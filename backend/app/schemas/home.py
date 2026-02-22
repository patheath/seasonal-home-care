from pydantic import BaseModel
from typing import Literal

HomeType = Literal["single_family", "condo", "townhouse"]

HomeFeature = Literal[
    "pool", "hot_tub", "fireplace", "deck", "basement",
    "crawl_space", "septic", "well_water", "irrigation", "solar_panels"
]


class HomeProfileCreate(BaseModel):
    home_type: HomeType
    year_built: int
    region: str
    square_footage: int | None = None
    features: list[HomeFeature] = []


class HomeProfileUpdate(HomeProfileCreate):
    pass


class HomeProfileResponse(HomeProfileCreate):
    id: str
    user_id: str
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
