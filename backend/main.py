"""
AegisIQ Backend Application Entry Point

Main FastAPI application with all routes, middleware, and lifecycle management.
"""

import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import get_settings
from backend.middleware import MonitoringMiddleware
from backend.routes.ai_routes import router as ai_router
from backend.routes.evaluation_routes import router as evaluation_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    stream=sys.stdout,
)
logger = logging.getLogger("aegisiq")

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s v%s", settings.app_name, settings.app_version)
    logger.info("AI Provider: %s", settings.llm_provider)
    logger.info("Demo Mode: %s", settings.demo_mode)
    yield
    logger.info("Shutting down %s", settings.app_name)


app = FastAPI(
    title="PWNDORA SkillScan X",
    description="Adaptive Cybersecurity Capability Intelligence Platform",
    version=settings.app_version,
    lifespan=lifespan,
    docs_url="/api/docs" if settings.debug else None,
    redoc_url="/api/redoc" if settings.debug else None,
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Monitoring ---
app.add_middleware(MonitoringMiddleware)

# --- API v1 Routes ---
API_V1_PREFIX = "/api/v1"

app.include_router(ai_router, prefix=f"{API_V1_PREFIX}/ai", tags=["AI Engine"])
app.include_router(evaluation_router, prefix=f"{API_V1_PREFIX}", tags=["Evaluation"])


# --- Health & Status ---

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
    }


@app.get("/", tags=["System"])
async def root():
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": "/api/docs" if settings.debug else "disabled",
    }


@app.get("/metrics", tags=["System"])
async def metrics():
    from backend.middleware import MonitoringMiddleware
    mw = None
    for m in app.middleware_stack.__class__.__mro__:
        pass
    return {
        "service": settings.app_name,
        "version": settings.app_version,
    }
