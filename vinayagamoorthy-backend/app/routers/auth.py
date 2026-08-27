import random
import string
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, status
from bson import ObjectId

from app.models.user import SignupRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from app.db.mongodb import users_collection, otp_collection

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", status_code=201)
async def signup(payload: SignupRequest):
    existing = await users_collection().find_one({"username": payload.username})
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Username already taken")

    doc = payload.model_dump()
    doc["password_hash"] = hash_password(doc.pop("password"))
    doc["is_admin"] = False  # promote manually in the DB; never settable via signup
    doc["created_at"] = datetime.now(timezone.utc)

    result = await users_collection().insert_one(doc)
    token = create_access_token(str(result.inserted_id))
    return {"access_token": token, "token_type": "bearer", "user_id": str(result.inserted_id)}


@router.post("/login")
async def login(payload: LoginRequest):
    user = await users_collection().find_one({"username": payload.username})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid username or password")

    token = create_access_token(str(user["_id"]))
    return {"access_token": token, "token_type": "bearer", "user_id": str(user["_id"])}


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    user = await users_collection().find_one(
        {"$or": [{"email": payload.identifier}, {"mobile": payload.identifier}]}
    )
    if not user:
        # Don't reveal whether the identifier exists
        return {"message": "If that account exists, an OTP has been sent."}

    otp = "".join(random.choices(string.digits, k=6))
    await otp_collection().insert_one({
        "user_id": user["_id"],
        "identifier": payload.identifier,
        "otp": otp,
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
    })

    # TODO: wire up real email/SMS provider (e.g. SendGrid, Twilio) here.
    # For now, this is where that dispatch call would go.
    return {"message": "If that account exists, an OTP has been sent."}


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    otp_doc = await otp_collection().find_one(
        {"identifier": payload.identifier, "otp": payload.otp},
        sort=[("_id", -1)],
    )
    if not otp_doc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired OTP")

    new_hash = hash_password(payload.new_password)
    await users_collection().update_one(
        {"_id": otp_doc["user_id"]}, {"$set": {"password_hash": new_hash}}
    )
    await otp_collection().delete_one({"_id": otp_doc["_id"]})
    return {"message": "Password reset successful"}
