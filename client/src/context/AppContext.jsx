import { createContext, useContext, useState, useCallback } from "react";

const DEFAULT_CAMPAIGN = {
  name: "ProteinX Launch",
  industry: "Fitness",
  goal: "Increase awareness",
  audience: "18-30, urban India, gym-goers",
  budget: 500000,
};

function loadState() {
  try {
    const raw = localStorage.getItem("ratefluencer.state");
    if (raw) return { ...{ campaign: DEFAULT_CAMPAIGN, recentContent: [] }, ...JSON.parse(raw) };
  } catch {}
  return { campaign: DEFAULT_CAMPAIGN, recentContent: [] };
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  const persist = useCallback((next) => {
    setState(next);
    try { localStorage.setItem("ratefluencer.state", JSON.stringify(next)); } catch {}
  }, []);

  const setCampaign = useCallback((campaign) => {
    persist((s) => ({ ...s, campaign }));
  }, [persist]);

  const pushRecentContent = useCallback((item) => {
    persist((s) => ({
      ...s,
      recentContent: [{ ...item, at: Date.now() }, ...s.recentContent].slice(0, 8),
    }));
  }, [persist]);

  return (
    <AppContext.Provider value={{ ...state, setCampaign, pushRecentContent }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  return useContext(AppContext);
}

export function quickScore(inf) {
  const eng = Math.min(inf.engagementRate / 8, 1);
  const reach = Math.min(Math.log10(inf.followers) / 7, 1);
  const freq = Math.min(inf.postingFrequency / 7, 1);
  return Math.round((eng * 0.55 + reach * 0.3 + freq * 0.15) * 100);
}
