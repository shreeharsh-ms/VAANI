"""Patient management routes."""
from flask import Blueprint, request
from ...utils.response import api_response, error_response
from ...utils.validators import validate_required_fields, validate_phone
from ...services.patient_service import PatientService
from ...middleware.auth_middleware import token_required

patient_bp = Blueprint("patients", __name__)


@patient_bp.route("", methods=["GET"])
@token_required
def list_patients():
    """Retrieve filtered/searched list of patients."""
    search = request.args.get("search")
    service_line = request.args.get("service_line")
    status = request.args.get("status")

    patients = PatientService.get_all(search=search, service_line=service_line, status=status)
    return api_response(data=patients, message=f"Retrieved {len(patients)} patients")


@patient_bp.route("/<patient_id>", methods=["GET"])
@token_required
def get_patient(patient_id: str):
    """Retrieve detailed profile of a single patient."""
    patient = PatientService.get_by_id(patient_id)
    if not patient:
        return error_response("Patient not found", 404)
    return api_response(data=patient, message="Patient details retrieved")


@patient_bp.route("", methods=["POST"])
@token_required
def create_patient():
    """Register a new patient record with auto-generated UHID."""
    data = request.get_json() or {}
    is_valid, err = validate_required_fields(data, ["first_name", "last_name", "phone", "gender", "date_of_birth"])
    if not is_valid:
        return error_response(err, 400)

    if not validate_phone(data["phone"]):
        return error_response("Please provide a valid phone number", 400)

    success, message, new_patient = PatientService.create(data)
    if not success:
        return error_response(message, 400)

    return api_response(data=new_patient, message=message, status_code=201)


@patient_bp.route("/<patient_id>", methods=["PUT", "PATCH"])
@token_required
def update_patient(patient_id: str):
    """Update patient details."""
    data = request.get_json() or {}
    success, message, updated = PatientService.update(patient_id, data)
    if not success:
        return error_response(message, 404)

    return api_response(data=updated, message=message)


@patient_bp.route("/<patient_id>", methods=["DELETE"])
@token_required
def delete_patient(patient_id: str):
    """Remove a patient record."""
    success, message = PatientService.delete(patient_id)
    if not success:
        return error_response(message, 404)

    return api_response(data={"id": patient_id}, message=message)
