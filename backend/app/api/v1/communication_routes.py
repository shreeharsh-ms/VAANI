"""Communication and Email dispatch endpoints."""
from flask import Blueprint, request
from ...services.email_service import EmailService
from ...utils.response import api_response, error_response

communication_bp = Blueprint("communications", __name__)


@communication_bp.route("/test-smtp", methods=["POST"])
def test_smtp():
    """Verify SMTP credentials and dispatch real test verification email."""
    data = request.get_json() or {}
    smtp_config = data.get("smtpConfig", {})
    test_recipient = data.get("testEmail", "")

    if not test_recipient:
        return error_response("Test recipient email is required", 400)
    if not smtp_config.get("host") or not smtp_config.get("password"):
        return error_response("SMTP configuration (host, password, sender) is required", 400)

    res = EmailService.test_connection(smtp_config, test_recipient)
    if res.get("success"):
        return api_response(data=res, message=res.get("message", "SMTP test dispatched successfully"))
    return error_response(
        message=res.get("error", "SMTP test dispatch failed"),
        status_code=400,
        errors=res
    )


@communication_bp.route("/send-email", methods=["POST"])
def send_email():
    """Dispatch real clinical document (invoice, report, proforma) via SMTP."""
    data = request.get_json() or {}
    smtp_config = data.get("smtpConfig", {})
    to_email = data.get("toEmail", "")
    subject = data.get("subject", "")
    body_text = data.get("body", "")

    if not to_email:
        return error_response("Recipient email is required", 400)
    if not subject:
        return error_response("Subject is required", 400)
    if not smtp_config.get("host") or not smtp_config.get("password"):
        return error_response("SMTP credentials are missing. Please configure SMTP in Settings.", 400)

    res = EmailService.send_clinical_email(
        smtp_config=smtp_config,
        to_email=to_email,
        subject=subject,
        body_text=body_text,
        document_title=data.get("documentTitle"),
        attached_file_name=data.get("attachedFile"),
        patient_name=data.get("patientName"),
        uhid=data.get("uhid"),
        report_data=data.get("reportData"),
    )
    if res.get("success"):
        return api_response(data=res, message=res.get("message", "Email sent successfully"))
    return error_response(
        message=res.get("error", "Failed to dispatch email"),
        status_code=400,
        errors=res
    )
