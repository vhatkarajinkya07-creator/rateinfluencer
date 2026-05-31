import { Router } from "express";
import { readJSON, writeJSON } from "../services/storage.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const campaigns = await readJSON("campaigns.json");
    res.json(campaigns);
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const campaigns = await readJSON("campaigns.json");
    const newCampaign = { id: `camp_${Date.now()}`, createdAt: new Date().toISOString(), ...req.body };
    campaigns.push(newCampaign);
    await writeJSON("campaigns.json", campaigns);
    res.status(201).json(newCampaign);
  } catch (err) { next(err); }
});

router.put("/:id", async (req, res, next) => {
  try {
    const campaigns = await readJSON("campaigns.json");
    const idx = campaigns.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    campaigns[idx] = { ...campaigns[idx], ...req.body };
    await writeJSON("campaigns.json", campaigns);
    res.json(campaigns[idx]);
  } catch (err) { next(err); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    let campaigns = await readJSON("campaigns.json");
    campaigns = campaigns.filter((c) => c.id !== req.params.id);
    await writeJSON("campaigns.json", campaigns);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
