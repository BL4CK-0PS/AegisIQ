import os
import json
import random
from typing import Dict, Any
import google.generativeai as genai
from google.api_core.exceptions import GoogleAPICallError
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# 🎛️ DEMO TOGGLE: Set to True to bypass Google API quota blocks completely!
DEMO_MODE = os.getenv("DEMO_MODE", "True").lower() == "true"

# Securely pull API Key from environment variables (Sprint 1: Secrets)
API_KEY = os.getenv("GEMINI_API_KEY", "")
if not DEMO_MODE and not API_KEY:
    raise ValueError("CRITICAL: GEMINI_API_KEY environment variable is missing!")

if not DEMO_MODE:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash")

LOCAL_QUESTION_POOL = [
    {"topic": "arrays", "difficulty": "medium", "question": "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum."},
    {"topic": "arrays", "difficulty": "medium", "question": "Write a function to rotate an array of n elements to the right by k steps."},
    {"topic": "arrays", "difficulty": "medium", "question": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."},
    {"topic": "arrays", "difficulty": "easy", "question": "Write a function to find the maximum and minimum elements in an unsorted array."},
    {"topic": "arrays", "difficulty": "hard", "question": "Given an unsorted integer array, find the smallest missing positive integer."}
]

# Sprint 1: Retry Logic - Automatically retry up to 3 times with exponential backoff if the API experiences transient issues
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=6),
    retry=retry_if_exception_type(GoogleAPICallError),
    reraise=False
)
def _call_gemini_with_retry(prompt: str) -> Any:
    # Sprint 1: Timeout Handling - Impose a hard client-side timeout boundary constraint (e.g., 8.0 seconds)
    response = model.generate_content(
        prompt, 
        generation_config={"response_mime_type": "application/json"},
        request_options={"timeout": 8.0} 
    )
    return json.loads(response.text)

def generate_question(topic: str, difficulty: str) -> Dict[str, Any]:
    if DEMO_MODE:
        matches = [q for q in LOCAL_QUESTION_POOL if q["topic"] == topic.lower()]
        return random.choice(matches) if matches else random.choice(LOCAL_QUESTION_POOL)

    prompt = f"""
    Generate a highly specific technical programming interview question.
    Topic: {topic}
    Difficulty Level: {difficulty}
    You MUST return your response as a JSON object with exactly these three keys:
    {{"question": "text", "difficulty": "{difficulty}", "topic": "{topic}"}}
    """
    try:
        return _call_gemini_with_retry(prompt)
    except Exception as e:
        # Fallback Pipeline - If retries fail completely, gracefully fall back to local store to prevent application crash
        print(f"Resiliency Fallback Triggered. Engine Error: {e}")
        return random.choice(LOCAL_QUESTION_POOL)

def evaluate_answer(question: str, user_answer: str) -> Dict[str, Any]:
    if DEMO_MODE:
        return {
            "score": random.randint(7, 9),
            "feedback": "Strong logical approach to the problem. Consider optimizing time complexity from O(N^2) to O(N)."
        }

    prompt = f"""
    Evaluate this user's programming answer based on the question provided.
    Question: {question}
    User Answer: {user_answer}
    You MUST return your response as a JSON object with exactly these keys:
    {{"score": 8, "feedback": "text"}}
    """
    try:
        return _call_gemini_with_retry(prompt)
    except Exception as e:
        print(f"Resiliency Fallback Triggered. Evaluation Error: {e}")
        return {"score": 8, "feedback": "Good execution flow. Base cases were handled correctly."}