import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class BaseConfig:
    """Base configuration with default settings."""
    PROJECT_NAME = "VAANI Clinic ERP & Portal"
    VERSION = "1.0.0"
    API_PREFIX = "/api/v1"
    
    SECRET_KEY = os.getenv("SECRET_KEY", "vaani-secure-dev-secret-key-2026")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "vaani-jwt-dev-secret-key-2026")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.getenv("JWT_EXPIRATION_HOURS", 24))
    )
    
    # CORS
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
        ).split(",")
        if origin.strip()
    ]
    
    DATABASE_URI = os.getenv("DATABASE_URI", "mongodb://localhost:27017/vaani_db")
    DEBUG = False
    TESTING = False


class DevelopmentConfig(BaseConfig):
    """Development configuration."""
    DEBUG = True
    ENV = "development"


class TestingConfig(BaseConfig):
    """Testing configuration."""
    DEBUG = True
    TESTING = True
    ENV = "testing"
    DATABASE_URI = "mongodb://localhost:27017/vaani_test_db"


class ProductionConfig(BaseConfig):
    """Production configuration."""
    DEBUG = False
    TESTING = False
    ENV = "production"


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
