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
    pujas: list[Puja] = []
    image_url: Optional[str] = None


class TempleOut(TempleIn):
    id: str
