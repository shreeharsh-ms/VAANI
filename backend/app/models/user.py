"""User model representation for Clinic ERP."""
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from ..utils.security import hash_password, verify_password


class User:
    """Represents a Clinic staff/practitioner user account."""

    ROLES = ("OWNER", "CLINICIAN", "RECEPTIONIST", "EDITOR", "ADMIN")

    def __init__(
        self,
        id: str,
        name: str,
        email: str,
        password_hash: str,
        role: str = "RECEPTIONIST",
        phone: Optional[str] = None,
        is_active: bool = True,
        created_at: Optional[str] = None,
    ):
        self.id = id
        self.name = name
        self.email = email.lower().strip()
        self.password_hash = password_hash
        self.role = role if role in self.ROLES else "RECEPTIONIST"
        self.phone = phone
        self.is_active = is_active
        self.created_at = created_at or datetime.now(timezone.utc).isoformat()

    @classmethod
    def create_new(cls, id: str, name: str, email: str, plain_password: str, role: str = "RECEPTIONIST", phone: Optional[str] = None):
        return cls(
            id=id,
            name=name,
            email=email,
            password_hash=hash_password(plain_password),
            role=role,
            phone=phone,
            is_active=True,
        )

    def check_password(self, password: str) -> bool:
        return verify_password(self.password_hash, password)

    def to_dict(self, include_sensitive: bool = False) -> Dict[str, Any]:
        data = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "phone": self.phone,
            "is_active": self.is_active,
            "created_at": self.created_at,
        }
        if include_sensitive:
            data["password_hash"] = self.password_hash
        return data
