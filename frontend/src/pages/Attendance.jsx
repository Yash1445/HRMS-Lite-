import { Filter, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import AttendanceForm from "../components/AttendanceForm.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { EmptyState, ErrorState, LoadingState } from "../components/StateMessage.jsx";
import { useToast } from "../components/ToastProvider.jsx";
import useAsync from "../hooks/useAsync.js";
import { attendanceService, employeeService } from "../services/api.js";

export default function Attendance() {
  const [dateFilter, setDateFilter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const loadAttendance = useCallback(() => attendanceService.list(dateFilter), [dateFilter]);
  const { data: attendance = [], error, loading, refresh } = useAsync(loadAttendance, [loadAttendance]);
  const { data: employees = [], loading: employeesLoading, error: employeesError, refresh: refreshEmployees } = useAsync(employeeService.list, []);

  const markAttendance = async (payload) => {
    setSubmitting(true);
    try {
      await attendanceService.create(payload);
      showToast("Attendance marked successfully");
      await refresh();
      return true;
    } catch (err) {
      showToast(err.message, "error");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const resetFilter = () => setDateFilter("");

  return (
    <>
      <PageHeader title="Attendance Management" description="Record daily attendance and filter records by date." />
      <div className="space-y-6">
        {employeesError && <ErrorState message={employeesError} onRetry={refreshEmployees} />}
        {!employeesError && <AttendanceForm employees={employees} onSubmit={markAttendance} submitting={submitting || employeesLoading} />}

        <section className="panel p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Attendance Records</h2>
              <p className="text-sm text-slate-500">Use the date filter to review a specific day.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="form-label min-w-48">
                Filter by Date
                <input className="form-input" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              </label>
              <button className="btn-secondary" onClick={refresh} disabled={loading}>
                <Filter className="h-4 w-4" />
                Apply
              </button>
              <button className="btn-secondary" onClick={resetFilter} disabled={!dateFilter}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </section>

        {loading && <LoadingState label="Loading attendance..." />}
        {!loading && error && <ErrorState message={error} onRetry={refresh} />}
        {!loading && !error && attendance.length === 0 && (
          <EmptyState title="No attendance records" message="Mark attendance to populate this view." />
        )}
        {!loading && !error && attendance.length > 0 && (
          <div className="table-shell">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {attendance.map((record) => {
                    const statusClass = record.status === "Present"
                      ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-success"
                      : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-danger";
                    return (
                      <tr key={record.id}>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-950">{record.employee_name}</div>
                          <div className="text-slate-500">{record.employee_id}</div>
                        </td>
                        <td className="px-4 py-4 text-slate-700">{record.date}</td>
                        <td className="px-4 py-4">
                          <span className={statusClass}>{record.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
