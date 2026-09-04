from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from app.core.deps import get_current_user
from app.models.user import UpdateProfileRequest
from app.db.mongodb import (
    users_collection,
    charts_collection,
    matches_collection,
    chat_history_collection,
    jathagam_readings_collection,
    vastu_reports_collection,
    otp_collection,
)
from app.services.photo_upload import upload_palm_photo, delete_palm_photo, is_configured

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
async def get_my_profile(user: dict = Depends(get_current_user)):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "username": user["username"],
        "gender": user["gender"],
        "email": user.get("email"),
        "mobile": user.get("mobile"),
        "preferred_language": user.get("preferred_language", "ta"),
        "birth": user["birth"],
        "palm_photo_url": user.get("palm_photo_url"),
    }


@router.put("/me")
async def update_my_profile(payload: UpdateProfileRequest, user: dict = Depends(get_current_user)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if updates:
        await users_collection().update_one({"_id": user["_id"]}, {"$set": updates})

    updated = await users_collection().find_one({"_id": user["_id"]})
    return {
        "id": str(updated["_id"]),
        "name": updated["name"],
        "username": updated["username"],
        "gender": updated["gender"],
        "email": updated.get("email"),
        "mobile": updated.get("mobile"),
        "preferred_language": updated.get("preferred_language", "ta"),
        "birth": updated["birth"],
        "palm_photo_url": updated.get("palm_photo_url"),
    }


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5MB


@router.post("/me/palm-photo")
async def upload_my_palm_photo(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    if not is_configured():
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "Photo upload isn't configured yet. Set CLOUDINARY_CLOUD_NAME, "
            "CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET (free account at cloudinary.com).",
        )
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Only JPEG, PNG, or WEBP images are allowed")

    contents = await file.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Image must be under 5MB")

    try:
        url = upload_palm_photo(contents, str(user["_id"]))
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, f"Upload failed: {e}")

    await users_collection().update_one({"_id": user["_id"]}, {"$set": {"palm_photo_url": url}})
    return {"palm_photo_url": url}


@router.delete("/me")
async def delete_my_account(user: dict = Depends(get_current_user)):
    """
    Permanently deletes the currently logged-in user's account and every
    piece of data tied to it. The user is identified only from their own
    JWT (get_current_user) -- there is no way to pass another user's id,
    so this can never delete anyone else's account.
    """
    user_id = user["_id"]

    if user.get("palm_photo_url"):
        try:
            delete_palm_photo(str(user_id))
        except Exception:
            pass  # never block account deletion on a third-party API hiccup

    await charts_collection().delete_many({"user_id": user_id})
    await matches_collection().delete_many({"user_id": user_id})
    await chat_history_collection().delete_many({"user_id": user_id})
    await jathagam_readings_collection().delete_many({"user_id": user_id})
    await vastu_reports_collection().delete_many({"user_id": user_id})
    await otp_collection().delete_many({"user_id": user_id})
    await users_collection().delete_one({"_id": user_id})

    return {"message": "Your account has been successfully deleted."}
