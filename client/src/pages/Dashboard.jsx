import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/app/AppShell.jsx";
import { InfluencerCard, formatNum } from "../components/app/InfluencerCard.jsx";
import { useAppStore, quickScore } from "../context/AppContext.jsx";
import { getInfluencers } from "../lib/api.js";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Radar, Sparkles, Target, Wand2 } from "lucide-react";

export default function Dashboard() {
  const [influencers, setInfluencers] = useState([]);
  const store = useAppStore();

  useEffect(() => {
    getInfluencers().then(setInfluencers).catch(console.error);
  }, []);

  const ranked = [...influencers].sort((a, b) => quickScore(b) - quickScore(a));
  const top = ranked.slice(0, 4);
  const totals = influencers.length
    ? {
        creators: influencers.length,
        avgEng: (influencers.reduce((s, i) => s + i.engagementRate, 0) / influencers.length).toFixed(1),
        reach: influencers.reduce((s, i) => s + i.followers, 0),
        niches: new Set(influencers.map((i) => i.niche)).size,
      }
    : null;

  return (
    <AppShell>
      <Hero />

      {totals && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Metric label="Tracked creators" value={String(totals.creators)} />
          <Metric label="Avg engagement" value={totals.avgEng + "%"} />
          <Metric label="Combined reach" value={formatNum(totals.reach)} />
          <Metric label="Niches" value={String(totals.niches)} />
        </section>
      )}

      <section className="mt-10">
        <SectionHeader
          title="Top Ranked Creators"
          subtitle="Quick-score preview — run X-Ray™ for the full AI audit."
          right={
            <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              Browse all <ArrowRight size={14} />
            </Link>
          }
        />
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {top.map((i) => <InfluencerCard key={i.id} inf={i} />)}
        </div>
      </section>

      <section className="mt-10 grid lg:grid-cols-3 gap-4">
        <FeatureCard to="/intelligence" icon={Brain} title="Intelligence Engine" desc="Explainable scores: authenticity, growth, brand match, success." />
        <FeatureCard to="/predictor" icon={Radar} title="Success Predictor" desc="Forecast reach, engagement and ROI before you spend." />
        <FeatureCard to="/content" icon={Wand2} title="Content Studio" desc="Reels, hooks, captions and hashtags tailored per creator." />
      </section>

      <section className="mt-10">
        <SectionHeader title="Recent generated content" subtitle="Your last AI campaign drafts." />
        <div className="mt-4 glass rounded-2xl p-5">
          {store.recentContent.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Nothing yet — head to the <Link to="/content" className="text-foreground underline">Content Studio</Link> to generate your first Reel.
            </div>
          ) : (
            <ul style={{ borderTop: "1px solid oklch(1 0 0 / 5%)" }}>
              {store.recentContent.map((r) => (
                <li key={r.at} className="py-3 flex items-start justify-between gap-4" style={{ borderBottom: "1px solid oklch(1 0 0 / 5%)" }}>
                  <div>
                    <div className="text-sm font-semibold">{r.reelIdea}</div>
                    <div className="text-xs text-muted-foreground">{r.influencer} · {r.campaign}</div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{new Date(r.at).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-strong p-8 lg:p-12 grid-bg">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-aurora)" }} />
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="relative">
        <div className="inline-flex items-center gap-2 score-pill rounded-full px-3 py-1 text-xs">
          <Sparkles size={14} /> Influencer Intelligence · v1
        </div>
        <h1 className="mt-4 font-display leading-tight" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", maxWidth: "48rem" }}>
          Find the <span className="text-gradient">right creator</span><br />before everyone else.
        </h1>
        <p className="mt-4 text-muted-foreground" style={{ maxWidth: "40rem" }}>
          Ratefluencer AI ranks, explains and predicts. Stop guessing with follower counts — get explainable scores, risk reports, and campaign success forecasts in seconds.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/campaign" className="px-5 py-2.5 rounded-xl btn-hero text-sm font-semibold inline-flex items-center gap-2"><Target size={16} /> Create a campaign</Link>
          <Link to="/intelligence" className="px-5 py-2.5 rounded-xl glass text-sm inline-flex items-center gap-2 hover:bg-white/10 transition"><Brain size={16} /> Run X-Ray™</Link>
        </div>
      </motion.div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-3xl mt-2">{value}</div>
    </div>
  );
}

function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function FeatureCard({ to, icon: Icon, title, desc }) {
  return (
    <Link to={to} className="glass rounded-2xl p-6 hover:ring-glow transition group block">
      <div className="size-10 rounded-xl btn-hero grid place-items-center mb-3" style={{ width: 40, height: 40, display: "grid", placeItems: "center" }}>
        <Icon size={20} />
      </div>
      <div className="font-display text-lg">{title}</div>
      <div className="text-sm text-muted-foreground mt-1">{desc}</div>
      <div className="text-xs text-primary mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">Open <ArrowRight size={14} /></div>
    </Link>
  );
}
