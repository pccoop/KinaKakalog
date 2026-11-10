from fastapi import APIRouter

from app.api.routes import activity_logs, admin, auth, health, movies

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(admin.router)
api_router.include_router(movies.router)
api_router.include_router(activity_logs.router)
