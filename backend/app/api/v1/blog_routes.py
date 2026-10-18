import os
import uuid
from werkzeug.utils import secure_filename
from flask import Blueprint, request, send_from_directory, current_app
from ...services.blog_service import BlogService
from ...utils.response import api_response, error_response

blog_bp = Blueprint("blogs", __name__)

# Local disk storage for blog images (no MongoDB)
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "instance", "uploads", "blogs")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "svg", "gif"}


def _allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@blog_bp.route("/upload-image", methods=["POST"])
def upload_blog_image():
    """Upload an image file directly to local storage on the server."""
    try:
        if "file" not in request.files:
            return error_response("No file attached in form data", 400)
        file = request.files["file"]
        if file.filename == "":
            return error_response("No file selected", 400)
        if not _allowed_file(file.filename):
            return error_response(f"Unsupported format. Allowed: {', '.join(ALLOWED_EXTENSIONS)}", 400)

        os.makedirs(UPLOAD_DIR, exist_ok=True)
        ext = file.filename.rsplit(".", 1)[1].lower()
        base_name = secure_filename(file.filename.rsplit(".", 1)[0])[:30] or "blog_img"
        filename = f"{base_name}_{uuid.uuid4().hex[:8]}.{ext}"
        save_path = os.path.join(UPLOAD_DIR, filename)
        file.save(save_path)

        # Public relative URL
        media_url = f"/api/v1/blogs/media/{filename}"
        return api_response(
            data={"url": media_url, "filename": filename, "size": os.path.getsize(save_path)},
            message="Image uploaded successfully to server storage",
            status_code=201,
        )
    except Exception as e:
        return error_response(f"Image upload failed: {str(e)}", 500)


@blog_bp.route("/media/<path:filename>", methods=["GET"])
def serve_blog_media(filename):
    """Serve uploaded blog media directly from local disk storage."""
    try:
        return send_from_directory(UPLOAD_DIR, filename)
    except Exception as e:
        return error_response(f"Media file not found: {str(e)}", 404)


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
