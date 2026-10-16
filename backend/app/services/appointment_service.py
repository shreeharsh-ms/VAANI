"""Appointment scheduling service layer."""
from typing import List, Dict, Any, Optional, Tuple
from datetime import date
from ..models.appointment import Appointment

today_str = date.today().isoformat()

SEED_APPOINTMENTS = [
    Appointment(
        id="apt-001",
        patient_id="pat-001",
        patient_name="Aarav Deshmukh",
        patient_phone="+91 98220 12345",
        service_id="svc-002",
        service_name="Speech Therapy Session",
        clinician_name="Ms. Palak Gandhi",
        appointment_date=today_str,
        appointment_time="10:00",
        duration_minutes=45,
        status="CONFIRMED",
        reason="Weekly articulation therapy routine",
        fee_paise=80000,
        payment_status="PAID",
    ),
    Appointment(
        id="apt-002",
        patient_id="pat-002",
        patient_name="Sunita Jadhav",
        patient_phone="+91 98221 54321",
        service_id="svc-001",
        service_name="Pure Tone Audiometry (PTA)",
        clinician_name="Ms. Palak Gandhi",
        appointment_date=today_str,
        appointment_time="11:30",
        duration_minutes=45,
        status="CONFIRMED",
        reason="Hearing threshold evaluation and bilateral PTA",
        fee_paise=120000,
        payment_status="PENDING",
    ),
    Appointment(
        id="apt-003",
        patient_id="pat-003",
        patient_name="Vihaan Kadam",
        patient_phone="+91 94230 99887",
        service_id="svc-003",
        service_name="Fluency Assessment (SSI-4)",
        clinician_name="Ms. Palak Gandhi",
        appointment_date=today_str,
        appointment_time="15:00",
        duration_minutes=60,
        status="CONFIRMED",
        reason="Baseline fluency and syllable rate measurement",
        fee_paise=150000,
        payment_status="PENDING",
    ),
]

_APPOINTMENTS_DB: Dict[str, Appointment] = {a.id: a for a in SEED_APPOINTMENTS}


class AppointmentService:
    """Handles appointment scheduling, status tracking, and slot availability."""

    @staticmethod
    def get_all(
        appointment_date: Optional[str] = None,
        status: Optional[str] = None,
        patient_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        results = list(_APPOINTMENTS_DB.values())

        if appointment_date:
            results = [a for a in results if a.appointment_date == appointment_date]

        if status:
            results = [a for a in results if a.status.upper() == status.upper()]

        if patient_id:
            results = [a for a in results if a.patient_id == patient_id]

        results.sort(key=lambda a: (a.appointment_date, a.appointment_time))
        return [a.to_dict() for a in results]

    @staticmethod
    def get_by_id(appointment_id: str) -> Optional[Dict[str, Any]]:
        apt = _APPOINTMENTS_DB.get(appointment_id)
        return apt.to_dict() if apt else None

    @staticmethod
    def create(data: Dict[str, Any]) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        count = len(_APPOINTMENTS_DB) + 1
        new_id = f"apt-{count:03d}"

        new_appointment = Appointment(
            id=new_id,
            patient_id=data.get("patient_id", "pat-guest"),
            patient_name=data.get("patient_name", "Guest Patient"),
            patient_phone=data.get("patient_phone", ""),
            service_id=data.get("service_id", "svc-001"),
            service_name=data.get("service_name", "General Consultation"),
            clinician_name=data.get("clinician_name", "Ms. Palak Gandhi"),
            appointment_date=data.get("appointment_date", today_str),
            appointment_time=data.get("appointment_time", "10:00"),
            duration_minutes=int(data.get("duration_minutes", 45)),
            status=data.get("status", "CONFIRMED"),
            reason=data.get("reason"),
            notes=data.get("notes"),
            fee_paise=int(data.get("fee_paise", 80000)),
            payment_status=data.get("payment_status", "PENDING"),
        )
        _APPOINTMENTS_DB[new_id] = new_appointment
        return True, "Appointment scheduled successfully", new_appointment.to_dict()

    @staticmethod
    def update_status(appointment_id: str, new_status: str) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        apt = _APPOINTMENTS_DB.get(appointment_id)
        if not apt:
            return False, "Appointment not found", None

        valid_statuses = ("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW")
        if new_status.upper() not in valid_statuses:
            return False, f"Invalid status. Must be one of {valid_statuses}", None

        apt.status = new_status.upper()
        return True, "Appointment status updated", apt.to_dict()

    @staticmethod
    def get_available_slots(requested_date: str) -> List[str]:
        """Generate open appointment slots between 09:30 and 18:30."""
        all_slots = [
            "09:30", "10:15", "11:00", "11:45",
            "14:00", "14:45", "15:30", "16:15", "17:00", "17:45"
        ]
        booked_times = {
            a.appointment_time
            for a in _APPOINTMENTS_DB.values()
            if a.appointment_date == requested_date and a.status in ("CONFIRMED", "PENDING")
        }
        return [slot for slot in all_slots if slot not in booked_times]
