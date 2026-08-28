from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # --- App ---
    APP_NAME: str = "Vinayagamoorthy Jothidam API"
    ENV: str = "development"

    # --- Database ---
    MONGODB_URI: str = "mongodb://localhost:27017"
    DB_NAME: str = "vinayagamoorthy"

    # --- Auth ---
    JWT_SECRET: str = "change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # --- OTP / notifications (wire up real providers later) ---
    OTP_EXPIRE_MINUTES: int = 10

    # --- Email delivery (SMTP — works with a free Gmail App Password) ---
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_ADDRESS: str = ""

    # --- Palm photo upload (Cloudinary free tier) ---
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # --- Astrology defaults ---
    DEFAULT_AYANAMSA: str = "LAHIRI"  # standard for Tamil/Vedic charts

    # --- Chat with Vinayagamoorthy (Gemini API) ---
    GEMINI_API_KEY: str = ""
    # gemini-2.5-flash-lite was retired for new keys (Aug 2026). If this 404s again,
    # set GEMINI_MODEL in the environment — "gemini-flash-lite-latest" always points
    # at the current lite model. Check aistudio.google.com for options.
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"

    class Config:
        env_file = ".env"


settings = Settings()
