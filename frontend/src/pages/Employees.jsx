import { Trash2 } from "lucide-react";
import { useState } from "react";
import EmployeeForm from "../components/EmployeeForm.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { EmptyState, ErrorState, LoadingState } from "../components/StateMessage.jsx";
import { useToast } from "../components/ToastProvider.jsx";
import useAsync from "../hooks/useAsync.js";
import { employeeService } from "../services/api.js";

export default function Employees() {
  const { data: employees = [], error, loading, refresh } = useAsync(employeeService.list, []);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useToast();

  const createEmployee = async (payload) => {
    setSubmitting(true);
    try {
      await employeeService.create(payload);
      showToast("Employee added successfully");
      await refresh();
      return true;
    } catch (err) {
      showToast(err.message, "error");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEmployee = async (employee) => {
    const confirmed = window.confirm(`Delete ${employee.full_name}? Attendance records for this employee will also be removed.`);
    if (!confirmed) return;

    setDeletingId(employee.id);
    try {
      await employeeService.remove(employee.id);
      showToast("Employee deleted successfully");
      await refresh();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <PageHeader title="Employee Management" description="Create employee profiles, review teams, and monitor present counts." />
      <div className="employee-grid">
        <EmployeeForm onSubmit={createEmployee} submitting={submitting} />
        <section>
          <div className="summary-strip">
            <div className="summary-pill"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Employees</p><p className="mt-1 text-2xl font-black text-slate-950">{employees.length}</p></div>
            <div className="summary-pill"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Departments</p><p className="mt-1 text-2xl font-black text-slate-950">{new Set(employees.map((employee) => employee.department)).size}</p></div>
            <div className="summary-pill"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Present Marks</p><p className="mt-1 text-2xl font-black text-success">{employees.reduce((total, employee) => total + (employee.present_count || 0), 0)}</p></div>
          </div>
          {loading && <LoadingState label="Loading employees..." />}
          {!loading && error && <ErrorState message={error} onRetry={refresh} />}
          {!loading && !error && employees.length === 0 && (
            <EmptyState title="No employees yet" message="Add your first employee to start tracking attendance." />
          )}
          {!loading && !error && employees.length > 0 && (
            <div className="table-shell">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Present Count</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-950">{employee.full_name}</div>
                          <div className="text-slate-500">{employee.employee_id} - {employee.email}</div>
                        </td>
                        <td className="px-4 py-4 text-slate-700">{employee.department}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-success">
                            {employee.present_count || 0} present
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button className="btn-danger" onClick={() => deleteEmployee(employee)} disabled={deletingId === employee.id} aria-label={`Delete ${employee.full_name}`}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
