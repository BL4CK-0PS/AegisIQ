"""
AegisIQ Middleware

Monitoring, caching, and rate limiting for the FastAPI application.
"""

import time
import logging
import threading
from collections import defaultdict
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

logger = logging.getLogger("aegisiq.middleware")


# ---------------------------------------------------------------------------
# Monitoring Middleware
# ---------------------------------------------------------------------------

_metrics_instance: "MonitoringMiddleware | None" = None


def get_metrics() -> dict:
    """Return current metrics from the active middleware instance."""
    if _metrics_instance is not None:
        return _metrics_instance.metrics
    return {
        "total_requests": 0,
        "total_errors": 0,
        "error_rate": 0.0,
        "average_duration_seconds": 0.0,
    }


class MonitoringMiddleware(BaseHTTPMiddleware):
    """Middleware for request logging, timing, and basic metrics."""

    def __init__(self, app, exclude_paths: list[str] | None = None):
        global _metrics_instance
        super().__init__(app)
        self.exclude_paths = exclude_paths or ["/health", "/metrics"]
        self._request_count = 0
        self._error_count = 0
        self._total_duration = 0.0
        _metrics_instance = self

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if request.url.path in self.exclude_paths:
            return await call_next(request)

        self._request_count += 1
        start_time = time.monotonic()

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


# ---------------------------------------------------------------------------
# In-Memory Cache
# ---------------------------------------------------------------------------


class InMemoryCache:
    """Thread-safe TTL-based in-memory cache for static data."""

    def __init__(self, default_ttl: int = 300) -> None:
        self._default_ttl = default_ttl
        self._store: dict[str, tuple[float, object]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> object | None:
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return None
            expires_at, value = entry
            if time.monotonic() > expires_at:
                del self._store[key]
                return None
            return value

    def set(self, key: str, value: object, ttl: int | None = None) -> None:
        with self._lock:
            expires = time.monotonic() + (ttl or self._default_ttl)
            self._store[key] = (expires, value)

    def invalidate(self, key: str) -> None:
        with self._lock:
            self._store.pop(key, None)

    def clear(self) -> None:
        with self._lock:
            self._store.clear()

    @property
    def size(self) -> int:
        with self._lock:
            return len(self._store)


# Global cache instance
cache = InMemoryCache(default_ttl=300)


# ---------------------------------------------------------------------------
# Rate Limiter State (for test reset)
# ---------------------------------------------------------------------------

_rate_limiter_instance: "RateLimitMiddleware | None" = None


def clear_rate_limits() -> None:
    """Reset all rate limiter counters. Intended for test isolation."""
    if _rate_limiter_instance is not None:
        with _rate_limiter_instance._lock:
            _rate_limiter_instance._requests.clear()


# ---------------------------------------------------------------------------
# Rate Limiting Middleware (Sliding Window)
# ---------------------------------------------------------------------------


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Sliding-window rate limiter per client IP.

    Default limits:
      - Auth routes: 10 requests / minute
      - Public API routes: 60 requests / minute
      - Other routes: unlimited
    """

    def __init__(
        self,
        app,
        auth_limit: int = 10,
        api_limit: int = 60,
        window_seconds: int = 60,
    ) -> None:
        global _rate_limiter_instance
        super().__init__(app)
        self._auth_limit = auth_limit
        self._api_limit = api_limit
        self._window = window_seconds
        self._requests: dict[str, list[float]] = defaultdict(list)
        self._lock = threading.Lock()
        _rate_limiter_instance = self

    def _get_client_ip(self, request: Request) -> str:
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    def _is_rate_limited(self, client_ip: str, path: str) -> bool:
        now = time.monotonic()
        cutoff = now - self._window

        if path.startswith("/api/v1/auth"):
            limit = self._auth_limit
        elif path.startswith("/api/v1"):
            limit = self._api_limit
        else:
            return False

        key = f"{client_ip}:{path.rsplit('/', 1)[0] if '/' in path else path}"

        with self._lock:
            timestamps = self._requests[key]
            self._requests[key] = [t for t in timestamps if t > cutoff]
            if len(self._requests[key]) >= limit:
                return True
            self._requests[key].append(now)
            return False

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        client_ip = self._get_client_ip(request)
        path = request.url.path

        if self._is_rate_limited(client_ip, path):
            logger.warning(
                "Rate limit exceeded for %s on %s", client_ip, path
            )
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Rate limit exceeded. Please try again later.",
                    "retry_after_seconds": self._window,
                },
                headers={"Retry-After": str(self._window)},
            )

        return await call_next(request)
