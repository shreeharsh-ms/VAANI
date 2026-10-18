"""Communication and Email dispatch endpoints."""
from flask import Blueprint, request
from ...services.email_service import EmailService
from ...services.settings_service import SettingsService
from ...utils.response import api_response, error_response

communication_bp = Blueprint("communications", __name__)


def _resolve_smtp_config(passed_config: dict) -> dict:
    """Resolve effective SMTP credentials, falling back to database settings if missing."""
    stored_settings = SettingsService.get_settings() or {}
    stored_smtp = stored_settings.get("smtp", {}) if isinstance(stored_settings, dict) else {}

    # Merge: passed_config values take precedence if non-empty
    effective = dict(stored_smtp)
    for k, v in (passed_config or {}).items():
        if v is not None and str(v).strip() != "":
            effective[k] = v
    return effective


@communication_bp.route("/test-smtp", methods=["POST"])
def test_smtp():
    """Verify SMTP credentials and dispatch real test verification email."""
    data = request.get_json() or {}
    smtp_config = _resolve_smtp_config(data.get("smtpConfig", {}))
    test_recipient = (data.get("testEmail") or "").strip()

    if not test_recipient:
        return error_response("Test recipient email is required", 400)
    if not smtp_config.get("host"):
        return error_response("SMTP host is not configured. Please enter SMTP host in Settings.", 400)
    if not smtp_config.get("password"):
        return error_response(
            "SMTP password is required. For Gmail, enter your 16-character Google App Password in Settings > Email & SMTP.",
            400,
        )

    res = EmailService.test_connection(smtp_config, test_recipient)
    if res.get("success"):
        return api_response(data=res, message=res.get("message", "SMTP test dispatched successfully"))
    return error_response(
        message=res.get("error", "SMTP test dispatch failed"),
        status_code=400,
        errors=res,
    )


@communication_bp.route("/send-email", methods=["POST"])
def send_email():
    """Dispatch real clinical document (invoice, report, proforma) via SMTP."""
    data = request.get_json() or {}
    smtp_config = _resolve_smtp_config(data.get("smtpConfig", {}))
    to_email = (data.get("toEmail") or "").strip()
    subject = (data.get("subject") or "").strip()
    body_text = data.get("body", "")

    if not to_email:
        return error_response("Recipient email is required", 400)
    if not subject:
        return error_response("Subject is required", 400)
    if not smtp_config.get("host"):
        return error_response("SMTP host is missing. Please configure SMTP in Settings.", 400)
    if not smtp_config.get("password"):
        return error_response(
            "SMTP password / App Password is missing. Please enter your 16-character Google App Password in Settings > Email & SMTP Gateway.",
            400,
        )

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
        errors=res,
    )
