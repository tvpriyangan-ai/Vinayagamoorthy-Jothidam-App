"""
Common dosha (affliction) detection from the natal chart, with traditional
remedies. This is cultural/religious guidance, not medical or legal advice —
every response includes a note recommending consultation with a priest or
professional astrologer for anything the person plans to act on.
"""
from app.services.astro import RASI_NAMES_TA  # noqa: F401 (kept for future use)
from datetime import date
import swisseph as swe

swe.set_sid_mode(swe.SIDM_LAHIRI)


KUJA_DOSHA_HOUSES = {1, 2, 4, 7, 8, 12}


def check_kuja_dosha(mars_rasi_index: int, lagna_rasi_index: int, moon_rasi_index: int) -> dict:
    house_from_lagna = ((mars_rasi_index - lagna_rasi_index) % 12) + 1
    house_from_moon = ((mars_rasi_index - moon_rasi_index) % 12) + 1

    present = house_from_lagna in KUJA_DOSHA_HOUSES or house_from_moon in KUJA_DOSHA_HOUSES

    return {
        "name": "செவ்வாய் தோஷம் (Kuja Dosham)",
        "present": present,
        "detail": f"லக்னத்திலிருந்து செவ்வாய் {house_from_lagna}ம் வீடு, "
                  f"ராசியிலிருந்து {house_from_moon}ம் வீடு",
        "remedies": [
            "செவ்வாய்க்கிழமைகளில் முருகன் அல்லது ஆஞ்சநேயர் வழிபாடு",
            "செவ்வாய் தோஷ சாந்தி பூஜை செய்வது",
            "சிவப்பு நிற பொருட்களை தானம் செய்வது",
            "மங்கள சூக்தம் பாராயணம்",
        ] if present else [],
    }


def check_rahu_ketu_dosha(rahu_rasi_index: int, ketu_rasi_index: int,
                           sun_rasi_index: int, moon_rasi_index: int) -> dict:
    grahan_with_sun = rahu_rasi_index == sun_rasi_index or ketu_rasi_index == sun_rasi_index
    grahan_with_moon = rahu_rasi_index == moon_rasi_index or ketu_rasi_index == moon_rasi_index
    present = grahan_with_sun or grahan_with_moon

    return {
        "name": "ராகு-கேது தோஷம் (Grahan Dosham)",
        "present": present,
        "detail": "சூரியன்/சந்திரனுடன் ராகு அல்லது கேது இணைந்துள்ளது" if present
                  else "ராகு-கேது இணைவு இல்லை",
        "remedies": [
            "திருநாகேஸ்வரம் (ராகு) மற்றும் கீழப்பெரும்பள்ளம் (கேது) கோவில்களில் வழிபாடு",
            "ராகு-கேது சாந்தி பூஜை",
            "துர்கா சப்தசதி பாராயணம்",
        ] if present else [],
    }


def check_sade_sati(moon_rasi_index: int, on_date: date | None = None) -> dict:
    d = on_date or date.today()
    # Use noon UT as a reasonable daily snapshot for Saturn's current transit position
    jd = swe.julday(d.year, d.month, d.day, 12.0)
    saturn_lon = swe.calc_ut(jd, swe.SATURN, swe.FLG_SIDEREAL)[0][0]
    saturn_rasi_index = int(saturn_lon // 30)

    diff = (saturn_rasi_index - moon_rasi_index) % 12
    active = diff in (11, 0, 1)
    phase = None
    if diff == 11:
        phase = "முதல் கட்டம் (Rising Phase)"
    elif diff == 0:
        phase = "உச்ச கட்டம் (Peak Phase)"
    elif diff == 1:
        phase = "இறுதி கட்டம் (Setting Phase)"

    return {
        "name": "சனி எழரை நாட்டு (Sade Sati)",
        "present": active,
        "phase": phase,
        "detail": f"தற்போதைய சனி இடம்: ராசி {saturn_rasi_index}, ராசியிலிருந்து வித்தியாசம் {diff}",
        "remedies": [
            "சனிக்கிழமைகளில் ஐயப்பன்/சனீஸ்வரர் வழிபாடு",
            "எள்ளு எண்ணெய், கருப்பு உடைகள் தானம்",
            "ஹனுமான் சாலிசா பாராயணம்",
            "சனி சாந்தி பூஜை",
        ] if active else [],
    }


def get_dosha_report(chart: dict) -> dict:
    planets = chart["planets"]
    lagna_rasi_index = chart["ascendant"]["rasi_index"]
    moon_rasi_index = planets["Moon"]["rasi_index"]

    checks = [
        check_kuja_dosha(planets["Mars"]["rasi_index"], lagna_rasi_index, moon_rasi_index),
        check_rahu_ketu_dosha(
            planets["Rahu"]["rasi_index"], planets["Ketu"]["rasi_index"],
            planets["Sun"]["rasi_index"], moon_rasi_index,
        ),
        check_sade_sati(moon_rasi_index),
    ]

    return {
        "doshas": checks,
        "any_active": any(c["present"] for c in checks),
        "note": "இவை பாரம்பரிய ஜோதிட வழிகாட்டுதல்கள் மட்டுமே. குருக்கள் அல்லது "
                "அனுபவமிக்க ஜோதிடரிடம் ஆலோசனை பெற்ற பின் பரிகாரங்களை மேற்கொள்ளவும்.",
    }
