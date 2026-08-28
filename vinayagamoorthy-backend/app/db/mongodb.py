from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global client
    if client is None:
        client = AsyncIOMotorClient(settings.MONGODB_URI)
    return client


def get_db():
    return get_client()[settings.DB_NAME]


# Convenience collection accessors
def users_collection():
    return get_db()["users"]


def charts_collection():
    return get_db()["charts"]


def otp_collection():
    return get_db()["otps"]


def matches_collection():
    return get_db()["matches"]


def chat_history_collection():
    return get_db()["chat_history"]


def panchangam_collection():
    return get_db()["panchangam_cache"]


def temples_collection():
    return get_db()["temples"]


def content_collection():
    return get_db()["content_articles"]


def jathagam_readings_collection():
    return get_db()["jathagam_readings"]


async def ensure_indexes():
    """Call once on startup to create needed indexes."""
    await users_collection().create_index("username", unique=True)
    await users_collection().create_index("email", unique=True, sparse=True)
    await users_collection().create_index("mobile", unique=True, sparse=True)
    await otp_collection().create_index("expires_at", expireAfterSeconds=0)
    await panchangam_collection().create_index(
        [("date", 1), ("lat_r", 1), ("lon_r", 1)], unique=True
    )
    await temples_collection().create_index("name_en", unique=True)
    await content_collection().create_index([("category", 1)])
    await jathagam_readings_collection().create_index(
        [("user_id", 1), ("language", 1)], unique=True
    )
