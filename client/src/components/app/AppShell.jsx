import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Sparkles, Users, Brain, Target, Wand2, Flame, Radar } from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/campaign", label: "Campaign", icon: Target },
  { to: "/marketplace", label: "Marketplace", icon: Users },
  { to: "/intelligence", label: "Intelligence", icon: Brain },
  { to: "/predictor", label: "Success Predictor", icon: Radar },
  { to: "/content", label: "Content Studio", icon: Wand2 },
  { to: "/virality", label: "Virality", icon: Flame },
];

export function AppShell({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-2 p-5 border-r border-border/60 glass-strong sticky top-0 h-screen" style={{ borderColor: "var(--border)" }}>
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="size-9 rounded-xl btn-hero grid place-items-center" style={{ width: 36, height: 36, display: "grid", placeItems: "center" }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div className="font-display text-lg leading-none">Ratefluencer<span className="text-gradient">.ai</span></div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Influencer Intelligence</div>
          </div>
        </Link>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                  active
                    ? "text-foreground ring-1"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={active ? { background: "oklch(0.72 0.19 295 / 15%)", boxShadow: "0 0 0 1px oklch(0.72 0.19 295 / 30%)" } : {}}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "oklch(1 0 0 / 5%)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = ""; }}
              >
                <Icon size={16} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-xl glass p-4 text-xs text-muted-foreground">
          <div className="text-gradient font-semibold mb-1">Ratefluencer X-Ray™</div>
          Every score is explainable. Every creator audited.
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 glass-strong border-b px-4 py-3 flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="btn-hero rounded-lg grid place-items-center" style={{ width: 28, height: 28, display: "grid", placeItems: "center" }}>
              <Sparkles size={16} />
            </div>
            <span className="font-display">Ratefluencer<span className="text-gradient">.ai</span></span>
          </Link>
          <select
            value={pathname}
            onChange={(e) => { window.location.href = e.target.value; }}
            className="bg-card border rounded-md px-2 py-1 text-sm"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            {nav.map((n) => <option key={n.to} value={n.to}>{n.label}</option>)}
          </select>
        </header>
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
