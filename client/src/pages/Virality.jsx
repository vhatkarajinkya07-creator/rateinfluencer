import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppShell } from "../components/app/AppShell.jsx";
import { Gauge } from "../components/app/Scores.jsx";
import { formatNum } from "../components/app/InfluencerCard.jsx";
import { getInfluencers, aiPredictVirality } from "../lib/api.js";
import { motion } from "framer-motion";
import { Flame, Loader2 } from "lucide-react";

function pick(i) {
  const { name, handle, niche, followers, averageLikes, averageComments, engagementRate, postingFrequency, bio } = i;
  return { name, handle, niche, followers, averageLikes, averageComments, engagementRate, postingFrequency, bio };
}

export default function Virality() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const id = searchParams.get("id");
  const [influencers, setInfluencers] = useState([]);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    getInfluencers().then(setInfluencers).catch(console.error);
  }, []);

  const inf = influencers.find((i) => i.id === id) ?? influencers[0];

  useEffect(() => {
    if (!inf) return;
    try {
      const raw = localStorage.getItem("ratefluencer.lastContent");
      if (raw) {
        const p = JSON.parse(raw);
        if (p?.id === inf.id) setContent(p.content);
        else setContent(null);
      } else { setContent(null); }
    } catch { setContent(null); }
  }, [inf?.id]);

  async function predict() {
    if (!inf || !content) return;
    setLoading(true); setError(null); setData(null);
    try {
      const result = await aiPredictVirality({
        influencer: pick(inf),
        content: { reelIdea: content.reelIdea, hook: content.hook, caption: content.caption },
      });
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
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Virality Predictor</div>
          <h1 className="font-display text-4xl flex items-center gap-3"><Flame size={32} style={{ color: "#fde047" }} /> Will it pop off?</h1>
          <p className="text-muted-foreground mt-1 text-sm">{inf.name} {content ? "· content loaded" : "· no content yet"}</p>
        </div>
        <div className="flex gap-2">
          <select value={inf.id} onChange={(e) => nav(`/virality?id=${e.target.value}`)} style={selectStyle}>
            {influencers.map((i) => <option key={i.id} value={i.id}>{i.name} · {i.niche}</option>)}
          </select>
          <button
            onClick={predict}
            disabled={loading || !content}
            className="btn-hero rounded-xl px-4 py-2 text-sm font-semibold inline-flex items-center gap-2"
            style={{ opacity: (loading || !content) ? 0.6 : 1 }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Flame size={16} />}
            {loading ? "Forecasting…" : "Predict"}
          </button>
        </div>
      </div>

      {!content && (
        <div className="mt-8 glass-strong rounded-2xl p-8 text-center">
          <div className="text-gradient font-display text-2xl">No content to score yet.</div>
          <p className="text-muted-foreground text-sm mt-2">
            Head to <Link to={`/content?id=${inf.id}`} className="text-foreground underline">Content Studio</Link> and generate a Reel for this creator first.
          </p>
        </div>
      )}

      {content && (
        <div className="mt-6 glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Scoring content</div>
          <div className="font-display text-xl mt-1">{content.reelIdea}</div>
          <div className="text-sm text-muted-foreground mt-1">"{content.hook}"</div>
        </div>
      )}

      {error && <div className="mt-6 glass rounded-2xl p-5 text-sm text-destructive">{error}</div>}

      {data && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid lg:grid-cols-5 gap-4">
          <StatCard label="Views" v={formatNum(data.expectedViews)} />
          <StatCard label="Likes" v={formatNum(data.expectedLikes)} />
          <StatCard label="Shares" v={formatNum(data.expectedShares)} />
          <StatCard label="Saves" v={formatNum(data.expectedSaves)} />
          <Gauge value={data.viralityScore} label="Virality Score" />
          <div className="lg:col-span-5 glass-strong rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">AI take</div>
            <p className="mt-2">{data.notes}</p>
          </div>
        </motion.div>
      )}
    </AppShell>
  );
}

function StatCard({ label, v }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-3xl mt-1 text-gradient">{v}</div>
    </div>
  );
}
