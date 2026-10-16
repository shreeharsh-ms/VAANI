"""Global application error handlers."""
from flask import Flask
from werkzeug.exceptions import HTTPException
from ..utils.response import error_response


def register_error_handlers(app: Flask):
    """Register standard JSON response error handlers across the Flask app."""

    @app.errorhandler(400)
    def bad_request(error):
        return error_response(str(error.description) if hasattr(error, 'description') else "Bad request", 400)

    @app.errorhandler(401)
    def unauthorized(error):
        return error_response("Unauthorized access", 401)

    @app.errorhandler(403)
    def forbidden(error):
        return error_response("Forbidden: You do not have permission to access this resource", 403)

    @app.errorhandler(404)
    def not_found(error):
        return error_response("Resource not found", 404)

    @app.errorhandler(405)
    def method_not_allowed(error):
        return error_response("HTTP method not allowed on this endpoint", 405)

    @app.errorhandler(500)
    def internal_server_error(error):
        return error_response("Internal server error. Please try again later.", 500)

    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        return error_response(error.description, error.code)

    @app.errorhandler(Exception)
    def handle_unexpected_exception(error):
        app.logger.exception("Unexpected unhandled exception: %s", error)
        return error_response("An unexpected internal error occurred", 500)
