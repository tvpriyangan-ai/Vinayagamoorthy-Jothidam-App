from fastapi import Header, HTTPException, status
from bson import ObjectId
from bson.errors import InvalidId

from app.core.security import decode_access_token
from app.db.mongodb import users_collection


async def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")

    token = authorization.removeprefix("Bearer ").strip()
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")

    try:
        oid = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token subject")

    user = await users_collection().find_one({"_id": oid})
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")

    return user


async def require_admin(authorization: str = Header(...)):
    """Same JWT validation as get_current_user, with an added admin check."""
    resolved_user = await get_current_user(authorization)
    if not resolved_user.get("is_admin"):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin access required")
    return resolved_user
