export default function StatCard({ label, value, icon: Icon, tone = "primary" }) {
  const toneClass = {
    primary: "bg-blue-50 text-primary",
    success: "bg-green-50 text-success",
    danger: "bg-red-50 text-danger",
    slate: "bg-amber-50 text-amber-600",
  }[tone];

  return (
    <div className="panel stat-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{value}</p>
        </div>
        <div className={`rounded-lg p-3 shadow-sm ${toneClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}