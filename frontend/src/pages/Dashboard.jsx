import { CalendarDays, CheckCircle2, ClipboardList, UsersRound, XCircle } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import { ErrorState, LoadingState } from "../components/StateMessage.jsx";
import useAsync from "../hooks/useAsync.js";
import { dashboardService } from "../services/api.js";

export default function Dashboard() {
  const { data, error, loading, refresh } = useAsync(dashboardService.summary, []);

  return (
    <>
      <PageHeader title="Dashboard" description="Monitor employee headcount and today's attendance status at a glance." />
      {loading && <LoadingState label="Loading dashboard..." />}
      {!loading && error && <ErrorState message={error} onRetry={refresh} />}
      {!loading && !error && data && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Employees" value={data.totalEmployees} icon={UsersRound} />
          <StatCard label="Present Today" value={data.presentToday} icon={CheckCircle2} tone="success" />
          <StatCard label="Absent Today" value={data.absentToday} icon={XCircle} tone="danger" />
          <StatCard label="Attendance Records" value={data.attendanceRecords} icon={ClipboardList} tone="slate" />
        </div>
      )}
      <div className="panel mt-6 overflow-hidden p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-50 p-3 text-primary shadow-sm">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950">Daily HR Operations</h2>
              <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-slate-600">Add employees, record attendance, and filter historical records from the sidebar.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-slate-500 sm:min-w-80">
            <div className="rounded-lg bg-white p-3 shadow-sm">People</div>
            <div className="rounded-lg bg-white p-3 shadow-sm">Presence</div>
            <div className="rounded-lg bg-white p-3 shadow-sm">Records</div>
          </div>
        </div>
      </div>
    </>
  );
}