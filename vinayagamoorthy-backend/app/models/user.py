from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class BirthDetails(BaseModel):
    date: str  # "YYYY-MM-DD"
    time: str  # "HH:MM" 24hr
    place: str  # display name, e.g. "Chennai, India"
    latitude: float
    longitude: float
    timezone_offset: float  # e.g. 5.5 for IST


class SignupRequest(BaseModel):
    name: str
    username: str
    password: str
    gender: str  # "male" or "female" — needed for direction-sensitive porutham checks
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    preferred_language: str = "ta"  # Tamil default, per your mockup
    birth: BirthDetails
    palm_photo_url: Optional[str] = None  # set after separate upload step


class LoginRequest(BaseModel):
    username: str
    password: str


class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or mobile


class ResetPasswordRequest(BaseModel):
    identifier: str
    otp: str
    new_password: str


class UserOut(BaseModel):
    id: str
    name: str
    username: str
    gender: str
    email: Optional[str] = None
    mobile: Optional[str] = None
    preferred_language: str
    birth: BirthDetails
    palm_photo_url: Optional[str] = None
    created_at: datetime


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    preferred_language: Optional[str] = None
    # Birth details intentionally excluded here — changing them would
    # invalidate the cached chart everywhere. Handle as a separate,
    # more deliberate flow later if you want to support it (e.g. requiring
    # re-confirmation, since it affects every other feature in the app).
