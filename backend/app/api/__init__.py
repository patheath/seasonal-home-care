from fastapi import APIRouter
from app.api.homes import router as homes_router
from app.api.tasks import router as tasks_router

router = APIRouter()
router.include_router(homes_router)
router.include_router(tasks_router)
