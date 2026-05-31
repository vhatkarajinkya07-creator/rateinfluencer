import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppShell } from "../components/app/AppShell.jsx";
import { useAppStore } from "../context/AppContext.jsx";
import { getInfluencers, aiGenerateContent, saveContent } from "../lib/api.js";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Loader2, Wand2 } from "lucide-react";

function pick(i) {
  const { name, handle, niche, followers, averageLikes, averageComments, engagementRate, postingFrequency, bio } = i;
  return { name, handle, niche, followers, averageLikes, averageComments, engagementRate, postingFrequency, bio };
}

export default function ContentStudio() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const id = searchParams.get("id");
  const [influencers, setInfluencers] = useState([]);
  const { campaign, pushRecentContent } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getInfluencers().then(setInfluencers).catch(console.error);
  }, []);

  const inf = influencers.find((i) => i.id === id) ?? influencers[0];

  useEffect(() => {
    if (result && inf) {
      localStorage.setItem("ratefluencer.lastContent", JSON.stringify({ id: inf.id, content: result }));
    }
  }, [result, inf]);

  async function generate() {
    if (!inf) return;
    setLoading(true); setError(null);
    try {
      const data = await aiGenerateContent({ influencer: pick(inf), campaign });
      setResult(data);
      pushRecentContent({ campaign: campaign.name, influencer: inf.name, reelIdea: data.reelIdea });
      // Persist to backend
      await saveContent({ influencerId: inf.id, influencerName: inf.name, campaign: campaign.name, ...data }).catch(() => {});
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
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Campaign Content Strategy</div>
          <h1 className="font-display text-4xl flex items-center gap-3"><Wand2 size={32} style={{ color: "var(--primary)" }} /> Content Studio</h1>
          <p className="text-muted-foreground mt-1 text-sm">{inf.name} × {campaign.name}</p>
        </div>
        <div className="flex gap-2">
          <select value={inf.id} onChange={(e) => nav(`/content?id=${e.target.value}`)} style={selectStyle}>
            {influencers.map((i) => <option key={i.id} value={i.id}>{i.name} · {i.niche}</option>)}
          </select>
          <button onClick={generate} disabled={loading} className="btn-hero rounded-xl px-4 py-2 text-sm font-semibold inline-flex items-center gap-2" style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>
      </div>

      {error && <div className="mt-6 glass rounded-2xl p-5 text-sm text-destructive">{error}</div>}

      {result ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid lg:grid-cols-2 gap-4">
          <div className="glass-strong rounded-2xl p-6 ring-glow">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Reel concept</div>
            <div className="font-display text-2xl mt-1">{result.reelIdea}</div>
            <div className="mt-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Hook (first 3s)</div>
              <p className="text-lg mt-1 text-gradient font-display">"{result.hook}"</p>
            </div>
            <div className="mt-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Story beats</div>
              <ol className="mt-2 space-y-2">
                {result.storyStructure.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="score-pill rounded-full text-xs grid place-items-center" style={{ width: 24, height: 24, flexShrink: 0, display: "grid", placeItems: "center" }}>{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Call to action</div>
              <div className="mt-1 inline-block score-pill rounded-lg px-3 py-2 text-sm">{result.cta}</div>
            </div>
          </div>

          <div className="space-y-4">
            <Panel title="Instagram Caption" copy={result.caption}>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{result.caption}</pre>
            </Panel>
            <Panel title="Hashtags" copy={result.hashtags.map((h) => "#" + h).join(" ")}>
              <div className="flex flex-wrap gap-1.5">
                {result.hashtags.map((h) => (
                  <span key={h} className="text-xs px-2 py-1 rounded-md" style={{ background: "oklch(1 0 0 / 5%)", border: "1px solid oklch(1 0 0 / 10%)" }}>#{h}</span>
                ))}
              </div>
            </Panel>
            <Link to={`/virality?id=${inf.id}`} className="btn-hero rounded-xl px-4 py-3 text-sm font-semibold inline-flex items-center gap-2">
              Predict virality <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      ) : (
        !loading && (
          <div className="mt-10 glass-strong rounded-2xl p-8 text-center">
            <div className="text-gradient font-display text-2xl">Make it post-ready.</div>
            <p className="text-muted-foreground text-sm mt-2" style={{ maxWidth: "28rem", margin: "0.5rem auto 0" }}>
              Generate a Reel concept, hook, caption and hashtags tailored to <strong className="text-foreground">{inf.name}</strong>'s voice and your campaign.
            </p>
          </div>
        )
      )}

      {loading && (
        <div className="mt-8 grid lg:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => <div key={i} className="glass rounded-2xl animate-pulse" style={{ height: 320 }} />)}
        </div>
      )}
    </AppShell>
  );
}

function Panel({ title, children, copy }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
        {copy && (
          <button onClick={() => navigator.clipboard.writeText(copy)} className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <Copy size={12} /> copy
          </button>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
