"""Appointment model representation."""
from datetime import datetime, timezone
from typing import Dict, Any, Optional


class Appointment:
    """Represents a scheduled therapy, assessment or follow-up session."""

    STATUSES = ("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW")

    def __init__(
        self,
        id: str,
        patient_id: str,
        patient_name: str,
        patient_phone: str,
        service_id: str,
        service_name: str,
        clinician_name: str,
        appointment_date: str,  # YYYY-MM-DD
        appointment_time: str,  # HH:MM format e.g. "10:30"
        duration_minutes: int = 45,
        status: str = "CONFIRMED",
        reason: Optional[str] = None,
        notes: Optional[str] = None,
        fee_paise: int = 80000,  # 800 INR stored as paise
        payment_status: str = "PENDING",  # PENDING, PAID, PARTIAL
        created_at: Optional[str] = None,
    ):
        self.id = id
        self.patient_id = patient_id
        self.patient_name = patient_name
        self.patient_phone = patient_phone
        self.service_id = service_id
        self.service_name = service_name
        self.clinician_name = clinician_name
        self.appointment_date = appointment_date
        self.appointment_time = appointment_time
        self.duration_minutes = duration_minutes
        self.status = status if status in self.STATUSES else "PENDING"
        self.reason = reason
        self.notes = notes
        self.fee_paise = fee_paise
        self.payment_status = payment_status
        self.created_at = created_at or datetime.now(timezone.utc).isoformat()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "patient_name": self.patient_name,
            "patient_phone": self.patient_phone,
            "service_id": self.service_id,
            "service_name": self.service_name,
            "clinician_name": self.clinician_name,
            "appointment_date": self.appointment_date,
            "appointment_time": self.appointment_time,
            "duration_minutes": self.duration_minutes,
            "status": self.status,
            "reason": self.reason,
            "notes": self.notes,
            "fee_paise": self.fee_paise,
            "fee_inr": self.fee_paise / 100,
            "payment_status": self.payment_status,
            "created_at": self.created_at,
        }
