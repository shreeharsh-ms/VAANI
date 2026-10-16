"""Pytest fixtures configuration."""
import pytest
from app import create_app


@pytest.fixture
def app():
    """Create application configured for testing."""
    app = create_app("testing")
    yield app


@pytest.fixture
def client(app):
    """Test HTTP client."""
    return app.test_client()


@pytest.fixture
def auth_headers(client):
    """Generate authorization header with valid bearer token for tests."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "palak@vaaniclinic.com", "password": "password123"},
    )
    data = response.get_json()
    token = data["data"]["token"]
    return {"Authorization": f"Bearer {token}"}
