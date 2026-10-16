"""Standardized API response helper functions."""
from typing import Any, Dict, List, Optional, Union
from flask import jsonify, Response


def api_response(
    data: Optional[Union[Dict, List, Any]] = None,
    message: str = "Success",
    status_code: int = 200,
    meta: Optional[Dict] = None,
) -> tuple[Response, int]:
    """Return a consistent JSON API response format."""
    payload = {
        "success": 200 <= status_code < 300,
        "message": message,
        "data": data if data is not None else {},
    }
    if meta is not None:
        payload["meta"] = meta

    return jsonify(payload), status_code


def error_response(
    message: str = "An error occurred",
    status_code: int = 400,
    errors: Optional[Union[List, Dict]] = None,
) -> tuple[Response, int]:
    """Return a consistent error JSON API response."""
    payload = {
        "success": False,
        "message": message,
        "data": None,
    }
    if errors is not None:
        payload["errors"] = errors

    return jsonify(payload), status_code


def paginated_response(
    items: List[Any],
    total: int,
    page: int,
    page_size: int,
    message: str = "Success",
    status_code: int = 200,
) -> tuple[Response, int]:
    """Return standard paginated response envelope."""
    total_pages = (total + page_size - 1) // page_size if page_size > 0 else 1
    meta = {
        "page": page,
        "page_size": page_size,
        "total_items": total,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1,
    }
    return api_response(data=items, message=message, status_code=status_code, meta=meta)
