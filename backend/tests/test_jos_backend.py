"""
AegisIQ Jos Backend Tests

Covers session lifecycle, metrics, pagination, rate limiting, and caching.
"""

import pytest
from fastapi.testclient import TestClient


# ---------------------------------------------------------------------------
# Helper: register and return tokens
# ---------------------------------------------------------------------------


def _register_user(client: TestClient, email: str = "jos_test@example.com") -> str:
    resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "secure_password_123",
            "display_name": "Jos Test User",
            "role": "professional",
        },
    )
    assert resp.status_code == 201
    return resp.json()["access_token"]


def _auth_header(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


# ---------------------------------------------------------------------------
# 1. Session Lifecycle — start → record → complete (by session_id)
# ---------------------------------------------------------------------------


class TestSessionLifecycle:
    def test_start_then_record_on_same_session(self, client: TestClient):
        token = _register_user(client, "session_lifecycle@example.com")
        headers = _auth_header(token)

        start_resp = client.post(
            "/api/v1/ai/session/start",
            json={"domain": "Network Security", "initial_difficulty": "beginner"},
            headers=headers,
        )
        assert start_resp.status_code == 200
        session_id = start_resp.json()["session"]["id"]

        record_resp = client.post(
            "/api/v1/ai/session/record",
            json={
                "session_id": session_id,
                "question_id": "q001",
                "question_text": "What is a firewall?",
                "domain": "Network Security",
                "skill": "Firewall Configuration",
                "difficulty": "beginner",
                "score": 70.0,
                "confidence": 0.75,
                "passed": True,
                "is_follow_up": False,
            },
            headers=headers,
        )
        assert record_resp.status_code == 200
        session = record_resp.json()["session"]
        assert session["id"] == session_id
        assert len(session["questions"]) == 1

    def test_record_on_nonexistent_session_returns_404(self, client: TestClient):
        token = _register_user(client, "session_404@example.com")
        headers = _auth_header(token)

        resp = client.post(
            "/api/v1/ai/session/record",
            json={
                "session_id": "fake_session_xyz",
                "question_id": "q001",
                "question_text": "Test?",
                "domain": "Network Security",
                "skill": "General",
                "difficulty": "beginner",
                "score": 50.0,
                "confidence": 0.5,
                "passed": False,
            },
            headers=headers,
        )
        assert resp.status_code == 404

    def test_complete_session_returns_completed_state(self, client: TestClient):
        token = _register_user(client, "session_complete@example.com")
        headers = _auth_header(token)

        start_resp = client.post(
            "/api/v1/ai/session/start",
            json={
                "domain": "Web Application Security",
                "initial_difficulty": "beginner",
            },
            headers=headers,
        )
        session_id = start_resp.json()["session"]["id"]

        for i in range(3):
            client.post(
                "/api/v1/ai/session/record",
                json={
                    "session_id": session_id,
                    "question_id": f"q{i:03d}",
                    "question_text": f"Question {i}",
                    "domain": "Web Application Security",
                    "skill": "SQL Injection",
                    "difficulty": "beginner",
                    "score": 60.0 + i * 10,
                    "confidence": 0.7,
                    "passed": True,
                },
                headers=headers,
            )

        complete_resp = client.post(
            "/api/v1/ai/session/complete",
            json={"session_id": session_id},
            headers=headers,
        )
        assert complete_resp.status_code == 200
        completed = complete_resp.json()["session"]
        assert completed["state"] == "completed"
        assert completed["id"] == session_id
        assert len(completed["questions"]) == 3

    def test_complete_nonexistent_session_returns_404(self, client: TestClient):
        token = _register_user(client, "complete_404@example.com")
        headers = _auth_header(token)

        resp = client.post(
            "/api/v1/ai/session/complete",
            json={"session_id": "nonexistent_abc"},
            headers=headers,
        )
        assert resp.status_code == 404


# ---------------------------------------------------------------------------
# 2. Metrics Endpoint
# ---------------------------------------------------------------------------


class TestMetrics:
    def test_metrics_returns_nonzero_after_requests(self, client: TestClient):
        client.get("/api/v1/jd/skills")
        client.get("/api/v1/jd/techniques")
        client.get("/api/v1/jd/domains")

        resp = client.get("/metrics")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_requests"] > 0
        assert data["average_duration_seconds"] >= 0.0

    def test_metrics_increments_on_new_request(self, client: TestClient):
        before = client.get("/metrics").json()["total_requests"]
        client.get("/api/v1/jd/skills")
        after = client.get("/metrics").json()["total_requests"]
        assert after > before

    def test_metrics_has_required_fields(self, client: TestClient):
        data = client.get("/metrics").json()
        assert "total_requests" in data
        assert "total_errors" in data
        assert "error_rate" in data
        assert "average_duration_seconds" in data
        assert "service" in data
        assert "version" in data


# ---------------------------------------------------------------------------
# 3. Pagination
# ---------------------------------------------------------------------------


class TestPagination:
    def test_users_pagination_has_correct_structure(self, client: TestClient):
        _register_user(client, "pagination_admin@example.com")

        admin_resp = client.post(
            "/api/v1/auth/register",
            json={
                "email": "pagination_admin2@example.com",
                "password": "secure_password_123",
                "display_name": "Admin",
                "role": "admin",
            },
        )
        admin_token = admin_resp.json()["access_token"]
        headers = _auth_header(admin_token)

        resp = client.get("/api/v1/users/?limit=5&offset=0", headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "users" in data
        assert "total" in data
        assert "limit" in data
        assert "offset" in data
        assert data["limit"] == 5
        assert data["offset"] == 0
        assert isinstance(data["users"], list)

    def test_jd_skills_pagination(self, client: TestClient):
        resp = client.get("/api/v1/jd/skills?limit=3&offset=0")
        assert resp.status_code == 200
        data = resp.json()
        assert "skills" in data
        assert "total" in data
        assert data["limit"] == 3
        assert len(data["skills"]) <= 3

    def test_jd_skills_offset(self, client: TestClient):
        resp_all = client.get("/api/v1/jd/skills?limit=200&offset=0").json()
        resp_page = client.get("/api/v1/jd/skills?limit=2&offset=1").json()
        assert len(resp_page["skills"]) == 2
        assert resp_page["skills"][0]["id"] != resp_all["skills"][0]["id"]

    def test_jd_techniques_pagination(self, client: TestClient):
        resp = client.get("/api/v1/jd/techniques?limit=5&offset=0")
        assert resp.status_code == 200
        data = resp.json()
        assert "techniques" in data
        assert "total" in data
        assert len(data["techniques"]) <= 5

    def test_jd_domains_pagination(self, client: TestClient):
        resp = client.get("/api/v1/jd/domains?limit=2&offset=0")
        assert resp.status_code == 200
        data = resp.json()
        assert "domains" in data
        assert "total" in data
        assert len(data["domains"]) <= 2

    def test_assessments_pagination(self, client: TestClient):
        token = _register_user(client, "assess_pagination@example.com")
        headers = _auth_header(token)

        resp = client.get("/api/v1/assessments/?limit=5&offset=0", headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "assessments" in data
        assert "total" in data
        assert "limit" in data
        assert "offset" in data


# ---------------------------------------------------------------------------
# 4. Rate Limiting
# ---------------------------------------------------------------------------


class TestRateLimiting:
    def test_auth_rate_limit_returns_429(self, client: TestClient):
        """Send 11 rapid login attempts to trigger auth rate limit (10/min)."""
        responses = []
        for i in range(12):
            resp = client.post(
                "/api/v1/auth/login",
                json={
                    "email": f"ratelimit_{i}@example.com",
                    "password": "wrong_password",
                },
            )
            responses.append(resp.status_code)

        assert 429 in responses, f"Expected 429 in responses but got: {responses}"

    def test_rate_limited_response_has_retry_after(self, client: TestClient):
        """After hitting the limit, response should have Retry-After header."""
        for i in range(15):
            resp = client.post(
                "/api/v1/auth/login",
                json={"email": f"retry_{i}@example.com", "password": "wrong_password"},
            )
            if resp.status_code == 429:
                assert "Retry-After" in resp.headers
                data = resp.json()
                assert "detail" in data
                return
        pytest.skip("Rate limit not triggered within 15 attempts")


# ---------------------------------------------------------------------------
# 5. Caching
# ---------------------------------------------------------------------------


class TestCache:
    def test_cache_module_importable(self):
        from backend.middleware import cache

        assert cache.size >= 0

    def test_cache_set_and_get(self):
        from backend.middleware import InMemoryCache

        c = InMemoryCache(default_ttl=60)
        c.set("key1", {"data": "value"})
        assert c.get("key1") == {"data": "value"}

    def test_cache_expires(self):
        from backend.middleware import InMemoryCache
        import time

        c = InMemoryCache(default_ttl=0)
        c.set("expire_me", "gone")
        time.sleep(0.01)
        assert c.get("expire_me") is None

    def test_cache_invalidate(self):
        from backend.middleware import InMemoryCache

        c = InMemoryCache(default_ttl=60)
        c.set("to_invalidate", "value")
        c.invalidate("to_invalidate")
        assert c.get("to_invalidate") is None

    def test_cache_clear(self):
        from backend.middleware import InMemoryCache

        c = InMemoryCache(default_ttl=60)
        c.set("a", 1)
        c.set("b", 2)
        c.clear()
        assert c.size == 0
