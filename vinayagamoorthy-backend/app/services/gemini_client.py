"""
One place that talks to Gemini, so every caller gets the same error handling.

Common reasons chat / readings "don't work":
  - GEMINI_API_KEY not set on the server (Render > service > Environment)
  - the key is wrong or the Generative Language API isn't enabled for it
  - the model name in GEMINI_MODEL isn't available to that key
  - the response came back empty because it was safety-blocked

All of these now raise a GeminiError with a readable message instead of a
bare AttributeError on `response.text`.
"""
from google import genai
from google.genai import types

from app.core.config import settings


class GeminiError(RuntimeError):
    """Raised for any Gemini problem, with a message safe to log."""


def is_configured() -> bool:
    return bool(settings.GEMINI_API_KEY)


def _client() -> genai.Client:
    if not settings.GEMINI_API_KEY:
        raise GeminiError(
            "GEMINI_API_KEY is not set. Get a free key at "
            "https://aistudio.google.com/app/apikey and add it to the backend's "
            "environment variables (on Render: the service > Environment tab)."
        )
    return genai.Client(api_key=settings.GEMINI_API_KEY)


async def generate_text(
    *,
    system_instruction: str,
    contents: list[dict] | str,
    max_output_tokens: int = 1200,
    response_mime_type: str | None = None,
) -> str:
    """Call Gemini and return plain text, or raise GeminiError."""
    client = _client()
    config_kwargs = {
        "system_instruction": system_instruction,
        "max_output_tokens": max_output_tokens,
        "temperature": 0.7,
    }
    if response_mime_type:
        config_kwargs["response_mime_type"] = response_mime_type
    config = types.GenerateContentConfig(**config_kwargs)

    try:
        response = await client.aio.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=contents,
            config=config,
        )
    except Exception as e:  # network, auth, bad model name, quota…
        raise GeminiError(f"Gemini request failed ({settings.GEMINI_MODEL}): {e}") from e

    text = (getattr(response, "text", None) or "").strip()
    if text:
        return text

    # No text — figure out why so the message is useful.
    reason = "empty response"
    try:
        cand = (response.candidates or [None])[0]
        if cand is not None and getattr(cand, "finish_reason", None):
            reason = f"finish_reason={cand.finish_reason}"
        pf = getattr(response, "prompt_feedback", None)
        if pf and getattr(pf, "block_reason", None):
            reason = f"blocked: {pf.block_reason}"
    except Exception:
        pass
    raise GeminiError(f"Gemini returned no text ({reason}).")


async def check_health() -> dict:
    """Lightweight probe used by /health — never raises."""
    if not is_configured():
        return {"configured": False, "ok": False, "detail": "GEMINI_API_KEY not set"}
    try:
        await generate_text(
            system_instruction="You are a health check.",
            contents="Reply with the single word: ok",
            max_output_tokens=10,
        )
        return {"configured": True, "ok": True, "model": settings.GEMINI_MODEL}
    except GeminiError as e:
        return {"configured": True, "ok": False, "model": settings.GEMINI_MODEL, "detail": str(e)}
