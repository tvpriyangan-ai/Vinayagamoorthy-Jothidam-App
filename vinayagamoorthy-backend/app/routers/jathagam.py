from fastapi import APIRouter, Depends
from app.core.deps import get_current_user
from app.services.chart_service import get_user_chart

router = APIRouter(prefix="/jathagam", tags=["jathagam"])


@router.get("/me")
async def get_my_jathagam(user: dict = Depends(get_current_user)):
    """
    Per your spec: no need to type anything again — this reads the
    birth details already saved on the profile and auto-calculates.
    """
    return await get_user_chart(user)
