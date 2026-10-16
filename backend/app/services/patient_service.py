"""Patient management service layer."""
from typing import List, Dict, Any, Optional, Tuple
from ..models.patient import Patient

# Seed patients representing Audiology & Speech Pathology domain
SEED_PATIENTS = [
    Patient(
        id="pat-001",
        uhid="VAA-2026-0001",
        first_name="Aarav",
        last_name="Deshmukh",
        gender="Male",
        date_of_birth="2020-04-12",
        phone="+91 98220 12345",
        email="deshmukh.family@gmail.com",
        address="Sadashiv Peth",
        city="Satara",
        guardian_name="Sachin Deshmukh",
        guardian_relationship="Father",
        primary_concern="Speech delay and articulation difficulty",
        service_line="SPEECH_LANGUAGE",
        medical_history="Normal birth history, milestone delay noted at 24 months",
        status="ACTIVE",
    ),
    Patient(
        id="pat-002",
        uhid="VAA-2026-0002",
        first_name="Sunita",
        last_name="Jadhav",
        gender="Female",
        date_of_birth="1958-11-20",
        phone="+91 98221 54321",
        email="sunitajadhav@yahoo.co.in",
        address="Powai Naka",
        city="Satara",
        guardian_name="Amit Jadhav",
        guardian_relationship="Son",
        primary_concern="Bilateral gradual hearing loss and tinnitus",
        service_line="AUDIOLOGY",
        medical_history="Hypertension under medication; bilateral sensorineural loss suspected",
        status="ACTIVE",
    ),
    Patient(
        id="pat-003",
        uhid="VAA-2026-0003",
        first_name="Vihaan",
        last_name="Kadam",
        gender="Male",
        date_of_birth="2018-08-15",
        phone="+91 94230 99887",
        email="kadam.vihaan@outlook.com",
        address="Karanje Turf",
        city="Satara",
        guardian_name="Pooja Kadam",
        guardian_relationship="Mother",
        primary_concern="Childhood onset fluency disorder (stuttering/stammering)",
        service_line="SPEECH_LANGUAGE",
        medical_history="Noticeable syllable repetitions when anxious or speaking in school",
        status="ACTIVE",
    ),
]

_PATIENTS_DB: Dict[str, Patient] = {p.id: p for p in SEED_PATIENTS}


class PatientService:
    """Handles Patient CRUD, search and UHID generation."""

    @staticmethod
    def get_all(
        search: Optional[str] = None,
        service_line: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        results = list(_PATIENTS_DB.values())

        if search:
            q = search.lower().strip()
            results = [
                p for p in results
                if q in p.full_name.lower() or q in p.uhid.lower() or q in p.phone
            ]

        if service_line:
            results = [p for p in results if p.service_line.upper() == service_line.upper()]

        if status:
            results = [p for p in results if p.status.upper() == status.upper()]

        # Sort newest first
        results.sort(key=lambda p: p.created_at, reverse=True)
        return [p.to_dict() for p in results]

    @staticmethod
    def get_by_id(patient_id: str) -> Optional[Dict[str, Any]]:
        patient = _PATIENTS_DB.get(patient_id)
        return patient.to_dict() if patient else None

    @staticmethod
    def create(data: Dict[str, Any]) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        count = len(_PATIENTS_DB) + 1
        new_id = f"pat-{count:03d}"
        uhid = f"VAA-2026-{count:04d}"

        new_patient = Patient(
            id=new_id,
            uhid=uhid,
            first_name=data.get("first_name", "").strip(),
            last_name=data.get("last_name", "").strip(),
            gender=data.get("gender", "Other"),
            date_of_birth=data.get("date_of_birth", "2000-01-01"),
            phone=data.get("phone", "").strip(),
            email=data.get("email"),
            address=data.get("address"),
            city=data.get("city", "Satara"),
            guardian_name=data.get("guardian_name"),
            guardian_relationship=data.get("guardian_relationship"),
            primary_concern=data.get("primary_concern"),
            service_line=data.get("service_line", "SPEECH_LANGUAGE"),
            medical_history=data.get("medical_history"),
            notes=data.get("notes"),
            status="ACTIVE",
        )
        _PATIENTS_DB[new_id] = new_patient
        return True, "Patient registered successfully", new_patient.to_dict()

    @staticmethod
    def update(patient_id: str, data: Dict[str, Any]) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        patient = _PATIENTS_DB.get(patient_id)
        if not patient:
            return False, "Patient not found", None

        for field in [
            "first_name", "last_name", "gender", "date_of_birth", "phone",
            "email", "address", "city", "guardian_name", "guardian_relationship",
            "primary_concern", "service_line", "medical_history", "notes", "status"
        ]:
            if field in data and data[field] is not None:
                setattr(patient, field, data[field])

        return True, "Patient updated successfully", patient.to_dict()

    @staticmethod
    def delete(patient_id: str) -> Tuple[bool, str]:
        if patient_id in _PATIENTS_DB:
            del _PATIENTS_DB[patient_id]
            return True, "Patient record removed"
        return False, "Patient not found"
