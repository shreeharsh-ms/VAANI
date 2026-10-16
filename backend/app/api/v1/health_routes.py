"""Health and system status routes."""
import sys
import time
from datetime import datetime, timezone
from flask import Blueprint, current_app
from ...utils.response import api_response

health_bp = Blueprint("health", __name__)
_start_time = time.time()


@health_bp.route("", methods=["GET"])
def health_check():
    """Health check endpoint providing runtime and system status."""
    uptime_seconds = int(time.time() - _start_time)
    data = {
        "status": "healthy",
        "service": current_app.config.get("PROJECT_NAME", "VAANI"),
        "version": current_app.config.get("VERSION", "1.0.0"),
        "environment": current_app.config.get("ENV", "development"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "uptime_seconds": uptime_seconds,
        "python_version": sys.version.split(" ")[0],
    }
    return api_response(data=data, message="System is operational")
