"""
Chat with Vinayagamoorthy: an AI astrology assistant that answers using the
user's OWN chart, dosha report, and lucky notes as grounding context — not a
generic astrology chatbot. All the actual astrology math still comes from
our own engine (astro.py, dosha.py, lucky_notes.py); Gemini's job here is
just to explain and converse naturally in the user's language, never to
invent planetary positions of its own.

Uses the Gemini API (free tier available via Google AI Studio). Swapping
providers later (e.g. to Claude) only means changing this one file — the
grounding approach and every other module stays identical.
"""
from google import genai
from google.genai import types
from app.core.config import settings
from app.services.lucky_notes import get_lucky_notes
from app.services.dosha import get_dosha_report

MAX_HISTORY_TURNS = 10  # keep recent context only; avoids unbounded token growth


def _format_chart_context(user: dict, chart: dict) -> str:
    planets = chart["planets"]
    lucky = get_lucky_notes(planets["Moon"]["rasi_index"])
    dosha_report = get_dosha_report(chart)
    active_doshas = [d["name"] for d in dosha_report["doshas"] if d["present"]]

    planet_lines = "\n".join(
        f"- {name}: {info['rasi_name_ta']} ராசி, {info['nakshatra_name_ta']} நட்சத்திரம்"
        f"{' (வக்ரம்)' if info['retrograde'] else ''}"
        for name, info in planets.items()
    )

    return f"""இது {user['name']} என்பவரின் ஜாதக விவரம் — இதை மட்டுமே பயன்படுத்தி பதில் அளிக்கவும்:

லக்னம்: {chart['ascendant']['rasi_name_ta']}
ராசி (சந்திர ராசி): {chart['rasi']}
நட்சத்திரம்: {chart['nakshatra']}

கிரக நிலைகள்:
{planet_lines}

அதிர்ஷ்ட குறிப்புகள்: நிறம் - {lucky['favorable']['lucky_color']}, எண் - {lucky['favorable']['lucky_number']}, நாள் - {lucky['favorable']['lucky_day']}, கல் - {lucky['favorable']['lucky_stone']}

செயலில் உள்ள தோஷங்கள்: {', '.join(active_doshas) if active_doshas else 'எதுவும் இல்லை'}
"""


def build_system_prompt(user: dict, chart: dict) -> str:
    chart_context = _format_chart_context(user, chart)
    language = user.get("preferred_language", "ta")
    lang_instruction = "தமிழில் பதில் அளிக்கவும்." if language == "ta" else "Respond in English."

    return f"""நீங்கள் "வினாயகமூர்த்தி" — ஒரு அனுபவமிக்க, அன்பான ஜோதிட உதவியாளர், "Vinayagamoorthy Jothidam" ஆப்பில்.

{chart_context}

வழிகாட்டுதல்கள்:
- மேலே கொடுக்கப்பட்ட ஜாதக தகவல்களை மட்டுமே பயன்படுத்தி பதிலளிக்கவும். புதிய கிரக நிலைகளை கற்பனை செய்ய வேண்டாம்.
- {lang_instruction}
- அன்பான, மரியாதையான தொனியில் பேசவும் — பாரம்பரிய ஜோதிடர் போல.
- திருமணம், ஆரோக்கியம், நிதி போன்ற முக்கிய முடிவுகளுக்கு, இது ஒரு வழிகாட்டுதலே தவிர இறுதி பதில் அல்ல என்பதை நினைவூட்டி, தேவைப்பட்டால் ஒரு அனுபவமிக்க ஜோதிடரை அணுக பரிந்துரைக்கவும்.
- மருத்துவ ஆலோசனை அல்லது சட்ட ஆலோசனை வழங்க வேண்டாம்.
- பதில்களை சுருக்கமாகவும், தெளிவாகவும் வைக்கவும்.
"""


def _history_to_gemini_contents(history: list[dict], new_message: str) -> list[dict]:
    """Gemini uses 'model' instead of 'assistant' for the AI's turns."""
    contents = []
    for turn in history[-MAX_HISTORY_TURNS:]:
        role = "model" if turn["role"] == "assistant" else "user"
        contents.append({"role": role, "parts": [{"text": turn["content"]}]})
    contents.append({"role": "user", "parts": [{"text": new_message}]})
    return contents


async def get_chat_reply(user: dict, chart: dict, history: list[dict], new_message: str) -> str:
    if not settings.GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com/app/apikey "
            "and add it to your .env file or Render environment variables."
        )

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    system_prompt = build_system_prompt(user, chart)
    contents = _history_to_gemini_contents(history, new_message)

    response = await client.aio.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            max_output_tokens=1000,
        ),
    )

    return response.text
