import { Router } from "express";
import { readJSON, writeJSON } from "../services/storage.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const content = await readJSON("content.json");
    res.json(content);
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const content = await readJSON("content.json");
    const newItem = { id: `cont_${Date.now()}`, createdAt: new Date().toISOString(), ...req.body };
    content.unshift(newItem);
    // Keep only the last 50 entries
    const trimmed = content.slice(0, 50);
    await writeJSON("content.json", trimmed);
    res.status(201).json(newItem);
  } catch (err) { next(err); }
});

export default router;
