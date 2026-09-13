import fetch from 'node-fetch';
import sql from '../config/db.js';

// ─── Credibility lists ────────────────────────────────────────────────────────
const RELIABLE_DOMAINS = new Set([
  'reuters.com','apnews.com','bbc.com','bbc.co.uk','theguardian.com',
  'nytimes.com','washingtonpost.com','npr.org','pbs.org','economist.com',
  'bloomberg.com','ft.com','wsj.com','theatlantic.com','science.org',
  'nature.com','who.int','cdc.gov','nih.gov','nasa.gov','un.org',
  'aljazeera.com','dw.com','france24.com','abc.net.au','hindustantimes.com',
  'thehindu.com','ndtv.com','timesofindia.com','ndtv.com','cnbc.com',
  'time.com','newsweek.com','usatoday.com','cbsnews.com','nbcnews.com',
  'abcnews.go.com','foxnews.com','cnn.com','politico.com','thehill.com'
]);

const UNRELIABLE_DOMAINS = new Set([
  'infowars.com','naturalnews.com','beforeitsnews.com','worldnewsdailyreport.com',
  'empirenews.net','thelastlineofdefense.org','abcnews.com.co','nationalreport.net',
  'huzlers.com','theonion.com','clickhole.com','babylonbee.com','newslo.com',
  'addictinginfo.com','activistpost.com','globalresearch.ca','zerohedge.com',
  'breitbart.com','dailywire.com','epochtimes.com','oann.com','newsmax.com',
  'yournewswire.com','neonnettle.com','thegatewaypundit.com','conservativetreehouse.com'
]);

// ─── Linguistic analysis lists ────────────────────────────────────────────────
const SENSATIONAL = [
  'SHOCKING','EXPLOSIVE','BOMBSHELL','BREAKING','UNBELIEVABLE','INCREDIBLE',
  'REVEALED','SECRET','EXPOSED','CONSPIRACY','HOAX','COVER-UP','STAGED',
  'WAKE UP','MAINSTREAM MEDIA','THEY DON\'T WANT YOU TO KNOW','MUST SEE',
  'SHARE BEFORE DELETED','URGENT','ALERT','WARNING','DANGER','CRISIS',
  'SCANDAL','OUTRAGE','DISGUSTING','SICK','EVIL','CORRUPT','DEEP STATE'
];

const CLICKBAIT_PATTERNS = [
  /you won't believe/i, /what happened next/i, /this is why/i,
  /\d+ reasons why/i, /the truth about/i, /doctors hate/i,
  /one weird trick/i, /find out why/i, /\[video\]/i,
  /make \$\d+/i, /lose \d+ pounds/i, /click here/i,
  /share before/i, /deleted soon/i, /banned from/i,
  /they don't want/i, /mainstream (media|press) (won't|refuses)/i,
  /wake up (america|people|sheeple)/i
];

const EMOTIONAL_TRIGGERS = [
  'outrage','outraged','furious','disgusting','sick','evil','corrupt',
  'traitor','liar','fraud','fake','scam','hoax','lie','lying',
  'hate','destroy','attack','war','kill','murder','dead','death',
  'disaster','catastrophe','collapse','crash','end of','invasion',
  'genocide','terrorist','extremist','radical','communist','socialist',
  'fascist','nazi','hitler','pedophile','trafficking'
];

const HEDGE_WORDS = [
  'allegedly','reportedly','sources say','according to','claimed','unconfirmed',
  'rumored','might','could','may','possibly','perhaps','some say','many believe'
];

// ─── Linguistic heuristics ─────────────────────────────────────────────────
function analyzeLinguistics(text) {
  if (!text || text.trim().length < 20) {
    return { score: 50, indicators: ['Text too short for analysis'], confidence: 'low' };
  }

  const upper = text.toUpperCase();
  const words = text.split(/\s+/);
  const indicators = [];
  let fakeScore = 0; // 0 = real, 100 = fake

  // 1. Sensational words
  const foundSensational = SENSATIONAL.filter(w => upper.includes(w));
  if (foundSensational.length > 0) {
    fakeScore += Math.min(foundSensational.length * 8, 30);
    indicators.push(`Sensational language: ${foundSensational.slice(0, 3).join(', ')}`);
  }

  // 2. Clickbait patterns
  const foundClickbait = CLICKBAIT_PATTERNS.filter(p => p.test(text));
  if (foundClickbait.length > 0) {
    fakeScore += foundClickbait.length * 10;
    indicators.push('Clickbait writing patterns detected');
  }

  // 3. Excessive caps (>30% of words are all caps)
  const capsWords = words.filter(w => w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
  const capsRatio = capsWords.length / words.length;
  if (capsRatio > 0.3) {
    fakeScore += 15;
    indicators.push(`Excessive capitalization (${Math.round(capsRatio * 100)}%)`);
  }

  // 4. Emotional triggers
  const lowerText = text.toLowerCase();
  const foundEmotional = EMOTIONAL_TRIGGERS.filter(w => lowerText.includes(w));
  if (foundEmotional.length >= 3) {
    fakeScore += Math.min(foundEmotional.length * 4, 20);
    indicators.push(`Heavy emotional language: ${foundEmotional.slice(0, 3).join(', ')}`);
  }

  // 5. Excessive punctuation (!!!, ???)
  const exclamations = (text.match(/!{2,}/g) || []).length;
  const questions = (text.match(/\?{2,}/g) || []).length;
  if (exclamations + questions > 2) {
    fakeScore += 10;
    indicators.push('Excessive punctuation (!!!//????)');
  }

  // 6. Hedge words (reduce fake score — legitimate journalism uses these)
  const foundHedge = HEDGE_WORDS.filter(w => lowerText.includes(w));
  if (foundHedge.length >= 2) {
    fakeScore -= 10;
    indicators.push(`Responsible hedging language used`);
  }

  // 7. Very short text with bold claim
  if (words.length < 30 && foundSensational.length > 0) {
    fakeScore += 10;
    indicators.push('Short text with sensational claim');
  }

  // 8. No author / publication indicators (heuristic)
  const hasPublication = /\b(reported by|by |according to|published|journal|study|research)\b/i.test(text);
  if (!hasPublication && words.length > 50) {
    fakeScore += 5;
    indicators.push('No publication or author reference');
  }

  const clampedScore = Math.max(0, Math.min(100, fakeScore));
  return {
    score: clampedScore,      // higher = more likely fake
    indicators,
    confidence: words.length > 100 ? 'high' : words.length > 40 ? 'medium' : 'low'
  };
}

// ─── Domain credibility ───────────────────────────────────────────────────────
function checkDomain(url) {
  if (!url) return null;
  try {
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
      .replace(/^www\./, '');
    if (RELIABLE_DOMAINS.has(hostname)) return { score: 10, label: 'Trusted source', domain: hostname };
    if (UNRELIABLE_DOMAINS.has(hostname)) return { score: 90, label: 'Known unreliable source', domain: hostname };
    // Unknown domain — neutral with slight suspicion
    if (/\.(info|xyz|top|click|biz|ws)$/.test(hostname)) {
      return { score: 65, label: 'Suspicious TLD domain', domain: hostname };
    }
    return { score: 45, label: 'Unknown source', domain: hostname };
  } catch {
    return { score: 50, label: 'Invalid URL', domain: null };
  }
}

// ─── Hugging Face BERT Inference ──────────────────────────────────────────────
async function callHuggingFace(text) {
  const truncated = text.slice(0, 512); // BERT token limit
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.HUGGING_FACE_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.HUGGING_FACE_API_KEY}`;
  }

  // Try primary model
  try {
    const res = await fetch(
      'https://api-inference.huggingface.co/models/mrm8488/bert-tiny-finetuned-fake-news-detection',
      { method: 'POST', headers, body: JSON.stringify({ inputs: truncated }), signal: AbortSignal.timeout(12000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        const results = Array.isArray(data[0]) ? data[0] : data;
        const fakeEntry  = results.find(r => r.label === 'FAKE' || r.label === 'LABEL_1');
        const realEntry  = results.find(r => r.label === 'REAL' || r.label === 'LABEL_0');
        if (fakeEntry || realEntry) {
          const fakeScore = fakeEntry ? fakeEntry.score * 100 : 100 - (realEntry?.score * 100 || 50);
          return { score: fakeScore, available: true, model: 'BERT-tiny (fine-tuned)' };
        }
      }
    }
  } catch { /* fallthrough */ }

  // Fallback: zero-shot with distilbart
  try {
    const res = await fetch(
      'https://api-inference.huggingface.co/models/typeform/distilbert-base-uncased-mnli',
      {
        method: 'POST', headers,
        body: JSON.stringify({
          inputs: truncated,
          parameters: { candidate_labels: ['reliable news', 'fake news', 'misleading information'] }
        }),
        signal: AbortSignal.timeout(15000)
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.labels && data.scores) {
        const fakeIdx = data.labels.findIndex(l => l === 'fake news');
        const misleadIdx = data.labels.findIndex(l => l === 'misleading information');
        const fakeScore = ((data.scores[fakeIdx] || 0) + (data.scores[misleadIdx] || 0)) * 60;
        return { score: fakeScore, available: true, model: 'DistilBERT zero-shot' };
      }
    }
  } catch { /* fallthrough */ }

  return { score: null, available: false, model: 'unavailable' };
}

// ─── Main detection endpoint ──────────────────────────────────────────────────
export const detectFakeNews = async (req, res, next) => {
  try {
    const { text, url, title } = req.body;
    const content = [title, text].filter(Boolean).join(' ').trim();

    if (!content || content.length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide at least some text to analyze.' });
    }

    // Run all analyses in parallel
    const [mlResult, linguistics, sourceResult] = await Promise.all([
      callHuggingFace(content),
      Promise.resolve(analyzeLinguistics(content)),
      Promise.resolve(checkDomain(url))
    ]);

    // ── Compute weighted composite score ──────────────────────────────────────
    let weights = { ml: 0, ling: 0, source: 0 };
    let totalWeight = 0;
    let compositeScore = 0;

    if (mlResult.available && mlResult.score !== null) {
      weights.ml = 0.55;
    }
    weights.ling   = mlResult.available ? 0.30 : 0.70;
    weights.source = sourceResult ? (mlResult.available ? 0.15 : 0.30) : 0;

    // Normalise weights
    totalWeight = weights.ml + weights.ling + weights.source;
    if (totalWeight > 0) {
      const mlScore   = mlResult.available ? mlResult.score : 50;
      const lingScore = linguistics.score;
      const srcScore  = sourceResult?.score ?? 50;
      compositeScore = (mlScore * weights.ml + lingScore * weights.ling + srcScore * weights.source) / totalWeight;
    } else {
      compositeScore = linguistics.score;
    }

    compositeScore = Math.round(Math.max(0, Math.min(100, compositeScore)));

    // ── Verdict ───────────────────────────────────────────────────────────────
    let verdict, verdictColor;
    if (compositeScore >= 65)      { verdict = 'LIKELY FAKE';    verdictColor = 'red';    }
    else if (compositeScore >= 45) { verdict = 'UNCERTAIN';      verdictColor = 'yellow'; }
    else                            { verdict = 'LIKELY REAL';    verdictColor = 'green';  }

    // ── Build response ────────────────────────────────────────────────────────
    const response = {
      success: true,
      verdict,
      verdictColor,
      compositeScore,
      confidence: Math.round(Math.abs(compositeScore - 50) * 2), // 0-100 confidence
      breakdown: {
        ml: {
          label: 'AI / ML Model',
          score: mlResult.available ? Math.round(mlResult.score) : null,
          model: mlResult.model,
          available: mlResult.available
        },
        linguistics: {
          label: 'Linguistic Analysis',
          score: linguistics.score,
          indicators: linguistics.indicators,
          confidence: linguistics.confidence
        },
        source: sourceResult ? {
          label: 'Source Credibility',
          score: sourceResult.score,
          domain: sourceResult.domain,
          domainLabel: sourceResult.label
        } : null
      },
      analyzedText: content.slice(0, 200) + (content.length > 200 ? '...' : ''),
      analyzedAt: new Date().toISOString()
    };

    // ── Persist to DB ─────────────────────────────────────────────────────────
    try {
      await sql`
        INSERT INTO fake_news_analyses
          (input_text, input_url, verdict, composite_score, ml_score, ling_score, source_score, indicators)
        VALUES (
          ${content.slice(0, 1000)},
          ${url || null},
          ${verdict},
          ${compositeScore},
          ${mlResult.available ? Math.round(mlResult.score) : null},
          ${linguistics.score},
          ${sourceResult?.score ?? null},
          ${JSON.stringify(linguistics.indicators)}
        )
      `;
    } catch { /* DB save failure is non-fatal */ }

    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

// ─── History endpoint ─────────────────────────────────────────────────────────
export const getHistory = async (req, res, next) => {
  try {
    const rows = await sql`
      SELECT id, verdict, composite_score, input_url,
             LEFT(input_text, 120) AS preview, analyzed_at
      FROM fake_news_analyses
      ORDER BY analyzed_at DESC
      LIMIT 20
    `;
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// ─── Stats endpoint ───────────────────────────────────────────────────────────
export const getStats = async (req, res, next) => {
  try {
    const [totals] = await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE verdict = 'LIKELY FAKE')::int AS fake_count,
        COUNT(*) FILTER (WHERE verdict = 'LIKELY REAL')::int AS real_count,
        COUNT(*) FILTER (WHERE verdict = 'UNCERTAIN')::int AS uncertain_count,
        ROUND(AVG(composite_score))::int AS avg_score
      FROM fake_news_analyses
    `;
    return res.status(200).json({ success: true, data: totals });
  } catch (err) {
    next(err);
  }
};
