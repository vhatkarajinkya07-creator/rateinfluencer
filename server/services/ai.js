import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

function getModel() {
  return google("gemini-2.5-flash");
}

// ─── X-RAY ───────────────────────────────────────────────────────────────────

const XRaySchema = z.object({
  authenticity: z.number().min(0).max(100),
  growthPotential: z.number().min(0).max(100),
  brandMatch: z.number().min(0).max(100),
  campaignSuccess: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  positives: z.array(z.string()).min(3).max(6),
  negatives: z.array(z.string()).min(2).max(5),
  reasoning: z.string(),
  risks: z.array(z.object({ title: z.string(), detail: z.string() })).min(2).max(5),
  improvements: z.array(z.object({ title: z.string(), why: z.string() })).min(3).max(6),
});

export async function analyzeInfluencer({ influencer, campaign, brutal = false }) {
  const tone = brutal
    ? "Reality Check Mode: be brutally honest, blunt, and slightly witty — but accurate."
    : "Tone: confident, analytical, like a senior brand strategist.";
  const prompt = `You are Ratefluencer AI — an Influencer Intelligence engine producing an X-Ray audit.

${tone}

INFLUENCER:
${JSON.stringify(influencer, null, 2)}

CAMPAIGN:
${JSON.stringify(campaign, null, 2)}

Produce:
- Four scores 0-100: authenticity, growthPotential, brandMatch, campaignSuccess.
- overallScore is a weighted blend (Brand Match 35%, Campaign Success 30%, Authenticity 20%, Growth 15%).
- 3-6 specific positives, 2-5 specific negatives — concrete, not generic.
- reasoning: 2-3 sentences explaining the headline call.
- 2-5 risks with title + detail.
- 3-6 improvement recommendations, each with a "why".
Be specific to this influencer's numbers and this campaign's goal.`;

  const { experimental_output } = await generateText({
    model: getModel(),
    experimental_output: Output.object({ schema: XRaySchema }),
    prompt,
  });
  return experimental_output;
}

// ─── CAMPAIGN PREDICTION ──────────────────────────────────────────────────────

const PredictionSchema = z.object({
  successProbability: z.number().min(0).max(100),
  expectedReachLow: z.number(),
  expectedReachHigh: z.number(),
  expectedEngagementRate: z.number(),
  expectedRoiMultiplier: z.number(),
  summary: z.string(),
});

export async function predictCampaign({ influencer, campaign }) {
  const prompt = `Predict the outcome of running this campaign with this creator. Be realistic, grounded in their metrics.

INFLUENCER: ${JSON.stringify(influencer)}
CAMPAIGN: ${JSON.stringify(campaign)}

Return:
- successProbability (0-100)
- expectedReachLow / expectedReachHigh (integers, plausible based on followers & engagement)
- expectedEngagementRate (percentage like 6.8)
- expectedRoiMultiplier (e.g. 2.5 means 2.5x)
- summary: 2 short sentences.`;

  const { experimental_output } = await generateText({
    model: getModel(),
    experimental_output: Output.object({ schema: PredictionSchema }),
    prompt,
  });
  return experimental_output;
}

// ─── CONTENT STRATEGY ────────────────────────────────────────────────────────

const ContentSchema = z.object({
  reelIdea: z.string(),
  hook: z.string(),
  storyStructure: z.array(z.string()).min(3).max(7),
  cta: z.string(),
  caption: z.string(),
  hashtags: z.array(z.string()).min(5).max(15),
});

export async function generateContent({ influencer, campaign }) {
  const prompt = `Create a campaign-specific Reel concept tailored to this creator's voice and audience.

INFLUENCER: ${JSON.stringify(influencer)}
CAMPAIGN: ${JSON.stringify(campaign)}

Return:
- reelIdea: one-line concept
- hook: the first 3 seconds line
- storyStructure: 3-7 beats (each a short phrase)
- cta: clear call-to-action
- caption: Instagram caption with line breaks (use \\n), 60-120 words, on-brand for the creator
- hashtags: 5-15 (no #, just the words)`;

  const { experimental_output } = await generateText({
    model: getModel(),
    experimental_output: Output.object({ schema: ContentSchema }),
    prompt,
  });
  return experimental_output;
}

// ─── VIRALITY ────────────────────────────────────────────────────────────────

const ViralitySchema = z.object({
  expectedViews: z.number(),
  expectedLikes: z.number(),
  expectedShares: z.number(),
  expectedSaves: z.number(),
  viralityScore: z.number().min(0).max(100),
  notes: z.string(),
});

export async function predictVirality({ influencer, content }) {
  const prompt = `Estimate virality for this Reel from this creator.
Be realistic relative to their follower base (${influencer.followers}) and engagement (${influencer.engagementRate}%).

CONTENT: ${JSON.stringify(content)}

Return integers for views/likes/shares/saves, a viralityScore 0-100, and a short 1-sentence notes field explaining the score driver.`;

  const { experimental_output } = await generateText({
    model: getModel(),
    experimental_output: Output.object({ schema: ViralitySchema }),
    prompt,
  });
  return experimental_output;
}
