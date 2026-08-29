"""
Astrology-term dictionaries in the 5 UI languages, plus localise_*() helpers
that rewrite an API payload's Tamil name fields into the requested language
using the indices/keys the payload already carries.

Calculation code never touches this — services keep computing in Tamil +
indices; routers call localise_*() on the way out.

ta = reviewed. en = reviewed. ml / hi / pa = Sanskrit names in the native
script, best-effort — have a native speaker verify before launch.
"""
from app.core.languages import normalize_language

RASI = {
    "ta": ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி",
           "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"],
    "en": ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
           "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
    "ml": ["മേടം", "ഇടവം", "മിഥുനം", "കർക്കടകം", "ചിങ്ങം", "കന്നി",
           "തുലാം", "വൃശ്ചികം", "ധനു", "മകരം", "കുംഭം", "മീനം"],
    "hi": ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
           "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"],
    "pa": ["ਮੇਖ", "ਬ੍ਰਿਖ", "ਮਿਥੁਨ", "ਕਰਕ", "ਸਿੰਘ", "ਕੰਨਿਆ",
           "ਤੁਲਾ", "ਬ੍ਰਿਸ਼ਚਕ", "ਧਨੁ", "ਮਕਰ", "ਕੁੰਭ", "ਮੀਨ"],
}

NAKSHATRA = {
    "ta": ["அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிடம்", "திருவாதிரை",
           "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்",
           "ஹஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை",
           "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
           "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி"],
    "en": ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
           "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
           "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
           "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
           "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"],
    "ml": ["അശ്വതി", "ഭരണി", "കാർത്തിക", "രോഹിണി", "മകയിരം", "തിരുവാതിര",
           "പുണർതം", "പൂയം", "ആയില്യം", "മകം", "പൂരം", "ഉത്രം",
           "അത്തം", "ചിത്തിര", "ചോതി", "വിശാഖം", "അനിഴം", "തൃക്കേട്ട",
           "മൂലം", "പൂരാടം", "ഉത്രാടം", "തിരുവോണം", "അവിട്ടം", "ചതയം",
           "പൂരുരുട്ടാതി", "ഉത്രട്ടാതി", "രേവതി"],
    "hi": ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा",
           "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी",
           "हस्त", "चित्रा", "स्वाति", "विशाखा", "अनुराधा", "ज्येष्ठा",
           "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा",
           "पूर्वाभाद्रपद", "उत्तराभाद्रपद", "रेवती"],
    "pa": ["ਅਸ਼ਵਨੀ", "ਭਰਣੀ", "ਕ੍ਰਿਤਿਕਾ", "ਰੋਹਿਣੀ", "ਮ੍ਰਿਗਸ਼ਿਰਾ", "ਆਰਦਰਾ",
           "ਪੁਨਰਵਸੁ", "ਪੁਸ਼ਯ", "ਅਸ਼ਲੇਸ਼ਾ", "ਮਘਾ", "ਪੂਰਵਾ ਫਾਲਗੁਨੀ", "ਉੱਤਰਾ ਫਾਲਗੁਨੀ",
           "ਹਸਤ", "ਚਿਤਰਾ", "ਸਵਾਤੀ", "ਵਿਸ਼ਾਖਾ", "ਅਨੁਰਾਧਾ", "ਜਯੇਸ਼ਠਾ",
           "ਮੂਲ", "ਪੂਰਵਾਸ਼ਾੜਾ", "ਉੱਤਰਾਸ਼ਾੜਾ", "ਸ਼੍ਰਵਣ", "ਧਨਿਸ਼ਠਾ", "ਸ਼ਤਭਿਸ਼ਾ",
           "ਪੂਰਵਾਭਾਦਰਪਦ", "ਉੱਤਰਾਭਾਦਰਪਦ", "ਰੇਵਤੀ"],
}

# Keyed by the English planet name the engine uses.
PLANET = {
    "Sun":     {"ta": "சூரியன்", "en": "Sun", "ml": "സൂര്യൻ", "hi": "सूर्य", "pa": "ਸੂਰਜ"},
    "Moon":    {"ta": "சந்திரன்", "en": "Moon", "ml": "ചന്ദ്രൻ", "hi": "चंद्र", "pa": "ਚੰਦ੍ਰਮਾ"},
    "Mars":    {"ta": "செவ்வாய்", "en": "Mars", "ml": "ചൊവ്വ", "hi": "मंगल", "pa": "ਮੰਗਲ"},
    "Mercury": {"ta": "புதன்", "en": "Mercury", "ml": "ബുധൻ", "hi": "बुध", "pa": "ਬੁੱਧ"},
    "Jupiter": {"ta": "குரு", "en": "Jupiter", "ml": "വ്യാഴം", "hi": "गुरु", "pa": "ਗੁਰੂ"},
    "Venus":   {"ta": "சுக்கிரன்", "en": "Venus", "ml": "ശുക്രൻ", "hi": "शुक्र", "pa": "ਸ਼ੁੱਕਰ"},
    "Saturn":  {"ta": "சனி", "en": "Saturn", "ml": "ശനി", "hi": "शनि", "pa": "ਸ਼ਨੀ"},
    "Rahu":    {"ta": "ராகு", "en": "Rahu", "ml": "രാഹു", "hi": "राहु", "pa": "ਰਾਹੂ"},
    "Ketu":    {"ta": "கேது", "en": "Ketu", "ml": "കേതു", "hi": "केतु", "pa": "ਕੇਤੂ"},
}
# Reverse: Tamil planet string -> English key (matching.py / lucky_notes.py emit Tamil)
_PLANET_TA_TO_KEY = {v["ta"]: k for k, v in PLANET.items()}

WEEKDAY = {
    "ta": ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"],
    "en": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "ml": ["ഞായർ", "തിങ്കൾ", "ചൊവ്വ", "ബുധൻ", "വ്യാഴം", "വെള്ളി", "ശനി"],
    "hi": ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
    "pa": ["ਐਤਵਾਰ", "ਸੋਮਵਾਰ", "ਮੰਗਲਵਾਰ", "ਬੁੱਧਵਾਰ", "ਵੀਰਵਾਰ", "ਸ਼ੁੱਕਰਵਾਰ", "ਸ਼ਨੀਵਾਰ"],
}

PAKSHA = {  # 0 = waxing / shukla, 1 = waning / krishna
    "ta": ["வளர்பிறை", "தேய்பிறை"],
    "en": ["Shukla Paksha", "Krishna Paksha"],
    "ml": ["ശുക്ലപക്ഷം", "കൃഷ്ണപക്ഷം"],
    "hi": ["शुक्ल पक्ष", "कृष्ण पक्ष"],
    "pa": ["ਸ਼ੁਕਲ ਪੱਖ", "ਕ੍ਰਿਸ਼ਨ ਪੱਖ"],
}
_PAKSHA_TA_TO_IDX = {"வளர்பிறை": 0, "தேய்பிறை": 1}

# Tithi 1..15 name (same set repeats in each paksha)
TITHI = {
    "ta": ["பிரதமை", "துவிதியை", "திருதியை", "சதுர்த்தி", "பஞ்சமி", "சஷ்டி", "சப்தமி",
           "அஷ்டமி", "நவமி", "தசமி", "ஏகாதசி", "துவாதசி", "திரயோதசி", "சதுர்தசி", "பௌர்ணமி"],
    "en": ["Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami",
           "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"],
    "ml": ["പ്രഥമ", "ദ്വിതീയ", "തൃതീയ", "ചതുർത്ഥി", "പഞ്ചമി", "ഷഷ്ഠി", "സപ്തമി",
           "അഷ്ടമി", "നവമി", "ദശമി", "ഏകാദശി", "ദ്വാദശി", "ത്രയോദശി", "ചതുർദശി", "പൗർണമി"],
    "hi": ["प्रथमा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी",
           "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा"],
    "pa": ["ਪ੍ਰਥਮਾ", "ਦ੍ਵਿਤੀਯਾ", "ਤ੍ਰਿਤੀਯਾ", "ਚਤੁਰਥੀ", "ਪੰਚਮੀ", "ਸ਼ਸ਼ਠੀ", "ਸਪਤਮੀ",
           "ਅਸ਼ਟਮੀ", "ਨਵਮੀ", "ਦਸ਼ਮੀ", "ਏਕਾਦਸ਼ੀ", "ਦ੍ਵਾਦਸ਼ੀ", "ਤ੍ਰਯੋਦਸ਼ੀ", "ਚਤੁਰਦਸ਼ੀ", "ਪੂਰਨਮਾਸ਼ੀ"],
}
AMAVASAI = {"ta": "அமாவாசை", "en": "Amavasya", "ml": "അമാവാസി", "hi": "अमावस्या", "pa": "ਮੱਸਿਆ"}
_TITHI_TA_TO_IDX = {n: i for i, n in enumerate(TITHI["ta"])}

YOGA = {
    "ta": ["விஷ்கம்பம்", "பிரீதி", "ஆயுஷ்மான்", "சௌபாக்கியம்", "சோபனம்", "அதிகண்டம்", "சுகர்மா",
           "திருதி", "சூலம்", "கண்டம்", "விருத்தி", "துருவம்", "வியாகாதம்", "ஹர்ஷணம்", "வஜ்ரம்",
           "சித்தி", "வியதீபாதம்", "வரீயான்", "பரிகம்", "சிவம்", "சித்தம்", "சாத்தியம்", "சுபம்",
           "சுக்லம்", "பிரம்மம்", "ஐந்திரம்", "வைதிருதி"],
    "en": ["Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma",
           "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
           "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha",
           "Shukla", "Brahma", "Indra", "Vaidhriti"],
}
YOGA["ml"] = YOGA["en"]; YOGA["hi"] = YOGA["en"]; YOGA["pa"] = YOGA["en"]  # REVIEW: transliterate
_YOGA_TA_TO_IDX = {n: i for i, n in enumerate(YOGA["ta"])}

KARANA = {
    "ta": ["பவ", "பாலவ", "கௌலவ", "தைதுலை", "கரஜை", "வணிஜை", "விஷ்டி",
           "கிம்ஸ்துக்னம்", "சகுனி", "சதுஷ்பாதம்", "நாகவம்"],
    "en": ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti",
           "Kimstughna", "Shakuni", "Chatushpada", "Naga"],
}
KARANA["ml"] = KARANA["en"]; KARANA["hi"] = KARANA["en"]; KARANA["pa"] = KARANA["en"]
_KARANA_TA_TO_IDX = {n: i for i, n in enumerate(KARANA["ta"])}

# Porutham display name, keyed by the stable key we add in matching.py
PORUTHAM = {
    "dina":         {"ta": "தினப் பொருத்தம்", "en": "Dina Porutham"},
    "gana":         {"ta": "கணப் பொருத்தம்", "en": "Gana Porutham"},
    "mahendra":     {"ta": "மகேந்திரப் பொருத்தம்", "en": "Mahendra Porutham"},
    "stree_deergha":{"ta": "ஸ்திரீ தீர்க்கப் பொருத்தம்", "en": "Stree Deergha Porutham"},
    "yoni":         {"ta": "யோனிப் பொருத்தம்", "en": "Yoni Porutham"},
    "rasi":         {"ta": "ராசிப் பொருத்தம்", "en": "Rasi Porutham"},
    "rasyadhipathi":{"ta": "ராசி அதிபதிப் பொருத்தம்", "en": "Rasi Adhipathi Porutham"},
    "vasiya":       {"ta": "வசியப் பொருத்தம்", "en": "Vasiya Porutham"},
    "rajju":        {"ta": "ரஜ்ஜுப் பொருத்தம்", "en": "Rajju Porutham"},
    "vedha":        {"ta": "வேதைப் பொருத்தம்", "en": "Vedha Porutham"},
    "nadi":         {"ta": "நாடிப் பொருத்தம்", "en": "Nadi Porutham"},
    "vruksha":      {"ta": "விருட்சப் பொருத்தம்", "en": "Vruksha Porutham"},
    "lagna":        {"ta": "லக்னப் பொருத்தம்", "en": "Lagna Porutham"},
    "ayul":         {"ta": "ஆயுள் பொருத்தம்", "en": "Ayul Porutham"},
    "linga":        {"ta": "லிங்கப் பொருத்தம்", "en": "Linga Porutham"},
    "kendra":       {"ta": "கேந்திரப் பொருத்தம்", "en": "Kendra Porutham"},
    "varna":        {"ta": "வர்ணப் பொருத்தம்", "en": "Varna Porutham"},
    "vaasi":        {"ta": "வாசிப் பொருத்தம்", "en": "Vaasi Porutham"},
    "naattu":       {"ta": "நாட்டுப் பொருத்தம்", "en": "Naattu Porutham"},
    "sevaka":       {"ta": "சேவகப் பொருத்தம்", "en": "Sevaka Porutham"},
    "koodali":      {"ta": "கூட்டாளிப் பொருத்தம்", "en": "Kootali Porutham"},
    "pakshi":       {"ta": "பக்ஷி / பஞ்சபட்சி பொருத்தம்", "en": "Pakshi Porutham"},
}


def _lang(code):
    return normalize_language(code)


def rasi(index, lang):
    if index is None or not (0 <= index < 12):
        return None
    L = _lang(lang)
    return (RASI.get(L) or RASI["ta"])[index]


def nakshatra(index, lang):
    L = _lang(lang)
    return (NAKSHATRA.get(L) or NAKSHATRA["ta"])[index] if index is not None and 0 <= index < 27 else None


def planet(name_key, lang):
    L = _lang(lang)
    key = name_key if name_key in PLANET else _PLANET_TA_TO_KEY.get(name_key)
    if not key:
        return name_key
    return PLANET[key].get(L, PLANET[key]["ta"])


def weekday(index, lang):
    L = _lang(lang)
    return (WEEKDAY.get(L) or WEEKDAY["ta"])[index]


def _from_ta(table_ta_to_idx, table, ta_value, lang):
    idx = table_ta_to_idx.get(ta_value)
    if idx is None:
        return ta_value
    L = _lang(lang)
    return (table.get(L) or table["ta"])[idx]


# ── payload localisers ────────────────────────────────────────────────

def localise_chart(chart: dict, lang: str) -> dict:
    if not chart:
        return chart
    asc = chart.get("ascendant") or {}
    if "rasi_index" in asc:
        asc["rasi_name_ta"] = rasi(asc["rasi_index"], lang)
        asc["rasi_name"] = asc["rasi_name_ta"]
    for info in (chart.get("planets") or {}).values():
        if "rasi_index" in info:
            info["rasi_name_ta"] = rasi(info["rasi_index"], lang)
        if info.get("nakshatra_index") is not None:
            info["nakshatra_name_ta"] = nakshatra(info["nakshatra_index"], lang)
    moon = (chart.get("planets") or {}).get("Moon") or {}
    if "rasi_index" in moon:
        chart["rasi"] = rasi(moon["rasi_index"], lang)
    if moon.get("nakshatra_index") is not None:
        chart["nakshatra"] = nakshatra(moon["nakshatra_index"], lang)
    return chart


def localise_panchangam(p: dict, lang: str) -> dict:
    if not p:
        return p
    if p.get("vaaram_index") is not None:
        p["vaaram"] = weekday(p["vaaram_index"], lang)
    t = p.get("tithi") or {}
    if t:
        pk = t.get("paksha_index")
        if pk is None:
            pk = _PAKSHA_TA_TO_IDX.get(t.get("paksha"))
        if pk is not None:
            t["paksha"] = (PAKSHA.get(_lang(lang)) or PAKSHA["ta"])[pk]
        if t.get("name_ta") == AMAVASAI["ta"]:
            t["name_ta"] = AMAVASAI.get(_lang(lang), AMAVASAI["ta"])
        elif "index" in t:
            base = t["index"] % 15
            t["name_ta"] = (TITHI.get(_lang(lang)) or TITHI["ta"])[base]
    for key, table, rev in (("nakshatra", NAKSHATRA, None), ("yoga", YOGA, _YOGA_TA_TO_IDX),
                            ("karana", KARANA, _KARANA_TA_TO_IDX)):
        seg = p.get(key) or {}
        if key == "nakshatra" and seg.get("index") is not None:
            seg["name_ta"] = nakshatra(seg["index"], lang)
        elif rev is not None and seg.get("name_ta"):
            seg["name_ta"] = _from_ta(rev, table, seg["name_ta"], lang)
    return p


def localise_transit(data: dict, lang: str) -> dict:
    if not data:
        return data
    if data.get("natal_moon_rasi_index") is not None:
        data["natal_moon_rasi"] = rasi(data["natal_moon_rasi_index"], lang)
    for tr in data.get("transits", []):
        if "planet" in tr:
            tr["planet_name_ta"] = planet(tr["planet"], lang)
        if tr.get("current_rasi_index") is not None:
            tr["current_rasi"] = rasi(tr["current_rasi_index"], lang)
    d = data.get("dasha")
    if d:
        for block in ("current_maha_dasha", "current_bhukti"):
            b = d.get(block)
            if b and "lord" in b:
                b["lord_ta"] = planet(b["lord"], lang)
        for row in d.get("maha_dasha_timeline", []) + d.get("bhukti_timeline", []):
            if "lord" in row:
                row["lord_ta"] = planet(row["lord"], lang)
    return data


def localise_matching(r: dict, lang: str) -> dict:
    if not r:
        return r
    for side in ("girl", "boy"):
        s = r.get(side) or {}
        if s.get("rasi_index") is not None:
            s["rasi"] = rasi(s["rasi_index"], lang)
        if s.get("nakshatra_index") is not None:
            s["nakshatra"] = nakshatra(s["nakshatra_index"], lang)
    for p in r.get("poruthams", []):
        k = p.get("key")
        if k and k in PORUTHAM:
            p["name"] = PORUTHAM[k].get(_lang(lang), PORUTHAM[k]["ta"])
    return r
