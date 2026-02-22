import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

import anthropic

from app.core.config import settings
from app.schemas.home import HomeProfileResponse
from app.schemas.task import TaskResponse, TaskPlanResponse

_client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def _load_prompt(name: str) -> str:
    return (_PROMPTS_DIR / f"{name}.txt").read_text()


def generate_task_plan(home: HomeProfileResponse) -> TaskPlanResponse:
    system_prompt = _load_prompt("task_generation")

    home_description = (
        f"Home type: {home.home_type}\n"
        f"Year built: {home.year_built}\n"
        f"Region: {home.region}\n"
        f"Square footage: {home.square_footage or 'unknown'}\n"
        f"Special features: {', '.join(home.features) if home.features else 'none'}"
    )

    message = _client.messages.create(
        model=settings.claude_model,
        max_tokens=4096,
        system=system_prompt,
        messages=[
            {"role": "user", "content": f"Generate a seasonal task plan for this home:\n\n{home_description}"}
        ],
    )

    # Log token usage
    print(
        f"[ai_service] tokens used — input: {message.usage.input_tokens}, "
        f"output: {message.usage.output_tokens}"
    )

    raw = message.content[0].text
    data = json.loads(raw)

    now = datetime.now(timezone.utc).isoformat()
    tasks = [
        TaskResponse(
            id=str(uuid.uuid4()),
            home_id=home.id,
            status="pending",
            is_custom=False,
            created_at=now,
            completed_at=None,
            **task,
        )
        for task in data["tasks"]
    ]

    return TaskPlanResponse(home_id=home.id, generated_at=now, tasks=tasks)
