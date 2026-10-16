"""Patient model representation (Audiology & Speech-Language Pathology)."""
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List


class Patient:
    """Represents a clinic patient with UHID, contact, and clinical metadata."""

    def __init__(
        self,
        id: str,
        uhid: str,
        first_name: str,
        last_name: str,
        gender: str,
        date_of_birth: str,
        phone: str,
        email: Optional[str] = None,
        address: Optional[str] = None,
        city: str = "Satara",
        guardian_name: Optional[str] = None,
        guardian_relationship: Optional[str] = None,
        primary_concern: Optional[str] = None,
        service_line: str = "SPEECH_LANGUAGE",  # SPEECH_LANGUAGE, AUDIOLOGY, CBT
        medical_history: Optional[str] = None,
        notes: Optional[str] = None,
        status: str = "ACTIVE",
        created_at: Optional[str] = None,
    ):
        self.id = id
        self.uhid = uhid
        self.first_name = first_name
        self.last_name = last_name
        self.gender = gender
        self.date_of_birth = date_of_birth
        self.phone = phone
        self.email = email
        self.address = address
        self.city = city
        self.guardian_name = guardian_name
        self.guardian_relationship = guardian_relationship
        self.primary_concern = primary_concern
        self.service_line = service_line
        self.medical_history = medical_history
        self.notes = notes
        self.status = status
        self.created_at = created_at or datetime.now(timezone.utc).isoformat()

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "uhid": self.uhid,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "full_name": self.full_name,
            "gender": self.gender,
            "date_of_birth": self.date_of_birth,
            "phone": self.phone,
            "email": self.email,
            "address": self.address,
            "city": self.city,
            "guardian_name": self.guardian_name,
            "guardian_relationship": self.guardian_relationship,
            "primary_concern": self.primary_concern,
            "service_line": self.service_line,
            "medical_history": self.medical_history,
            "notes": self.notes,
            "status": self.status,
            "created_at": self.created_at,
        }
