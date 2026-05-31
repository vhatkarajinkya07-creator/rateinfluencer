import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppShell } from "../components/app/AppShell.jsx";
import { Gauge } from "../components/app/Scores.jsx";
import { formatNum } from "../components/app/InfluencerCard.jsx";
import { useAppStore } from "../context/AppContext.jsx";
import { getInfluencers, aiAnalyzeInfluencer } from "../lib/api.js";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Brain, CheckCircle2, Flame, Lightbulb, Loader2, XCircle } from "lucide-react";

function pick(i) {
  const { name, handle, niche, followers, averageLikes, averageComments, engagementRate, postingFrequency, bio } = i;
  return { name, handle, niche, followers, averageLikes, averageComments, engagementRate, postingFrequency, bio };
}

export default function Intelligence() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const id = searchParams.get("id");
  const [influencers, setInfluencers] = useState([]);
  const { campaign } = useAppStore();
  const [brutal, setBrutal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    getInfluencers().then(setInfluencers).catch(console.error);
  }, []);

  const inf = influencers.find((i) => i.id === id) ?? influencers[0];

  async function runXRay() {
    if (!inf) return;
    setLoading(true); setError(null); setData(null);
    try {
      const result = await aiAnalyzeInfluencer({ influencer: pick(inf), campaign, brutal });
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
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Influencer Intelligence Engine</div>
          <h1 className="font-display text-4xl flex items-center gap-3"><Brain size={32} style={{ color: "var(--primary)" }} /> Ratefluencer X-Ray™</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Auditing <span className="text-foreground">{inf.name}</span> ({inf.handle}) for <span className="text-foreground">{campaign.name}</span>.
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <select value={inf.id} onChange={(e) => nav(`/intelligence?id=${e.target.value}`)} style={selectStyle}>
            {influencers.map((i) => <option key={i.id} value={i.id}>{i.name} · {i.niche}</option>)}
          </select>
          <label className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg glass cursor-pointer">
            <input type="checkbox" checked={brutal} onChange={(e) => setBrutal(e.target.checked)} style={{ accentColor: "var(--primary)" }} />
            <Flame size={14} style={{ color: "#fde047" }} /> Reality Check
          </label>
          <button
            onClick={runXRay}
            disabled={loading}
            className="btn-hero rounded-xl px-4 py-2 text-sm font-semibold inline-flex items-center gap-2"
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
            {loading ? "Auditing…" : "Run X-Ray™"}
          </button>
        </div>
      </div>

      <ProfileBar inf={inf} />

      {loading && <Skeleton />}
      {error && <div className="mt-6 glass rounded-2xl p-5 text-sm text-destructive">Analysis failed: {error}</div>}
      {data && <Report data={data} inf={inf} brutal={brutal} />}

      {!data && !loading && (
        <div className="mt-10 glass-strong rounded-2xl p-8 text-center">
          <div className="text-gradient font-display text-2xl">Ready for the audit.</div>
          <p className="text-muted-foreground text-sm mt-2" style={{ maxWidth: "28rem", margin: "0.5rem auto 0" }}>
            Click <strong className="text-foreground">Run X-Ray™</strong> to generate explainable scores, risks and recommendations powered by AI.
          </p>
        </div>
      )}
    </AppShell>
  );
}

function ProfileBar({ inf }) {
  return (
    <div className="mt-6 glass rounded-2xl p-5 grid md:grid-cols-5 gap-4">
      <div className="md:col-span-2">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Creator</div>
        <div className="font-display text-2xl mt-1">{inf.name}</div>
        <div className="text-sm text-muted-foreground">{inf.handle} · {inf.niche}</div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{inf.bio}</p>
      </div>
      <StatBox label="Followers" v={formatNum(inf.followers)} />
      <StatBox label="Avg Likes" v={formatNum(inf.averageLikes)} />
      <StatBox label="Engagement" v={inf.engagementRate + "%"} />
    </div>
  );
}

function StatBox({ label, v }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "oklch(1 0 0 / 3%)", border: "1px solid oklch(1 0 0 / 5%)" }}>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-xl mt-1">{v}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mt-6 grid lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl animate-pulse" style={{ height: 128 }} />
      ))}
    </div>
  );
}

function Report({ data, inf, brutal }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Gauge value={data.authenticity} label="Authenticity" />
        <Gauge value={data.growthPotential} label="Growth Potential" />
        <Gauge value={data.brandMatch} label="Brand Match" />
        <Gauge value={data.campaignSuccess} label="Campaign Success" />
        <div className="glass-strong rounded-2xl p-5 ring-glow">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Overall Ratefluencer Score</div>
          <div className="font-display text-6xl text-gradient mt-1">{Math.round(data.overallScore)}</div>
          <div className="text-xs text-muted-foreground">{brutal ? "Reality Check mode" : "Standard audit"}</div>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><Brain size={14} /> AI Reasoning</div>
        <p className="mt-2 text-base leading-relaxed">{data.reasoning}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Positive Factors" tone="success" icon={CheckCircle2}>
          <ul className="space-y-2">{data.positives.map((p, i) => <li key={i} className="text-sm flex gap-2"><span style={{ color: "#34d399" }}>+</span>{p}</li>)}</ul>
        </Panel>
        <Panel title="Negative Factors" tone="destructive" icon={XCircle}>
          <ul className="space-y-2">{data.negatives.map((p, i) => <li key={i} className="text-sm flex gap-2"><span style={{ color: "#f87171" }}>−</span>{p}</li>)}</ul>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Creator Risk Report™" tone="warning" icon={AlertTriangle}>
          <ul className="space-y-3">
            {data.risks.map((r, i) => (
              <li key={i} className="rounded-lg p-3" style={{ background: "oklch(1 0 0 / 3%)", border: "1px solid oklch(1 0 0 / 5%)" }}>
                <div className="text-sm font-semibold">{r.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{r.detail}</div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Improvement Recommendations" tone="primary" icon={Lightbulb}>
          <ul className="space-y-3">
            {data.improvements.map((r, i) => (
              <li key={i} className="rounded-lg p-3" style={{ background: "oklch(1 0 0 / 3%)", border: "1px solid oklch(1 0 0 / 5%)" }}>
                <div className="text-sm font-semibold">{r.title}</div>
                <div className="text-xs text-muted-foreground mt-1"><strong>Why:</strong> {r.why}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="glass rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">Next step — see how this creator performs in your campaign.</div>
        <div className="flex gap-2">
          <Link to={`/predictor?id=${inf.id}`} className="btn-hero rounded-lg px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
            Predict success <ArrowRight size={16} />
          </Link>
          <Link to={`/content?id=${inf.id}`} className="glass rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2 hover:bg-white/10 transition">
            Generate content
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function Panel({ title, tone, icon: Icon, children }) {
  const toneGrad = {
    success: "from-emerald-400/15 to-transparent",
    destructive: "from-rose-500/15 to-transparent",
    warning: "from-amber-400/15 to-transparent",
    primary: "from-primary/15 to-transparent",
  }[tone];
  return (
    <div className={`glass-strong rounded-2xl p-5 bg-gradient-to-br ${toneGrad}`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><Icon size={14} /> {title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
