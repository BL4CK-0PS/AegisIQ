import logging
from ai.ai_service import generate_question, evaluate_answer

# Setup basic logging to track errors in the terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_question(data):
    try:
        topic = data.get("topic", "general")
        difficulty = data.get("difficulty", "medium")
        return generate_question(topic, difficulty)
    except Exception as e:
        logger.error(f"Error in generation pipeline: {e}")
        # Fallback response so the frontend never receives a raw crash
        return {
            "question": "Fallback: Explain the difference between an Array and a Linked List.",
            "difficulty": "medium",
            "topic": "arrays",
            "error": "Safe fallback triggered.",
        }


def check_answer(data):
    try:
        question = data.get("question", "")
        answer = data.get("answer", "")
        return evaluate_answer(question, answer)
    except Exception as e:
        logger.error(f"Error in evaluation pipeline: {e}")
        return {
            "score": 0,
            "feedback": "System temporary slowdown. Your answer was recorded successfully.",
            "error": "Safe fallback triggered.",
        }
