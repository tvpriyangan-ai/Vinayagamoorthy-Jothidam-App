from fastapi import APIRouter, Depends, Query
from app.core.deps import get_current_user
from app.core.languages import normalize_language
from app.core.i18n_terms import localise_chart
from app.services.chart_service import get_user_chart
from app.services.jathagam_reading import get_jathagam_reading

router = APIRouter(prefix="/jathagam", tags=["jathagam"])


@router.get("/me")
async def get_my_jathagam(
    lang: str | None = Query(None),
    user: dict = Depends(get_current_user),
):
    """
    Per your spec: no need to type anything again — this reads the
    birth details already saved on the profile and auto-calculates.
    """
    chart = await get_user_chart(user)
    return localise_chart(chart, normalize_language(lang or user.get("preferred_language")))


@router.get("/me/reading")
async def get_my_jathagam_reading(
    language: str | None = Query(None, description="ta | ml | en | hi | pa; defaults to the profile language"),
    refresh: bool = Query(False, description="bypass the cache and regenerate"),
    user: dict = Depends(get_current_user),
):
    """
    Jothidar-style prediction paragraphs per life area, in the chosen
    language, generated from the same auto-calculated chart. Cached per
    (user, language). If the AI service is unavailable, `available` is
    false and the page just shows the chart.
    """
    chart = await get_user_chart(user)
    return await get_jathagam_reading(user, chart, language, refresh=refresh)
