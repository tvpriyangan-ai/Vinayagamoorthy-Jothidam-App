"""
Lucky Notes: traditional per-rasi (Moon sign / Janma Rasi) associations —
color, number, day, gemstone, metal, friendly & unfavorable rasis — matching
the "Lucky Notes" card in your mockup.
"""
from typing import TypedDict

RASI_NAMES_TA = [
    "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி",
    "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்",
]

# index -> {color, number, day, stone, metal, friendly (rasi indices)}
RASI_LUCKY_DATA = {
    0: {"lord": "செவ்வாய்", "color": "சிவப்பு", "number": 9, "day": "செவ்வாய்க்கிழமை",
        "stone": "பவளம்", "metal": "செம்பு", "friendly": [4, 8]},
    1: {"lord": "சுக்கிரன்", "color": "வெள்ளை", "number": 6, "day": "வெள்ளிக்கிழமை",
        "stone": "வைரம்", "metal": "வெள்ளி", "friendly": [5, 9]},
    2: {"lord": "புதன்", "color": "பச்சை", "number": 5, "day": "புதன்கிழமை",
        "stone": "மரகதம்", "metal": "வெண்கலம்", "friendly": [6, 10]},
    3: {"lord": "சந்திரன்", "color": "வெள்ளை", "number": 2, "day": "திங்கட்கிழமை",
        "stone": "முத்து", "metal": "வெள்ளி", "friendly": [7, 11]},
    4: {"lord": "சூரியன்", "color": "மஞ்சள் / கிட்டானி", "number": 1, "day": "ஞாயிற்றுக்கிழமை",
        "stone": "மாணிக்கம்", "metal": "தங்கம்", "friendly": [0, 8]},
    5: {"lord": "புதன்", "color": "பச்சை", "number": 5, "day": "புதன்கிழமை",
        "stone": "மரகதம்", "metal": "வெண்கலம்", "friendly": [1, 9]},
    6: {"lord": "சுக்கிரன்", "color": "வெள்ளை", "number": 6, "day": "வெள்ளிக்கிழமை",
        "stone": "வைரம்", "metal": "வெள்ளி", "friendly": [2, 10]},
    7: {"lord": "செவ்வாய்", "color": "சிவப்பு", "number": 9, "day": "செவ்வாய்க்கிழமை",
        "stone": "பவளம்", "metal": "செம்பு", "friendly": [3, 11]},
    8: {"lord": "குரு", "color": "மஞ்சள்", "number": 3, "day": "வியாழக்கிழமை",
        "stone": "புஷ்பராகம்", "metal": "தங்கம்", "friendly": [0, 4]},
    9: {"lord": "சனி", "color": "கருப்பு / அடர் நீலம்", "number": 8, "day": "சனிக்கிழமை",
        "stone": "நீலக்கல்", "metal": "இரும்பு", "friendly": [1, 5]},
    10: {"lord": "சனி", "color": "நீலம்", "number": 8, "day": "சனிக்கிழமை",
         "stone": "நீலக்கல்", "metal": "இரும்பு", "friendly": [2, 6]},
    11: {"lord": "குரு", "color": "மஞ்சள்", "number": 3, "day": "வியாழக்கிழமை",
         "stone": "புஷ்பராகம்", "metal": "தங்கம்", "friendly": [3, 7]},
}

PLANET_ENEMIES = {
    "சூரியன்": ["சுக்கிரன்", "சனி"], "சந்திரன்": [], "செவ்வாய்": ["புதன்"],
    "புதன்": ["சந்திரன்"], "குரு": ["புதன்", "சுக்கிரன்"],
    "சுக்கிரன்": ["சூரியன்", "சந்திரன்"], "சனி": ["சூரியன்", "சந்திரன்", "செவ்வாய்"],
}


class LuckyNotes(TypedDict):
    rasi: str
    favorable: dict
    unfavorable: dict


def get_lucky_notes(moon_rasi_index: int) -> LuckyNotes:
    data = RASI_LUCKY_DATA[moon_rasi_index]
    friendly_idx = list(data["friendly"])
    enemy_idx = [
        i for i in RASI_LUCKY_DATA
        if i != moon_rasi_index and i not in data["friendly"]
    ]
    friendly_names = [RASI_NAMES_TA[i] for i in friendly_idx]
    enemy_rasis = [RASI_NAMES_TA[i] for i in enemy_idx]
    unfavorable_planets = PLANET_ENEMIES.get(data["lord"], [])

    return {
        "rasi": RASI_NAMES_TA[moon_rasi_index],
        "moon_rasi_index": moon_rasi_index,
        "friendly_rasi_indices": friendly_idx,
        "challenging_rasi_indices": enemy_idx,
        "favorable": {
            "lucky_color": data["color"],
            "lucky_number": data["number"],
            "lucky_day": data["day"],
            "lucky_stone": data["stone"],
            "lucky_metal": data["metal"],
            "friendly_rasis": friendly_names,
            "ruling_planet": data["lord"],
        },
        "unfavorable": {
            "challenging_rasis": enemy_rasis,
            "challenging_planets": unfavorable_planets,
        },
    }
