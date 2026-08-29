from fastapi import APIRouter, Depends, Query
from app.core.deps import get_current_user
from app.core.languages import normalize_language
from app.core.i18n_terms import localise_lucky
from app.services.chart_service import get_user_chart
from app.services.lucky_notes import get_lucky_notes

router = APIRouter(prefix="/lucky-notes", tags=["lucky-notes"])


@router.get("/me")
async def get_my_lucky_notes(
    lang: str | None = Query(None),
    user: dict = Depends(get_current_user),
):
    chart = await get_user_chart(user)
    moon_rasi_index = chart["planets"]["Moon"]["rasi_index"]
    notes = get_lucky_notes(moon_rasi_index)
    return localise_lucky(notes, normalize_language(lang or user.get("preferred_language")))
