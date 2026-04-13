from fastapi import APIRouter
from .router import router as config_router

# 创建API路由路由器
router = APIRouter(
    prefix="/api/v1",
    tags=["api_v1"],
    responses={404: {"description": "Not found"}},
)

# 包含所有子路由
router.include_router(config_router)
