"""
Transit Predictions (Gochara): compares each planet's CURRENT position
against the person's NATAL Moon rasi — the traditional basis for Vedic
transit predictions ("Chandra Gochara"). House-from-Moon is what matters
classically, not house-from-Lagna, for this particular technique.

This uses the same astro.py engine as everything else — no separate
calculation logic, just a different lens on the same real planetary data.
"""
from datetime import date
from app.services.astro import calculate_planet_positions

RASI_NAMES_TA = [
    "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி",
    "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்",
]

# Classical Chandra Gochara: which houses-from-Moon are traditionally
# favorable for each planet's transit. Simplified/commonly-published
# version — classical texts add nuance (e.g. exceptions during
# retrogression, or combinations with other transits) that this omits.
FAVORABLE_HOUSES_FROM_MOON = {
    "Sun": {3, 6, 10, 11},
    "Moon": {1, 3, 6, 7, 10, 11},
    "Mars": {3, 6, 11},
    "Mercury": {2, 4, 6, 8, 10, 11},
    "Jupiter": {2, 5, 7, 9, 11},
    "Venus": {1, 2, 3, 4, 5, 8, 9, 11, 12},
    "Saturn": {3, 6, 11},
    "Rahu": {3, 6, 11},
    "Ketu": {3, 6, 11},
}

PLANET_NAMES_TA = {
    "Sun": "சூரியன்", "Moon": "சந்திரன்", "Mars": "செவ்வாய்", "Mercury": "புதன்",
    "Jupiter": "குரு", "Venus": "சுக்கிரன்", "Saturn": "சனி", "Rahu": "ராகு", "Ketu": "கேது",
}


def get_transit_predictions(natal_moon_rasi_index: int, on_date: date | None = None) -> dict:
    d = on_date or date.today()
    # Noon UT as a reasonable daily snapshot, consistent with panchangam.py
    current_positions = calculate_planet_positions(d.isoformat(), "12:00", 0.0)

    predictions = []
    for planet, info in current_positions.items():
        current_rasi_index = info["rasi_index"]
        house_from_moon = ((current_rasi_index - natal_moon_rasi_index) % 12) + 1
        favorable = house_from_moon in FAVORABLE_HOUSES_FROM_MOON[planet]

        predictions.append({
            "planet": planet,
            "planet_name_ta": PLANET_NAMES_TA[planet],
            "current_rasi": RASI_NAMES_TA[current_rasi_index],
            "current_rasi_index": current_rasi_index,
            "house_from_moon": house_from_moon,
            "favorable": favorable,
            "retrograde": info["retrograde"],
        })

    return {
        "date": d.isoformat(),
        "natal_moon_rasi": RASI_NAMES_TA[natal_moon_rasi_index],
        "natal_moon_rasi_index": natal_moon_rasi_index,
        "transits": predictions,
        "note": "இது சந்திர கோச்சாரம் அடிப்படையிலான பொதுவான வழிகாட்டுதல். "
                "இதர கிரக இணைவுகள், பார்வைகள் ஆகியவை முழுமையான பலனை மாற்றக்கூடும் — "
                "விரிவான ஆலோசனைக்கு ஜோதிடரை அணுகவும்.",
    }
