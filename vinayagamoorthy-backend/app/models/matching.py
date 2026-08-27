from pydantic import BaseModel
from app.models.user import BirthDetails


class PartnerDetails(BaseModel):
    name: str
    gender: str  # "male" or "female"
    birth: BirthDetails
