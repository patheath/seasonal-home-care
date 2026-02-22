from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user_id
from app.core.database import get_db
from app.schemas.task import TaskResponse, TaskStatusUpdate
from app.services import task_service

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.put("/{task_id}", response_model=TaskResponse, response_model_by_alias=True)
async def update_task_status(
    task_id: str,
    update: TaskStatusUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    try:
        return task_service.update_task_status(db, task_id, update)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
