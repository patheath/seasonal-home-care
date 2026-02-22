from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from typing import Literal

Season = Literal["spring", "summer", "fall", "winter"]
TaskCategory = Literal["exterior", "interior", "hvac", "plumbing", "safety", "landscaping", "other"]
TaskPriority = Literal["high", "medium", "low"]
TaskStatus = Literal["pending", "complete", "snoozed"]

_camel_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class TaskResponse(BaseModel):
    model_config = _camel_config
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


class TaskStatusUpdate(BaseModel):
    status: TaskStatus


class TaskPlanResponse(BaseModel):
    model_config = _camel_config
    home_id: str
    generated_at: str
    tasks: list[TaskResponse]
