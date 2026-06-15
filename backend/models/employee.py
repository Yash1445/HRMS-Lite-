from datetime import datetime, timezone

from extensions import db


class Employee(db.Model):
    __tablename__ = "employees"

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(40), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    attendance_records = db.relationship(
        "Attendance",
        back_populates="employee",
        cascade="all, delete-orphan",
        lazy=True,
    )

    def to_dict(self, include_present_count=False):
        payload = {
            "id": self.id,
            "employee_id": self.employee_id,
            "full_name": self.full_name,
            "email": self.email,
            "department": self.department,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_present_count:
            payload["present_count"] = sum(
                1 for record in self.attendance_records if record.status == "Present"
            )
        return payload
