from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy.exc import SQLAlchemyError

from config import Config
from extensions import db
from routes import attendance_bp, dashboard_bp, employees_bp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    app.register_blueprint(employees_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(dashboard_bp)

    @app.get("/")
    def api_index():
        return jsonify(
            {
                "message": "HRMS Lite API is running",
                "health": "/health",
                "endpoints": {
                    "employees": "/api/employees",
                    "attendance": "/api/attendance",
                    "dashboard": "/api/dashboard",
                },
                "frontend": "Run the React app from the frontend folder and open its Vite URL.",
            }
        ), 200

    @app.get("/health")
    def health_check():
        return jsonify({"status": "ok"}), 200

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(SQLAlchemyError)
    def database_error(_error):
        db.session.rollback()
        return jsonify({"error": "Database operation failed"}), 500

    @app.errorhandler(Exception)
    def unexpected_error(_error):
        return jsonify({"error": "Internal server error"}), 500

    with app.app_context():
        db.create_all()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

