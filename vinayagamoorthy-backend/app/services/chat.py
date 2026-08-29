"""
Chat with Vinayagamoorthy: an AI astrology assistant that answers using the
user's OWN chart, dosha report, and lucky notes as grounding context — not a
generic astrology chatbot. All the actual astrology math still comes from
our own engine (astro.py, dosha.py, lucky_notes.py); Gemini's job here is
just to explain and converse naturally in the user's language, never to
invent planetary positions of its own.

Uses the Gemini API (free tier available via Google AI Studio). Swapping
providers later (e.g. to Claude) only means changing gemini_client.py — the
grounding approach and every other module stays identical.
"""
from datetime import date, datetime

from app.core.languages import language_instruction
from app.services.gemini_client import generate_text, GeminiError  # noqa: F401 (re-exported)
from app.services.lucky_notes import get_lucky_notes
from app.services.dosha import get_dosha_report
from app.services.dasha import compute_dasha
from app.services.transit import get_transit_predictions

MAX_HISTORY_TURNS = 10  # keep recent context only; avoids unbounded token growth


def _approx_age(birth_date: str) -> str:
    try:
        b = datetime.strptime(birth_date, "%Y-%m-%d").date()
        today = date.today()
        years = today.year - b.year - ((today.month, today.day) < (b.month, b.day))
        return f"{years} years"
    except Exception:
        return "unknown"


def _format_chart_context(user: dict, chart: dict) -> str:
    planets = chart["planets"]
    birth = user.get("birth", {})
    lucky = get_lucky_notes(planets["Moon"]["rasi_index"])
    dosha_report = get_dosha_report(chart)
    active_doshas = [d["name"] for d in dosha_report["doshas"] if d["present"]]

    planet_lines = "\n".join(
        f"- {name}: {info['rasi_name_ta']} rasi, {info['nakshatra_name_ta']} nakshatra"
        f"{' (retrograde)' if info['retrograde'] else ''}"
        for name, info in planets.items()
    )

    # Current Vimshottari period + today's gochara — so the assistant can
    # answer "which period am I in", "is this a good time for…", etc.
    dasha_line = "unavailable"
    try:
        d = compute_dasha(planets["Moon"]["longitude"], birth["date"])
        md, bh = d["current_maha_dasha"], d["current_bhukti"]
        dasha_line = (
            f"{md['lord']} Maha Dasha ({md['start']} to {md['end']}, "
            f"{md['remaining']['years']}y {md['remaining']['months']}m left); "
            f"currently {bh['lord']} Bhukti (until {bh['end']})"
        )
    except Exception:
        pass

    transit_line = "unavailable"
    try:
        tp = get_transit_predictions(planets["Moon"]["rasi_index"])
        fav = [t["planet"] for t in tp["transits"] if t["favorable"]]
        unfav = [t["planet"] for t in tp["transits"] if not t["favorable"]]
        transit_line = f"favourable now: {', '.join(fav) or 'none'}; needs care: {', '.join(unfav) or 'none'}"
    except Exception:
        pass

    return f"""Birth chart of {user['name']} — use ONLY this data to answer:

Gender: {user.get('gender', 'unknown')}
Born: {birth.get('date', '?')} at {birth.get('time', '?')}, {birth.get('place', '?')} (approx age: {_approx_age(birth.get('date', ''))})

Lagnam (ascendant): {chart['ascendant']['rasi_name_ta']}
Rasi (Moon sign): {chart['rasi']}
Nakshatra (birth star): {chart['nakshatra']}

Planetary positions:
{planet_lines}

Current Vimshottari period: {dasha_line}
Current transits (gochara) vs natal Moon: {transit_line}

Lucky notes: colour - {lucky['favorable']['lucky_color']}, number - {lucky['favorable']['lucky_number']}, day - {lucky['favorable']['lucky_day']}, stone - {lucky['favorable']['lucky_stone']}

Active doshas: {', '.join(active_doshas) if active_doshas else 'none'}
"""


def build_system_prompt(user: dict, chart: dict, language: str | None = None) -> str:
    chart_context = _format_chart_context(user, chart)
    lang_instruction = language_instruction(language or user.get("preferred_language"))

    return f"""You are "Vinayagamoorthy" — an experienced, warm Vedic astrologer (jothidar) inside the "Vinayagamoorthy Jothidam" app.

{chart_context}

Guidelines:
- Answer the user's PERSONAL questions (career, marriage, timing, health tendencies, finance, education, family, current period, "is now a good time…") by interpreting the birth chart, the current Vimshottari dasha/bhukti and the current transits shown above — the way a traditional jothidar would.
- Use ONLY the data above. Never invent planetary positions, dashas or dates.
- {lang_instruction}
- Speak in a warm, respectful, confident tone, like a trusted family astrologer.
- You ARE the astrologer here — answer fully from this chart yourself. Do NOT tell the user to consult another astrologer, to see someone "in person", or that this reading is incomplete. Never undermine confidence in this app.
- You may gently note that outcomes also depend on the person's own effort and choices, but keep it brief and positive — not a disclaimer.
- Do not give medical diagnoses or legal advice; for those, suggest a doctor or lawyer only.
- Keep answers concise and clear.
"""


def _history_to_gemini_contents(history: list[dict], new_message: str) -> list[dict]:
    """Gemini uses 'model' instead of 'assistant' for the AI's turns."""
    contents = []
    for turn in history[-MAX_HISTORY_TURNS:]:
        role = "model" if turn["role"] == "assistant" else "user"
        contents.append({"role": role, "parts": [{"text": turn["content"]}]})
    contents.append({"role": "user", "parts": [{"text": new_message}]})
    return contents


async def get_chat_reply(
    user: dict, chart: dict, history: list[dict], new_message: str, language: str | None = None
) -> str:
    system_prompt = build_system_prompt(user, chart, language)
    contents = _history_to_gemini_contents(history, new_message)
    return await generate_text(
        system_instruction=system_prompt,
        contents=contents,
        max_output_tokens=1000,
    )
