from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.mongodb import ensure_indexes
from app.routers import auth, jathagam, panchangam, matching, lucky_notes, dosha, temples, chat
from app.services.temple_seed import seed_temples_if_needed

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


@app.on_event("startup")
async def on_startup():
    await ensure_indexes()
    await seed_temples_if_needed()


@app.get("/health")
async def health():
    return {"status": "ok", "app": settings.APP_NAME}
