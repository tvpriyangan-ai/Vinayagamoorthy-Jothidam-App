"""
The five languages the app supports, in one place so the chat assistant and
the Jathagam reading generator both instruct Gemini the same way.
"""

SUPPORTED_LANGUAGES = ["ta", "ml", "en", "hi", "pa"]
DEFAULT_LANGUAGE = "ta"

# Native name + the instruction we hand Gemini so it replies in that language.
_LANGUAGE_INFO = {
    "ta": ("தமிழ்", "Respond ONLY in Tamil (தமிழ்). Use clear, modern Tamil."),
    "ml": ("മലയാളം", "Respond ONLY in Malayalam (മലയാളം). Use clear, modern Malayalam."),
    "en": ("English", "Respond ONLY in English."),
    "hi": ("हिन्दी", "Respond ONLY in Hindi (हिन्दी) using Devanagari script."),
    "pa": ("ਪੰਜਾਬੀ", "Respond ONLY in Punjabi (ਪੰਜਾਬੀ) using Gurmukhi script."),
}


def normalize_language(code: str | None) -> str:
    if not code:
        return DEFAULT_LANGUAGE
    code = code.strip().lower()[:2]
    return code if code in _LANGUAGE_INFO else DEFAULT_LANGUAGE


def language_name(code: str | None) -> str:
    return _LANGUAGE_INFO[normalize_language(code)][0]


def language_instruction(code: str | None) -> str:
    return _LANGUAGE_INFO[normalize_language(code)][1]
