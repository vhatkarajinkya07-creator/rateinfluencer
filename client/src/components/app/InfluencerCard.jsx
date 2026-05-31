import { Link } from "react-router-dom";
import { TrendingUp, Heart, MessageCircle, Sparkles } from "lucide-react";
import { quickScore } from "../../context/AppContext.jsx";

export function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

const nicheColor = {
  Fitness: "from-rose-500/30 to-orange-400/20",
  Tech: "from-cyan-400/30 to-violet-500/20",
  Finance: "from-emerald-400/30 to-teal-500/20",
  Fashion: "from-fuchsia-500/30 to-pink-400/20",
  Travel: "from-amber-400/30 to-rose-400/20",
};

export function InfluencerCard({ inf, onSelect }) {
  const score = quickScore(inf);
  const initials = inf.name.replace(/[^A-Z]/g, "").slice(0, 2) || inf.name.slice(0, 2).toUpperCase();
  return (
    <div className="glass rounded-2xl p-5 group hover:ring-glow transition-all">
      <div className="flex items-start gap-4">
        <div
          className={`rounded-xl bg-gradient-to-br ${nicheColor[inf.niche] ?? "from-primary/30 to-accent/20"} grid place-items-center font-display text-lg ring-1 ring-white/10`}
          style={{ width: 56, height: 56, display: "grid", placeItems: "center" }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-semibold truncate">{inf.name}</div>
              <div className="text-xs text-muted-foreground truncate">{inf.handle} · {inf.niche}</div>
            </div>
            <div className="score-pill rounded-full px-2.5 py-1 text-xs font-semibold flex items-center gap-1">
              <Sparkles size={12} /> {score}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{inf.bio}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
        <StatBox icon={TrendingUp} label="Followers" value={formatNum(inf.followers)} />
        <StatBox icon={Heart} label="Avg Likes" value={formatNum(inf.averageLikes)} />
        <StatBox icon={MessageCircle} label="Engage" value={inf.engagementRate + "%"} />
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          to={`/intelligence?id=${inf.id}`}
          onClick={onSelect}
          className="flex-1 text-center text-xs py-2 rounded-lg btn-hero font-semibold"
        >
          Run X-Ray™
        </Link>
        <Link
          to={`/predictor?id=${inf.id}`}
          className="flex-1 text-center text-xs py-2 rounded-lg glass hover:bg-white/10 transition"
        >
          Predict
        </Link>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg px-2 py-1.5" style={{ background: "oklch(1 0 0 / 3%)", border: "1px solid oklch(1 0 0 / 5%)" }}>
      <div className="flex items-center gap-1 text-muted-foreground"><Icon size={12} />{label}</div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  );
}
