"""
Shared helper: every feature that needs "this user's chart" should go through
here, so caching behavior stays consistent in exactly one place.
"""
from app.services.astro import generate_full_chart
from app.db.mongodb import charts_collection


async def get_user_chart(user: dict) -> dict:
    cached = await charts_collection().find_one({"user_id": user["_id"]})
    if cached:
        cached.pop("_id", None)
        cached.pop("user_id", None)
        return cached

    birth = user["birth"]
    chart = generate_full_chart(
        date=birth["date"], time=birth["time"], tz_offset=birth["timezone_offset"],
        latitude=birth["latitude"], longitude=birth["longitude"],
    )
    await charts_collection().insert_one({"user_id": user["_id"], **chart})
    return chart
