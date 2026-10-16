"""Tests for authentication endpoints."""

def test_login_successful(client):
    """Test valid login returns token and user object."""
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "palak@vaaniclinic.com", "password": "password123"},
    )
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert "token" in data["data"]
    assert data["data"]["user"]["email"] == "palak@vaaniclinic.com"


def test_login_invalid_password(client):
    """Test invalid password returns 401."""
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "palak@vaaniclinic.com", "password": "wrongpassword"},
    )
    assert res.status_code == 401
    data = res.get_json()
    assert data["success"] is False


def test_get_current_user(client, auth_headers):
    """Test fetching authenticated user profile."""
    res = client.get("/api/v1/auth/me", headers=auth_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["data"]["role"] == "OWNER"
