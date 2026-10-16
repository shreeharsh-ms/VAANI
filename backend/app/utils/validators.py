"""Input validation helper functions."""
import re
from typing import Dict, List, Optional, Tuple, Any

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
PHONE_REGEX = re.compile(r"^[+]?[0-9]{10,14}$")


def validate_email(email: str) -> bool:
    """Validate email format."""
    if not email or not isinstance(email, str):
        return False
    return bool(EMAIL_REGEX.match(email.strip()))


def validate_phone(phone: str) -> bool:
    """Validate 10-14 digit telephone number (supporting Indian mobile format)."""
    if not phone or not isinstance(phone, str):
        return False
    clean = phone.replace(" ", "").replace("-", "")
    return bool(PHONE_REGEX.match(clean))


def validate_required_fields(
    data: Dict[str, Any], required_fields: List[str]
) -> Tuple[bool, Optional[str]]:
    """Verify presence of required fields in incoming request body."""
    if not isinstance(data, dict):
        return False, "Payload must be a JSON object"
    for field in required_fields:
        if field not in data or data[field] is None or data[field] == "":
            return False, f"Field '{field}' is required"
    return True, None
