import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


def parse_cors_origins(value):
    if value.strip() == "*":
        return "*"
    return [origin.strip() for origin in value.split(",") if origin.strip()]


def normalize_database_url(value):
    if value.startswith("postgres://"):
        value = value.replace("postgres://", "postgresql://", 1)
    if value.startswith("postgresql://"):
        value = value.replace("postgresql://", "postgresql+psycopg://", 1)
    return value


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
    SQLALCHEMY_DATABASE_URI = normalize_database_url(
        os.getenv(
            "DATABASE_URL",
            f"sqlite:///{BASE_DIR / 'instance' / 'hrms_lite.db'}",
        )
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False
    CORS_ORIGINS = parse_cors_origins(os.getenv("CORS_ORIGINS", "*"))
