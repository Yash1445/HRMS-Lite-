import { useState } from "react";
import { CalendarPlus } from "lucide-react";

const today = new Date().toISOString().slice(0, 10);

export default function AttendanceForm({ employees, onSubmit, submitting }) {
  const [form, setForm] = useState({ employee_id: "", date: today, status: "Present" });

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    const created = await onSubmit(form);
    if (created) {
      setForm({ employee_id: "", date: today, status: "Present" });
    }
  };

  return (
    <form className="panel p-5" onSubmit={submit}>
      <h2 className="text-lg font-semibold text-slate-950">Mark Attendance</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="form-label">
          Employee
          <select className="form-input" value={form.employee_id} onChange={(e) => updateField("employee_id", e.target.value)} required>
            <option value="">Select employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.employee_id}>
                {employee.full_name} ({employee.employee_id})
              </option>
            ))}
          </select>
        </label>
        <label className="form-label">
          Date
          <input className="form-input" type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} required />
        </label>
        <label className="form-label">
          Status
          <select className="form-input" value={form.status} onChange={(e) => updateField("status", e.target.value)} required>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </label>
      </div>
      <button className="btn-primary mt-5" type="submit" disabled={submitting || employees.length === 0}>
        <CalendarPlus className="h-4 w-4" />
        {submitting ? "Saving..." : "Mark Attendance"}
      </button>
    </form>
  );
}
