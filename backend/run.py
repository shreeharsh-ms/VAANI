"""Development server entry point."""
import os
from dotenv import load_dotenv
from app import create_app

load_dotenv()

app = create_app(os.getenv("FLASK_ENV", "development"))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    debug = os.getenv("FLASK_ENV", "development") == "development"
    print(f"\n🚀 Starting VAANI Flask Backend on http://127.0.0.1:{port}")
    print(f"📡 API Base URL: http://127.0.0.1:{port}/api/v1")
    print(f"🏥 Health Check: http://127.0.0.1:{port}/api/v1/health\n")
    app.run(host="0.0.0.0", port=port, debug=debug)
