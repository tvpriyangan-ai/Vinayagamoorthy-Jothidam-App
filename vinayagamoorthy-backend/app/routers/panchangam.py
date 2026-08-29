from datetime import date, datetime, timezone
from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.core.deps import get_current_user
from app.core.languages import normalize_language
from app.core.i18n_terms import localise_panchangam
from app.services.panchangam import calculate_panchangam
from app.db.mongodb import panchangam_collection

router = APIRouter(prefix="/panchangam", tags=["panchangam"])


@router.get("/today")
async def get_today_panchangam(
    lat: Optional[float] = Query(None, description="Defaults to user's saved birth-place latitude"),
    lon: Optional[float] = Query(None, description="Defaults to user's saved birth-place longitude"),
    tz_offset: Optional[float] = Query(None, description="Defaults to user's saved timezone offset"),
    lang: Optional[str] = Query(None),
    user: dict = Depends(get_current_user),
):
    """
    Panchangam is location-specific (sunrise/sunset shift by place), so we
    default to the user's saved birth place but allow overriding — useful if
    they've since moved, or want the panchangam for a place they're visiting.
    """
    birth = user["birth"]
    latitude = lat if lat is not None else birth["latitude"]
    longitude = lon if lon is not None else birth["longitude"]
    offset = tz_offset if tz_offset is not None else birth["timezone_offset"]

    today = date.today()
    # Round location to ~1km precision for cache key purposes — panchangam
    # timing doesn't meaningfully change at finer resolution than that.
    lat_r, lon_r = round(latitude, 2), round(longitude, 2)

    language = normalize_language(lang or user.get("preferred_language"))

    cached = await panchangam_collection().find_one(
        {"date": today.isoformat(), "lat_r": lat_r, "lon_r": lon_r}
    )
    if cached:
        cached.pop("_id")
        cached.pop("lat_r", None)
        cached.pop("lon_r", None)
        cached.pop("computed_at", None)
        return localise_panchangam(cached, language)

    result = calculate_panchangam(today, latitude, longitude, offset)
    await panchangam_collection().insert_one({
        **result,
        "lat_r": lat_r,
        "lon_r": lon_r,
        "computed_at": datetime.now(timezone.utc),
    })
    result.pop("date", None)
    result["date"] = today.isoformat()
    return localise_panchangam(result, language)
