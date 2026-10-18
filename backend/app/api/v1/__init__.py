"""API v1 Blueprint Registry."""
from flask import Blueprint

api_v1 = Blueprint("api_v1", __name__)

from .health_routes import health_bp
from .auth_routes import auth_bp
from .patient_routes import patient_bp
from .appointment_routes import appointment_bp
from .service_routes import service_bp
from .clinical_routes import clinical_bp
from .communication_routes import communication_bp
from .settings_routes import settings_bp

api_v1.register_blueprint(health_bp, url_prefix="/health")
api_v1.register_blueprint(auth_bp, url_prefix="/auth")
api_v1.register_blueprint(patient_bp, url_prefix="/patients")
api_v1.register_blueprint(appointment_bp, url_prefix="/appointments")
api_v1.register_blueprint(service_bp, url_prefix="/services")
api_v1.register_blueprint(clinical_bp, url_prefix="/clinical")
api_v1.register_blueprint(communication_bp, url_prefix="/communications")
api_v1.register_blueprint(settings_bp, url_prefix="/settings")
