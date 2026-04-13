from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.api.v1 import router as api_v1_router
from app.db.session import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 NVIDIA Configurator Backend starting...")
    print("📊 Initializing database...")
    init_db()
    print("✅ Database initialized successfully")
    yield
    print("🛑 NVIDIA Configurator Backend shutting down...")


app = FastAPI(
    title="NVIDIA 智算设备配置系统",
    description="NVIDIA Intelligent Computing Configurator API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "service": "NVIDIA Intelligent Computing Configurator",
        "version": "1.0.0",
        "status": "ok"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "NVIDIA Configurator API"
    }


# 包含API v1路由
app.include_router(api_v1_router)

# 保留v1健康检查端点以确保兼容性
@app.get("/api/v1/health")
async def api_health_check():
    return {
        "status": "ok",
        "api_version": "v1"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )
