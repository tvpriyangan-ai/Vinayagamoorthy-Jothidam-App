from fastapi import APIRouter, Depends
from app.core.deps import get_current_user
from app.services.chart_service import get_user_chart
from app.services.transit import get_transit_predictions
from app.services.dasha import compute_dasha

router = APIRouter(prefix="/transit", tags=["transit"])


@router.get("/me")
async def get_my_transit_predictions(user: dict = Depends(get_current_user)):
    chart = await get_user_chart(user)
    natal_moon_rasi_index = chart["planets"]["Moon"]["rasi_index"]

    result = get_transit_predictions(natal_moon_rasi_index)
    # Also return the running Vimshottari maha dasha ("dhasa") and bhukti
    # ("puththi"), with years + months, per the client's spec.
    result["dasha"] = compute_dasha(
        moon_longitude=chart["planets"]["Moon"]["longitude"],
        birth_date=user["birth"]["date"],
    )
    return result
