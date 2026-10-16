"""Tests for health check endpoints."""

def test_health_check(client):
    """Test health endpoint returns 200 with operational status."""
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    json_data = res.get_json()
    assert json_data["success"] is True
    assert json_data["data"]["status"] == "healthy"
    assert "uptime_seconds" in json_data["data"]
