from datetime import date

from flask import Blueprint, jsonify

from models import Attendance, Employee


dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.get("")
def dashboard_summary():
    today = date.today()
    return jsonify(
        {
            "totalEmployees": Employee.query.count(),
            "presentToday": Attendance.query.filter_by(date=today, status="Present").count(),
            "absentToday": Attendance.query.filter_by(date=today, status="Absent").count(),
            "attendanceRecords": Attendance.query.count(),
        }
    ), 200
