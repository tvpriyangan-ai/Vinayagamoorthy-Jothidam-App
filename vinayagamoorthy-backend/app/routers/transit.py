from fastapi import APIRouter, Depends
from app.core.deps import get_current_user
from app.services.chart_service import get_user_chart
from app.services.transit import get_transit_predictions

router = APIRouter(prefix="/transit", tags=["transit"])


@router.get("/me")
async def get_my_transit_predictions(user: dict = Depends(get_current_user)):
    chart = await get_user_chart(user)
    natal_moon_rasi_index = chart["planets"]["Moon"]["rasi_index"]
    return get_transit_predictions(natal_moon_rasi_index)
