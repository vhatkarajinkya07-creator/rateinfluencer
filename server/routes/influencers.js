import { Router } from "express";
import { readJSON, writeJSON } from "../services/storage.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const influencers = await readJSON("influencers.json");
    res.json(influencers);
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const influencers = await readJSON("influencers.json");
    const inf = influencers.find((i) => i.id === req.params.id);
    if (!inf) return res.status(404).json({ error: "Not found" });
    res.json(inf);
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const influencers = await readJSON("influencers.json");
    const newInf = { id: `inf_${Date.now()}`, ...req.body };
    influencers.push(newInf);
    await writeJSON("influencers.json", influencers);
    res.status(201).json(newInf);
  } catch (err) { next(err); }
});

router.put("/:id", async (req, res, next) => {
  try {
    const influencers = await readJSON("influencers.json");
    const idx = influencers.findIndex((i) => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    influencers[idx] = { ...influencers[idx], ...req.body };
    await writeJSON("influencers.json", influencers);
    res.json(influencers[idx]);
  } catch (err) { next(err); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    let influencers = await readJSON("influencers.json");
    influencers = influencers.filter((i) => i.id !== req.params.id);
    await writeJSON("influencers.json", influencers);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
