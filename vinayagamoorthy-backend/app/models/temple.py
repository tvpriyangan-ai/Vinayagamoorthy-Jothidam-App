from pydantic import BaseModel
from typing import Optional


class Puja(BaseModel):
    name: str
    description: str
    recommended_day: Optional[str] = None


class TempleIn(BaseModel):
    name_ta: str
    name_en: str
    deity: str
    place: str
    state: str
    associated_planet: Optional[str] = None  # e.g. "Rahu", for Navagraha sthalams
    associated_doshas: list[str] = []        # e.g. ["Kuja Dosham"]
    description: str
    special_note: Optional[str] = None       # short highlighted "Special:" callout
    visiting_hours: Optional[str] = None     # e.g. "6:00 AM - 1:00 PM, 4:00 - 9:00 PM"
    pujas: list[Puja] = []
    image_url: Optional[str] = None


class TempleOut(TempleIn):
    id: str
