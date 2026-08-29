from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.deps import get_current_user
from app.services.chart_service import get_user_chart
from app.services.chat import get_chat_reply
from app.db.mongodb import chat_history_collection

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessageRequest(BaseModel):
    message: str
    language: str | None = None  # ta|ml|en|hi|pa — the UI's current language


@router.post("/message")
async def send_chat_message(payload: ChatMessageRequest, user: dict = Depends(get_current_user)):
    chart = await get_user_chart(user)

    history_cursor = chat_history_collection().find({"user_id": user["_id"]}).sort("created_at", 1)
    history_docs = await history_cursor.to_list(length=50)
    history = [{"role": h["role"], "content": h["content"]} for h in history_docs]

    try:
        reply_text = await get_chat_reply(user, chart, history, payload.message, payload.language)
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, f"Chat service unavailable: {e}")

    now = datetime.now(timezone.utc)
    await chat_history_collection().insert_many([
        {"user_id": user["_id"], "role": "user", "content": payload.message, "created_at": now},
        {"user_id": user["_id"], "role": "assistant", "content": reply_text, "created_at": now},
    ])

    return {"reply": reply_text}


@router.get("/history")
async def get_chat_history(limit: int = 50, user: dict = Depends(get_current_user)):
    cursor = chat_history_collection().find({"user_id": user["_id"]}).sort("created_at", 1)
    docs = await cursor.to_list(length=limit)
    return [
        {"role": d["role"], "content": d["content"], "created_at": d["created_at"].isoformat()}
        for d in docs
    ]
