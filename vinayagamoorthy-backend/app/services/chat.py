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
from app.core.languages import language_instruction
from app.services.gemini_client import generate_text, GeminiError  # noqa: F401 (re-exported)
from app.services.lucky_notes import get_lucky_notes
from app.services.dosha import get_dosha_report

MAX_HISTORY_TURNS = 10  # keep recent context only; avoids unbounded token growth


def _format_chart_context(user: dict, chart: dict) -> str:
    planets = chart["planets"]
    lucky = get_lucky_notes(planets["Moon"]["rasi_index"])
    dosha_report = get_dosha_report(chart)
    active_doshas = [d["name"] for d in dosha_report["doshas"] if d["present"]]

    planet_lines = "\n".join(
        f"- {name}: {info['rasi_name_ta']} rasi, {info['nakshatra_name_ta']} nakshatra"
        f"{' (retrograde)' if info['retrograde'] else ''}"
        for name, info in planets.items()
    )

    return f"""Birth chart of {user['name']} — use ONLY this data to answer:

Lagnam (ascendant): {chart['ascendant']['rasi_name_ta']}
Rasi (Moon sign): {chart['rasi']}
Nakshatra (birth star): {chart['nakshatra']}

Planetary positions:
{planet_lines}

Lucky notes: colour - {lucky['favorable']['lucky_color']}, number - {lucky['favorable']['lucky_number']}, day - {lucky['favorable']['lucky_day']}, stone - {lucky['favorable']['lucky_stone']}

Active doshas: {', '.join(active_doshas) if active_doshas else 'none'}
"""


def build_system_prompt(user: dict, chart: dict, language: str | None = None) -> str:
    chart_context = _format_chart_context(user, chart)
    lang_instruction = language_instruction(language or user.get("preferred_language"))

    return f"""You are "Vinayagamoorthy" — an experienced, warm Vedic astrologer (jothidar) inside the "Vinayagamoorthy Jothidam" app.

{chart_context}

Guidelines:
- Answer using ONLY the chart data above. Never invent planetary positions.
- {lang_instruction}
- Speak in a warm, respectful tone, like a traditional family astrologer.
- For big decisions (marriage, health, finance), remind the user this is guidance, not a final verdict, and suggest consulting an experienced astrologer in person if needed.
- Do not give medical or legal advice.
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
