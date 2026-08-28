"""
Vimshottari Dasha — the 120-year planetary period system used in Tamil /
Vedic astrology. Driven entirely by the Moon's sidereal longitude at birth
(from astro.py), so it stays consistent with the rest of the app.

Terms:
  Maha Dasha  = major planetary period ("dhasa")
  Bhukti      = sub-period within a maha dasha ("puththi" / antardasha)

We report the running maha dasha and bhukti with years+months remaining,
plus the full maha-dasha timeline and the bhukti timeline inside the
current maha dasha.
"""
from datetime import date, datetime, timedelta

# Vimshottari order and the years allotted to each lord (total = 120).
DASHA_SEQUENCE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
DASHA_YEARS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7,
    "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17,
}
TOTAL_YEARS = 120

LORD_NAMES_TA = {
    "Ketu": "கேது", "Venus": "சுக்கிரன்", "Sun": "சூரியன்", "Moon": "சந்திரன்",
    "Mars": "செவ்வாய்", "Rahu": "ராகு", "Jupiter": "குரு", "Saturn": "சனி", "Mercury": "புதன்",
}

_DAYS_PER_YEAR = 365.2425
_NAKSHATRA_ARC = 360.0 / 27.0


def _add_years(d: date, years: float) -> date:
    return d + timedelta(days=years * _DAYS_PER_YEAR)


def _seq_from(lord: str) -> list[str]:
    i = DASHA_SEQUENCE.index(lord)
    return DASHA_SEQUENCE[i:] + DASHA_SEQUENCE[:i]


def _fmt(d: date) -> str:
    return d.isoformat()


def _years_months(delta_days: float) -> dict:
    total_years = max(delta_days, 0) / _DAYS_PER_YEAR
    years = int(total_years)
    months = int(round((total_years - years) * 12))
    if months == 12:
        years, months = years + 1, 0
    return {"years": years, "months": months}


def compute_dasha(moon_longitude: float, birth_date: str, on_date: date | None = None) -> dict:
    today = on_date or date.today()
    birth = datetime.strptime(birth_date, "%Y-%m-%d").date()

    # Which nakshatra (0-26) and how far through it the Moon had travelled.
    nak_index = int(moon_longitude // _NAKSHATRA_ARC) % 27
    frac_through = (moon_longitude % _NAKSHATRA_ARC) / _NAKSHATRA_ARC

    start_lord = DASHA_SEQUENCE[nak_index % 9]
    order = _seq_from(start_lord)

    # The first maha dasha is only partly left at birth.
    balance_years = DASHA_YEARS[start_lord] * (1 - frac_through)

    # ---- Build the maha-dasha timeline forward from birth ----
    maha_list = []
    cursor = birth
    for k, lord in enumerate(order + order):  # 18 entries ~ 240y, plenty
        span = balance_years if k == 0 else DASHA_YEARS[lord]
        end = _add_years(cursor, span)
        maha_list.append({
            "lord": lord,
            "lord_ta": LORD_NAMES_TA[lord],
            "start": _fmt(cursor),
            "end": _fmt(end),
            "years": round(span, 2),
        })
        cursor = end
        if cursor.year - birth.year > 120:
            break

    current_maha = next((m for m in maha_list if m["start"] <= today.isoformat() < m["end"]), maha_list[0])

    # ---- Bhukti (sub-period) timeline inside the current maha dasha ----
    maha_start = date.fromisoformat(current_maha["start"])
    maha_span_years = current_maha["years"]
    bhukti_list = []
    b_cursor = maha_start
    for lord in _seq_from(current_maha["lord"]):
        span = maha_span_years * DASHA_YEARS[lord] / TOTAL_YEARS
        end = _add_years(b_cursor, span)
        bhukti_list.append({
            "lord": lord,
            "lord_ta": LORD_NAMES_TA[lord],
            "start": _fmt(b_cursor),
            "end": _fmt(end),
        })
        b_cursor = end

    current_bhukti = next(
        (b for b in bhukti_list if b["start"] <= today.isoformat() < b["end"]),
        bhukti_list[0],
    )

    maha_end = date.fromisoformat(current_maha["end"])
    bhukti_end = date.fromisoformat(current_bhukti["end"])

    return {
        "as_of": today.isoformat(),
        "birth_nakshatra_index": nak_index,
        "current_maha_dasha": {
            **current_maha,
            "remaining": _years_months((maha_end - today).days),
        },
        "current_bhukti": {
            **current_bhukti,
            "remaining": _years_months((bhukti_end - today).days),
        },
        "maha_dasha_timeline": maha_list[:12],
        "bhukti_timeline": bhukti_list,
        "note": (
            "விம்சோத்தரி தசை சந்திரனின் பிறப்பு நட்சத்திர நிலையை அடிப்படையாகக் "
            "கொண்டது. அந்தர்தசை (புத்தி) வரையிலான விவரம் இங்கே; விரிவான சூட்சும "
            "தசைக்கு ஜோதிடரை அணுகவும்."
        ),
    }
