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


class MockProvider(BaseAIProvider):
    """Fallback provider returning deterministic mock responses for demos."""

    async def generate(self, prompt: str, schema: Optional[dict] = None) -> str:
        import json

        logger.info("Using MockProvider fallback")
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
        return OllamaProvider(
            base_url=base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
            model=model or os.getenv("OLLAMA_MODEL", "llama3"),
            timeout=float(os.getenv("LLM_TIMEOUT", "120")),
            max_retries=int(os.getenv("LLM_MAX_RETRIES", "3")),
        )

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
