import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.home import Home
from app.schemas.home import HomeProfileCreate, HomeProfileResponse


def get_home_by_user(db: Session, user_id: str) -> HomeProfileResponse | None:
    home = db.query(Home).filter(Home.user_id == user_id).first()
    if not home:
        return None
    return HomeProfileResponse.model_validate(home)


def create_home(db: Session, user_id: str, data: HomeProfileCreate) -> HomeProfileResponse:
    now = datetime.now(timezone.utc).isoformat()
    home = Home(
        id=str(uuid.uuid4()),
        user_id=user_id,
        home_type=data.home_type,
        year_built=data.year_built,
        region=data.region,
        square_footage=data.square_footage,
        features=list(data.features),
        created_at=now,
        updated_at=now,
    )
    db.add(home)
    db.commit()
    db.refresh(home)
    return HomeProfileResponse.model_validate(home)


def update_home(db: Session, home_id: str, data: HomeProfileCreate) -> HomeProfileResponse:
    home = db.query(Home).filter(Home.id == home_id).first()
    if not home:
        raise ValueError(f"Home {home_id} not found")
    home.home_type = data.home_type
    home.year_built = data.year_built
    home.region = data.region
    home.square_footage = data.square_footage
    home.features = list(data.features)
    home.updated_at = datetime.now(timezone.utc).isoformat()
    db.commit()
    db.refresh(home)
    return HomeProfileResponse.model_validate(home)
