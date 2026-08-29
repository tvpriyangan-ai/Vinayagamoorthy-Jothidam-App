from fastapi import APIRouter, Depends, Query
from app.core.deps import get_current_user
from app.core.languages import normalize_language
from app.core.i18n_terms import localise_dosha
from app.services.chart_service import get_user_chart
from app.services.dosha import get_dosha_report

router = APIRouter(prefix="/dosha", tags=["dosha"])


@router.get("/me")
async def get_my_dosha_report(
    lang: str | None = Query(None),
    user: dict = Depends(get_current_user),
):
    chart = await get_user_chart(user)
    report = get_dosha_report(chart)
    return localise_dosha(report, normalize_language(lang or user.get("preferred_language")))
