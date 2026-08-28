"""
Personalised Vastu report — per the client's spec (doc 2.pdf):

  "this chapter shows personal vaasthu report for this user only, each user
   gets an individual vaastu prediction according to their raasi,
   nadsaththira, number. So use the calculated jathagam and show the
   genuine vaasthu report."

So this is NOT the generic Vastu content-library article. It's grounded in
the user's own Moon rasi, nakshatra, ruling planet and lucky number/
direction, written like a Vastu consultant, in the chosen language, and
cached per (user, language).
"""
from datetime import datetime, timezone

from app.core.languages import normalize_language, language_instruction, language_name
from app.db.mongodb import vastu_reports_collection
from app.services.gemini_client import generate_text, GeminiError, is_configured, parse_json_object
from app.services.lucky_notes import get_lucky_notes

# Direction of each planet in Vastu (dik) — used to hint the favourable
# direction from the person's ruling planet.
PLANET_DIRECTION = {
    "சூரியன்": "கிழக்கு (East)",
    "சந்திரன்": "வடமேற்கு (North-West)",
    "செவ்வாய்": "தெற்கு (South)",
    "புதன்": "வடக்கு (North)",
    "குரு": "வடகிழக்கு (North-East)",
    "சுக்கிரன்": "தென்கிழக்கு (South-East)",
    "சனி": "மேற்கு (West)",
}

VASTU_SECTIONS = [
    ("favourable_direction", "Favourable Direction & Sitting/Sleeping Orientation"),
    ("main_entrance", "Main Entrance & Doors"),
    ("pooja_room", "Pooja / Prayer Room"),
    ("kitchen", "Kitchen & Cooking Direction"),
    ("bedroom", "Bedroom"),
    ("water_finance", "Water, Borewell & Wealth Corner"),
    ("colours_elements", "Colours & Elements to Favour"),
    ("remedies", "Vastu Remedies (no demolition needed)"),
]

_SCHEMA_VERSION = 1


def _context(user: dict, chart: dict) -> str:
    moon = chart["planets"]["Moon"]
    lucky = get_lucky_notes(moon["rasi_index"])["favorable"]
    ruling = lucky["ruling_planet"]
    return (
        f"Name: {user['name']}\n"
        f"Moon rasi (Janma Rasi): {chart['rasi']}\n"
        f"Nakshatra: {chart['nakshatra']}\n"
        f"Ruling planet of the rasi: {ruling}\n"
        f"Planet direction (Vastu dik) of the ruling planet: {PLANET_DIRECTION.get(ruling, 'derive from the ruling planet')}\n"
        f"Lucky number: {lucky['lucky_number']}\n"
        f"Lucky colour: {lucky['lucky_color']}\n"
        f"Lucky metal: {lucky['lucky_metal']}\n"
        f"Favourable weekday: {lucky['lucky_day']}\n"
    )


def _prompt(user: dict, chart: dict, language: str) -> str:
    sections = "\n".join(f'  - "{k}": {label}' for k, label in VASTU_SECTIONS)
    return f"""You are an experienced Vastu Shastra consultant working alongside a Vedic
astrologer. Write a PERSONAL Vastu report for this person, tuned to their
birth chart below (rasi, nakshatra, ruling planet, lucky number/direction).

{_context(user, chart)}

Write 2-4 practical, specific sentences for EACH section, connecting the
advice to their rasi / nakshatra / ruling planet / lucky number where it
makes sense:
{sections}

Rules:
- {language_instruction(language)}
- Sound like a warm, practical consultant giving genuine guidance a family can act on.
- Prefer remedies that DON'T need breaking or rebuilding (mirrors, colours, salt, plants, idols, direction of sitting/sleeping, etc.).
- Do not invent chart data beyond what's given.
- No structural/engineering or legal advice.
- Return ONLY valid JSON, no markdown, exactly:
  {{
    "title": "<localized: 'Personal Vastu Report'>",
    "intro": "<1-2 sentence localized opening naming their rasi>",
    "sections": [
      {{ "key": "favourable_direction", "heading": "<localized heading>", "text": "<the advice>" }},
      ... one object per section key above, same order ...
    ],
    "disclaimer": "<1 localized sentence: this is Vastu guidance based on your chart; consult a consultant on site for major changes>"
  }}
"""


async def get_vastu_report(user: dict, chart: dict, language: str | None, refresh: bool = False) -> dict:
    language = normalize_language(language or user.get("preferred_language"))
    fp = f"{user['birth']['date']}|{user['birth']['time']}|{user['birth']['place']}|v{_SCHEMA_VERSION}"

    cached = await vastu_reports_collection().find_one({"user_id": user["_id"], "language": language})
    if not refresh and cached and cached.get("chart_fp") == fp:
        return {
            "available": True,
            "language": language,
            "language_name": language_name(language),
            "report": cached["report"],
            "generated_at": cached["generated_at"].isoformat(),
            "cached": True,
        }

    if not is_configured():
        return {
            "available": False,
            "language": language,
            "detail": "The Vastu report service (Gemini) is not configured yet.",
        }

    try:
        raw = await generate_text(
            system_instruction="You output only valid JSON. No markdown fences.",
            contents=_prompt(user, chart, language),
            max_output_tokens=2200,
            response_mime_type="application/json",
        )
        report = parse_json_object(raw)
        if not isinstance(report.get("sections"), list) or not report["sections"]:
            raise GeminiError("Vastu response had no sections.")
    except GeminiError as e:
        return {"available": False, "language": language, "detail": str(e)}

    now = datetime.now(timezone.utc)
    await vastu_reports_collection().update_one(
        {"user_id": user["_id"], "language": language},
        {"$set": {"report": report, "chart_fp": fp, "generated_at": now}},
        upsert=True,
    )
    return {
        "available": True,
        "language": language,
        "language_name": language_name(language),
        "report": report,
        "generated_at": now.isoformat(),
        "cached": False,
    }
