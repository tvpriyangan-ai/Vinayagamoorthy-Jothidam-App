"""
Daily Panchangam engine: tithi, nakshatra, yoga, karana, vaaram, sunrise/sunset,
and the three inauspicious periods (Rahu Kalam, Yamagandam, Gulika Kalam).

Built on top of the same Swiss Ephemeris setup as astro.py, so it stays
consistent with the jathagam engine (same ayanamsa, same sidereal positions).
"""
import swisseph as swe
from datetime import datetime, timedelta, date as date_cls

swe.set_sid_mode(swe.SIDM_LAHIRI)

TITHI_NAMES_TA = [
    "பிரதமை", "துவிதியை", "திருதியை", "சதுர்த்தி", "பஞ்சமி",
    "சஷ்டி", "சப்தமி", "அஷ்டமி", "நவமி", "தசமி",
    "ஏகாதசி", "துவாதசி", "திரயோதசி", "சதுர்தசி", "பௌர்ணமி",
]
AMAVASAI = "அமாவாசை"

YOGA_NAMES_TA = [
    "விஷ்கம்பம்", "பிரீதி", "ஆயுஷ்மான்", "சௌபாக்கியம்", "சோபனம்",
    "அதிகண்டம்", "சுகர்மா", "திருதி", "சூலம்", "கண்டம்",
    "விருத்தி", "துருவம்", "வியாகாதம்", "ஹர்ஷணம்", "வஜ்ரம்",
    "சித்தி", "வியதீபாதம்", "வரீயான்", "பரிகம்", "சிவம்",
    "சித்தம்", "சாத்தியம்", "சுபம்", "சுக்லம்", "பிரம்மம்",
    "ஐந்திரம்", "வைதிருதி",
]

KARANA_MOVABLE_TA = ["பவ", "பாலவ", "கௌலவ", "தைதுலை", "கரஜை", "வணிஜை", "விஷ்டி"]
KARANA_FIXED_TA = {0: "கிம்ஸ்துக்னம்", 57: "சகுனி", 58: "சதுஷ்பாதம்", 59: "நாகவம்"}

NAKSHATRA_NAMES_TA = [
    "அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிடம்", "திருவாதிரை",
    "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்",
    "ஹஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை",
    "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
    "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி",
]

VAARA_NAMES_TA = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"]

# weekday index: 0=Sunday ... 6=Saturday (matches VAARA_NAMES_TA order)
# Segment = which 1/8th of the sunrise-to-sunset window (1-indexed)
RAHU_KALAM_SEGMENT =  {0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3}
YAMAGANDAM_SEGMENT =  {0: 5, 1: 4, 2: 3, 3: 2, 4: 1, 5: 7, 6: 6}
GULIKAI_SEGMENT =     {0: 7, 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1}


def _weekday_index_from_python_weekday(py_weekday: int) -> int:
    # Python: Monday=0 ... Sunday=6. We want Sunday=0 ... Saturday=6.
    return (py_weekday + 1) % 7


def _jd_ut_for_local_midnight(d: date_cls, tz_offset: float) -> float:
    return swe.julday(d.year, d.month, d.day, 0.0 - tz_offset)


def _sun_moon_longitudes(jd_ut: float) -> tuple[float, float]:
    flag = swe.FLG_SIDEREAL
    sun = swe.calc_ut(jd_ut, swe.SUN, flag)[0][0]
    moon = swe.calc_ut(jd_ut, swe.MOON, flag)[0][0]
    return sun, moon


def _get_tithi(sun_lon: float, moon_lon: float) -> dict:
    elongation = (moon_lon - sun_lon) % 360
    tithi_index = int(elongation // 12)  # 0-29
    degree_into_tithi = elongation % 12
    if tithi_index < 15:
        paksha = "வளர்பிறை"  # waxing (Shukla)
        name = TITHI_NAMES_TA[tithi_index]
        number = tithi_index + 1
    else:
        paksha = "தேய்பிறை"  # waning (Krishna)
        idx = tithi_index - 15
        number = idx + 1
        name = AMAVASAI if idx == 14 else TITHI_NAMES_TA[idx]
    return {
        "index": tithi_index,
        "number": number,
        "paksha": paksha,
        "name_ta": name,
        "percent_complete": round((degree_into_tithi / 12) * 100, 1),
    }


def _get_nakshatra(moon_lon: float) -> dict:
    span = 360 / 27
    idx = int(moon_lon // span)
    pada = int((moon_lon % span) // (span / 4)) + 1  # 1-4
    return {"index": idx, "name_ta": NAKSHATRA_NAMES_TA[idx], "pada": pada}


def _get_yoga(sun_lon: float, moon_lon: float) -> dict:
    total = (sun_lon + moon_lon) % 360
    span = 360 / 27
    idx = int(total // span)
    return {"index": idx, "name_ta": YOGA_NAMES_TA[idx]}


def _get_karana(sun_lon: float, moon_lon: float) -> dict:
    elongation = (moon_lon - sun_lon) % 360
    half_tithi_index = int(elongation // 6)  # 0-59
    if half_tithi_index in KARANA_FIXED_TA:
        name = KARANA_FIXED_TA[half_tithi_index]
    else:
        movable_idx = (half_tithi_index - 1) % 7
        name = KARANA_MOVABLE_TA[movable_idx]
    return {"index": half_tithi_index, "name_ta": name}


def _sunrise_sunset(jd_midnight_ut: float, latitude: float, longitude: float, tz_offset: float) -> dict:
    geopos = (longitude, latitude, 0)
    _, rise = swe.rise_trans(jd_midnight_ut, swe.SUN, swe.CALC_RISE, geopos)
    _, set_ = swe.rise_trans(jd_midnight_ut, swe.SUN, swe.CALC_SET, geopos)
    sunrise_jd = rise[0]
    sunset_jd = set_[0]

    def jd_to_local_str(jd: float) -> str:
        y, m, d, h = swe.revjul(jd)
        local_h = h + tz_offset
        # normalize into 0-24
        local_h = local_h % 24
        hh = int(local_h)
        mm = int(round((local_h - hh) * 60))
        if mm == 60:
            mm = 0
            hh += 1
        return f"{hh:02d}:{mm:02d}"

    return {
        "sunrise": jd_to_local_str(sunrise_jd),
        "sunset": jd_to_local_str(sunset_jd),
        "sunrise_jd": sunrise_jd,
        "sunset_jd": sunset_jd,
    }


def _segment_time_range(sunrise_jd: float, sunset_jd: float, segment: int, tz_offset: float) -> dict:
    """segment is 1-indexed, 1 = first 1/8th after sunrise."""
    day_length = sunset_jd - sunrise_jd
    part = day_length / 8
    start_jd = sunrise_jd + part * (segment - 1)
    end_jd = sunrise_jd + part * segment

    def jd_to_local_str(jd: float) -> str:
        y, m, d, h = swe.revjul(jd)
        local_h = (h + tz_offset) % 24
        hh = int(local_h)
        mm = int(round((local_h - hh) * 60))
        if mm == 60:
            mm = 0
            hh += 1
        return f"{hh:02d}:{mm:02d}"

    return {"start": jd_to_local_str(start_jd), "end": jd_to_local_str(end_jd)}


def calculate_panchangam(d: date_cls, latitude: float, longitude: float, tz_offset: float) -> dict:
    jd_midnight = _jd_ut_for_local_midnight(d, tz_offset)
    # Use noon for the tithi/nakshatra/yoga/karana snapshot (standard practice
    # for a single daily panchangam reading rather than a precise transition time)
    jd_noon = jd_midnight + (12 / 24)

    sun_lon, moon_lon = _sun_moon_longitudes(jd_noon)

    weekday_idx = _weekday_index_from_python_weekday(d.weekday())
    sun_times = _sunrise_sunset(jd_midnight, latitude, longitude, tz_offset)

    rahu = _segment_time_range(sun_times["sunrise_jd"], sun_times["sunset_jd"], RAHU_KALAM_SEGMENT[weekday_idx], tz_offset)
    yama = _segment_time_range(sun_times["sunrise_jd"], sun_times["sunset_jd"], YAMAGANDAM_SEGMENT[weekday_idx], tz_offset)
    gulika = _segment_time_range(sun_times["sunrise_jd"], sun_times["sunset_jd"], GULIKAI_SEGMENT[weekday_idx], tz_offset)

    return {
        "date": d.isoformat(),
        "vaaram": VAARA_NAMES_TA[weekday_idx],
        "sunrise": sun_times["sunrise"],
        "sunset": sun_times["sunset"],
        "tithi": _get_tithi(sun_lon, moon_lon),
        "nakshatra": _get_nakshatra(moon_lon),
        "yoga": _get_yoga(sun_lon, moon_lon),
        "karana": _get_karana(sun_lon, moon_lon),
        "rahu_kalam": rahu,
        "yamagandam": yama,
        "gulikai_kalam": gulika,
    }
