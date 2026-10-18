"""Clinic Settings API endpoints."""
from flask import Blueprint, request
from ...services.settings_service import SettingsService
from ...utils.response import api_response, error_response

settings_bp = Blueprint("settings", __name__)


@settings_bp.route("", methods=["GET"])
def get_settings():
    """Retrieve current clinic profile, NAP, credentials, and social settings from database."""
    try:
        data = SettingsService.get_settings()
        return api_response(data=data, message="Clinic settings retrieved from database")
    except Exception as e:
        return error_response(f"Failed to retrieve settings: {str(e)}", 500)


@settings_bp.route("", methods=["PUT", "POST"])
def update_settings():
    """Update clinic profile, NAP, RCI number, GSTIN, SAC code, timings, and social channels."""
    try:
        payload = request.get_json() or {}
        updated = SettingsService.save_settings(payload)
        return api_response(data=updated, message="Clinic settings updated and saved to database successfully")
    except Exception as e:
        return error_response(f"Failed to save settings: {str(e)}", 500)
