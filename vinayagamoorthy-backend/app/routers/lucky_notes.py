from fastapi import APIRouter, Depends
from app.core.deps import get_current_user
from app.services.chart_service import get_user_chart
from app.services.lucky_notes import get_lucky_notes

router = APIRouter(prefix="/lucky-notes", tags=["lucky-notes"])


@router.get("/me")
async def get_my_lucky_notes(user: dict = Depends(get_current_user)):
    chart = await get_user_chart(user)
    moon_rasi_index = chart["planets"]["Moon"]["rasi_index"]
    return get_lucky_notes(moon_rasi_index)
