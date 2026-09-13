# 🔍 TruthLens — AI Fake News Detection System

An AI-powered fake news detection system using BERT machine learning, linguistic analysis, and source credibility scoring.

## 🌐 Live App

> **👉 https://fake-news-detection-beige-chi.vercel.app**

---

## 🧠 How Detection Works

Three independent AI layers analyze every piece of content:

| Layer | Method | Weight |
|-------|--------|--------|
| 🤖 **BERT AI Model** | Hugging Face fine-tuned fake news BERT | 55% |
| 🔤 **Linguistic Analysis** | Sensationalism, clickbait, emotional triggers | 30% |
| 🌐 **Source Credibility** | Domain trust database (Reuters, BBC vs known fake sites) | 15% |

### Linguistic Indicators Detected
- Sensational words: `SHOCKING`, `EXPLOSIVE`, `COVER-UP`, etc.
- Clickbait patterns: "You won't believe", "Share before deleted"
- Excessive capitalization (>30% of words)
- Emotional trigger words: outrage, conspiracy, evil, corrupt
- Excessive punctuation (`!!!`, `???`)
- Lack of journalistic hedging (`reportedly`, `according to`)

### Domain Credibility
- ✅ **Trusted**: reuters.com, bbc.com, apnews.com, who.int, nature.com, thehindu.com...
- ❌ **Unreliable**: infowars.com, naturalnews.com, beforeitsnews.com...

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| ML Model | Hugging Face BERT (fine-tuned fake news detection) |
| Database | Neon Serverless PostgreSQL |
| Deployment | Vercel (Serverless) |
| Frontend | Vanilla HTML / CSS / JavaScript |

---

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/analyze` | Analyze text/URL for fake news |
| `GET` | `/api/history` | Get last 20 analyzed articles |
| `GET` | `/api/stats` | Get total stats (fake/real counts) |
| `GET` | `/api/health` | Health check |

### Example Request
```bash
curl -X POST https://fake-news-detection-beige-chi.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "SHOCKING scientists EXPOSED hiding cure! SHARE BEFORE DELETED!!!"}'
```

### Example Response
```json
{
  "success": true,
  "verdict": "LIKELY FAKE",
  "verdictColor": "red",
  "compositeScore": 75,
  "confidence": 50,
  "breakdown": {
    "ml": { "label": "AI / ML Model", "score": 82, "model": "BERT-tiny (fine-tuned)" },
    "linguistics": { "label": "Linguistic Analysis", "score": 65, "indicators": ["Sensational language: SHOCKING, EXPOSED", "Clickbait writing patterns detected"] },
    "source": null
  }
}
```

---

## 🛠️ Local Setup

```bash
# 1. Clone
git clone https://github.com/yaswanthkumar7093/fake-news-detection-system.git
cd fake-news-detection-system

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# Set DATABASE_URL from https://neon.tech

# 4. Create DB table
node setup-db.mjs

# 5. Start
npm run dev
# → http://localhost:4000
```

---

## ⚠️ Disclaimer
TruthLens is an AI assistant tool and should not be the sole source of truth. Always verify news with multiple reliable sources.
