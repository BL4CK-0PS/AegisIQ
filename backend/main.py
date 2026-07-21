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
from backend.routes.voice_routes import router as voice_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    stream=sys.stdout,
)
logger = logging.getLogger("aegisiq")

settings = get_settings()
monitoring = MonitoringMiddleware(app=None)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events."""
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
monitoring = MonitoringMiddleware(app)
app.add_middleware(MonitoringMiddleware)

# --- Routes ---
app.include_router(ai_router, prefix="/ai")
app.include_router(voice_router, prefix="/voice")


# --- Health & Status Endpoints ---

@app.get("/health")
async def health_check():
    """Health check endpoint for Docker and load balancers."""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
    }


@app.get("/")
async def root():
    """Root endpoint with basic service info."""
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": "/api/docs" if settings.debug else "disabled",
    }


@app.get("/metrics")
async def metrics():
    """Basic metrics endpoint."""
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        **monitoring.metrics,
    }
