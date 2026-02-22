from pydantic import BaseModel
from typing import Literal

Season = Literal["spring", "summer", "fall", "winter"]
TaskCategory = Literal["exterior", "interior", "hvac", "plumbing", "safety", "landscaping", "other"]
TaskPriority = Literal["high", "medium", "low"]
TaskStatus = Literal["pending", "complete", "snoozed"]


class TaskResponse(BaseModel):
    id: str
    home_id: str
    season: Season
    category: TaskCategory
    priority: TaskPriority
    status: TaskStatus
    title: str
    description: str
    estimated_effort: str | None = None
    is_custom: bool
    created_at: str
    completed_at: str | None = None

    model_config = {"from_attributes": True}


class TaskStatusUpdate(BaseModel):
    status: TaskStatus


class TaskPlanResponse(BaseModel):
    home_id: str
    generated_at: str
    tasks: list[TaskResponse]
