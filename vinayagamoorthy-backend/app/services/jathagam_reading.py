"""
Full Jathagam reading — jothidar-style prediction paragraphs for each life
area, generated from the user's OWN computed chart (no re-typing anything),
in the user's chosen language.

Per the client's spec (doc.pdf / doc 2.pdf):
  "any one click the jathagam button, then they can see their full horoscope
   in their favourite language ... Analyse personal jathagam and give the
   correct prediction about these headings ... nice and perfect sentences
   like a jothidar or guruji."

The astrology facts still come from our own engine. Gemini only writes the
prose. Results are cached per (user, language) so repeat visits are instant
and don't burn quota; the cache is rebuilt if the birth chart changes.
"""
import json
from datetime import datetime, timezone

from app.core.languages import normalize_language, language_instruction, language_name
from app.db.mongodb import jathagam_readings_collection
from app.services.gemini_client import generate_text, GeminiError, is_configured
from app.services.lucky_notes import get_lucky_notes
from app.services.dosha import get_dosha_report

# key -> English label. The model is told to translate the label itself.
READING_SECTIONS = [
    ("personality", "Personality & Nature"),
    ("education_career", "Education & Career"),
    ("wealth_finance", "Wealth & Finance"),
    ("marriage_family", "Marriage & Family Life"),
    ("health", "Health"),
    ("spiritual", "Spiritual Path & Temperament"),
    ("current_period", "Current Planetary Period (Dasha / Gochara)"),
    ("remedies", "Remedies & Recommendations"),
]

_SCHEMA_VERSION = 3  # bump to invalidate every cached reading after a prompt change


def _chart_summary(user: dict, chart: dict) -> str:
    planets = chart["planets"]
    lucky = get_lucky_notes(planets["Moon"]["rasi_index"])
    dosha_report = get_dosha_report(chart)
    active = [d["name"] for d in dosha_report["doshas"] if d["present"]]
    planet_lines = "\n".join(
        f"- {name}: {info['rasi_name_ta']} rasi, {info['nakshatra_name_ta']} nakshatra"
        f"{' (retrograde)' if info['retrograde'] else ''}, {info['degree_in_rasi']} deg"
        for name, info in planets.items()
    )
    return (
        f"Name: {user['name']}\n"
        f"Gender: {user.get('gender', 'unknown')}\n"
        f"Birth: {user['birth']['date']} {user['birth']['time']} at {user['birth']['place']}\n"
        f"Lagnam (ascendant): {chart['ascendant']['rasi_name_ta']}\n"
        f"Rasi (Moon sign): {chart['rasi']}\n"
        f"Nakshatra: {chart['nakshatra']}\n\n"
        f"Planetary positions:\n{planet_lines}\n\n"
        f"Lucky: colour {lucky['favorable']['lucky_color']}, number {lucky['favorable']['lucky_number']}, "
        f"day {lucky['favorable']['lucky_day']}, stone {lucky['favorable']['lucky_stone']}\n"
        f"Active doshas: {', '.join(active) if active else 'none'}"
    )


def _prompt(user: dict, chart: dict, language: str) -> str:
    sections = "\n".join(f'  - "{k}": {label}' for k, label in READING_SECTIONS)
    return f"""You are "Vinayagamoorthy", an experienced Vedic astrologer (jothidar / guruji).
Write a full jathagam reading for the person whose chart is given below.

{_chart_summary(user, chart)}

Write 2-4 warm, specific sentences for EACH of these sections, grounded in the
chart above (mention the relevant rasi / nakshatra / planet where natural):
{sections}

Rules:
- {language_instruction(language)}
- Write like a kind traditional family astrologer, not a textbook.
- Be encouraging but honest; where the chart shows a challenge, name it gently
  and give practical guidance.
- Do NOT invent planetary positions beyond the data above.
- No medical or legal advice.
- Return ONLY valid JSON, no markdown, with this exact shape:
  {{
    "title": "<localized: 'Full Jathagam Reading'>",
    "intro": "<1-2 sentence localized opening>",
    "sections": [
      {{ "key": "personality", "heading": "<localized heading>", "text": "<the reading>" }},
      ... one object per section key above, in the same order ...
    ],
    "disclaimer": "<1 localized sentence: this is astrological guidance, consult an astrologer in person for major decisions>"
  }}
"""


def _parse(raw: str) -> dict:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.lstrip().lower().startswith("json"):
            raw = raw.lstrip()[4:]
    start, end = raw.find("{"), raw.rfind("}")
    if start == -1 or end == -1:
        raise GeminiError("Reading response was not JSON.")
    data = json.loads(raw[start : end + 1])
    if not isinstance(data.get("sections"), list) or not data["sections"]:
        raise GeminiError("Reading response had no sections.")
    return data


async def get_jathagam_reading(
    user: dict, chart: dict, language: str | None, refresh: bool = False
) -> dict:
    """
    Returns {"available": True, "language": ..., "reading": {...}, "generated_at": ...}
    or {"available": False, "detail": "..."} if Gemini isn't usable right now.
    The chart is always shown by the page regardless of this.
    """
    language = normalize_language(language or user.get("preferred_language"))
    chart_fp = f"{user['birth']['date']}|{user['birth']['time']}|{user['birth']['place']}|v{_SCHEMA_VERSION}"

    cached = await jathagam_readings_collection().find_one(
        {"user_id": user["_id"], "language": language}
    )
    if not refresh and cached and cached.get("chart_fp") == chart_fp:
        return {
            "available": True,
            "language": language,
            "language_name": language_name(language),
            "reading": cached["reading"],
            "generated_at": cached["generated_at"].isoformat(),
            "cached": True,
        }

    if not is_configured():
        return {
            "available": False,
            "language": language,
            "detail": "The prediction service (Gemini) is not configured yet. "
            "The chart below is still fully calculated from your birth details.",
        }

    try:
        raw = await generate_text(
            system_instruction="You output only valid JSON. No markdown fences.",
            contents=_prompt(user, chart, language),
            max_output_tokens=2200,
            response_mime_type="application/json",
        )
        reading = _parse(raw)
    except GeminiError as e:
        return {"available": False, "language": language, "detail": str(e)}

    now = datetime.now(timezone.utc)
    await jathagam_readings_collection().update_one(
        {"user_id": user["_id"], "language": language},
        {"$set": {"reading": reading, "chart_fp": chart_fp, "generated_at": now}},
        upsert=True,
    )
    return {
        "available": True,
        "language": language,
        "language_name": language_name(language),
        "reading": reading,
        "generated_at": now.isoformat(),
        "cached": False,
    }
