import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, CalendarCheck, Menu, Sparkles, UsersRound, X } from "lucide-react";
import { useState } from "react";
import ThreeBackground from "./ThreeBackground.jsx";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/employees", label: "Employees", icon: UsersRound },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
];

function Navigation({ onNavigate }) {
  return (
    <nav className="mt-8 space-y-2">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `nav-item ${isActive ? "nav-item-active" : "nav-item-idle"}`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="brand-lockup">
      <div className="brand-mark">
        <Sparkles className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xl font-bold text-slate-950">HRMS Lite</div>
        <p className="mt-1 text-sm text-slate-500">People and attendance</p>
      </div>
    </div>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <ThreeBackground />
      <aside className="sidebar-surface fixed inset-y-0 left-0 z-20 hidden w-72 px-5 py-6 lg:block">
        <Brand />
        <Navigation />
        <div className="sidebar-note">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Live workspace</span>
          <p className="mt-2 text-sm leading-6 text-slate-600">Employee records, daily attendance, and operational signals in one calm admin view.</p>
        </div>
      </aside>

      <header className="mobile-header sticky top-0 z-30 flex items-center justify-between px-4 py-4 lg:hidden">
        <Brand />
        <button className="icon-button" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/45" onClick={() => setOpen(false)} aria-label="Close menu backdrop" />
          <aside className="sidebar-surface relative h-full w-80 max-w-[85vw] px-5 py-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <Brand />
              <button className="icon-button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Navigation onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <main className="relative z-10 px-4 py-6 sm:px-6 lg:ml-72 lg:px-9 lg:py-8">
        <div className="mx-auto max-w-[1320px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}