"""
AegisIQ AI Routes — Production-Ready

Routes now use the new src/core/ai/ provider layer with full retry,
timeout, and fallback support via the provider factory.
"""

import logging
from typing import Dict, Any

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from backend.services.provider_factory import create_ai_client

logger = logging.getLogger(__name__)
router = APIRouter()

# Lazily initialized AI client (created on first request)
_ai_client = None
_prompt_loader = None


def _get_ai():
    """Get or create the AI client and prompt loader (lazy init)."""
    global _ai_client, _prompt_loader
    if _ai_client is None:
        _ai_client, _prompt_loader = create_ai_client()
    return _ai_client, _prompt_loader


# --- Request/Response Schemas ---


class QuestionRequest(BaseModel):
    topic: str = Field(
        ...,
        example="web_security",
        description="The cybersecurity topic for the question.",
    )
    difficulty: str = Field(
        ...,
        example="intermediate",
        description="Difficulty level: beginner, intermediate, advanced.",
    )
    domain: str = Field(
        default="Web Application Security", description="Cybersecurity domain."
    )
    question_count: int = Field(
        default=3, ge=1, le=10, description="Number of questions to generate."
    )


class EvaluationRequest(BaseModel):
    question: str = Field(..., description="The original question text.")
    user_answer: str = Field(..., description="The professional's answer/transcript.")
    domain: str = Field(default="General", description="Cybersecurity domain.")
    skill: str = Field(default="General", description="Specific skill being assessed.")


class GenerationResponse(BaseModel):
    status: str
    topic: str
    difficulty: str
    questions: list[Dict[str, Any]]
    provider: str


class EvaluationResponse(BaseModel):
    status: str
    score: float
    confidence: float
    passed: bool
    feedback: str
    provider: str


# --- Routes ---


@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate(payload: QuestionRequest) -> Dict[str, Any]:
    """
    Generate cybersecurity assessment questions using the AI pipeline.

    Uses the new provider layer with retry, timeout, and fallback support.
    """
    client, loader = _get_ai()

    try:
        # Build prompt from template
        prompt = loader.render(
            "skill_assessment",
            {
                "domain": payload.domain,
                "skill": payload.topic,
                "difficulty": payload.difficulty,
                "question_count": str(payload.question_count),
            },
        )
    except Exception:
        # Fallback to direct prompt if template not found
        prompt = (
            f"Generate {payload.question_count} cybersecurity assessment questions "
            f"for the topic '{payload.topic}' at {payload.difficulty} difficulty level "
            f"in the domain of {payload.domain}. "
            f"Return a JSON array of objects with keys: question_text, type, expected_reasoning_points."
        )

    try:
        response = await client.generate(prompt=prompt)

        import json

        try:
            # Try to parse as JSON
            cleaned = response.strip().replace("```json", "").replace("```", "")
            data = json.loads(cleaned)
        except json.JSONDecodeError:
            data = {"raw_response": response}

        return {
            "status": "success",
            "topic": payload.topic,
            "difficulty": payload.difficulty,
            "questions": data if isinstance(data, list) else [data],
            "provider": type(client.provider).__name__,
        }

    except Exception as e:
        logger.error("Question generation failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI generation service unavailable: {str(e)}",
        )


@router.post("/evaluate", status_code=status.HTTP_200_OK)
async def evaluate(payload: EvaluationRequest) -> Dict[str, Any]:
    """
    Evaluate a professional's response using the AI evaluation engine.

    Uses the new provider layer with full observability.
    """
    client, loader = _get_ai()

    try:
        prompt = loader.render(
            "evaluation_engine",
            {
                "question": payload.question,
                "answer": payload.user_answer,
                "domain": payload.domain,
                "skill": payload.skill,
            },
        )
    except Exception:
        prompt = (
            f"Evaluate the following cybersecurity response:\n\n"
            f"Question: {payload.question}\n"
            f"Answer: {payload.user_answer}\n\n"
            f"Provide a JSON response with: score (0-100), confidence (0.0-1.0), "
            f"passed (bool), feedback (string), demonstrated_skills (list)."
        )

    try:
        response = await client.generate(prompt=prompt)

        import json

        try:
            cleaned = response.strip().replace("```json", "").replace("```", "")
            data = json.loads(cleaned)
        except json.JSONDecodeError:
            data = {
                "score": 50,
                "confidence": 0.5,
                "passed": False,
                "feedback": response[:500],
            }

        return {
            "status": "success",
            "score": data.get("score", 50),
            "confidence": data.get("confidence", 0.5),
            "passed": data.get("passed", False),
            "feedback": data.get("feedback", "Evaluation complete."),
            "provider": type(client.provider).__name__,
        }

    except Exception as e:
        logger.error("Evaluation failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI evaluation service unavailable: {str(e)}",
        )


@router.get("/providers")
async def list_providers():
    """List available AI providers and their status."""
    import os

    providers = {
        "gemini": bool(os.getenv("GEMINI_API_KEY")),
        "mistral": bool(os.getenv("MISTRAL_API_KEY")),
        "ollama": True,  # Always available if running locally
        "mock": True,  # Always available as fallback
    }
    return {
        "available": providers,
        "active": os.getenv("LLM_PROVIDER", "ollama"),
    }
