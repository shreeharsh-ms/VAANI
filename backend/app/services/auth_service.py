"""Authentication service business logic."""
from typing import Optional, Dict, Any, Tuple
from ..models.user import User
from ..utils.security import generate_jwt_token

# Seed users for out-of-the-box development and testing
SEED_USERS = [
    User.create_new(
        id="usr-001",
        name="ASLP Palak Gandhi",
        email="palak@vaaniclinic.com",
        plain_password="password123",
        role="OWNER",
        phone="+91 98765 43210",
    ),
    User.create_new(
        id="usr-002",
        name="Reception Desk",
        email="reception@vaaniclinic.com",
        plain_password="password123",
        role="RECEPTIONIST",
        phone="+91 98765 43211",
    ),
    User.create_new(
        id="usr-003",
        name="Clinical Consultant",
        email="clinician@vaaniclinic.com",
        plain_password="password123",
        role="CLINICIAN",
        phone="+91 98765 43212",
    ),
]

_USERS_DB: Dict[str, User] = {u.email: u for u in SEED_USERS}
_USERS_BY_ID: Dict[str, User] = {u.id: u for u in SEED_USERS}


class AuthService:
    """Handles user authentication, login validation and token issuance."""

    @staticmethod
    def authenticate(email: str, password: str) -> Tuple[bool, Optional[str], Optional[Dict[str, Any]]]:
        user = _USERS_DB.get(email.lower().strip())
        if not user:
            return False, "Invalid email or password", None

        if not user.is_active:
            return False, "Account has been deactivated. Please contact administrator.", None

        if not user.check_password(password):
            return False, "Invalid email or password", None

        user_dict = user.to_dict()
        token = generate_jwt_token(user_dict)
        return True, "Login successful", {"token": token, "user": user_dict}

    @staticmethod
    def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        user = _USERS_BY_ID.get(user_id)
        return user.to_dict() if user else None

    @staticmethod
    def register_user(name: str, email: str, password: str, role: str = "RECEPTIONIST", phone: Optional[str] = None) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        clean_email = email.lower().strip()
        if clean_email in _USERS_DB:
            return False, "User with this email already exists", None

        user_id = f"usr-{len(_USERS_BY_ID) + 1:03d}"
        new_user = User.create_new(
            id=user_id,
            name=name,
            email=clean_email,
            plain_password=password,
            role=role,
            phone=phone,
        )
        _USERS_DB[clean_email] = new_user
        _USERS_BY_ID[user_id] = new_user
        return True, "User registered successfully", new_user.to_dict()
