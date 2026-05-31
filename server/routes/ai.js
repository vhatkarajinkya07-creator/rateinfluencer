import { Router } from "express";
import { analyzeInfluencer, predictCampaign, generateContent, predictVirality } from "../services/ai.js";

const router = Router();

router.post("/analyze-influencer", async (req, res, next) => {
  try {
    const result = await analyzeInfluencer(req.body);
    res.json(result);
  } catch (err) { next(err); }
});

router.post("/predict-success", async (req, res, next) => {
  try {
    const result = await predictCampaign(req.body);
    res.json(result);
  } catch (err) { next(err); }
});

router.post("/generate-content", async (req, res, next) => {
  try {
    const result = await generateContent(req.body);
    res.json(result);
  } catch (err) { next(err); }
});

router.post("/predict-virality", async (req, res, next) => {
  try {
    const result = await predictVirality(req.body);
    res.json(result);
  } catch (err) { next(err); }
});

export default router;
