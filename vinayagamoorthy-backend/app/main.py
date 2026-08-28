from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.mongodb import ensure_indexes
from app.services.gemini_client import is_configured as gemini_configured, check_health as gemini_check
from app.routers import auth, jathagam, panchangam, matching, lucky_notes, dosha, temples, chat, users, transit, content
from app.services.temple_seed import seed_temples_if_needed
from app.services.content_seed import seed_content_if_needed

app = FastAPI(title=settings.APP_NAME)

# Allow the web app and mobile app (via WebView/dev servers) to call this API.
# Tighten allow_origins to your real domains before going to production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(jathagam.router)
app.include_router(panchangam.router)
app.include_router(matching.router)
app.include_router(lucky_notes.router)
app.include_router(dosha.router)
app.include_router(temples.router)
app.include_router(chat.router)
app.include_router(users.router)
app.include_router(transit.router)
app.include_router(content.router)


@app.get("/")
async def root():
    return {"status": "ok", "app": settings.APP_NAME, "health": "/health"}


@app.on_event("startup")
async def on_startup():
    await ensure_indexes()
    await seed_temples_if_needed()
    await seed_content_if_needed()


@app.get("/health")
async def health(check: str | None = None):
    """
    Plain /health is cheap (used by Render's health check).
    /health?check=gemini makes one live test call to Gemini so you can see
    from the browser whether the chat / jathagam-reading AI is working.
    """
    body = {
        "status": "ok",
        "app": settings.APP_NAME,
        "gemini_configured": gemini_configured(),
        "gemini_model": settings.GEMINI_MODEL,
    }
    if check == "gemini":
        body["gemini"] = await gemini_check()
    return body
