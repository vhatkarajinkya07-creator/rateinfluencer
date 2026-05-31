import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppShell } from "../components/app/AppShell.jsx";
import { formatNum } from "../components/app/InfluencerCard.jsx";
import { useAppStore } from "../context/AppContext.jsx";
import { getInfluencers, aiPredictSuccess } from "../lib/api.js";
import { motion } from "framer-motion";
import { Loader2, Radar } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

function pick(i) {
  const { name, handle, niche, followers, averageLikes, averageComments, engagementRate, postingFrequency, bio } = i;
  return { name, handle, niche, followers, averageLikes, averageComments, engagementRate, postingFrequency, bio };
}

export default function Predictor() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const id = searchParams.get("id");
  const [influencers, setInfluencers] = useState([]);
  const { campaign } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    getInfluencers().then(setInfluencers).catch(console.error);
  }, []);

  const inf = influencers.find((i) => i.id === id) ?? influencers[0];

  async function predict() {
    if (!inf) return;
    setLoading(true); setError(null); setData(null);
    try {
      const result = await aiPredictSuccess({ influencer: pick(inf), campaign });
      setData(result);
    } catch (e) {
      setError(e.response?.data?.error ?? e.message);
    } finally { setLoading(false); }
  }

  if (!inf) return <AppShell><div className="text-muted-foreground">Loading…</div></AppShell>;

  const selectStyle = { background: "oklch(1 0 0 / 4%)", border: "1px solid oklch(1 0 0 / 10%)", color: "var(--foreground)", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem" };

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Campaign Success Predictor</div>
          <h1 className="font-display text-4xl flex items-center gap-3"><Radar size={32} style={{ color: "var(--accent)" }} /> Will this campaign win?</h1>
          <p className="text-muted-foreground mt-1 text-sm">{inf.name} × {campaign.name}</p>
        </div>
        <div className="flex gap-2">
          <select value={inf.id} onChange={(e) => nav(`/predictor?id=${e.target.value}`)} style={selectStyle}>
            {influencers.map((i) => <option key={i.id} value={i.id}>{i.name} · {i.niche}</option>)}
          </select>
          <button onClick={predict} disabled={loading} className="btn-hero rounded-xl px-4 py-2 text-sm font-semibold inline-flex items-center gap-2" style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Radar size={16} />}
            {loading ? "Predicting…" : "Predict"}
          </button>
        </div>
      </div>

      {error && <div className="mt-6 glass rounded-2xl p-5 text-sm text-destructive">{error}</div>}

      {data ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid lg:grid-cols-3 gap-4">
          <div className="glass-strong rounded-2xl p-6 lg:col-span-1 ring-glow">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Success Probability</div>
            <ProbGauge value={data.successProbability} />
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            <Stat label="Expected Reach" v={`${formatNum(data.expectedReachLow)}–${formatNum(data.expectedReachHigh)}`} />
            <Stat label="Expected Engagement" v={data.expectedEngagementRate.toFixed(1) + "%"} />
            <Stat label="Expected ROI" v={data.expectedRoiMultiplier.toFixed(1) + "x"} />
            <Stat label="Budget" v={"₹" + campaign.budget.toLocaleString("en-IN")} />
            <div className="sm:col-span-2 glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">AI Summary</div>
              <p className="mt-2 text-sm leading-relaxed">{data.summary}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        !loading && (
          <div className="mt-10 glass-strong rounded-2xl p-8 text-center">
            <div className="text-gradient font-display text-2xl">Forecast on demand.</div>
            <p className="text-muted-foreground text-sm mt-2" style={{ maxWidth: "28rem", margin: "0.5rem auto 0" }}>
              Click <strong className="text-foreground">Predict</strong> to see expected reach, engagement and ROI for this creator + campaign combination.
            </p>
          </div>
        )
      )}

      {loading && (
        <div className="mt-8 grid lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass rounded-2xl animate-pulse" style={{ height: 192 }} />)}
        </div>
      )}
    </AppShell>
  );
}

function Stat({ label, v }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-3xl mt-1 text-gradient">{v}</div>
    </div>
  );
}

function ProbGauge({ value }) {
  const chartData = [{ v: value }, { v: 100 - value }];
  return (
    <div className="relative" style={{ height: 224 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="v" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270} stroke="none">
            <Cell fill="url(#g1)" />
            <Cell fill="oklch(1 0 0 / 6%)" />
          </Pie>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.72 0.19 295)" />
              <stop offset="100%" stopColor="oklch(0.78 0.16 200)" />
            </linearGradient>
          </defs>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center" style={{ display: "grid", placeItems: "center" }}>
        <div className="text-center">
          <div className="font-display text-5xl text-gradient">{Math.round(value)}%</div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">confidence</div>
        </div>
      </div>
    </div>
  );
}
