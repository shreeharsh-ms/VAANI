"""Security utilities: password hashing and JWT token operations."""
import hashlib
import os
import hmac
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
import jwt
from flask import current_app


def hash_password(password: str) -> str:
    """Hash a password securely using PBKDF2 with SHA-256 and a random salt."""
    salt = os.urandom(16).hex()
    iterations = 100_000
    key = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), bytes.fromhex(salt), iterations
    )
    return f"{salt}${iterations}${key.hex()}"


def verify_password(stored_password: str, provided_password: str) -> bool:
    """Verify a plain-text password against a PBKDF2 hash."""
    try:
        parts = stored_password.split("$")
        if len(parts) != 3:
            return False
        salt, iterations_str, key_hex = parts
        iterations = int(iterations_str)
        test_key = hashlib.pbkdf2_hmac(
            "sha256", provided_password.encode("utf-8"), bytes.fromhex(salt), iterations
        )
        return hmac.compare_digest(test_key.hex(), key_hex)
    except Exception:
        return False


def generate_jwt_token(user_data: Dict[str, Any], expires_in: Optional[timedelta] = None) -> str:
    """Generate a JWT bearer token for authenticated sessions."""
    secret = current_app.config.get("JWT_SECRET_KEY", "fallback-secret-key")
    if expires_in is None:
        expires_in = current_app.config.get(
            "JWT_ACCESS_TOKEN_EXPIRES", timedelta(hours=24)
        )

    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_data.get("id"),
        "email": user_data.get("email"),
        "role": user_data.get("role", "RECEPTIONIST"),
        "name": user_data.get("name"),
        "iat": now,
        "exp": now + expires_in,
    }
    return jwt.encode(payload, secret, algorithm="HS256")


def decode_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a JWT bearer token."""
    secret = current_app.config.get("JWT_SECRET_KEY", "fallback-secret-key")
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
