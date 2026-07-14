from fastapi import APIRouter
from backend.services.ai_handler import get_question, check_answer

# This creates a mini-app just for AI-related traffic
router = APIRouter()

@router.post("/generate")
def generate(data: dict):
    return get_question(data)

@router.post("/evaluate")
def evaluate(data: dict):
    return check_answer(data)