"""Tests for patient endpoints."""

def test_list_patients_authorized(client, auth_headers):
    """Test authenticated retrieval of patient list."""
    res = client.get("/api/v1/patients", headers=auth_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
    assert len(data["data"]) >= 3


def test_list_patients_unauthorized(client):
    """Test unauthenticated request is rejected with 401."""
    res = client.get("/api/v1/patients")
    assert res.status_code == 401


def test_create_patient(client, auth_headers):
    """Test creating a new patient record."""
    new_patient_data = {
        "first_name": "Rohan",
        "last_name": "Patil",
        "gender": "Male",
        "date_of_birth": "2015-06-25",
        "phone": "+91 98888 77777",
        "service_line": "AUDIOLOGY",
        "city": "Satara",
        "primary_concern": "Hearing screening before school admission",
    }
    res = client.post("/api/v1/patients", headers=auth_headers, json=new_patient_data)
    assert res.status_code == 201
    data = res.get_json()
    assert data["success"] is True
    assert data["data"]["first_name"] == "Rohan"
    assert data["data"]["uhid"].startswith("VAA-2026-")
