"""
Traditional Tamil marriage-matching system, expanded to the client's
requested 22-porutham report.

Every check is computed from real chart data (nakshatra, rasi, lagna, Sun
position) -- nothing here is hardcoded or randomized. Only the porutham
NAMES, ORDER and DESCRIPTIONS follow the client's supplied 22-porutham
chart; the calculation of each `matched` result is unchanged.
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

GANA = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0]
GANA_NAMES = ["தேவ கணம்", "மனுஷ கணம்", "ராட்சத கணம்"]

YONI_ANIMAL = [
    0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1
]
YONI_NAMES = ["குதிரை", "யானை", "ஆடு", "பாம்பு", "நாய்", "பூனை", "எலி", "பசு",
              "எருமை", "புலி", "மான்", "குரங்கு", "சிங்கம்", "வெள்ளாடு (நாகணவாய்)"]
YONI_ENEMIES = {
    frozenset({0, 8}), frozenset({1, 12}), frozenset({2, 10}), frozenset({3, 6}),
    frozenset({4, 9}), frozenset({5, 6}), frozenset({7, 12}),
}

RAJJU_GROUP = {
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

RASI_LORD = [
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
    "ராகு": {"friends": {"புதன்", "சுக்கிரன்", "சனி"}, "enemies": {"சூரியன்", "சந்திரன்", "செவ்வாய்"}},
    "கேது": {"friends": {"செவ்வாய்", "சுக்கிரன்", "சனி"}, "enemies": {"சூரியன்", "சந்திரன்"}},
}

VASIYA_GROUP = {
    0: "சதுஷ்பாதம்", 1: "சதுஷ்பாதம்", 9: "சதுஷ்பாதம்",
    2: "மனிதம்", 5: "மனிதம்", 6: "மனிதம்", 8: "மனிதம்", 10: "மனிதம்",
    3: "நீர்வாழ்", 11: "நீர்வாழ்",
    4: "காட்டுவாழ்",
    7: "பூச்சி",
}

NAKSHATRA_LORD_CYCLE = ["கேது", "சுக்கிரன்", "சூரியன்", "சந்திரன்", "செவ்வாய்", "ராகு", "குரு", "சனி", "புதன்"]

VARNA_BY_RASI = {
    0: ("க்ஷத்திரியர்", 3), 4: ("க்ஷத்திரியர்", 3), 8: ("க்ஷத்திரியர்", 3),
    1: ("வைசியர்", 2), 5: ("வைசியர்", 2), 9: ("வைசியர்", 2),
    2: ("சூத்திரர்", 1), 6: ("சூத்திரர்", 1), 10: ("சூத்திரர்", 1),
    3: ("பிராமணர்", 4), 7: ("பிராமணர்", 4), 11: ("பிராமணர்", 4),
}

BIRD_NAMES_TA = ["கழுகு", "ஆந்தை", "காகம்", "கோழி", "மயில்"]
BIRD_ENEMY_PAIRS = {frozenset({0, 2}), frozenset({1, 3})}

RASI_ELEMENT = {
    0: "நெருப்பு", 4: "நெருப்பு", 8: "நெருப்பு",
    1: "மண்", 5: "மண்", 9: "மண்",
    2: "காற்று", 6: "காற்று", 10: "காற்று",
    3: "நீர்", 7: "நீர்", 11: "நீர்",
}
ELEMENT_COMPATIBLE = {
    frozenset({"நெருப்பு"}), frozenset({"மண்"}), frozenset({"காற்று"}), frozenset({"நீர்"}),
    frozenset({"நெருப்பு", "காற்று"}), frozenset({"மண்", "நீர்"}),
}


class PoruthamResult(TypedDict):
    name: str
    matched: bool
    detail: str
    description: str


# ── 1. தினப் பொருத்தம் ─────────────────────────────────────────
def _porutham_dina(girl_nak: int, boy_nak: int) -> PoruthamResult:
    count = ((boy_nak - girl_nak) % 27) + 1
    remainder = count % 9
    good = remainder in (0, 2, 4, 6, 8)
    return {"name": "தினப் பொருத்தம்", "matched": good,
            "detail": f"எண்ணிக்கை {count}, தாரை மீதி {remainder if remainder else 9}",
            "description": "அன்றாட வாழ்க்கையில் நல்ல ஒத்துழைப்பு, உடல்–மன நலம் மற்றும் சௌகரியம்"}


# ── 2. கணப் பொருத்தம் ─────────────────────────────────────────
def _porutham_gana(girl_nak: int, boy_nak: int) -> PoruthamResult:
    g, b = GANA[girl_nak], GANA[boy_nak]
    good = g == b or {g, b} == {0, 1}
    return {"name": "கணப் பொருத்தம்", "matched": good,
            "detail": f"பெண்: {GANA_NAMES[g]}, ஆண்: {GANA_NAMES[b]}",
            "description": "குணநலம், மனப்பான்மை மற்றும் பழக்கங்களில் ஒற்றுமை"}


# ── 3. மகேந்திரப் பொருத்தம் ───────────────────────────────────
def _porutham_mahendra(girl_nak: int, boy_nak: int) -> PoruthamResult:
    count = ((boy_nak - girl_nak) % 27) + 1
    good = count in {4, 7, 10, 13, 16, 19, 22, 25}
    return {"name": "மகேந்திரப் பொருத்தம்", "matched": good, "detail": f"எண்ணிக்கை {count}",
            "description": "குடும்ப வளர்ச்சி, சந்ததி மற்றும் இல்லற வளம்"}


# ── 4. ஸ்திரீ தீர்க்கப் பொருத்தம் ─────────────────────────────
def _porutham_stree_deergha(girl_nak: int, boy_nak: int) -> PoruthamResult:
    count = ((boy_nak - girl_nak) % 27) + 1
    good = count >= 13
    return {"name": "ஸ்திரீ தீர்க்கப் பொருத்தம்", "matched": good, "detail": f"எண்ணிக்கை {count}",
            "description": "பெண்ணின் நலம் மற்றும் திருமண வாழ்க்கையின் நீடிப்பு"}


# ── 5. யோனிப் பொருத்தம் ─────────────────────────────────────
def _porutham_yoni(girl_nak: int, boy_nak: int) -> PoruthamResult:
    g, b = YONI_ANIMAL[girl_nak], YONI_ANIMAL[boy_nak]
    good = g == b or frozenset({g, b}) not in YONI_ENEMIES
    return {"name": "யோனிப் பொருத்தம்", "matched": good,
            "detail": f"பெண்: {YONI_NAMES[g]}, ஆண்: {YONI_NAMES[b]}",
            "description": "தாம்பத்திய ஒற்றுமை, நெருக்கம் மற்றும் இயல்பான இணக்கம்"}


# ── 6. ராசிப் பொருத்தம் ─────────────────────────────────────
def _porutham_rasi(girl_rasi: int, boy_rasi: int) -> PoruthamResult:
    count = ((boy_rasi - girl_rasi) % 12) + 1
    good = count not in {2, 6, 8, 12}
    return {"name": "ராசிப் பொருத்தம்", "matched": good, "detail": f"எண்ணிக்கை {count}",
            "description": "மனநிலை, குடும்ப வாழ்க்கை மற்றும் பரஸ்பர ஒத்துழைப்பு"}


# ── 7. ராசி அதிபதிப் பொருத்தம் ───────────────────────────────
def _porutham_rasyadhipathi(girl_rasi: int, boy_rasi: int) -> PoruthamResult:
    g_lord, b_lord = RASI_LORD[girl_rasi], RASI_LORD[boy_rasi]
    good = g_lord == b_lord or b_lord not in PLANET_FRIENDSHIP[g_lord]["enemies"]
    return {"name": "ராசி அதிபதிப் பொருத்தம்", "matched": good,
            "detail": f"பெண் ராசி நாதன்: {g_lord}, ஆண் ராசி நாதன்: {b_lord}",
            "description": "இருவரின் குணம், அணுகுமுறை மற்றும் பரஸ்பர புரிதல்"}


# ── 8. வசியப் பொருத்தம் ─────────────────────────────────────
def _porutham_vasiya(girl_rasi: int, boy_rasi: int) -> PoruthamResult:
    g, b = VASIYA_GROUP.get(girl_rasi, "மனிதம்"), VASIYA_GROUP.get(boy_rasi, "மனிதம்")
    good = g == b or {g, b} == {"மனிதம்", "சதுஷ்பாதம்"}
    return {"name": "வசியப் பொருத்தம்", "matched": good, "detail": f"பெண்: {g}, ஆண்: {b}",
            "description": "ஈர்ப்பு, அன்பு மற்றும் ஒருவர் மீது ஒருவர் கொண்ட செல்வாக்கு"}


# ── 9. ரஜ்ஜுப் பொருத்தம் ────────────────────────────────────
def _porutham_rajju(girl_nak: int, boy_nak: int) -> PoruthamResult:
    g, b = RAJJU_GROUP[girl_nak], RAJJU_GROUP[boy_nak]
    return {"name": "ரஜ்ஜுப் பொருத்தம்", "matched": g != b, "detail": f"பெண்: {g}, ஆண்: {b}",
            "description": "திருமண பந்தத்தின் நிலைத்தன்மை மற்றும் நீடித்த குடும்ப வாழ்க்கை"}


# ── 10. வேதைப் பொருத்தம் ────────────────────────────────────
def _porutham_vedha(girl_nak: int, boy_nak: int) -> PoruthamResult:
    bad = frozenset({girl_nak, boy_nak}) in VEDHA_PAIRS
    return {"name": "வேதைப் பொருத்தம்", "matched": not bad,
            "detail": "வேத தோஷம் உள்ளது" if bad else "வேத தோஷம் இல்லை",
            "description": "நட்சத்திரங்களுக்கிடையிலான பாரம்பரிய வேதை அல்லது தடைகள்"}


# ── 11. நாடிப் பொருத்தம் ────────────────────────────────────
def _porutham_nadi(girl_nak: int, boy_nak: int) -> PoruthamResult:
    nadi_names = ["வாத நாடி", "பித்த நாடி", "கபா நாடி"]
    g_nadi, b_nadi = girl_nak % 3, boy_nak % 3
    good = g_nadi != b_nadi
    return {"name": "நாடிப் பொருத்தம்", "matched": good,
            "detail": f"பெண்: {nadi_names[g_nadi]}, ஆண்: {nadi_names[b_nadi]}",
            "description": "உடல்நலம் மற்றும் சந்ததி நலம் தொடர்பான பாரம்பரியக் கருத்து"}


# ── 12. விருட்சப் பொருத்தம் ──────────────────────────────────
def _porutham_vruksha(girl_nak: int, boy_nak: int) -> PoruthamResult:
    g_lord = NAKSHATRA_LORD_CYCLE[girl_nak % 9]
    b_lord = NAKSHATRA_LORD_CYCLE[boy_nak % 9]
    good = g_lord == b_lord or b_lord not in PLANET_FRIENDSHIP[g_lord]["enemies"]
    return {"name": "விருட்சப் பொருத்தம்", "matched": good,
            "detail": f"பெண் நட்சத்திர நாதன்: {g_lord}, ஆண் நட்சத்திர நாதன்: {b_lord}",
            "description": "குடும்ப வளர்ச்சி, வளம் மற்றும் வாழ்க்கைச் செழிப்பு"}


# ── 13. லக்னப் பொருத்தம் ────────────────────────────────────
def _porutham_lagna(girl_lagna: int, boy_lagna: int) -> PoruthamResult:
    count = ((boy_lagna - girl_lagna) % 12) + 1
    good = count not in {2, 6, 8, 12}
    return {"name": "லக்னப் பொருத்தம்", "matched": good,
            "detail": f"பெண் லக்னம்: {RASI_NAMES_TA[girl_lagna]}, ஆண் லக்னம்: {RASI_NAMES_TA[boy_lagna]}",
            "description": "வாழ்க்கை அணுகுமுறை, தன்மை மற்றும் இல்லற அமைப்பின் ஒத்திசைவு"}


# ── 14. ஆயுள் பொருத்தம் ─────────────────────────────────────
def _porutham_ayul(girl_nak: int, boy_nak: int) -> PoruthamResult:
    count = ((girl_nak - boy_nak) % 27) + 1
    remainder = count % 9
    good = remainder in (0, 2, 4, 6, 8)
    return {"name": "ஆயுள் பொருத்தம்", "matched": good, "detail": f"எதிர் தாரை எண்ணிக்கை {count}",
            "description": "நீண்டகால வாழ்க்கை மற்றும் ஆயுள் தொடர்பான ஜாதகக் கணிப்பு"}


# ── 15. லிங்கப் பொருத்தம் ───────────────────────────────────
def _porutham_linga(girl_rasi: int, boy_rasi: int) -> PoruthamResult:
    g_gender = "ஆண் ராசி" if girl_rasi % 2 == 0 else "பெண் ராசி"
    b_gender = "ஆண் ராசி" if boy_rasi % 2 == 0 else "பெண் ராசி"
    good = g_gender != b_gender
    return {"name": "லிங்கப் பொருத்தம்", "matched": good, "detail": f"பெண்: {g_gender}, ஆண்: {b_gender}",
            "description": "இயல்பு, தாம்பத்திய தன்மை மற்றும் இருவருக்கிடையேயான இணக்கம்"}


# ── 16. கேந்திரப் பொருத்தம் ──────────────────────────────────
def _porutham_kendra(girl_rasi: int, boy_rasi: int) -> PoruthamResult:
    count = ((boy_rasi - girl_rasi) % 12) + 1
    good = count in {1, 4, 7, 10}
    return {"name": "கேந்திரப் பொருத்தம்", "matched": good, "detail": f"எண்ணிக்கை {count}",
            "description": "குடும்ப வாழ்க்கையின் நிலைத்தன்மை மற்றும் முக்கிய வாழ்க்கை அம்சங்களின் ஆதரவு"}


# ── 17. வர்ணப் பொருத்தம் ────────────────────────────────────
def _porutham_varna(girl_rasi: int, boy_rasi: int) -> PoruthamResult:
    g_varna, g_rank = VARNA_BY_RASI[girl_rasi]
    b_varna, b_rank = VARNA_BY_RASI[boy_rasi]
    good = b_rank >= g_rank
    return {"name": "வர்ணப் பொருத்தம்", "matched": good,
            "detail": f"பெண்: {g_varna}, ஆண்: {b_varna}",
            "description": "இயல்பு, மனப்பான்மை மற்றும் குணநிலை சார்ந்த பாரம்பரிய ஒற்றுமை"}


# ── 18. வாசிப் பொருத்தம் ────────────────────────────────────
def _porutham_vaasi(girl_sun_rasi: int, boy_sun_rasi: int) -> PoruthamResult:
    g_lord, b_lord = RASI_LORD[girl_sun_rasi], RASI_LORD[boy_sun_rasi]
    good = g_lord == b_lord or b_lord not in PLANET_FRIENDSHIP[g_lord]["enemies"]
    return {"name": "வாசிப் பொருத்தம்", "matched": good,
            "detail": f"பெண் சூரிய ராசி நாதன்: {g_lord}, ஆண் சூரிய ராசி நாதன்: {b_lord}",
            "description": "பரஸ்பர ஈர்ப்பு, தொடர்பு மற்றும் ஒருவர் மற்றவரை ஏற்றுக்கொள்ளும் தன்மை"}


# ── 19. நாட்டுப் பொருத்தம் ──────────────────────────────────
def _porutham_naattu(girl_rasi: int, boy_rasi: int) -> PoruthamResult:
    g_elem, b_elem = RASI_ELEMENT[girl_rasi], RASI_ELEMENT[boy_rasi]
    good = frozenset({g_elem, b_elem}) in ELEMENT_COMPATIBLE
    return {"name": "நாட்டுப் பொருத்தம்", "matched": good, "detail": f"பெண்: {g_elem}, ஆண்: {b_elem}",
            "description": "குடும்பச் சூழல், வாழ்க்கைச் சூழல் மற்றும் இல்லற ஒத்துழைப்பு தொடர்பான கூடுதல் கணிப்பு"}


# ── 20. சேவகப் பொருத்தம் ────────────────────────────────────
def _porutham_sevaka(girl_rasi: int, boy_rasi: int) -> PoruthamResult:
    count = ((boy_rasi - girl_rasi) % 12) + 1
    good = count in {3, 11}
    return {"name": "சேவகப் பொருத்தம்", "matched": good, "detail": f"எண்ணிக்கை {count}",
            "description": "ஒருவருக்கொருவர் உதவி, ஆதரவு மற்றும் குடும்பப் பொறுப்புகளைப் பகிர்ந்துகொள்ளும் தன்மை"}


# ── 21. கூட்டாளிப் பொருத்தம் ─────────────────────────────────
def _porutham_koodali(girl_rasi: int, boy_rasi: int) -> PoruthamResult:
    count = ((boy_rasi - girl_rasi) % 12) + 1
    good = count in {5, 9}
    return {"name": "கூட்டாளிப் பொருத்தம்", "matched": good, "detail": f"எண்ணிக்கை {count}",
            "description": "வாழ்க்கைத் துணையாக இணைந்து செயல்படுதல், புரிதல் மற்றும் ஒத்துழைப்பு"}


# ── 22. பக்ஷி / பஞ்சபட்சி பொருத்தம் ─────────────────────────
def _porutham_pakshi(girl_nak: int, boy_nak: int) -> PoruthamResult:
    g_bird, b_bird = girl_nak % 5, boy_nak % 5
    good = g_bird == b_bird or frozenset({g_bird, b_bird}) not in BIRD_ENEMY_PAIRS
    return {"name": "பக்ஷி / பஞ்சபட்சி பொருத்தம்", "matched": good,
            "detail": f"பெண்: {BIRD_NAMES_TA[g_bird]}, ஆண்: {BIRD_NAMES_TA[b_bird]}",
            "description": "பிறப்பு பட்சி மற்றும் அதன் சாதக–பாதக நிலைகளை அடிப்படையாகக் கொண்ட பாரம்பரிய மதிப்பீடு"}


def calculate_porutham(
    girl_nakshatra: int, girl_rasi: int, boy_nakshatra: int, boy_rasi: int,
    girl_lagna_rasi: int, boy_lagna_rasi: int, girl_sun_rasi: int, boy_sun_rasi: int,
) -> dict:
    # Order follows the client's supplied 22-porutham chart.
    checks = [
        _porutham_dina(girl_nakshatra, boy_nakshatra),                 # 1
        _porutham_gana(girl_nakshatra, boy_nakshatra),                 # 2
        _porutham_mahendra(girl_nakshatra, boy_nakshatra),             # 3
        _porutham_stree_deergha(girl_nakshatra, boy_nakshatra),        # 4
        _porutham_yoni(girl_nakshatra, boy_nakshatra),                 # 5
        _porutham_rasi(girl_rasi, boy_rasi),                           # 6
        _porutham_rasyadhipathi(girl_rasi, boy_rasi),                  # 7
        _porutham_vasiya(girl_rasi, boy_rasi),                         # 8
        _porutham_rajju(girl_nakshatra, boy_nakshatra),               # 9
        _porutham_vedha(girl_nakshatra, boy_nakshatra),               # 10
        _porutham_nadi(girl_nakshatra, boy_nakshatra),                # 11
        _porutham_vruksha(girl_nakshatra, boy_nakshatra),             # 12
        _porutham_lagna(girl_lagna_rasi, boy_lagna_rasi),             # 13
        _porutham_ayul(girl_nakshatra, boy_nakshatra),               # 14
        _porutham_linga(girl_rasi, boy_rasi),                         # 15
        _porutham_kendra(girl_rasi, boy_rasi),                        # 16
        _porutham_varna(girl_rasi, boy_rasi),                         # 17
        _porutham_vaasi(girl_sun_rasi, boy_sun_rasi),                 # 18
        _porutham_naattu(girl_rasi, boy_rasi),                        # 19
        _porutham_sevaka(girl_rasi, boy_rasi),                        # 20
        _porutham_koodali(girl_rasi, boy_rasi),                       # 21
        _porutham_pakshi(girl_nakshatra, boy_nakshatra),             # 22
    ]
    matched_count = sum(1 for c in checks if c["matched"])

    critical = {"தினப் பொருத்தம்", "கணப் பொருத்தம்", "ரஜ்ஜுப் பொருத்தம்", "வேதைப் பொருத்தம்", "நாடிப் பொருத்தம்"}
    critical_failures = [c["name"] for c in checks if c["name"] in critical and not c["matched"]]

    return {
        "girl": {"nakshatra": NAKSHATRA_NAMES_TA[girl_nakshatra], "rasi": RASI_NAMES_TA[girl_rasi]},
        "boy": {"nakshatra": NAKSHATRA_NAMES_TA[boy_nakshatra], "rasi": RASI_NAMES_TA[boy_rasi]},
        "poruthams": checks,
        "matched_count": matched_count,
        "total_count": len(checks),
        "critical_failures": critical_failures,
        "note": "இது ஒரு வழிகாட்டுதல் மட்டுமே. இறுதி முடிவுக்கு முன் ஒரு அனுபவமிக்க "
                "ஜோதிடரிடம் ஆலோசனை பெறவும்.",
    }
