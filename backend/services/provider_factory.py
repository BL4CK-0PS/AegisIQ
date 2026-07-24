"""
AegisIQ AI Provider Factory

Wires the new src/core/ai/ provider layer into the backend.
Supports multi-tier fallback: Cloud (Gemini/Mistral) -> Local (Ollama) -> Mock.
"""

import os
import logging
from typing import Optional

from src.core.ai.provider import BaseAIProvider, OllamaProvider, MistralProvider
from src.core.ai.client import AIClient
from src.core.ai.prompt_loader import PromptLoader

logger = logging.getLogger(__name__)


class GeminiProvider(BaseAIProvider):
    """Provider wrapping Google Gemini API via google-generativeai SDK."""

    def __init__(
        self,
        api_key: str,
        model: str = "gemini-pro",
        timeout: float = 120.0,
        max_retries: int = 3,
        retry_delay: float = 2.0,
    ) -> None:
        self._api_key = api_key
        self._model = model
        self._timeout = timeout
        self._max_retries = max_retries
        self._retry_delay = retry_delay
        self._genai = None

    def _get_client(self):
        if self._genai is None:
            import google.generativeai as genai

            genai.configure(api_key=self._api_key)
            self._genai = genai.GenerativeModel(self._model)
        return self._genai

    async def generate(self, prompt: str, schema: Optional[dict] = None) -> str:
        import asyncio

        last_exception = None
        for attempt in range(1, self._max_retries + 1):
            try:
                model = self._get_client()
                response = await asyncio.to_thread(model.generate_content, prompt)
                return response.text
            except Exception as exc:
                last_exception = exc
                logger.warning(
                    "Gemini attempt %d/%d failed: %s",
                    attempt,
                    self._max_retries,
                    exc,
                )
                if attempt < self._max_retries:
                    await asyncio.sleep(self._retry_delay * attempt)

        from src.core.ai.provider import AIProviderError

        raise AIProviderError(
            f"Gemini provider failed after {self._max_retries} attempts"
        ) from last_exception


JUSTIFICATION_POOL: dict[str, list[str]] = {
    "foundational_knowledge": [
        "Demonstrated a solid grasp of core cybersecurity concepts, including threat classification and basic defense mechanisms.",
        "Answer reflected awareness of fundamental security principles, though some terminology was used imprecisely.",
        "Candidate showed adequate understanding of baseline security practices relevant to the question domain.",
    ],
    "tool_familiarity": [
        "Referenced appropriate security tooling and showed awareness of how they integrate into a SOC workflow.",
        "Candidate demonstrated working knowledge of relevant tools but could improve on advanced configuration scenarios.",
        "Indicated practical exposure to the tools in question, citing realistic use cases.",
    ],
    "guided_analysis": [
        "Candidate followed a logical analytical approach, breaking the problem into identifiable investigation steps.",
        "Analysis showed a methodical thought process with reasonable hypotheses and next steps.",
        "The investigative approach was sound, though deeper triage criteria could have been applied.",
    ],
    "communication": [
        "Response was clearly structured and conveyed findings in a concise, actionable manner.",
        "Candidate communicated reasoning effectively, making the analysis easy to follow.",
        "Articulated findings with appropriate detail, suitable for both technical and management audiences.",
    ],
    "situational_awareness": [
        "Candidate demonstrated awareness of the operational context and prioritized actions appropriately.",
        "Showed understanding of risk implications and real-world impact of the scenario described.",
        "Response reflected a practical mindset with attention to escalation and containment procedures.",
    ],
}


def _pick_justification(criterion_name: str) -> str:
    import random

    pool = JUSTIFICATION_POOL.get(criterion_name, [])
    if not pool:
        pool = [
            f"Candidate addressed the {criterion_name.replace('_', ' ')} dimension with a reasonable level of detail.",
            f"Response demonstrated competence in {criterion_name.replace('_', ' ')} aligned with the expected proficiency.",
        ]
    return random.choice(pool)


_NONSENSE_PATTERNS = (
    "idk", "i don't know", "i dont know", "dunno", "no idea",
    "skip", "pass", "n/a", "none", "no answer", "nothing",
    "idk how to answer", "not sure", "no comment", "test",
    "asdf", "aaaa", "hello", "hi", "ok", "okay", "yes", "no",
    "1", "2", "3", "abc",
)


def _extract_answer(prompt: str) -> str:
    marker = "Candidate answer to evaluate:\n"
    idx = prompt.rfind(marker)
    if idx != -1:
        return prompt[idx + len(marker):].strip()
    return prompt[-500:].strip() if len(prompt) > 500 else prompt.strip()


def _is_nonsense(answer: str) -> bool:
    if len(answer) < 5:
        return True
    lower = answer.lower().strip()
    return any(lower == p or lower.startswith(p) for p in _NONSENSE_PATTERNS)


class MockProvider(BaseAIProvider):
    """Fallback provider returning structured mock responses for demos."""

    async def generate(self, prompt: str, schema: Optional[dict] = None) -> str:
        import json
        import random

        logger.info("Using MockProvider fallback")

        if schema and "overall_score" in str(schema):
            candidate_answer = _extract_answer(prompt)
            nonsense = _is_nonsense(candidate_answer)

            if nonsense:
                score = round(random.uniform(0, 10), 1)
                crit_score_range = (0, 1)
                crit_score_default = 1
                confidence_range = (0.3, 0.55)
                proficiency = "beginner"
                justification_fn = lambda cn, s: f"Candidate did not provide a substantive answer for {cn.replace('_', ' ')}. The response lacked relevant technical content."
                overall_justification = (
                    f"Scored {score}/100. "
                    "The candidate's response was empty, nonsensical, or indicated inability to answer. "
                    "No meaningful cybersecurity knowledge was demonstrated."
                )
                demonstrated = random.sample(
                    ["Incident response", "Log analysis"],
                    k=min(1, 2),
                )
                missing = [
                    "Advanced threat modeling",
                    "Zero trust architecture",
                    "Threat hunting",
                    "Malware reverse engineering",
                    "Cloud forensics",
                ]
                mitre = ["T1078"]
            else:
                score = round(random.uniform(60, 95), 1)
                crit_score_range = (2, 5)
                crit_score_default = 3
                confidence_range = (0.6, 0.95)
                proficiency = random.choice(["beginner", "intermediate", "advanced"])
                justification_fn = lambda cn, s: _pick_justification(cn)
                overall_justification = (
                    f"Scored {score}/100. Demonstrated solid foundational knowledge with room for growth."
                )
                demonstrated = random.sample(
                    [
                        "Incident response",
                        "Log analysis",
                        "SIEM operations",
                        "Network monitoring",
                        "Vulnerability assessment",
                    ],
                    k=random.randint(2, 4),
                )
                missing = random.sample(
                    [
                        "Advanced threat modeling",
                        "Zero trust architecture",
                        "Threat hunting",
                        "Malware reverse engineering",
                        "Cloud forensics",
                    ],
                    k=random.randint(1, 3),
                )
                mitre = random.sample(
                    ["T1078", "T1059", "T1566", "T1021", "T1053", "T1027"],
                    k=random.randint(1, 3),
                )

            criteria_names = [
                "foundational_knowledge",
                "tool_familiarity",
                "guided_analysis",
                "communication",
                "situational_awareness",
            ]

            return json.dumps(
                {
                    "overall_score": score,
                    "confidence": round(random.uniform(*confidence_range), 2),
                    "passed": score >= 70,
                    "proficiency_level": proficiency,
                    "criteria_scores": [
                        {
                            "criterion_name": cn,
                            "score": int(round(random.uniform(*crit_score_range))),
                            "justification": justification_fn(cn, score),
                        }
                        for cn in criteria_names
                    ],
                    "missing_concepts": missing,
                    "demonstrated_skills": demonstrated,
                    "mitre_technique_ids": mitre,
                    "overall_justification": overall_justification,
                }
            )

        return json.dumps(
            {
                "status": "mock",
                "message": "Running in demo mode. No LLM provider available.",
                "prompt_length": len(prompt),
            }
        )


def create_provider(
    provider_name: Optional[str] = None,
    api_key: Optional[str] = None,
    base_url: Optional[str] = None,
    model: Optional[str] = None,
) -> BaseAIProvider:
    """
    Factory function to create the appropriate AI provider based on configuration.

    Priority chain:
    1. Explicit provider_name parameter
    2. LLM_PROVIDER environment variable
    3. Auto-detect from available API keys
    """
    provider = provider_name or os.getenv("LLM_PROVIDER", "ollama")
    provider = provider.lower()

    logger.info("Creating AI provider: %s", provider)

    if provider == "gemini":
        key = api_key or os.getenv("GEMINI_API_KEY", "")
        if not key:
            logger.warning("No Gemini API key found, falling back to Ollama")
            return create_provider("ollama", api_key, base_url, model)
        return GeminiProvider(
            api_key=key,
            model=model or "gemini-pro",
            timeout=float(os.getenv("LLM_TIMEOUT", "120")),
            max_retries=int(os.getenv("LLM_MAX_RETRIES", "3")),
        )

    elif provider == "mistral":
        key = api_key or os.getenv("MISTRAL_API_KEY", "")
        if not key:
            logger.warning("No Mistral API key found, falling back to Ollama")
            return create_provider("ollama", api_key, base_url, model)
        return MistralProvider(
            api_key=key,
            base_url=base_url or "https://api.mistral.ai",
            model=model or os.getenv("MISTRAL_MODEL", "mistral-large-latest"),
            timeout=float(os.getenv("LLM_TIMEOUT", "120")),
            max_retries=int(os.getenv("LLM_MAX_RETRIES", "3")),
        )

    elif provider == "ollama":
        base = base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        try:
            import urllib.request

            req = urllib.request.Request(f"{base}/api/tags", method="GET")
            urllib.request.urlopen(req, timeout=3)
            return OllamaProvider(
                base_url=base,
                model=model or os.getenv("OLLAMA_MODEL", "llama3"),
                timeout=float(os.getenv("LLM_TIMEOUT", "120")),
                max_retries=int(os.getenv("LLM_MAX_RETRIES", "3")),
            )
        except Exception:
            logger.warning(
                "Ollama not reachable at %s, falling back to MockProvider", base
            )
            return MockProvider()

    elif provider == "mock":
        return MockProvider()

    else:
        logger.warning("Unknown provider '%s', falling back to MockProvider", provider)
        return MockProvider()


def create_ai_client(
    provider_name: Optional[str] = None,
    api_key: Optional[str] = None,
    base_url: Optional[str] = None,
    model: Optional[str] = None,
    prompts_dir: Optional[str] = None,
) -> tuple[AIClient, PromptLoader]:
    """
    Create a fully configured AIClient and PromptLoader.

    Returns:
        Tuple of (AIClient, PromptLoader) ready for use.
    """
    provider = create_provider(provider_name, api_key, base_url, model)
    client = AIClient(
        provider=provider,
        timeout=float(os.getenv("LLM_TIMEOUT", "120")),
        log_prompts=os.getenv("LOG_LEVEL", "INFO").upper() == "DEBUG",
    )

    prompts_path = prompts_dir or os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "prompts",
    )
    loader = PromptLoader(prompts_dir=prompts_path)

    logger.info(
        "AI Client created [provider=%s, prompts=%s]",
        type(provider).__name__,
        prompts_path,
    )

    return client, loader
