from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskResponse, TaskPlanResponse, TaskStatus, Season, TaskStatusUpdate
from app.schemas.home import HomeProfileResponse
from app.services import ai_service
from datetime import datetime, timezone


def get_task_plan(db: Session, home_id: str) -> TaskPlanResponse:
    tasks = db.query(Task).filter(Task.home_id == home_id).all()
    task_responses = [TaskResponse.model_validate(t) for t in tasks]
    generated_at = task_responses[0].created_at if task_responses else datetime.now(timezone.utc).isoformat()
    return TaskPlanResponse(home_id=home_id, generated_at=generated_at, tasks=task_responses)


def generate_and_save_task_plan(db: Session, home: HomeProfileResponse) -> TaskPlanResponse:
    # Delete existing AI-generated tasks before regenerating
    db.query(Task).filter(Task.home_id == home.id, Task.is_custom == False).delete()  # noqa: E712
    db.commit()

    plan = ai_service.generate_task_plan(home)

    for task in plan.tasks:
        db.add(Task(
            id=task.id,
            home_id=task.home_id,
            season=task.season,
            category=task.category,
            priority=task.priority,
            status=task.status,
            title=task.title,
            description=task.description,
            estimated_effort=task.estimated_effort,
            is_custom=False,
            created_at=task.created_at,
        ))
    db.commit()
    return plan


def update_task_status(db: Session, task_id: str, update: TaskStatusUpdate) -> TaskResponse:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise ValueError(f"Task {task_id} not found")
    task.status = update.status
    if update.status == "complete":
        task.completed_at = datetime.now(timezone.utc).isoformat()
    db.commit()
    db.refresh(task)
    return TaskResponse.model_validate(task)


def get_tasks_by_season(db: Session, home_id: str, season: Season) -> list[TaskResponse]:
    tasks = db.query(Task).filter(Task.home_id == home_id, Task.season == season).all()
    return [TaskResponse.model_validate(t) for t in tasks]
