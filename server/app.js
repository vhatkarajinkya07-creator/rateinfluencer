import "dotenv/config";
import express from "express";
import cors from "cors";
import influencerRoutes from "./routes/influencers.js";
import campaignRoutes from "./routes/campaigns.js";
import contentRoutes from "./routes/content.js";
import aiRoutes from "./routes/ai.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/influencers", influencerRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/ai", aiRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message ?? "Internal server error" });
});

app.listen(PORT, () => console.log(`Ratefluencer API running on http://localhost:${PORT}`));
