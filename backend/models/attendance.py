from extensions import db


class Attendance(db.Model):
    __tablename__ = "attendance"

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey("employees.id"), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False, index=True)
    status = db.Column(db.String(10), nullable=False)

    employee = db.relationship("Employee", back_populates="attendance_records")

    __table_args__ = (
        db.CheckConstraint("status IN ('Present', 'Absent')", name="check_attendance_status"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "employee_id": self.employee.employee_id,
            "employee_db_id": self.employee_id,
            "employee_name": self.employee.full_name,
            "date": self.date.isoformat() if self.date else None,
            "status": self.status,
        }
