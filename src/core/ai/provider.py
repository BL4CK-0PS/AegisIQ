import abc
import asyncio
import logging
from typing import Any, Optional

import httpx

logger = logging.getLogger(__name__)


class AIProviderError(Exception):
    """Base exception for all AI provider failures."""


class AIProviderTimeoutError(AIProviderError):
    """Raised when a provider request exceeds its configured timeout."""


class AIProviderResponseError(AIProviderError):
    """Raised when a provider returns a non-success HTTP status."""


class BaseAIProvider(abc.ABC):
    """Abstract interface that all LLM providers must implement."""

    @abc.abstractmethod
    async def generate(
        self, prompt: str, schema: Optional[dict[str, Any]] = None
    ) -> str: ...


class OllamaProvider(BaseAIProvider):
    """Provider that targets a local Ollama instance."""

    def __init__(
        self,
        base_url: str = "http://localhost:11434",
        model: str = "llama3",
        timeout: float = 60.0,
        max_retries: int = 3,
        retry_delay: float = 2.0,
    ) -> None:
        self._base_url = base_url.rstrip("/")
        self._model = model
        self._timeout = timeout
        self._max_retries = max_retries
        self._retry_delay = retry_delay

    async def generate(
        self, prompt: str, schema: Optional[dict[str, Any]] = None
    ) -> str:
        last_exception: Optional[Exception] = None

        payload: dict[str, object] = {
            "model": self._model,
            "prompt": prompt,
            "stream": False,
        }
        if schema is not None:
            payload["format"] = schema

        for attempt in range(1, self._max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self._timeout) as client:
                    response = await client.post(
                        f"{self._base_url}/api/generate",
                        json=payload,
                    )
                    response.raise_for_status()
                    data: dict[str, Any] = response.json()
                    return str(data.get("response", ""))

            except httpx.TimeoutException:
                last_exception = AIProviderTimeoutError(
                    f"Ollama request timed out after {self._timeout}s "
                    f"(attempt {attempt}/{self._max_retries})"
                )
                logger.warning(str(last_exception))

            except httpx.HTTPStatusError as exc:
                last_exception = AIProviderResponseError(
                    f"Ollama returned HTTP {exc.response.status_code} "
                    f"(attempt {attempt}/{self._max_retries})"
                )
                logger.warning(str(last_exception))

            except httpx.RequestError as exc:
                last_exception = AIProviderError(
                    f"Ollama request failed: {exc} "
                    f"(attempt {attempt}/{self._max_retries})"
                )
                logger.warning(str(last_exception))

            if attempt < self._max_retries:
                await asyncio.sleep(self._retry_delay * attempt)

        raise AIProviderError(
            f"Ollama provider failed after {self._max_retries} attempts"
        ) from last_exception


class MistralProvider(BaseAIProvider):
    """Provider that targets the Mistral AI cloud API."""

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.mistral.ai",
        model: str = "mistral-large-latest",
        timeout: float = 60.0,
        max_retries: int = 3,
        retry_delay: float = 2.0,
    ) -> None:
        self._api_key = api_key
        self._base_url = base_url.rstrip("/")
        self._model = model
        self._timeout = timeout
        self._max_retries = max_retries
        self._retry_delay = retry_delay

    async def generate(
        self, prompt: str, schema: Optional[dict[str, Any]] = None
    ) -> str:
        last_exception: Optional[Exception] = None

        messages: list[dict[str, str]] = [
            {"role": "user", "content": prompt},
        ]

        payload: dict[str, object] = {
            "model": self._model,
            "messages": messages,
        }
        if schema is not None:
            payload["response_format"] = {"type": "json_object", "schema": schema}

        for attempt in range(1, self._max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self._timeout) as client:
                    response = await client.post(
                        f"{self._base_url}/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {self._api_key}",
                            "Content-Type": "application/json",
                        },
                        json=payload,
                    )
                    response.raise_for_status()
                    data: dict[str, Any] = response.json()
                    return str(data["choices"][0]["message"]["content"])

            except httpx.TimeoutException:
                last_exception = AIProviderTimeoutError(
                    f"Mistral request timed out after {self._timeout}s "
                    f"(attempt {attempt}/{self._max_retries})"
                )
                logger.warning(str(last_exception))

            except httpx.HTTPStatusError as exc:
                last_exception = AIProviderResponseError(
                    f"Mistral returned HTTP {exc.response.status_code} "
                    f"(attempt {attempt}/{self._max_retries})"
                )
                logger.warning(str(last_exception))

            except httpx.RequestError as exc:
                last_exception = AIProviderError(
                    f"Mistral request failed: {exc} "
                    f"(attempt {attempt}/{self._max_retries})"
                )
                logger.warning(str(last_exception))

            except (KeyError, IndexError) as exc:
                last_exception = AIProviderError(
                    f"Mistral response parse failed: {exc} "
                    f"(attempt {attempt}/{self._max_retries})"
                )
                logger.warning(str(last_exception))

            if attempt < self._max_retries:
                await asyncio.sleep(self._retry_delay * attempt)

        raise AIProviderError(
            f"Mistral provider failed after {self._max_retries} attempts"
        ) from last_exception
