"""
Palm photo upload via Cloudinary -- free tier (25 credits/month, generous
for a small app) and no server-side file storage needed, which matters
since Render's filesystem is ephemeral (files don't survive a redeploy).
"""
import cloudinary
import cloudinary.uploader
from app.core.config import settings

_configured = False


def _ensure_configured():
    global _configured
    if not _configured:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
        )
        _configured = True


def is_configured() -> bool:
    return bool(
        settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET
    )


def upload_palm_photo(file_bytes: bytes, user_id: str) -> str:
    """Returns the uploaded image's secure URL. Raises on failure -- the
    router is responsible for turning that into a clean HTTP error."""
    _ensure_configured()
    result = cloudinary.uploader.upload(
        file_bytes,
        folder="vinayagamoorthy/palm_photos",
        public_id=user_id,
        overwrite=True,
        resource_type="image",
    )
    return result["secure_url"]
