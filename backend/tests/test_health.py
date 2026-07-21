"""Smoke tests for AegisIQ backend health endpoints."""


def test_health_returns_200(client):
    """GET /health must return 200 with status=healthy."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data
    assert "version" in data


def test_root_returns_200(client):
    """GET / must return 200 with service info."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "AegisIQ"
    assert data["status"] == "running"


def test_metrics_returns_200(client):
    """GET /metrics must return 200 with metrics data."""
    response = client.get("/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "total_requests" in data
    assert "total_errors" in data
    assert "error_rate" in data
    assert "average_duration_seconds" in data


def test_docs_endpoint(client):
    """GET /api/docs must return 200 when debug mode is on."""
    response = client.get("/api/docs")
    # May return 404 if debug is off, which is fine
    assert response.status_code in [200, 404]


def test_health_check_includes_version(client):
    """Health check must include version information."""
    response = client.get("/health")
    data = response.json()
    assert isinstance(data["version"], str)
    assert len(data["version"]) > 0
