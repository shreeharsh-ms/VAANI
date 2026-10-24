"""
Frontend API endpoints for WhatsApp operations & Gateway configuration.
"""
from flask import Blueprint, request, jsonify
from ...services.whatsapp_service import WhatsAppGatewayService
from ...services.settings_service import SettingsService
from ...utils.response import api_response, error_response

whatsapp_bp = Blueprint("whatsapp", __name__)

@whatsapp_bp.route("/config", methods=["GET"])
def get_whatsapp_config():
    """Retrieve WhatsApp Gateway settings and status."""
    cfg = WhatsAppGatewayService.get_config()
    return api_response(data=cfg, message="WhatsApp Gateway configuration retrieved")


@whatsapp_bp.route("/config", methods=["POST"])
def update_whatsapp_config():
    """Update WhatsApp Gateway credentials and operational settings."""
    data = request.get_json() or {}
    current_settings = SettingsService.get_settings()
    stored_wa = current_settings.get("whatsapp", {}) if isinstance(current_settings, dict) else {}

    updated_wa = {
        **stored_wa,
        "enabled": data.get("enabled", stored_wa.get("enabled", True)),
        "gatewayUrl": data.get("gatewayUrl", stored_wa.get("gatewayUrl", "https://api.yourdomain.com/api/v1")),
        "apiKey": data.get("apiKey") or stored_wa.get("apiKey"),
        "webhookSecret": data.get("webhookSecret") or stored_wa.get("webhookSecret"),
        "reviewShortlink": data.get("reviewShortlink") or stored_wa.get("reviewShortlink"),
        "autoSendConfirmation": data.get("autoSendConfirmation", stored_wa.get("autoSendConfirmation", True)),
        "autoSendReminder": data.get("autoSendReminder", stored_wa.get("autoSendReminder", True)),
        "autoSendReview": data.get("autoSendReview", stored_wa.get("autoSendReview", True)),
    }

    SettingsService.update_settings({"whatsapp": updated_wa})
    return api_response(data=WhatsAppGatewayService.get_config(), message="WhatsApp settings updated successfully")


@whatsapp_bp.route("/test-connection", methods=["POST"])
def test_connection():
    """Ping external gateway and check API key status."""
    res = WhatsAppGatewayService.test_connection()
    return api_response(data=res, message=res.get("message", "Test completed"))


@whatsapp_bp.route("/send-template", methods=["POST"])
def send_template():
    """Dispatch WhatsApp template message to patient."""
    data = request.get_json() or {}
    to_phone = (data.get("to") or data.get("phone") or "").strip()
    template_name = data.get("templateName") or "vaani_appointment_confirmation"
    parameters = data.get("parameters") or []

    if not to_phone:
        return error_response("Recipient phone number is required", 400)

    res = WhatsAppGatewayService.send_template(
        to_phone=to_phone,
        template_name=template_name,
        parameters=parameters,
        header_media_url=data.get("headerMediaUrl"),
        button_params=data.get("buttonParams"),
    )
    return api_response(data=res, message="WhatsApp message dispatched successfully")


@whatsapp_bp.route("/send-report", methods=["POST"])
def send_diagnostic_report():
    """Dispatch clinical report PDF to patient's WhatsApp."""
    data = request.get_json() or {}
    phone = (data.get("phone") or "").strip()
    patient_name = data.get("patientName") or "Patient"
    test_type = data.get("testType") or "Pure Tone Audiometry (PTA)"
    summary_diagnosis = data.get("summaryDiagnosis") or "Diagnostic Audiogram Assessment Complete"
    pdf_url = data.get("pdfUrl") or "https://frontend-alpha-topaz-35.vercel.app/services/audiogram-sample.pdf"
    uhid = data.get("uhid") or "VN-9021"

    if not phone:
        return error_response("Patient phone number is required", 400)

    res = WhatsAppGatewayService.send_diagnostic_report(
        to_phone=phone,
        patient_name=patient_name,
        test_type=test_type,
        summary_diagnosis=summary_diagnosis,
        pdf_url=pdf_url,
        uhid=uhid,
    )
    return api_response(data=res, message=f"Diagnostic report delivered to {phone}")


@whatsapp_bp.route("/send-review-invite", methods=["POST"])
def send_review_invite():
    """Dispatch automated Google review invitation upon visit completion."""
    data = request.get_json() or {}
    phone = (data.get("phone") or "").strip()
    if not phone:
        return error_response("Patient phone is required", 400)

    res = WhatsAppGatewayService.sync_visit_for_review({
        "phone": phone,
        "patientName": data.get("patientName", "Patient"),
        "invoiceNumber": data.get("invoiceNumber", "VISIT-001"),
        "serviceName": data.get("serviceName", "Consultation"),
        "amount": data.get("amount", 800),
        "uhid": data.get("uhid"),
    })
    return api_response(data=res, message=res.get("message", "Review invitation queued"))


@whatsapp_bp.route("/sync-patient", methods=["POST"])
def sync_patient():
    """Sync patient details to WhatsApp CRM."""
    data = request.get_json() or {}
    res = WhatsAppGatewayService.sync_patient(data)
    return api_response(data=res, message="Patient synchronized with WhatsApp CRM")


@whatsapp_bp.route("/logs", methods=["GET"])
def get_whatsapp_logs():
    """Retrieve recent audit logs for WhatsApp communications."""
    limit = int(request.args.get("limit", 50))
    logs = WhatsAppGatewayService.get_logs(limit=limit)
    return api_response(data=logs, message="WhatsApp logs retrieved")
