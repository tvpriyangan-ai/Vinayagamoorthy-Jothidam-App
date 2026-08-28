from pydantic import BaseModel
from typing import Optional, Literal

ContentCategory = Literal["meditation", "yoga", "diet", "ayurveda", "vastu", "books"]


class ContentSection(BaseModel):
    heading: str
    body: str  # plain text; bullet points as separate lines starting with "• "


class ContentArticleIn(BaseModel):
    category: ContentCategory
    title_ta: str
    title_en: str
    summary_ta: str          # short teaser shown in list views
    intro_ta: str            # "என்றால் என்ன" style opening explanation
    table_title_ta: Optional[str] = None
    table_headers: Optional[list[str]] = None
    table_rows: Optional[list[list[str]]] = None   # each inner list matches table_headers length
    sections: list[ContentSection] = []            # additional named sections (benefits, steps, etc.)
    quote_ta: Optional[str] = None                 # a highlighted pull-quote
    safety_note_ta: Optional[str] = None           # shown in a warning-styled callout
    reference_links: list[str] = []                # filled in later when the user provides real links
    image_url: Optional[str] = None


class ContentArticleOut(ContentArticleIn):
    id: str
