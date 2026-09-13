import fetch from 'node-fetch';
import sql from '../config/db.js';

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION DICTIONARIES
// ═══════════════════════════════════════════════════════════════════════════════

// --- Category 1: Sensational clickbait words (strong fake signal) ---
const SENSATIONAL = [
  'SHOCKING','BOMBSHELL','EXPLOSIVE','BREAKING','UNBELIEVABLE','INCREDIBLE',
  'EXPOSED','CAUGHT','BUSTED','ARRESTED','BANNED','CENSORED','DELETED',
  'REVEALED','SECRET','SECRETS','HIDDEN','COVER-UP','COVERUP','CONSPIRACY',
  'HOAX','STAGED','FAKED','FALSE FLAG','CRISIS ACTOR','CRISIS ACTORS',
  'WAKE UP','SHEEPLE','THEY DON\'T WANT YOU TO KNOW','SHARE BEFORE',
  'MUST SEE','URGENT','ALERT','BOMBSHELL','SCANDAL','OUTRAGE',
  'DISGUSTING','SICK','EVIL','CORRUPT','TRAITOR','TREASON','LIES'
];

// --- Category 2: Conspiracy / pseudoscience terms (very strong fake signal) ---
const CONSPIRACY_TERMS = [
  'deep state','new world order','illuminati','chemtrails','5g','microchip',
  'microchipping','rfid chip','vaccine chip','flat earth','crisis actor',
  'false flag','staged shooting','predictive programming','mk-ultra','mind control',
  'depopulation','population control','reptilian','shapeshifter','soros',
  'globalists','nwo','cabal','satanic','adrenochrome','pizzagate','qanon',
  'great reset','world domination','shadow government','secret society',
  'weather weapon','haarp','chemtrail','nanobots','nanotechnology in vaccine',
  'bill gates chip','mark of the beast'
];

// --- Category 3: Medical misinformation terms ---
const MEDICAL_MISINFO = [
  'miracle cure','secret cure','cures cancer','cure for cancer','big pharma',
  'big pharma hiding','doctors hate','suppress','suppressed cure','natural cure',
  'cancer cure hidden','alternative cure','detox','toxins','poison','chemical',
  'deadly vaccine','vaccine kills','vaccine deaths','vaccine injury',
  'autism vaccine','ivermectin cures','bleach cure','hydroxychloroquine miracle',
  'herd immunity lie','pcr test fake','covid hoax','plandemic','scamdemic',
  'fake pandemic','casedemic'
];

// --- Category 4: Political misinformation patterns ---
const POLITICAL_MISINFO = [
  'stolen election','election fraud','rigged election','ballot stuffing',
  'dominion voting','voter fraud','deep state plot','communist takeover',
  'socialist agenda','radical left','far left agenda','globalist agenda',
  'george soros funding','funded by soros','antifa plot','blm plot',
  'great replacement','white genocide','open borders agenda',
  'new world order agenda','martial law','fema camps','gun grab',
  'second amendment attack','first amendment gone','constitution abolished'
];

// --- Category 5: Impossible/absurd claim patterns ---
const IMPOSSIBLE_CLAIMS_PATTERNS = [
  /aliens (living|found|discovered|confirmed|caught|spotted) on (mars|moon|earth)/i,
  /(microchip|rfid|chip) in (vaccine|shot|water|food)/i,
  /(bill gates|george soros|obama|hillary|biden|trump) (arrested|indicted|caught|exposed) for (treason|murder|trafficking|pedophilia)/i,
  /nasa (hiding|cover.?up|concealing) (aliens|ufo|planet|truth)/i,
  /cure for (cancer|aids|hiv|covid|diabetes) (hidden|suppressed|secret)/i,
  /(government|fbi|cia|who|cdc|fda) (poisoning|killing|depopulating)/i,
  /(sun|moon|earth) is (flat|fake|hollow|artificial)/i,
  /(covid|coronavirus|pandemic) (hoax|fake|planned|engineered|bioweapon)/i,
  /\d+,?\d* (children|kids|babies) (killed|murdered|trafficked|sacrificed)/i,
  /(clinton|obama|soros|rothschild|rockefeller) secret (plan|plot|agenda|meeting)/i,
];

// --- Category 6: Emotional trigger words ---
const EMOTIONAL_TRIGGERS = [
  'outrage','outraged','furious','enraged','disgusting','sick','evil','wicked',
  'corrupt','traitor','liar','fraud','scam','hoax','lie','lying','lied',
  'hate','destroy','obliterate','attack','war','kill','murder','massacre',
  'dead','death','genocide','catastrophe','collapse','invasion','infiltrated',
  'pedophile','trafficking','child abuse','grooming','predator','terrorist',
  'extremist','radical','communist','socialist','fascist','nazi','satanic'
];

// --- Category 7: Clickbait phrase patterns ---
const CLICKBAIT_PATTERNS = [
  /you won'?t believe/i, /what happened next/i, /the truth about/i,
  /doctors hate (him|this)/i, /one weird trick/i, /find out why/i,
  /share before (it'?s? )?(deleted|removed|banned|censored)/i,
  /they (don'?t|do not|won'?t|refuse to) want you to (know|see|read)/i,
  /mainstream media (won'?t|refuses? to|is hiding|ignores?)/i,
  /wake up (america|people|sheeple|world|patriots)/i,
  /\[must (watch|read|see)\]/i, /\bbreaking news\b.*!/i,
  /before it'?s? (deleted|too late|banned)/i,
  /\d+ (things|reasons|facts) (they|the media|government) (don'?t|won'?t|never)/i,
  /this will (shock|blow|change|destroy|outrage)/i,
  /the (real|true|hidden|suppressed) (truth|story|facts?|reason)/i,
];

// --- Credible journalistic hedge words ---
const HEDGE_WORDS = [
  'allegedly','reportedly','sources say','according to','claimed','unconfirmed',
  'rumored','might','could','may','possibly','perhaps','some say',
  'authorities say','officials say','police say','the study found',
  'researchers found','data shows','evidence suggests','analysts say',
  'experts say','scientists say','the report states','citing','sourced'
];

// --- Trusted / unreliable domains ---
const RELIABLE_DOMAINS = new Set([
  'reuters.com','apnews.com','bbc.com','bbc.co.uk','theguardian.com',
  'nytimes.com','washingtonpost.com','npr.org','pbs.org','economist.com',
  'bloomberg.com','ft.com','wsj.com','theatlantic.com','science.org',
  'nature.com','who.int','cdc.gov','nih.gov','nasa.gov','un.org',
  'aljazeera.com','dw.com','france24.com','abc.net.au','hindustantimes.com',
  'thehindu.com','ndtv.com','cnbc.com','time.com','newsweek.com',
  'usatoday.com','cbsnews.com','nbcnews.com','abcnews.go.com','cnn.com',
  'politico.com','thehill.com','bbc.co.uk','independent.co.uk','telegraph.co.uk',
  'sciencedirect.com','pubmed.ncbi.nlm.nih.gov','scholar.google.com',
  'sciencenews.org','livescience.com','space.com','smithsonianmag.com'
]);

const UNRELIABLE_DOMAINS = new Set([
  'infowars.com','naturalnews.com','beforeitsnews.com','worldnewsdailyreport.com',
  'empirenews.net','thelastlineofdefense.org','abcnews.com.co','nationalreport.net',
  'huzlers.com','yournewswire.com','neonnettle.com','thegatewaypundit.com',
  'conservativetreehouse.com','wnd.com','americanthinker.com',
  'zerohedge.com','globalresearch.ca','21stcenturywire.com','activistpost.com',
  'thetruthseeker.co.uk','veteranstoday.com','rense.com','prisonplanet.com',
  'whatreallyhappened.com','fourwinds10.net','rumormillnews.com',
  'dcclothesline.com','freedomoutpost.com','truthandaction.org',
  'realnewsrightnow.com','newslo.com','huzlers.com','empirenews.net',
  'clickhole.com','newsthump.com','thespoof.com'
]);

// ═══════════════════════════════════════════════════════════════════════════════
// LINGUISTIC ANALYSIS ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

function analyzeLinguistics(text) {
  if (!text || text.trim().length < 10) {
    return { score: 50, indicators: ['Text too short for meaningful analysis'], confidence: 'very_low' };
  }

  const upper = text.toUpperCase();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/);
  const indicators = [];
  let fakeScore = 10; // slight baseline skepticism

  // ── 1. Conspiracy / pseudoscience terms (HIGH weight) ─────────────────────
  const foundConspiracy = CONSPIRACY_TERMS.filter(t => lower.includes(t));
  if (foundConspiracy.length > 0) {
    const pts = Math.min(foundConspiracy.length * 18, 50);
    fakeScore += pts;
    indicators.push(`Conspiracy terminology: "${foundConspiracy.slice(0, 2).join('", "')}"`);
  }

  // ── 2. Impossible claim patterns (VERY HIGH weight) ──────────────────────
  const foundImpossible = IMPOSSIBLE_CLAIMS_PATTERNS.filter(p => p.test(text));
  if (foundImpossible.length > 0) {
    fakeScore += foundImpossible.length * 25;
    indicators.push('Extraordinary/impossible claims detected');
  }

  // ── 3. Medical misinformation (HIGH weight) ────────────────────────────────
  const foundMedical = MEDICAL_MISINFO.filter(t => lower.includes(t));
  if (foundMedical.length > 0) {
    fakeScore += Math.min(foundMedical.length * 15, 40);
    indicators.push(`Medical misinformation terms: "${foundMedical.slice(0, 2).join('", "')}"`);
  }

  // ── 4. Political misinformation (HIGH weight) ─────────────────────────────
  const foundPolitical = POLITICAL_MISINFO.filter(t => lower.includes(t));
  if (foundPolitical.length > 0) {
    fakeScore += Math.min(foundPolitical.length * 12, 35);
    indicators.push(`Political misinformation patterns: "${foundPolitical.slice(0, 2).join('", "')}"`);
  }

  // ── 5. Sensational words (MEDIUM weight) ─────────────────────────────────
  const foundSensational = SENSATIONAL.filter(w => upper.includes(w));
  if (foundSensational.length > 0) {
    fakeScore += Math.min(foundSensational.length * 6, 25);
    indicators.push(`Sensational language: "${foundSensational.slice(0, 3).join('", "')}"`);
  }

  // ── 6. Clickbait patterns (MEDIUM weight) ────────────────────────────────
  const foundClickbait = CLICKBAIT_PATTERNS.filter(p => p.test(text));
  if (foundClickbait.length > 0) {
    fakeScore += foundClickbait.length * 12;
    indicators.push('Clickbait writing patterns detected');
  }

  // ── 7. Emotional triggers (MEDIUM weight) ────────────────────────────────
  const foundEmotional = EMOTIONAL_TRIGGERS.filter(w => lower.includes(w));
  if (foundEmotional.length >= 2) {
    fakeScore += Math.min(foundEmotional.length * 5, 20);
    indicators.push(`Emotionally charged language (${foundEmotional.length} triggers)`);
  }

  // ── 8. Excessive capitalization (LOW weight) ──────────────────────────────
  const capsWords = words.filter(w => w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
  const capsRatio = capsWords.length / words.length;
  if (capsRatio > 0.25) {
    fakeScore += 15;
    indicators.push(`Excessive capitalization (${Math.round(capsRatio * 100)}% of words)`);
  } else if (capsRatio > 0.15) {
    fakeScore += 7;
    indicators.push(`High capitalization rate (${Math.round(capsRatio * 100)}%)`);
  }

  // ── 9. Excessive punctuation !!!/??? ─────────────────────────────────────
  const exclamations = (text.match(/!{2,}/g) || []).length + (text.match(/!/g) || []).length;
  const questions = (text.match(/\?{2,}/g) || []).length;
  if (exclamations >= 3 || questions >= 2) {
    fakeScore += 10;
    indicators.push('Excessive punctuation (!!!/???)');
  }

  // ── 10. Hedge words REDUCE score (journalistic credibility signal) ─────────
  const foundHedge = HEDGE_WORDS.filter(w => lower.includes(w));
  if (foundHedge.length >= 2) {
    fakeScore -= 15;
    indicators.push('Credible journalistic hedging language used');
  } else if (foundHedge.length === 1) {
    fakeScore -= 5;
  }

  // ── 11. Citation / publication signals ────────────────────────────────────
  const hasCitation = /\b(reuters|ap news|bbc|published in|peer.reviewed|journal|study found|research shows|scientists at|university of|according to (a |the )?(study|report|research))\b/i.test(text);
  if (hasCitation) {
    fakeScore -= 12;
    indicators.push('Credible source or publication reference found');
  }

  // ── 12. Compound amplifier: multiple high-risk categories ─────────────────
  const highRiskCategories = [
    foundConspiracy.length > 0,
    foundImpossible.length > 0,
    foundMedical.length > 0,
    foundPolitical.length > 0,
    foundClickbait.length > 0
  ].filter(Boolean).length;

  if (highRiskCategories >= 3) {
    fakeScore += 15;
    indicators.push(`Multiple misinformation categories triggered (${highRiskCategories}/5)`);
  }

  const clampedScore = Math.max(0, Math.min(100, Math.round(fakeScore)));
  const wordCount = words.length;
  const confidence = wordCount > 100 ? 'high' : wordCount > 40 ? 'medium' : wordCount > 15 ? 'low' : 'very_low';

  return { score: clampedScore, indicators, confidence };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOMAIN CREDIBILITY CHECK
// ═══════════════════════════════════════════════════════════════════════════════

function checkDomain(url) {
  if (!url) return null;
  try {
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`)
      .hostname.replace(/^www\./, '');
    if (RELIABLE_DOMAINS.has(hostname)) return { score: 5,  label: 'Trusted source ✓', domain: hostname };
    if (UNRELIABLE_DOMAINS.has(hostname)) return { score: 92, label: 'Known misinformation site ✗', domain: hostname };
    if (/\.(info|xyz|top|click|biz|ws|cc|tk|ml|ga|cf|gq)$/.test(hostname)) {
      return { score: 68, label: 'Suspicious domain extension', domain: hostname };
    }
    if (/\d{4,}/.test(hostname) || hostname.split('.').length > 3) {
      return { score: 60, label: 'Unusual domain structure', domain: hostname };
    }
    return { score: 45, label: 'Unknown source (unverified)', domain: hostname };
  } catch {
    return { score: 50, label: 'Invalid or missing URL', domain: null };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HUGGING FACE ML INFERENCE (with retry)
// ═══════════════════════════════════════════════════════════════════════════════

async function callHuggingFace(text) {
  const truncated = text.slice(0, 500);
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.HUGGING_FACE_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.HUGGING_FACE_API_KEY}`;
  }

  const MODELS = [
    'mrm8488/bert-tiny-finetuned-fake-news-detection',
    'jy46604790/Fake-News-Bert-Detect'
  ];

  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        { method: 'POST', headers, body: JSON.stringify({ inputs: truncated, options: { wait_for_model: true } }), signal: AbortSignal.timeout(14000) }
      );

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const results = Array.isArray(data[0]) ? data[0] : data;
          const fakeEntry = results.find(r => ['FAKE','LABEL_1','fake','label_1'].includes(r.label));
          const realEntry = results.find(r => ['REAL','LABEL_0','real','label_0'].includes(r.label));
          if (fakeEntry || realEntry) {
            const fakeScore = fakeEntry ? fakeEntry.score * 100 : 100 - (realEntry?.score ?? 0.5) * 100;
            return { score: Math.round(fakeScore), available: true, model };
          }
        }
      }
    } catch { /* try next model */ }
  }

  return { score: null, available: false, model: 'unavailable' };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DETECTION ENDPOINT
// ═══════════════════════════════════════════════════════════════════════════════

export const detectFakeNews = async (req, res, next) => {
  try {
    const { text, url, title } = req.body;
    const content = [title, text].filter(Boolean).join(' ').trim();

    if (!content || content.length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide at least some text or headline to analyze.' });
    }

    // Run ML and heuristics in parallel
    const [mlResult, linguistics, sourceResult] = await Promise.all([
      callHuggingFace(content),
      Promise.resolve(analyzeLinguistics(content)),
      Promise.resolve(checkDomain(url))
    ]);

    // ── Weighted composite score ───────────────────────────────────────────
    let compositeScore;
    if (mlResult.available && mlResult.score !== null) {
      // ML available: 55% ML + 35% linguistics + 10% source
      const srcScore = sourceResult?.score ?? 50;
      compositeScore = mlResult.score * 0.55 + linguistics.score * 0.35 + (sourceResult ? srcScore * 0.10 : 0);
      if (!sourceResult) compositeScore = mlResult.score * 0.60 + linguistics.score * 0.40;
    } else {
      // ML unavailable: 80% linguistics + 20% source (if available)
      compositeScore = sourceResult
        ? linguistics.score * 0.80 + sourceResult.score * 0.20
        : linguistics.score;
    }

    compositeScore = Math.round(Math.max(0, Math.min(100, compositeScore)));

    // ── Verdict with calibrated thresholds ────────────────────────────────
    let verdict, verdictColor;
    if      (compositeScore >= 60) { verdict = 'LIKELY FAKE';  verdictColor = 'red';    }
    else if (compositeScore >= 38) { verdict = 'UNCERTAIN';    verdictColor = 'yellow'; }
    else                            { verdict = 'LIKELY REAL';  verdictColor = 'green';  }

    // ── Response ──────────────────────────────────────────────────────────
    const response = {
      success: true, verdict, verdictColor, compositeScore,
      confidence: Math.round(Math.abs(compositeScore - 50) * 2),
      breakdown: {
        ml: { label: 'AI / ML Model', score: mlResult.available ? mlResult.score : null, model: mlResult.model, available: mlResult.available },
        linguistics: { label: 'Linguistic Analysis', score: linguistics.score, indicators: linguistics.indicators, confidence: linguistics.confidence },
        source: sourceResult ? { label: 'Source Credibility', score: sourceResult.score, domain: sourceResult.domain, domainLabel: sourceResult.label } : null
      },
      analyzedText: content.slice(0, 200) + (content.length > 200 ? '...' : ''),
      analyzedAt: new Date().toISOString()
    };

    // ── Persist ───────────────────────────────────────────────────────────
    try {
      await sql`
        INSERT INTO fake_news_analyses (input_text, input_url, verdict, composite_score, ml_score, ling_score, source_score, indicators)
        VALUES (${content.slice(0, 1000)}, ${url || null}, ${verdict}, ${compositeScore},
                ${mlResult.available ? mlResult.score : null}, ${linguistics.score},
                ${sourceResult?.score ?? null}, ${JSON.stringify(linguistics.indicators)})
      `;
    } catch { /* non-fatal */ }

    return res.status(200).json(response);
  } catch (err) { next(err); }
};

// ═══════════════════════════════════════════════════════════════════════════════
// HISTORY & STATS
// ═══════════════════════════════════════════════════════════════════════════════

export const getHistory = async (req, res, next) => {
  try {
    const rows = await sql`SELECT id, verdict, composite_score, input_url, LEFT(input_text, 120) AS preview, analyzed_at FROM fake_news_analyses ORDER BY analyzed_at DESC LIMIT 20`;
    return res.status(200).json({ success: true, data: rows });
  } catch (err) { next(err); }
};

export const getStats = async (req, res, next) => {
  try {
    const [s] = await sql`
      SELECT COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE verdict = 'LIKELY FAKE')::int AS fake_count,
             COUNT(*) FILTER (WHERE verdict = 'LIKELY REAL')::int AS real_count,
             COUNT(*) FILTER (WHERE verdict = 'UNCERTAIN')::int AS uncertain_count,
             ROUND(AVG(composite_score))::int AS avg_score
      FROM fake_news_analyses`;
    return res.status(200).json({ success: true, data: s });
  } catch (err) { next(err); }
};
