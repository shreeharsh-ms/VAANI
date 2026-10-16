"""Appointment management routes."""
from flask import Blueprint, request
from ...utils.response import api_response, error_response
from ...utils.validators import validate_required_fields
from ...services.appointment_service import AppointmentService
from ...middleware.auth_middleware import token_required

appointment_bp = Blueprint("appointments", __name__)


@appointment_bp.route("", methods=["GET"])
def list_appointments():
    """Retrieve appointments with optional date, patient and status filters."""
    date_filter = request.args.get("date")
    status = request.args.get("status")
    patient_id = request.args.get("patient_id")

    appointments = AppointmentService.get_all(
        appointment_date=date_filter, status=status, patient_id=patient_id
    )
    return api_response(
        data=appointments, message=f"Retrieved {len(appointments)} appointments"
    )


@appointment_bp.route("/<appointment_id>", methods=["GET"])
def get_appointment(appointment_id: str):
    """Retrieve details of a specific appointment."""
    apt = AppointmentService.get_by_id(appointment_id)
    if not apt:
        return error_response("Appointment not found", 404)
    return api_response(data=apt, message="Appointment details retrieved")


@appointment_bp.route("", methods=["POST"])
def book_appointment():
    """Create a new appointment booking (can be called publicly by visitors or internally by staff)."""
    data = request.get_json() or {}
    is_valid, err = validate_required_fields(
        data, ["patient_name", "patient_phone", "service_name", "appointment_date", "appointment_time"]
    )
    if not is_valid:
        return error_response(err, 400)

    success, message, new_apt = AppointmentService.create(data)
    if not success:
        return error_response(message, 400)

    return api_response(data=new_apt, message=message, status_code=201)


@appointment_bp.route("/<appointment_id>/status", methods=["PATCH"])
@token_required
def update_status(appointment_id: str):
    """Update appointment status (CONFIRMED, COMPLETED, CANCELLED, NO_SHOW)."""
    data = request.get_json() or {}
    new_status = data.get("status")
    if not new_status:
        return error_response("Status field is required", 400)

    success, message, updated = AppointmentService.update_status(appointment_id, new_status)
    if not success:
        return error_response(message, 400)

    return api_response(data=updated, message=message)


@appointment_bp.route("/slots", methods=["GET"])
def available_slots():
    """Retrieve open time slots for a given date."""
    target_date = request.args.get("date")
    if not target_date:
        return error_response("Query param 'date' (YYYY-MM-DD) is required", 400)

    slots = AppointmentService.get_available_slots(target_date)
    return api_response(data={"date": target_date, "available_slots": slots}, message="Slots retrieved")
