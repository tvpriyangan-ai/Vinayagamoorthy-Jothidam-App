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
    GEMINI_MODEL: str = "gemini-2.5-flash-lite"  # free-tier eligible; check aistudio.google.com for current options

    class Config:
        env_file = ".env"


settings = Settings()
