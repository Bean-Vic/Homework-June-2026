from typing import Optional
from pydantic import BaseModel, Field


class GarmentAttributes(BaseModel):
    garment_type: Optional[str] = None
    style: Optional[str] = None
    material: Optional[str] = None
    color_palette: list[str] = Field(default_factory=list)
    pattern: Optional[str] = None
    season: Optional[str] = None
    occasion: Optional[str] = None
    consumer_profile: Optional[str] = None
    trend_notes: Optional[str] = None
    location_context: Optional[str] = None


class ClassificationResult(BaseModel):
    description: str = ""
    attributes: GarmentAttributes = Field(default_factory=GarmentAttributes)


class UploadContext(BaseModel):
    continent: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    year: Optional[int] = None
    month: Optional[int] = None
    season: Optional[str] = None
    designer: Optional[str] = None
