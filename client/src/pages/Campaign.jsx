import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/app/AppShell.jsx";
import { useAppStore } from "../context/AppContext.jsx";
import { Target } from "lucide-react";

const INDUSTRIES = ["Fitness", "Tech", "Finance", "Fashion", "Travel"];
const GOALS = ["Increase awareness", "Drive conversions", "Launch a product", "Build community", "Re-engage audience"];

const inputStyle = {
  width: "100%",
  background: "oklch(1 0 0 / 4%)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: "0.6rem",
  padding: "0.6rem 0.8rem",
  color: "inherit",
  outline: "none",
  fontSize: "0.875rem",
};

export default function CampaignPage() {
  const { campaign, setCampaign } = useAppStore();
  const [form, setForm] = useState(campaign);
  const nav = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setCampaign(form);
    nav("/marketplace");
  }

  return (
    <AppShell>
      <div style={{ maxWidth: "48rem" }}>
        <div className="inline-flex items-center gap-2 score-pill rounded-full px-3 py-1 text-xs"><Target size={14} /> Step 1 · Campaign brief</div>
        <h1 className="font-display text-4xl mt-3">Create a campaign</h1>
        <p className="text-muted-foreground mt-1">The brief powers every downstream AI analysis.</p>

        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 mt-6 grid gap-5">
          <Field label="Campaign Name">
            <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Industry">
              <select style={inputStyle} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Goal">
              <select style={inputStyle} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
                {GOALS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Target Audience">
            <input style={inputStyle} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} required />
          </Field>
          <Field label="Budget (INR)">
            <input type="number" style={inputStyle} value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} required />
          </Field>
          <button className="btn-hero rounded-xl px-5 py-3 font-semibold text-sm justify-self-start">Analyze Campaign →</button>
        </form>
      </div>
    </AppShell>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
