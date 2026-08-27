"""
Traditional Tamil "Pathu Porutham" (10-point) matching system, computed from
each person's Moon nakshatra and Moon rasi — read from the same chart engine
as jathagam.py, so it's consistent with the rest of the app.

NOTE ON SCOPE: this implements the widely-published simplified versions of
each porutham (the tables used by most matching software). Classical texts
carry additional nuance in places (e.g. pada-level Rajju sub-rules, exact
half-sign boundaries for Vasiya). For a couple making a real decision, this
should support a conversation with a professional astrologer, not replace one
— worth saying so plainly in the app UI itself.
"""
from typing import TypedDict

NAKSHATRA_NAMES_TA = [
    "அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிடம்", "திருவாதிரை",
    "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்",
    "ஹஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை",
    "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
    "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி",
]
RASI_NAMES_TA = [
    "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி",
    "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்",
]

# ---- Reference tables (indices are 0-based: 0=Ashwini...26=Revati / 0=Mesham...11=Meenam) ----

GANA = (  # 0=Deva, 1=Manushya, 2=Rakshasa, per nakshatra index
    [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0]
)
GANA_NAMES = ["தேவ கணம்", "மனுஷ கணம்", "ராட்சத கணம்"]

YONI_ANIMAL = [  # per nakshatra index, 0-13 animal id
    0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1
]
YONI_NAMES = ["குதிரை", "யானை", "ஆடு", "பாம்பு", "நாய்", "பூனை", "எலி", "பசு",
              "எருமை", "புலி", "மான்", "குரங்கு", "சிங்கம்", "வெள்ளாடு (நாகணவாய்)"]
# Enemy pairs among the 14 yoni animals (by id)
YONI_ENEMIES = {
    frozenset({0, 8}),   # Horse - Buffalo
    frozenset({1, 12}),  # Elephant - Lion
    frozenset({2, 10}),  # Goat - Monkey
    frozenset({3, 6}),   # Snake - Mongoose(rat-family stand-in)
    frozenset({4, 9}),   # Dog - Deer
    frozenset({5, 6}),   # Cat - Rat
    frozenset({7, 12}),  # Cow - Lion
}

RAJJU_GROUP = {  # nakshatra index -> rajju group name
    **{i: "பாத ரஜ்ஜு" for i in [0, 8, 9, 17, 18, 26]},
    **{i: "கடி ரஜ்ஜு" for i in [1, 7, 10, 16, 19, 25]},
    **{i: "நாபி ரஜ்ஜு" for i in [2, 11, 15, 20, 24]},
    **{i: "கண்ட ரஜ்ஜு" for i in [3, 12, 14, 21, 23]},
    **{i: "சிரோ ரஜ்ஜு" for i in [4, 13, 22, 6, 5]},
}

VEDHA_PAIRS = {
    frozenset({0, 17}), frozenset({1, 16}), frozenset({2, 15}), frozenset({3, 14}),
    frozenset({4, 13}), frozenset({5, 21}), frozenset({6, 20}), frozenset({7, 19}),
    frozenset({8, 18}), frozenset({9, 26}), frozenset({10, 25}), frozenset({11, 24}),
    frozenset({12, 23}),
}

RASI_LORD = [  # 0=Mesham...11=Meenam -> planet name
    "செவ்வாய்", "சுக்கிரன்", "புதன்", "சந்திரன்", "சூரியன்", "புதன்",
    "சுக்கிரன்", "செவ்வாய்", "குரு", "சனி", "சனி", "குரு",
]
PLANET_FRIENDSHIP = {
    "சூரியன்": {"friends": {"சந்திரன்", "செவ்வாய்", "குரு"}, "enemies": {"சுக்கிரன்", "சனி"}},
    "சந்திரன்": {"friends": {"சூரியன்", "புதன்"}, "enemies": set()},
    "செவ்வாய்": {"friends": {"சூரியன்", "சந்திரன்", "குரு"}, "enemies": {"புதன்"}},
    "புதன்": {"friends": {"சூரியன்", "சுக்கிரன்"}, "enemies": {"சந்திரன்"}},
    "குரு": {"friends": {"சூரியன்", "சந்திரன்", "செவ்வாய்"}, "enemies": {"புதன்", "சுக்கிரன்"}},
    "சுக்கிரன்": {"friends": {"புதன்", "சனி"}, "enemies": {"சூரியன்", "சந்திரன்"}},
    "சனி": {"friends": {"புதன்", "சுக்கிரன்"}, "enemies": {"சூரியன்", "சந்திரன்", "செவ்வாய்"}},
}

# Simplified Vasiya grouping (whole-rasi approximation — classical version
# splits Dhanusu/Makaram in half; we assign each to one group for simplicity)
VASIYA_GROUP = {
    0: "சதுஷ்பாதம்", 1: "சதுஷ்பாதம்", 9: "சதுஷ்பாதம்",       # Mesham, Rishabam, Makaram
    2: "மனிதம்", 5: "மனிதம்", 6: "மனிதம்", 8: "மனிதம்", 10: "மனிதம்",  # Mithunam, Kanni, Thulam, Dhanusu, Kumbam
    3: "நீர்வாழ்", 11: "நீர்வாழ்",                              # Kadagam, Meenam
    4: "காட்டுவாழ்",                                            # Simmam
    7: "பூச்சி",                                                # Viruchigam
}


class PoruthamResult(TypedDict):
    name: str
    matched: bool
    detail: str


def _porutham_dina(girl_nak: int, boy_nak: int) -> PoruthamResult:
    count = ((boy_nak - girl_nak) % 27) + 1
    remainder = count % 9
    good = remainder in (0, 2, 4, 6, 8)
    return {"name": "தின (நட்சத்திர) பொருத்தம்", "matched": good,
            "detail": f"எண்ணிக்கை {count}, தாரை மீதி {remainder if remainder else 9}"}


def _porutham_gana(girl_nak: int, boy_nak: int) -> PoruthamResult:
    g, b = GANA[girl_nak], GANA[boy_nak]
    if g == b:
        good = True
    elif {g, b} == {0, 1}:  # Deva-Manushya
        good = True
    else:
        good = False  # Rakshasa with anything else, or Deva-Rakshasa
    return {"name": "கண பொருத்தம்", "matched": good,
            "detail": f"பெண்: {GANA_NAMES[g]}, ஆண்: {GANA_NAMES[b]}"}


def _porutham_yoni(girl_nak: int, boy_nak: int) -> PoruthamResult:
    g, b = YONI_ANIMAL[girl_nak], YONI_ANIMAL[boy_nak]
    if g == b:
        good = True
    elif frozenset({g, b}) in YONI_ENEMIES:
        good = False
    else:
        good = True  # neutral treated as acceptable
    return {"name": "யோனி பொருத்தம்", "matched": good,
            "detail": f"பெண்: {YONI_NAMES[g]}, ஆண்: {YONI_NAMES[b]}"}


def _porutham_rasi(girl_rasi: int, boy_rasi: int) -> PoruthamResult:
    count = ((boy_rasi - girl_rasi) % 12) + 1
    bad_counts = {2, 6, 8, 12}
    good = count not in bad_counts
    return {"name": "ராசி பொருத்தம்", "matched": good, "detail": f"எண்ணிக்கை {count}"}


def _porutham_rajju(girl_nak: int, boy_nak: int) -> PoruthamResult:
    g, b = RAJJU_GROUP[girl_nak], RAJJU_GROUP[boy_nak]
    good = g != b
    return {"name": "ரஜ்ஜு பொருத்தம்", "matched": good,
            "detail": f"பெண்: {g}, ஆண்: {b}"}


def _porutham_vedha(girl_nak: int, boy_nak: int) -> PoruthamResult:
    bad = frozenset({girl_nak, boy_nak}) in VEDHA_PAIRS
    return {"name": "வேத பொருத்தம்", "matched": not bad,
            "detail": "வேத தோஷம் உள்ளது" if bad else "வேத தோஷம் இல்லை"}


def _porutham_mahendra(girl_nak: int, boy_nak: int) -> PoruthamResult:
    count = ((boy_nak - girl_nak) % 27) + 1
    good = count in {4, 7, 10, 13, 16, 19, 22, 25}
    return {"name": "மஹேந்திர பொருத்தம்", "matched": good, "detail": f"எண்ணிக்கை {count}"}


def _porutham_stree_deergha(girl_nak: int, boy_nak: int) -> PoruthamResult:
    count = ((boy_nak - girl_nak) % 27) + 1
    good = count >= 13
    return {"name": "ஸ்திரீ தீர்க்க பொருத்தம்", "matched": good, "detail": f"எண்ணிக்கை {count}"}


def _porutham_rasyadhipathi(girl_rasi: int, boy_rasi: int) -> PoruthamResult:
    g_lord, b_lord = RASI_LORD[girl_rasi], RASI_LORD[boy_rasi]
    if g_lord == b_lord:
        good = True
    elif b_lord in PLANET_FRIENDSHIP[g_lord]["enemies"]:
        good = False
    else:
        good = True  # friend or neutral
    return {"name": "ராசியாதிபதி பொருத்தம்", "matched": good,
            "detail": f"பெண் ராசி நாதன்: {g_lord}, ஆண் ராசி நாதன்: {b_lord}"}


def _porutham_vasiya(girl_rasi: int, boy_rasi: int) -> PoruthamResult:
    g, b = VASIYA_GROUP.get(girl_rasi, "மனிதம்"), VASIYA_GROUP.get(boy_rasi, "மனிதம்")
    if g == b:
        good = True
    elif {g, b} == {"மனிதம்", "சதுஷ்பாதம்"}:
        good = True
    else:
        good = False
    return {"name": "வசிய பொருத்தம்", "matched": good, "detail": f"பெண்: {g}, ஆண்: {b}"}


def calculate_porutham(girl_nakshatra: int, girl_rasi: int, boy_nakshatra: int, boy_rasi: int) -> dict:
    checks = [
        _porutham_dina(girl_nakshatra, boy_nakshatra),
        _porutham_gana(girl_nakshatra, boy_nakshatra),
        _porutham_yoni(girl_nakshatra, boy_nakshatra),
        _porutham_rasi(girl_rasi, boy_rasi),
        _porutham_rajju(girl_nakshatra, boy_nakshatra),
        _porutham_vedha(girl_nakshatra, boy_nakshatra),
        _porutham_mahendra(girl_nakshatra, boy_nakshatra),
        _porutham_stree_deergha(girl_nakshatra, boy_nakshatra),
        _porutham_rasyadhipathi(girl_rasi, boy_rasi),
        _porutham_vasiya(girl_rasi, boy_rasi),
    ]
    matched_count = sum(1 for c in checks if c["matched"])

    # These four are traditionally weighted as the most important —
    # flag clearly if any of them fail, regardless of overall count.
    critical = {"தின (நட்சத்திர) பொருத்தம்", "கண பொருத்தம்", "ரஜ்ஜு பொருத்தம்", "வேத பொருத்தம்"}
    critical_failures = [c["name"] for c in checks if c["name"] in critical and not c["matched"]]

    return {
        "girl": {"nakshatra": NAKSHATRA_NAMES_TA[girl_nakshatra], "rasi": RASI_NAMES_TA[girl_rasi]},
        "boy": {"nakshatra": NAKSHATRA_NAMES_TA[boy_nakshatra], "rasi": RASI_NAMES_TA[boy_rasi]},
        "poruthams": checks,
        "matched_count": matched_count,
        "total_count": len(checks),
        "critical_failures": critical_failures,
        "note": "இது ஒரு வழிகாட்டுதல் மட்டுமே. இறுதி முடிவுக்கு முன் ஒரு அனுபவமிக்க "
                "ஜோதிடரிடம் ஆலோசனை பெறவும்.",  # "This is guidance only — consult an experienced astrologer before a final decision."
    }
