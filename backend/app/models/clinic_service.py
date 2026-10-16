"""Clinic service catalogue model."""
from typing import Dict, Any, Optional


class ClinicService:
    """Represents a service offered by the clinic (Audiology, Speech, Voice, CBT)."""

    CATEGORIES = ("AUDIOLOGY", "SPEECH_LANGUAGE", "VOICE", "CBT_PSYCHOLOGY")

    def __init__(
        self,
        id: str,
        name: str,
        category: str,
        description: str,
        duration_minutes: int,
        price_paise: int,
        is_active: bool = True,
        icon: Optional[str] = None,
    ):
        self.id = id
        self.name = name
        self.category = category if category in self.CATEGORIES else "SPEECH_LANGUAGE"
        self.description = description
        self.duration_minutes = duration_minutes
        self.price_paise = price_paise
        self.is_active = is_active
        self.icon = icon

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "duration_minutes": self.duration_minutes,
            "price_paise": self.price_paise,
            "price_inr": self.price_paise / 100,
            "is_active": self.is_active,
            "icon": self.icon,
        }
