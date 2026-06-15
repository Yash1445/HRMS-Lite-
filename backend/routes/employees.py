import re
from sqlalchemy.exc import IntegrityError
from flask import Blueprint, jsonify, request

from extensions import db
from models import Employee

employees_bp = Blueprint("employees", __name__, url_prefix="/api/employees")

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def error_response(message, status_code):
    return jsonify({"error": message}), status_code


def normalize_payload(payload):
    return {
        "employee_id": str(payload.get("employee_id", "")).strip(),
        "full_name": str(payload.get("full_name", "")).strip(),
        "email": str(payload.get("email", "")).strip().lower(),
        "department": str(payload.get("department", "")).strip(),
    }


@employees_bp.post("")
def create_employee():
    data = normalize_payload(request.get_json(silent=True) or {})

    if not all(data.values()):
        return error_response("All employee fields are required", 400)
    if not EMAIL_RE.match(data["email"]):
        return error_response("Enter a valid email address", 400)
    if Employee.query.filter_by(employee_id=data["employee_id"]).first():
        return error_response("Employee ID already exists", 409)

    employee = Employee(**data)
    db.session.add(employee)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return error_response("Employee ID already exists", 409)

    return jsonify({"message": "Employee created successfully", "employee": employee.to_dict()}), 201


@employees_bp.get("")
def list_employees():
    employees = Employee.query.order_by(Employee.created_at.desc()).all()
    return jsonify({"employees": [employee.to_dict(include_present_count=True) for employee in employees]}), 200


@employees_bp.delete("/<int:employee_id>")
def delete_employee(employee_id):
    employee = Employee.query.get(employee_id)
    if not employee:
        return error_response("Employee not found", 404)

    db.session.delete(employee)
    db.session.commit()
    return jsonify({"message": "Employee deleted successfully"}), 200
