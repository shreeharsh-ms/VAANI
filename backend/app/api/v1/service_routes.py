"""Clinic service catalogue endpoints."""
from flask import Blueprint, request
from ...utils.response import api_response, error_response
from ...models.clinic_service import ClinicService

service_bp = Blueprint("services", __name__)

CLINIC_SERVICES = [
    ClinicService(
        id="svc-001",
        name="Pure Tone Audiometry (PTA)",
        category="AUDIOLOGY",
        description="Comprehensive bilateral hearing threshold evaluation with air & bone conduction testing across 250Hz - 8000Hz.",
        duration_minutes=45,
        price_paise=120000,
        icon="Headphones",
    ),
    ClinicService(
        id="svc-002",
        name="Speech & Language Therapy Session",
        category="SPEECH_LANGUAGE",
        description="Personalized 1-on-1 therapeutic intervention for articulation, phonology, language delay, and developmental communication.",
        duration_minutes=45,
        price_paise=80000,
        icon="MessageSquare",
    ),
    ClinicService(
        id="svc-003",
        name="Stuttering & Fluency Evaluation",
        category="SPEECH_LANGUAGE",
        description="Standardized SSI-4 assessment, percentage of syllables stuttered (%SS), secondary behaviors and personalized fluency shaping program.",
        duration_minutes=60,
        price_paise=150000,
        icon="Mic",
    ),
    ClinicService(
        id="svc-004",
        name="Otoacoustic Emissions (OAE) Screening",
        category="AUDIOLOGY",
        description="Objective cochlear hair cell evaluation (TEOAE / DPOAE) recommended for neonates, infants, and ototoxic monitoring.",
        duration_minutes=30,
        price_paise=90000,
        icon="Activity",
    ),
    ClinicService(
        id="svc-005",
        name="Voice Assessment & Vocal Hygiene (GRBAS)",
        category="VOICE",
        description="Perceptual voice evaluation using GRBAS, maximum phonation time (MPT), and therapeutic vocal cord rehabilitation.",
        duration_minutes=45,
        price_paise=100000,
        icon="Volume2",
    ),
    ClinicService(
        id="svc-006",
        name="Hearing Aid Evaluation & Digital Trial",
        category="AUDIOLOGY",
        description="Digital hearing aid selection, real-ear verification, fine-tuning, and patient counseling for RIC, BTE, and CIC devices.",
        duration_minutes=60,
        price_paise=150000,
        icon="Ear",
    ),
]


@service_bp.route("", methods=["GET"])
def list_services():
    """Retrieve full service catalogue with optional category filter."""
    category = request.args.get("category")
    services = CLINIC_SERVICES
    if category:
        services = [s for s in services if s.category.upper() == category.upper()]
    return api_response(
        data=[s.to_dict() for s in services],
        message=f"Retrieved {len(services)} services",
    )


@service_bp.route("/<service_id>", methods=["GET"])
def get_service(service_id: str):
    """Retrieve single service detail."""
    for s in CLINIC_SERVICES:
        if s.id == service_id:
            return api_response(data=s.to_dict(), message="Service retrieved")
    return error_response("Service not found", 404)
