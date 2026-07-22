"""
AegisIQ Core Flow Tests

Covers authentication, in-memory session lifecycle, metrics, and rubric registry.
"""

from fastapi.testclient import TestClient


# ---------------------------------------------------------------------------
# 1. Authentication — Registration & Login
# ---------------------------------------------------------------------------


class TestAuthentication:
    def test_register_returns_tokens(self, client: TestClient):
        payload = {
            "email": "test_auth_register@example.com",
            "password": "secure_password_123",
            "display_name": "Test User",
            "role": "professional",
        }
        resp = client.post("/api/v1/auth/register", json=payload)
        assert resp.status_code == 201
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert data["role"] == "professional"
        assert data["display_name"] == "Test User"

    def test_login_returns_tokens(self, client: TestClient):
        reg = {
            "email": "test_auth_login@example.com",
            "password": "secure_password_123",
            "display_name": "Login User",
            "role": "professional",
        }
        client.post("/api/v1/auth/register", json=reg)

        login_payload = {
            "email": "test_auth_login@example.com",
            "password": "secure_password_123",
        }
        resp = client.post("/api/v1/auth/login", json=login_payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data

    def test_login_wrong_password_returns_401(self, client: TestClient):
        reg = {
            "email": "test_auth_wrong@example.com",
            "password": "correct_password",
            "display_name": "Wrong Pw User",
            "role": "professional",
        }
        client.post("/api/v1/auth/register", json=reg)

        resp = client.post(
            "/api/v1/auth/login",
            json={"email": "test_auth_wrong@example.com", "password": "wrong_password"},
        )
        assert resp.status_code == 401

    def test_me_endpoint_returns_user(self, client: TestClient):
        reg = {
            "email": "test_auth_me@example.com",
            "password": "secure_password_123",
            "display_name": "Me User",
            "role": "professional",
        }
        reg_resp = client.post("/api/v1/auth/register", json=reg)
        token = reg_resp.json()["access_token"]

        resp = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 200
        assert resp.json()["email"] == "test_auth_me@example.com"


# ---------------------------------------------------------------------------
# 2. In-Memory Session Lifecycle
# ---------------------------------------------------------------------------


class TestSessionLifecycle:
    def test_start_record_complete_session(self, client: TestClient):
        reg = {
            "email": "test_session@example.com",
            "password": "secure_password_123",
            "display_name": "Session User",
            "role": "professional",
        }
        reg_resp = client.post("/api/v1/auth/register", json=reg)
        token = reg_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        start_resp = client.post(
            "/api/v1/ai/session/start",
            json={
                "domain": "Web Application Security",
                "initial_difficulty": "beginner",
            },
            headers=headers,
        )
        assert start_resp.status_code == 200
        session_data = start_resp.json()["session"]
        session_id = session_data["id"]
        assert session_data["state"] == "active"

        record_resp = client.post(
            "/api/v1/ai/session/record",
            json={
                "session_id": session_id,
                "question_id": "q001",
                "question_text": "What is SQL injection?",
                "domain": "Web Application Security",
                "skill": "SQL Injection",
                "difficulty": "beginner",
                "score": 75.0,
                "confidence": 0.8,
                "passed": True,
                "is_follow_up": False,
            },
            headers=headers,
        )
        assert record_resp.status_code == 200
        updated_session = record_resp.json()["session"]
        assert len(updated_session["questions"]) == 1
        assert updated_session["questions"][0]["question_id"] == "q001"

        complete_resp = client.post(
            "/api/v1/ai/session/complete",
            json={"session_id": session_id},
            headers=headers,
        )
        assert complete_resp.status_code == 200
        completed = complete_resp.json()["session"]
        assert completed["state"] == "completed"
        assert completed["id"] == session_id

    def test_record_on_nonexistent_session_returns_404(self, client: TestClient):
        reg = {
            "email": "test_session_404@example.com",
            "password": "secure_password_123",
            "display_name": "No Session",
            "role": "professional",
        }
        reg_resp = client.post("/api/v1/auth/register", json=reg)
        token = reg_resp.json()["access_token"]

        resp = client.post(
            "/api/v1/ai/session/record",
            json={
                "session_id": "nonexistent123",
                "question_id": "q001",
                "question_text": "Test?",
                "domain": "Web Application Security",
                "skill": "General",
                "difficulty": "beginner",
                "score": 50.0,
                "confidence": 0.5,
                "passed": False,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 404

    def test_multiple_answers_on_same_session(self, client: TestClient):
        reg = {
            "email": "test_session_multi@example.com",
            "password": "secure_password_123",
            "display_name": "Multi Answer",
            "role": "professional",
        }
        reg_resp = client.post("/api/v1/auth/register", json=reg)
        token = reg_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        start_resp = client.post(
            "/api/v1/ai/session/start",
            json={"domain": "Network Security", "initial_difficulty": "beginner"},
            headers=headers,
        )
        session_id = start_resp.json()["session"]["id"]

        for i in range(3):
            resp = client.post(
                "/api/v1/ai/session/record",
                json={
                    "session_id": session_id,
                    "question_id": f"q{i:03d}",
                    "question_text": f"Question {i}",
                    "domain": "Network Security",
                    "skill": "Packet Analysis",
                    "difficulty": "beginner",
                    "score": 60.0 + i * 10,
                    "confidence": 0.7,
                    "passed": True,
                },
                headers=headers,
            )
            assert resp.status_code == 200

        session_resp = client.post(
            "/api/v1/ai/session/complete",
            json={"session_id": session_id},
            headers=headers,
        )
        completed = session_resp.json()["session"]
        assert len(completed["questions"]) == 3


# ---------------------------------------------------------------------------
# 3. Metrics Endpoint
# ---------------------------------------------------------------------------


class TestMetrics:
    def test_metrics_returns_valid_data(self, client: TestClient):
        client.get("/health")
        client.get("/")

        resp = client.get("/metrics")
        assert resp.status_code == 200
        data = resp.json()
        assert "total_requests" in data
        assert "total_errors" in data
        assert "error_rate" in data
        assert "average_duration_seconds" in data
        assert data["total_requests"] > 0

    def test_metrics_after_request_increments_count(self, client: TestClient):
        before = client.get("/metrics").json()["total_requests"]
        client.get("/api/v1/jd/list")
        after = client.get("/metrics").json()["total_requests"]
        assert after > before


# ---------------------------------------------------------------------------
# 4. Expert Rubric
# ---------------------------------------------------------------------------


class TestExpertRubric:
    def test_get_rubric_for_expert_does_not_raise(self):
        from src.core.knowledge.rubrics import get_rubric_for_difficulty

        rubric = get_rubric_for_difficulty("expert")
        assert rubric is not None
        assert rubric.difficulty == "expert"
        assert rubric.name == "Expert Rubric"
        assert len(rubric.criteria) == 5
        assert rubric.passing_percentage == 0.65

    def test_expert_rubric_criteria_names(self):
        from src.core.knowledge.rubrics import get_rubric_for_difficulty

        rubric = get_rubric_for_difficulty("expert")
        names = [c.name for c in rubric.criteria]
        assert "advanced_threat_hunting" in names
        assert "strategic_risk_assessment" in names
        assert "architecture_resilience" in names
        assert "incident_command" in names
        assert "mentorship_and_influence" in names

    def test_all_difficulties_return_valid_rubrics(self):
        from src.core.knowledge.rubrics import get_rubric_for_difficulty

        for level in ("beginner", "intermediate", "advanced", "expert"):
            rubric = get_rubric_for_difficulty(level)
            assert rubric.difficulty == level
            assert len(rubric.criteria) >= 4
            assert rubric.total_score_possible == 100
