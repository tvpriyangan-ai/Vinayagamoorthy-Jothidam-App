from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from bson.errors import InvalidId

from app.core.deps import get_current_user, require_admin
from app.models.temple import TempleIn
from app.db.mongodb import temples_collection
from app.services.chart_service import get_user_chart
from app.services.dosha import get_dosha_report

router = APIRouter(prefix="/temples", tags=["temples"])


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("")
async def list_temples(
    state: Optional[str] = None,
    planet: Optional[str] = None,
    dosha: Optional[str] = None,
    user: dict = Depends(get_current_user),
):
    query = {}
    if state:
        query["state"] = state
    if planet:
        query["associated_planet"] = planet
    if dosha:
        query["associated_doshas"] = dosha

    temples = await temples_collection().find(query).to_list(length=100)
    return [_serialize(t) for t in temples]


@router.get("/for-my-doshas")
async def temples_for_my_doshas(user: dict = Depends(get_current_user)):
    """
    Ties directly into the Dosha report: if the user has an active Kuja
    Dosham, Grahan Dosham, or Sade Sati, this surfaces the matching
    Navagraha temple(s) automatically.
    """
    chart = await get_user_chart(user)
    dosha_report = get_dosha_report(chart)
    active_dosha_names = [
        d["name"].split(" (")[0] for d in dosha_report["doshas"] if d["present"]
    ]
    active_tags = []
    for d in dosha_report["doshas"]:
        if d["present"]:
            if "Kuja" in d["name"]:
                active_tags.append("Kuja Dosham")
            elif "Grahan" in d["name"]:
                active_tags.append("Grahan Dosham")
            elif "Sade Sati" in d["name"]:
                active_tags.append("Sade Sati")

    if not active_tags:
        return {"active_doshas": [], "recommended_temples": []}

    temples = await temples_collection().find(
        {"associated_doshas": {"$in": active_tags}}
    ).to_list(length=50)

    return {
        "active_doshas": active_dosha_names,
        "recommended_temples": [_serialize(t) for t in temples],
    }


@router.get("/{temple_id}")
async def get_temple(temple_id: str, user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(temple_id)
    except InvalidId:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid temple id")

    temple = await temples_collection().find_one({"_id": oid})
    if not temple:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Temple not found")
    return _serialize(temple)


@router.post("", status_code=201)
async def create_temple(payload: TempleIn, admin: dict = Depends(require_admin)):
    result = await temples_collection().insert_one(payload.model_dump())
    created = await temples_collection().find_one({"_id": result.inserted_id})
    return _serialize(created)


@router.put("/{temple_id}")
async def update_temple(temple_id: str, payload: TempleIn, admin: dict = Depends(require_admin)):
    try:
        oid = ObjectId(temple_id)
    except InvalidId:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid temple id")

    result = await temples_collection().update_one({"_id": oid}, {"$set": payload.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Temple not found")

    updated = await temples_collection().find_one({"_id": oid})
    return _serialize(updated)


@router.delete("/{temple_id}", status_code=204)
async def delete_temple(temple_id: str, admin: dict = Depends(require_admin)):
    try:
        oid = ObjectId(temple_id)
    except InvalidId:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid temple id")

    result = await temples_collection().delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Temple not found")
