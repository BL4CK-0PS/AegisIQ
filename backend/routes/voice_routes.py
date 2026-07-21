"""
AegisIQ Voice Routes

Handles voice-to-text transcription via Web Speech API proxy.
"""

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, UploadFile, File, status
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
router = APIRouter()


class TranscriptionRequest(BaseModel):
    """Request for server-side transcription (when Web Speech API is unavailable)."""
    audio_base64: str = Field(..., description="Base64-encoded audio data")
    language: str = Field(default="en-US", description="Language code for transcription")


class TranscriptionResponse(BaseModel):
    """Response containing transcribed text."""
    text: str
    language: str
    confidence: float
    provider: str


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    audio: Optional[UploadFile] = File(None),
    language: str = "en-US",
):
    """
    Transcribe audio to text.

    In production, this proxies to a speech-to-text service (Google, Whisper, etc.).
    In demo mode, returns a placeholder response.
    """
    # Demo mode: return placeholder
    logger.info("Voice transcription requested (language=%s)", language)

    return TranscriptionResponse(
        text="[Voice transcription requires a speech-to-text API key. "
             "Configure STT_PROVIDER in .env to enable server-side transcription. "
             "The frontend Web Speech API works without this endpoint.]",
        language=language,
        confidence=0.0,
        provider="placeholder",
    )


@router.get("/transcribe/health")
async def voice_health():
    """Check if voice transcription service is available."""
    return {
        "status": "available",
        "provider": "placeholder",
        "note": "Configure STT_PROVIDER in .env for production use",
    }
