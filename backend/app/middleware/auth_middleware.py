"""Authentication and Authorization Decorators."""
from functools import wraps
from flask import request, g
from ..utils.response import error_response
from ..utils.security import decode_jwt_token


def token_required(f):
    """Decorator to enforce valid JWT bearer token on protected routes."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return error_response("Authorization token is missing", 401)

        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return error_response(
                "Invalid Authorization format. Expected 'Bearer <token>'", 401
            )

        token = parts[1]
        payload = decode_jwt_token(token)
        if not payload:
            return error_response("Token has expired or is invalid", 401)

        # Store authenticated user info in Flask g
        g.current_user = payload
        return f(*args, **kwargs)

    return decorated


def roles_required(*allowed_roles: str):
    """Decorator to enforce role-based access control (RBAC)."""
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated_function(*args, **kwargs):
            user_role = g.current_user.get("role")
            if user_role not in allowed_roles and "OWNER" not in user_role:
                return error_response(
                    f"Access forbidden: requires one of {allowed_roles}", 403
                )
            return f(*args, **kwargs)

        return decorated_function

    return decorator
