import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/app/AppShell.jsx";
import { InfluencerCard } from "../components/app/InfluencerCard.jsx";
import { useAppStore, quickScore } from "../context/AppContext.jsx";
import { getInfluencers } from "../lib/api.js";
import { Search } from "lucide-react";

const NICHES = ["All", "Fitness", "Tech", "Finance", "Fashion", "Travel"];

export default function Marketplace() {
  const [influencers, setInfluencers] = useState([]);
  const { campaign } = useAppStore();
  const [q, setQ] = useState("");
  const [niche, setNiche] = useState(campaign.industry || "All");
  const [sort, setSort] = useState("score");

  useEffect(() => {
    getInfluencers().then(setInfluencers).catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    let list = influencers.filter(
      (i) =>
        (niche === "All" || i.niche === niche) &&
        (q === "" || (i.name + i.bio + i.handle).toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === "score") list = [...list].sort((a, b) => quickScore(b) - quickScore(a));
    if (sort === "followers") list = [...list].sort((a, b) => b.followers - a.followers);
    if (sort === "engagement") list = [...list].sort((a, b) => b.engagementRate - a.engagementRate);
    return list;
  }, [influencers, q, niche, sort]);

  const selectStyle = {
    background: "oklch(1 0 0 / 4%)",
    border: "1px solid oklch(1 0 0 / 10%)",
    color: "var(--foreground)",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
  };

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Marketplace</div>
          <h1 className="font-display text-4xl">Creator Marketplace</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {filtered.length} creators · campaign: <span className="text-foreground">{campaign.name}</span> · {campaign.industry}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search creators…"
              style={{ ...selectStyle, paddingLeft: "2.25rem", width: "15rem" }}
            />
          </div>
          <select value={niche} onChange={(e) => setNiche(e.target.value)} style={selectStyle}>
            {NICHES.map((n) => <option key={n}>{n}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={selectStyle}>
            <option value="score">Sort: Score</option>
            <option value="followers">Sort: Followers</option>
            <option value="engagement">Sort: Engagement</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {filtered.map((i) => <InfluencerCard key={i.id} inf={i} />)}
      </div>
    </AppShell>
  );
}
