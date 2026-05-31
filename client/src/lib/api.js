import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Influencers
export const getInfluencers = () => api.get("/influencers").then((r) => r.data);
export const getInfluencer = (id) => api.get(`/influencers/${id}`).then((r) => r.data);

// Campaigns
export const getCampaigns = () => api.get("/campaigns").then((r) => r.data);
export const createCampaign = (data) => api.post("/campaigns", data).then((r) => r.data);

// Content history
export const getContent = () => api.get("/content").then((r) => r.data);
export const saveContent = (data) => api.post("/content", data).then((r) => r.data);

// AI endpoints
export const aiAnalyzeInfluencer = (body) =>
  api.post("/ai/analyze-influencer", body).then((r) => r.data);
export const aiPredictSuccess = (body) =>
  api.post("/ai/predict-success", body).then((r) => r.data);
export const aiGenerateContent = (body) =>
  api.post("/ai/generate-content", body).then((r) => r.data);
export const aiPredictVirality = (body) =>
  api.post("/ai/predict-virality", body).then((r) => r.data);
