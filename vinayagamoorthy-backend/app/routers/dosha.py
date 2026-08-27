from fastapi import APIRouter, Depends
from app.core.deps import get_current_user
from app.services.chart_service import get_user_chart
from app.services.dosha import get_dosha_report

router = APIRouter(prefix="/dosha", tags=["dosha"])


@router.get("/me")
async def get_my_dosha_report(user: dict = Depends(get_current_user)):
    chart = await get_user_chart(user)
    return get_dosha_report(chart)
