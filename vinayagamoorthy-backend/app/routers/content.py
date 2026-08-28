from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from bson.errors import InvalidId

from app.core.deps import get_current_user, require_admin
from app.models.content import ContentArticleIn
from app.db.mongodb import content_collection

router = APIRouter(prefix="/content", tags=["content"])


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("")
async def list_content(category: Optional[str] = None, user: dict = Depends(get_current_user)):
    query = {"category": category} if category else {}
    articles = await content_collection().find(query).to_list(length=100)
    return [_serialize(a) for a in articles]


@router.get("/{article_id}")
async def get_content(article_id: str, user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(article_id)
    except InvalidId:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid article id")

    article = await content_collection().find_one({"_id": oid})
    if not article:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Article not found")
    return _serialize(article)


@router.post("", status_code=201)
async def create_content(payload: ContentArticleIn, admin: dict = Depends(require_admin)):
    result = await content_collection().insert_one(payload.model_dump())
    created = await content_collection().find_one({"_id": result.inserted_id})
    return _serialize(created)


@router.put("/{article_id}")
async def update_content(article_id: str, payload: ContentArticleIn, admin: dict = Depends(require_admin)):
    try:
        oid = ObjectId(article_id)
    except InvalidId:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid article id")

    result = await content_collection().update_one({"_id": oid}, {"$set": payload.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Article not found")

    updated = await content_collection().find_one({"_id": oid})
    return _serialize(updated)


@router.delete("/{article_id}", status_code=204)
async def delete_content(article_id: str, admin: dict = Depends(require_admin)):
    try:
        oid = ObjectId(article_id)
    except InvalidId:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid article id")

    result = await content_collection().delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Article not found")
