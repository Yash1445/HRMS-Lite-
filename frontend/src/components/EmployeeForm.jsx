import { useState } from "react";
import { Plus } from "lucide-react";

const initialValues = {
  employee_id: "",
  full_name: "",
  email: "",
  department: "",
};

export default function EmployeeForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialValues);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    const created = await onSubmit(form);
    if (created) {
      setForm(initialValues);
    }
  };

  return (
    <form className="panel p-5" onSubmit={submit}>
      <h2 className="text-lg font-semibold text-slate-950">Add Employee</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="form-label">
          Employee ID
          <input className="form-input" value={form.employee_id} onChange={(e) => updateField("employee_id", e.target.value)} required />
        </label>
        <label className="form-label">
          Full Name
          <input className="form-input" value={form.full_name} onChange={(e) => updateField("full_name", e.target.value)} required />
        </label>
        <label className="form-label">
          Email Address
          <input className="form-input" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
        </label>
        <label className="form-label">
          Department
          <input className="form-input" value={form.department} onChange={(e) => updateField("department", e.target.value)} required />
        </label>
      </div>
      <button className="btn-primary mt-5" type="submit" disabled={submitting}>
        <Plus className="h-4 w-4" />
        {submitting ? "Adding..." : "Add Employee"}
      </button>
    </form>
  );
}
