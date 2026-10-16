"""Application Factory module for Flask."""
import os
from flask import Flask
from .config import config_by_name
from .extensions import cors
from .middleware.error_middleware import register_error_handlers


def create_app(config_name: str = None) -> Flask:
    """Create and configure an instance of the Flask application."""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    app = Flask(__name__)
    config_class = config_by_name.get(config_name, config_by_name["default"])
    app.config.from_object(config_class)

    # Initialize extensions
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}},
        supports_credentials=True,
    )

    # Register central error handlers
    register_error_handlers(app)

    # Register API blueprints
    from .api.v1 import api_v1
    app.register_blueprint(api_v1, url_prefix=app.config.get("API_PREFIX", "/api/v1"))

    # Root index route
    @app.route("/", methods=["GET"])
    def index():
        return {
            "name": app.config.get("PROJECT_NAME", "VAANI"),
            "version": app.config.get("VERSION", "1.0.0"),
            "status": "online",
            "documentation": f"{app.config.get('API_PREFIX', '/api/v1')}/health",
        }

    return app
