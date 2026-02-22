from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user_id
from app.core.database import get_db
from app.schemas.home import HomeProfileCreate, HomeProfileResponse
from app.schemas.task import TaskPlanResponse, Season, TaskStatusUpdate, TaskResponse
from app.services import home_service, task_service

router = APIRouter(prefix="/homes", tags=["homes"])


@router.get("/me", response_model=HomeProfileResponse)
async def get_my_home(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    home = home_service.get_home_by_user(db, user_id)
    if not home:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Home profile not found")
    return home


@router.post("", response_model=HomeProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_home(
    data: HomeProfileCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    existing = home_service.get_home_by_user(db, user_id)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Home profile already exists")
    return home_service.create_home(db, user_id, data)


@router.put("/{home_id}", response_model=HomeProfileResponse)
async def update_home(
    home_id: str,
    data: HomeProfileCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    home = home_service.get_home_by_user(db, user_id)
    if not home or home.id != home_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Home not found")
    return home_service.update_home(db, home_id, data)


@router.get("/{home_id}/tasks", response_model=TaskPlanResponse)
async def get_task_plan(
    home_id: str,
    season: Season | None = None,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    if season:
        tasks = task_service.get_tasks_by_season(db, home_id, season)
        return TaskPlanResponse(home_id=home_id, generated_at="", tasks=tasks)
    return task_service.get_task_plan(db, home_id)


@router.post("/{home_id}/tasks/generate", response_model=TaskPlanResponse)
async def generate_task_plan(
    home_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    home = home_service.get_home_by_user(db, user_id)
    if not home or home.id != home_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Home not found")
    return task_service.generate_and_save_task_plan(db, home)
