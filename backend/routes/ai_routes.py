from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Dict, Any

# Import the core resilient engine we perfected in Step 1
from ai.ai_service import generate_question, evaluate_answer

router = APIRouter()

# --- SPRINT 2: DATA VALIDATION SCHEMAS ---
# This forces the frontend to send EXACTLY what we expect. No assumptions.

class QuestionRequest(BaseModel):
    topic: str = Field(..., example="arrays", description="The programming topic for the question.")
    difficulty: str = Field(..., example="medium", description="Difficulty level: easy, medium, or hard.")

class EvaluationRequest(BaseModel):
    question: str = Field(..., description="The original question text prompt provided to the user.")
    user_answer: str = Field(..., description="The code implementation or answer submitted by the user.")


# --- SPRINT 2: ENDPOINTS ---

@router.post("/generate", status_code=status.HTTP_200_OK)
def generate(payload: QuestionRequest) -> Dict[str, Any]:
    """
    Exposes AI question generation to the frontend/voice teams.
    Validates inputs strictly before processing.
    """
    try:
        # Extract validated fields and pass them to our core resilient logic
        result = generate_question(topic=payload.topic, difficulty=payload.difficulty)
        return result
    except Exception as e:
        # Ultimate fallback barrier to ensure the route never returns a raw 500 crash
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Integration layer failure: {str(e)}"
        )

@router.post("/evaluate", status_code=status.HTTP_200_OK)
def evaluate(payload: EvaluationRequest) -> Dict[str, Any]:
    """
    Evaluates a user's code submission against the generated question context.
    """
    try:
        result = evaluate_answer(question=payload.question, user_answer=payload.user_answer)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Integration layer failure: {str(e)}"
        )