import os
import json
import logging
from google import generativeai as genai
import ollama

# Setup local logger inside the AI module to avoid cross-folder import loops
logger = logging.getLogger("AegisIQ_AI")
logging.basicConfig(level=logging.INFO)

# Retrieve environment configuration
DEMO_MODE = os.getenv("DEMO_MODE", "True").lower() == "true"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Configure Gemini if key is available
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Local Mock Data for Bulletproof Demos (Absolute Last Resort fallback)
MOCK_QUESTIONS = {
    "arrays": "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    "strings": "Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1."
}

def generate_question_logic(topic: str, difficulty: str) -> dict:
    """
    Generates a coding question using a multi-tiered fallback pipeline:
    Tier 1: Cloud Gemini API (Production)
    Tier 2: Local Mistral via Ollama (Local/Offline Failover)
    Tier 3: Local Demo Mock Fallback (Bulletproof Hackathon Safety Net)
    """
    prompt = (
        f"Generate a {difficulty} level coding question focused on the topic of {topic}. "
        f"Provide the response strictly in JSON format matching this structure: "
        f'{{"topic": "{topic}", "difficulty": "{difficulty}", "question": "your question details here"}}'
    )

    # --- TIER 1: CLOUD GEMINI API ---
    if not DEMO_MODE and GEMINI_API_KEY:
        try:
            logger.info("Attempting Cloud Generation via Gemini...")
            model = genai.GenerativeModel("gemini-pro")
            response = model.generate_content(prompt)
            
            # Sanitize markdown code blocks if the model wrapped JSON in ```json ... ```
            cleaned_text = response.text.strip().replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_text)
        except Exception as e:
            logger.warning(f"Tier 1 (Gemini) failed: {e}. Falling back to Tier 2 (Ollama Mistral)...")

    # --- TIER 2: LOCAL MISTRAL VIA OLLAMA ---
    try:
        logger.info("Attempting Local Generation via Ollama (Mistral)...")
        response = ollama.chat(
            model='mistral',
            messages=[{'role': 'user', 'content': prompt}]
        )
        cleaned_response = response['message']['content'].strip().replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned_response)
    except Exception as e:
        logger.warning(f"Tier 2 (Ollama) failed: {e}. Falling back to Tier 3 (Mock Data)...")

    # --- TIER 3: BULLETPROOF DEMO MOCK DATA ---
    logger.info("Serving cached mock data.")
    fallback_q = MOCK_QUESTIONS.get(topic.lower(), f"Write a functional programming solution solving a {difficulty} {topic} challenge.")
    return {
        "topic": topic,
        "difficulty": difficulty,
        "question": fallback_q
    }