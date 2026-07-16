"""
AegisIQ Monitoring Middleware

Request logging, timing, and metrics collection.
"""

import time
import logging
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("aegisiq.middleware")


class MonitoringMiddleware(BaseHTTPMiddleware):
    """Middleware for request logging, timing, and basic metrics."""

    def __init__(self, app, exclude_paths: list[str] | None = None):
        super().__init__(app)
        self.exclude_paths = exclude_paths or ["/health", "/metrics"]
        self._request_count = 0
        self._error_count = 0
        self._total_duration = 0.0

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if request.url.path in self.exclude_paths:
            return await call_next(request)

        self._request_count += 1
        start_time = time.monotonic()

        # Add request ID header
        request_id = f"{int(start_time * 1000)}"
        request.state.request_id = request_id

        logger.info(
            "[%s] %s %s started",
            request_id,
            request.method,
            request.url.path,
        )

        response = None
        status_code = 500
        try:
            response = await call_next(request)
            status_code = response.status_code
            return response
        except Exception as exc:
            self._error_count += 1
            logger.error(
                "[%s] %s %s failed: %s",
                request_id,
                request.method,
                request.url.path,
                str(exc),
            )
            raise
        finally:
            duration = time.monotonic() - start_time
            self._total_duration += duration

            log_fn = logger.warning if status_code >= 400 else logger.info
            log_fn(
                "[%s] %s %s completed [%d] in %.3fs",
                request_id,
                request.method,
                request.url.path,
                status_code,
                duration,
            )

            # Add timing header
            if response:
                response.headers["X-Request-ID"] = request_id
                response.headers["X-Response-Time"] = f"{duration:.3f}s"

    @property
    def metrics(self) -> dict:
        """Return current metrics snapshot."""
        avg_duration = (
            self._total_duration / self._request_count
            if self._request_count > 0
            else 0.0
        )
        return {
            "total_requests": self._request_count,
            "total_errors": self._error_count,
            "error_rate": (
                self._error_count / self._request_count
                if self._request_count > 0
                else 0.0
            ),
            "average_duration_seconds": round(avg_duration, 4),
        }
