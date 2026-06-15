from datetime import datetime

from flask import Blueprint, jsonify, request

from extensions import db
from models import Attendance, Employee

attendance_bp = Blueprint("attendance", __name__, url_prefix="/api/attendance")

VALID_STATUSES = {"Present", "Absent"}


def error_response(message, status_code):
    return jsonify({"error": message}), status_code


def parse_date(value):
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except (TypeError, ValueError):
        return None


@attendance_bp.post("")
def mark_attendance():
    payload = request.get_json(silent=True) or {}
    employee_code = str(payload.get("employee_id", "")).strip()
    attendance_date = parse_date(payload.get("date"))
    status = str(payload.get("status", "")).strip()

    if not employee_code:
        return error_response("Employee is required", 400)
    if not attendance_date:
        return error_response("A valid date is required", 400)
    if status not in VALID_STATUSES:
        return error_response("Status must be Present or Absent", 400)

    employee = Employee.query.filter_by(employee_id=employee_code).first()
    if not employee:
        return error_response("Employee not found", 404)

    attendance = Attendance(employee_id=employee.id, date=attendance_date, status=status)
    db.session.add(attendance)
    db.session.commit()

    return jsonify({"message": "Attendance marked successfully", "attendance": attendance.to_dict()}), 201


@attendance_bp.get("")
def list_attendance():
    date_filter = request.args.get("date")
    query = Attendance.query.join(Employee)

    if date_filter:
        selected_date = parse_date(date_filter)
        if not selected_date:
            return error_response("Date filter must use YYYY-MM-DD format", 400)
        query = query.filter(Attendance.date == selected_date)

    records = query.order_by(Attendance.date.desc(), Attendance.id.desc()).all()
    return jsonify({"attendance": [record.to_dict() for record in records]}), 200


@attendance_bp.get("/<employee_id>")
def attendance_for_employee(employee_id):
    employee = Employee.query.filter_by(employee_id=employee_id).first()
    if not employee:
        return error_response("Employee not found", 404)

    records = Attendance.query.filter_by(employee_id=employee.id).order_by(
        Attendance.date.desc(), Attendance.id.desc()
    ).all()
    present_count = Attendance.query.filter_by(employee_id=employee.id, status="Present").count()
    return jsonify(
        {
            "employee": employee.to_dict(),
            "present_count": present_count,
            "attendance": [record.to_dict() for record in records],
        }
    ), 200
