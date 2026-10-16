"""Clinical assessments and report endpoints."""
from flask import Blueprint, request
from ...utils.response import api_response
from ...middleware.auth_middleware import token_required

clinical_bp = Blueprint("clinical", __name__)

SAMPLE_ASSESSMENTS = [
    {
        "id": "asmt-001",
        "patient_id": "pat-001",
        "patient_name": "Aarav Deshmukh",
        "type": "SPEECH_LANGUAGE",
        "title": "Comprehensive Speech-Language Evaluation",
        "date": "2026-10-10",
        "examiner": "Ms. Palak Gandhi, MASLP",
        "diagnosis": "Expressive Language Delay with Articulation Disorder",
        "receptive_language_age": "3.5 years",
        "expressive_language_age": "2.8 years",
        "recommendations": "Twice weekly speech-language therapy, home stimulation program",
    },
    {
        "id": "asmt-002",
        "patient_id": "pat-002",
        "patient_name": "Sunita Jadhav",
        "type": "AUDIOLOGY",
        "title": "Pure Tone & Speech Audiological Evaluation",
        "date": "2026-10-12",
        "examiner": "Ms. Palak Gandhi, MASLP",
        "diagnosis": "Moderate Sensorineural Hearing Loss (Bilateral, Sloping)",
        "pta_right_ear": "46 dB HL",
        "pta_left_ear": "48 dB HL",
        "srt_right": "45 dB",
        "srt_left": "50 dB",
        "recommendations": "Bilateral digital hearing aid fitting with wide dynamic range compression",
    },
]


@clinical_bp.route("/assessments", methods=["GET"])
@token_required
def list_assessments():
    """Retrieve list of clinical assessments."""
    patient_id = request.args.get("patient_id")
    results = SAMPLE_ASSESSMENTS
    if patient_id:
        results = [a for a in results if a["patient_id"] == patient_id]
    return api_response(data=results, message=f"Retrieved {len(results)} clinical records")
