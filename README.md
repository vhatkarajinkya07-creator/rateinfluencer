# Ratefluencer AI — MERN Stack

Influencer Intelligence platform converted to a MERN-style architecture using **Express + JSON file storage** (no database required).

---

## Project Structure

```
ratefluencer/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── app/
│   │   │       ├── AppShell.jsx        # Sidebar layout
│   │   │       ├── InfluencerCard.jsx  # Creator card component
│   │   │       └── Scores.jsx          # Gauge / ScoreRing visuals
│   │   ├── context/
│   │   │   └── AppContext.jsx          # Global state (campaign, recent content)
│   │   ├── lib/
│   │   │   └── api.js                  # Axios API service layer
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── Intelligence.jsx        # X-Ray™ audit
│   │   │   ├── Predictor.jsx           # Campaign success predictor
│   │   │   ├── ContentStudio.jsx       # AI content generation
│   │   │   ├── Campaign.jsx            # Campaign brief form
│   │   │   └── Virality.jsx            # Virality predictor
│   │   ├── App.jsx                     # React Router routes
│   │   ├── main.jsx
│   │   └── index.css                   # Design system (glass, gradients, etc.)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── data/
│   │   ├── influencers.json    # 50 influencer records
│   │   ├── campaigns.json      # Saved campaigns
│   │   └── content.json        # Generated content history
│   ├── routes/
│   │   ├── influencers.js      # GET/POST/PUT/DELETE /api/influencers
│   │   ├── campaigns.js        # GET/POST/PUT/DELETE /api/campaigns
│   │   ├── content.js          # GET/POST /api/content
│   │   └── ai.js               # POST /api/ai/*
│   ├── services/
│   │   ├── ai.js               # Gemini AI functions
│   │   └── storage.js          # JSON file read/write helpers
│   ├── app.js                  # Express entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
└── README.md
```

---

## API Endpoints

### Influencers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/influencers` | List all influencers |
| GET | `/api/influencers/:id` | Get single influencer |
| POST | `/api/influencers` | Add influencer |
| PUT | `/api/influencers/:id` | Update influencer |
| DELETE | `/api/influencers/:id` | Remove influencer |

### Campaigns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | List all campaigns |
| POST | `/api/campaigns` | Save campaign |
| PUT | `/api/campaigns/:id` | Update campaign |
| DELETE | `/api/campaigns/:id` | Remove campaign |

### Content
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/content` | List generated content history |
| POST | `/api/content` | Save generated content |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/analyze-influencer` | X-Ray™ audit (Gemini) |
| POST | `/api/ai/predict-success` | Campaign success prediction |
| POST | `/api/ai/generate-content` | Reel content strategy |
| POST | `/api/ai/predict-virality` | Virality forecast |

---

## Installation & Setup

### 1. Configure the API key

Edit `server/.env`:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
```

Get a free Gemini API key at https://aistudio.google.com/app/apikey

### 2. Install & run the backend

```bash
cd server
npm install
npm run dev
```

Server starts at `http://localhost:5001`

### 3. Install & run the frontend

```bash
cd client
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

The Vite dev server proxies all `/api` requests to `:5000`, so no CORS issues.

---

## Pages & Features

| Route | Page | AI-powered |
|-------|------|------------|
| `/` | Dashboard | – |
| `/campaign` | Campaign brief form | – |
| `/marketplace` | Creator marketplace with filter/search/sort | – |
| `/intelligence` | Ratefluencer X-Ray™ audit | ✓ Gemini |
| `/predictor` | Campaign success predictor | ✓ Gemini |
| `/content` | Content Studio (reel, hook, caption, hashtags) | ✓ Gemini |
| `/virality` | Virality predictor | ✓ Gemini |

---

## Data Storage

All data lives in `server/data/*.json`. No database required.

- `influencers.json` — 50 pre-seeded creators
- `campaigns.json` — user-created campaigns (written on save)
- `content.json` — AI-generated content history (last 50 entries)

Campaign state and recent content are also persisted in the browser's `localStorage` for fast local access.
