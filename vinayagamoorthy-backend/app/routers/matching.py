from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import get_current_user
from app.core.languages import normalize_language
from app.core.i18n_terms import localise_chart, localise_matching
from app.models.matching import PartnerDetails
from app.services.astro import generate_full_chart
from app.services.chart_service import get_user_chart
from app.services.matching import calculate_porutham
from app.db.mongodb import matches_collection

router = APIRouter(prefix="/matching", tags=["matching"])


@router.post("/check")
async def check_matching(
    payload: PartnerDetails,
    lang: str | None = Query(None),
    user: dict = Depends(get_current_user),
):
    """
    Per your spec: user clicks Matching & Advices, a dialog asks for the
    partner's name/DOB/time/place, and gets back the compatibility report.
    We use the logged-in user's own saved chart as one side automatically.
    """
    if user["gender"] not in ("male", "female") or payload.gender not in ("male", "female"):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "gender must be 'male' or 'female'")
    if user["gender"] == payload.gender:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Matching requires one male and one female chart")

    user_chart = await get_user_chart(user)
    birth = payload.birth.model_dump()
    partner_chart = generate_full_chart(
        date=birth["date"], time=birth["time"], tz_offset=birth["timezone_offset"],
        latitude=birth["latitude"], longitude=birth["longitude"],
    )

    if user["gender"] == "female":
        girl_chart, boy_chart = user_chart, partner_chart
        girl_birth, boy_birth = user["birth"], birth
    else:
        girl_chart, boy_chart = partner_chart, user_chart
        girl_birth, boy_birth = birth, user["birth"]

    result = calculate_porutham(
        girl_nakshatra=girl_chart["planets"]["Moon"]["nakshatra_index"],
        girl_rasi=girl_chart["planets"]["Moon"]["rasi_index"],
        boy_nakshatra=boy_chart["planets"]["Moon"]["nakshatra_index"],
        boy_rasi=boy_chart["planets"]["Moon"]["rasi_index"],
        girl_lagna_rasi=girl_chart["ascendant"]["rasi_index"],
        boy_lagna_rasi=boy_chart["ascendant"]["rasi_index"],
        girl_sun_rasi=girl_chart["planets"]["Sun"]["rasi_index"],
        boy_sun_rasi=boy_chart["planets"]["Sun"]["rasi_index"],
    )

    # Include full chart + birth data for both people — the frontend uses
    # this to render the mini South Indian chart grids and the groom/bride
    # detail boxes in the downloadable result report.
    result["girl_full_chart"] = girl_chart
    result["boy_full_chart"] = boy_chart
    result["girl_name"] = user["name"] if user["gender"] == "female" else payload.name
    result["boy_name"] = payload.name if user["gender"] == "female" else user["name"]
    result["girl_birth"] = girl_birth
    result["boy_birth"] = boy_birth

    await matches_collection().insert_one({
        "user_id": user["_id"],
        "partner_name": payload.name,
        "partner_birth": birth,
        "result_summary": {"matched_count": result["matched_count"], "total_count": result["total_count"]},
        "checked_at": datetime.now(timezone.utc),
    })

    language = normalize_language(lang or user.get("preferred_language"))
    localise_chart(result["girl_full_chart"], language)
    localise_chart(result["boy_full_chart"], language)
    return localise_matching(result, language)
