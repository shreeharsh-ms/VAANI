"""Clinic Blog & Educational Articles API endpoints."""
from flask import Blueprint, request
from ...services.blog_service import BlogService
from ...utils.response import api_response, error_response

blog_bp = Blueprint("blogs", __name__)


@blog_bp.route("", methods=["GET"])
def get_published_blogs():
    """Retrieve all published clinical articles for the public site."""
    try:
        articles = BlogService.get_all(published_only=True)
        return api_response(data=articles, message=f"Retrieved {len(articles)} published articles")
    except Exception as e:
        return error_response(f"Failed to retrieve blogs: {str(e)}", 500)


@blog_bp.route("/admin/all", methods=["GET"])
def get_admin_blogs():
    """Retrieve all articles including drafts for admin management."""
    try:
        articles = BlogService.get_all(published_only=False)
        return api_response(data=articles, message=f"Retrieved {len(articles)} total articles for admin")
    except Exception as e:
        return error_response(f"Failed to retrieve admin blogs: {str(e)}", 500)


@blog_bp.route("/<path:slug>", methods=["GET"])
def get_blog_by_slug(slug):
    """Retrieve a single article by slug (increments view count)."""
    try:
        # Don't increment view count if request includes admin preview param
        is_preview = request.args.get("preview", "false").lower() == "true"
        article = BlogService.get_by_slug(slug, increment_view=not is_preview)
        if not article:
            return error_response(f"Article '{slug}' not found", 404)
        return api_response(data=article, message="Article retrieved successfully")
    except Exception as e:
        return error_response(f"Failed to retrieve article: {str(e)}", 500)


@blog_bp.route("", methods=["POST"])
def create_blog():
    """Create a new clinical article from Admin CMS."""
    try:
        payload = request.get_json() or {}
        article = BlogService.create(payload)
        return api_response(data=article, message="Clinical article created successfully", status_code=201)
    except ValueError as ve:
        return error_response(str(ve), 400)
    except Exception as e:
        return error_response(f"Failed to create article: {str(e)}", 500)


@blog_bp.route("/<bid>", methods=["PUT", "PATCH"])
def update_blog(bid):
    """Update an existing clinical article."""
    try:
        payload = request.get_json() or {}
        updated = BlogService.update(bid, payload)
        if not updated:
            return error_response(f"Article '{bid}' not found", 404)
        return api_response(data=updated, message="Clinical article updated successfully")
    except Exception as e:
        return error_response(f"Failed to update article: {str(e)}", 500)


@blog_bp.route("/<bid>", methods=["DELETE"])
def delete_blog(bid):
    """Delete a clinical article by ID."""
    try:
        deleted = BlogService.delete(bid)
        if not deleted:
            return error_response(f"Article '{bid}' not found", 404)
        return api_response(data={"deletedId": bid}, message="Article deleted successfully")
    except Exception as e:
        return error_response(f"Failed to delete article: {str(e)}", 500)


@blog_bp.route("/seed", methods=["POST"])
def seed_blogs():
    """Re-seed baseline clinical articles."""
    try:
        articles = BlogService.reset_seed()
        return api_response(data=articles, message="Default clinical articles seeded successfully")
    except Exception as e:
        return error_response(f"Failed to seed articles: {str(e)}", 500)
