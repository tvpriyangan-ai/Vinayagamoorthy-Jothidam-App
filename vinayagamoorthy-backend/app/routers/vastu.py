from fastapi import APIRouter, Depends, Query
from app.core.deps import get_current_user
from app.services.chart_service import get_user_chart
from app.services.vastu_report import get_vastu_report

router = APIRouter(prefix="/vastu", tags=["vastu"])


@router.get("/me")
async def get_my_vastu_report(
    language: str | None = Query(None, description="ta | ml | en | hi | pa; defaults to the profile language"),
    refresh: bool = Query(False, description="bypass the cache and regenerate"),
    user: dict = Depends(get_current_user),
):
    """Personal Vastu report grounded in the user's own rasi / nakshatra / number."""
    chart = await get_user_chart(user)
    return await get_vastu_report(user, chart, language, refresh=refresh)
