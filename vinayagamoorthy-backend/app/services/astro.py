"""
Core Vedic astrology calculation engine, built on the Swiss Ephemeris.

This module is intentionally the single source of truth for all chart math.
Every other feature (jathagam, matching, lucky notes, panchangam, transit
predictions) should read planetary positions FROM HERE rather than
recomputing anything — keeps the whole app consistent.
"""
import swisseph as swe
from datetime import datetime
from typing import TypedDict

# Ayanamsa: Lahiri is the standard for Tamil/Vedic sidereal charts
swe.set_sid_mode(swe.SIDM_LAHIRI)

RASI_NAMES_EN = [
    "Mesham", "Rishabam", "Mithunam", "Kadagam", "Simmam", "Kanni",
    "Thulam", "Viruchigam", "Dhanusu", "Magaram", "Kumbam", "Meenam",
]
RASI_NAMES_TA = [
    "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி",
    "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்",
]
NAKSHATRA_NAMES_TA = [
    "அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிடம்", "திருவாதிரை",
    "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்",
    "ஹஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை",
    "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
    "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி",
]

PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE,  # Mean lunar node; Ketu = Rahu + 180
}


class PlanetPosition(TypedDict):
    longitude: float
    rasi_index: int
    rasi_name_ta: str
    degree_in_rasi: float
    nakshatra_index: int
    nakshatra_name_ta: str
    retrograde: bool


def _to_julian_day_ut(date: str, time: str, tz_offset: float) -> float:
    """date: 'YYYY-MM-DD', time: 'HH:MM' (local), tz_offset: hours e.g. 5.5 for IST."""
    dt = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
    local_hours = dt.hour + dt.minute / 60.0
    ut_hours = local_hours - tz_offset
    return swe.julday(dt.year, dt.month, dt.day, ut_hours)


def _rasi_and_degree(longitude: float) -> tuple[int, float]:
    rasi_index = int(longitude // 30)
    degree_in_rasi = longitude % 30
    return rasi_index, degree_in_rasi


def _nakshatra(longitude: float) -> int:
    # Each nakshatra spans 360/27 = 13.3333 degrees
    return int(longitude // (360 / 27))


def calculate_planet_positions(date: str, time: str, tz_offset: float) -> dict[str, PlanetPosition]:
    jd = _to_julian_day_ut(date, time, tz_offset)
    flag = swe.FLG_SIDEREAL | swe.FLG_SPEED

    positions: dict[str, PlanetPosition] = {}
    for name, pid in PLANETS.items():
        result = swe.calc_ut(jd, pid, flag)[0]
        longitude, speed = result[0], result[3]
        rasi_index, degree_in_rasi = _rasi_and_degree(longitude)
        nak_index = _nakshatra(longitude)
        positions[name] = {
            "longitude": round(longitude, 4),
            "rasi_index": rasi_index,
            "rasi_name_ta": RASI_NAMES_TA[rasi_index],
            "degree_in_rasi": round(degree_in_rasi, 2),
            "nakshatra_index": nak_index,
            "nakshatra_name_ta": NAKSHATRA_NAMES_TA[nak_index],
            "retrograde": speed < 0,
        }

    # Ketu is always exactly opposite Rahu
    rahu_lon = positions["Rahu"]["longitude"]
    ketu_lon = (rahu_lon + 180) % 360
    rasi_index, degree_in_rasi = _rasi_and_degree(ketu_lon)
    nak_index = _nakshatra(ketu_lon)
    positions["Ketu"] = {
        "longitude": round(ketu_lon, 4),
        "rasi_index": rasi_index,
        "rasi_name_ta": RASI_NAMES_TA[rasi_index],
        "degree_in_rasi": round(degree_in_rasi, 2),
        "nakshatra_index": nak_index,
        "nakshatra_name_ta": NAKSHATRA_NAMES_TA[nak_index],
        "retrograde": True,  # Ketu treated as always retrograde by convention
    }

    return positions


def calculate_ascendant(date: str, time: str, tz_offset: float, latitude: float, longitude: float) -> dict:
    jd = _to_julian_day_ut(date, time, tz_offset)
    # 'P' = Placidus house system; ascmc[0] = Ascendant (sidereal via flag)
    _, ascmc = swe.houses_ex(jd, latitude, longitude, b'P', flags=swe.FLG_SIDEREAL)
    asc_longitude = ascmc[0]
    rasi_index, degree_in_rasi = _rasi_and_degree(asc_longitude)
    return {
        "longitude": round(asc_longitude, 4),
        "rasi_index": rasi_index,
        "rasi_name_ta": RASI_NAMES_TA[rasi_index],
        "degree_in_rasi": round(degree_in_rasi, 2),
    }


def generate_full_chart(date: str, time: str, tz_offset: float, latitude: float, longitude: float) -> dict:
    """This is the main entry point other modules should call."""
    planets = calculate_planet_positions(date, time, tz_offset)
    ascendant = calculate_ascendant(date, time, tz_offset, latitude, longitude)
    moon_rasi_index = planets["Moon"]["rasi_index"]

    return {
        "ascendant": ascendant,           # Lagnam
        "rasi": RASI_NAMES_TA[moon_rasi_index],  # Moon sign = "Rasi" in Tamil astrology
        "nakshatra": planets["Moon"]["nakshatra_name_ta"],  # Birth star from Moon
        "planets": planets,
    }
