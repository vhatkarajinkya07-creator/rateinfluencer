import { motion } from "framer-motion";

export function Gauge({ value, label }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-end gap-2">
        <div className="font-display text-4xl text-gradient">{Math.round(value)}</div>
        <div className="text-muted-foreground text-sm mb-1">/ 100</div>
      </div>
      <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 5%)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full btn-hero"
        />
      </div>
    </div>
  );
}

export function ScoreRing({ value, label, size = 120 }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(1 0 0 / 8%)" strokeWidth="8" fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="url(#ringGrad)" strokeWidth="8" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - dash }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.19 295)" />
            <stop offset="100%" stopColor="oklch(0.78 0.16 200)" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ marginTop: `calc(-${size / 2}px - 0.5rem)`, marginBottom: `calc(${size / 2}px - 1.5rem)`, pointerEvents: "none" }}>
        <div className="font-display text-2xl">{Math.round(value)}</div>
      </div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground" style={{ marginTop: "-0.5rem" }}>{label}</div>
    </div>
  );
}
