from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from typing import Literal

HomeType = Literal["single_family", "condo", "townhouse"]

HomeFeature = Literal[
    "pool", "hot_tub", "fireplace", "deck", "basement",
    "crawl_space", "septic", "well_water", "irrigation", "solar_panels"
]


class HomeProfileCreate(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )
    home_type: HomeType
    year_built: int
    region: str
    square_footage: int | None = None
    features: list[HomeFeature] = []


class HomeProfileUpdate(HomeProfileCreate):
    pass


class HomeProfileResponse(HomeProfileCreate):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
    id: str
    user_id: str
    created_at: str
    updated_at: str
