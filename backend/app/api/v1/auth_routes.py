"""Authentication routes (login, me, logout, register)."""
from flask import Blueprint, request, g
from ...utils.response import api_response, error_response
from ...utils.validators import validate_required_fields, validate_email
from ...services.auth_service import AuthService
from ...middleware.auth_middleware import token_required

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate with email and password to receive JWT bearer token."""
    data = request.get_json() or {}
    is_valid, err = validate_required_fields(data, ["email", "password"])
    if not is_valid:
        return error_response(err, 400)

    email = data.get("email", "")
    password = data.get("password", "")

    if not validate_email(email):
        return error_response("Please provide a valid email address", 400)

    success, message, result = AuthService.authenticate(email, password)
    if not success:
        return error_response(message, 401)

    return api_response(data=result, message=message, status_code=200)


@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user():
    """Retrieve currently authenticated user profile from token claims."""
    user_id = g.current_user.get("sub")
    user = AuthService.get_user_by_id(user_id)
    if not user:
        return error_response("User not found", 404)
    return api_response(data=user, message="User profile retrieved")


@auth_bp.route("/logout", methods=["POST"])
@token_required
def logout():
    """Client-side token disposal endpoint."""
    return api_response(data={}, message="Successfully logged out")


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user account (admin / receptionist)."""
    data = request.get_json() or {}
    is_valid, err = validate_required_fields(data, ["name", "email", "password"])
    if not is_valid:
        return error_response(err, 400)

    if not validate_email(data["email"]):
        return error_response("Invalid email format", 400)

    if len(data["password"]) < 6:
        return error_response("Password must be at least 6 characters", 400)

    success, message, user = AuthService.register_user(
        name=data["name"],
        email=data["email"],
        password=data["password"],
        role=data.get("role", "RECEPTIONIST"),
        phone=data.get("phone"),
    )
    if not success:
        return error_response(message, 400)

    return api_response(data=user, message=message, status_code=201)
