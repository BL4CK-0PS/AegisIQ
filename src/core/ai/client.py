import logging
import time
from typing import Any, Optional

from src.core.ai.provider import (
    AIProviderError,
    AIProviderTimeoutError,
    BaseAIProvider,
)

logger = logging.getLogger(__name__)


class AIClientError(Exception):
    """Base exception for AI client-level failures."""


class AIClientTimeoutError(AIClientError):
    """Raised when the full client request (including retries) exceeds the timeout."""


class AIClient:
    """Centralised orchestrator that wraps an AI provider with observability."""

    def __init__(
        self,
        provider: BaseAIProvider,
        timeout: float = 120.0,
        log_prompts: bool = False,
    ) -> None:
        self._provider = provider
        self._timeout = timeout
        self._log_prompts = log_prompts

    @property
    def provider(self) -> BaseAIProvider:
        """Return the injected provider instance."""
        return self._provider

    async def generate(
        self,
        prompt: str,
        schema: Optional[dict[str, Any]] = None,
        timeout: Optional[float] = None,
    ) -> str:
        """Send a prompt to the provider and return the response with instrumentation."""
        effective_timeout: float = timeout if timeout is not None else self._timeout
        start_time: float = time.monotonic()

        if self._log_prompts:
            logger.debug("AI prompt [%s chars]: %s", len(prompt), prompt[:500])

        try:
            response: str = await self._provider.generate(
                prompt=prompt,
                schema=schema,
            )
        except AIProviderTimeoutError as exc:
            elapsed: float = time.monotonic() - start_time
            logger.error(
                "AI request timed out after %.2fs (configured_timeout=%.1f)",
                elapsed,
                effective_timeout,
            )
            raise AIClientTimeoutError(
                f"AI provider timed out after {effective_timeout}s"
            ) from exc
        except AIProviderError as exc:
            elapsed = time.monotonic() - start_time
            logger.error(
                "AI request failed after %.2fs: %s",
                elapsed,
                exc,
            )
            raise AIClientError(str(exc)) from exc

        elapsed = time.monotonic() - start_time
        logger.info(
            "AI request succeeded in %.2fs [provider=%s, response_len=%d]",
            elapsed,
            type(self._provider).__name__,
            len(response),
        )

        return response
