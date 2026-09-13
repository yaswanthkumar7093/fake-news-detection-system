const API = window.location.origin;
let activeTab = 'text';

// ── Tab switching ────────────────────────────────────────────────────────────
function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${tab}`));
}

// ── Char counter ─────────────────────────────────────────────────────────────
document.getElementById('input-text')?.addEventListener('input', function () {
  document.getElementById('char-count').textContent = this.value.length;
});

// ── Main analyze handler ─────────────────────────────────────────────────────
async function handleAnalyze(e) {
  e.preventDefault();
  hideError();

  let text = '', url = '', title = '';

  if (activeTab === 'text') {
    title = document.getElementById('input-title').value.trim();
    text  = document.getElementById('input-text').value.trim();
  } else {
    url  = document.getElementById('input-url').value.trim();
    text = document.getElementById('input-url-text').value.trim();
  }

  const combined = [title, text].join(' ').trim();
  if (combined.length < 10) {
    showError('Please enter at least a headline or article text (minimum 10 characters).');
    return;
  }

  setLoading(true);
  document.getElementById('result-section').style.display = 'none';

  try {
    const res = await fetch(`${API}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, url, title })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Analysis failed.');
    renderResult(data);
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

// ── Render result ────────────────────────────────────────────────────────────
function renderResult(data) {
  const card = document.getElementById('result-card');
  const colorMap = { red: 'red', green: 'green', yellow: 'yellow' };
  const color = colorMap[data.verdictColor] || 'yellow';

  // Card border color
  card.className = `result-card ${color}`;

  // Verdict
  const vEl = document.getElementById('result-verdict');
  vEl.textContent = data.verdict;
  vEl.className = `result-verdict ${color}`;

  // Score ring
  const score = data.compositeScore;
  const circumference = 251;
  const offset = circumference - (score / 100) * circumference;
  const ringFill = document.getElementById('ring-fill');
  ringFill.style.strokeDashoffset = offset;
  ringFill.style.stroke = color === 'red' ? '#ef4444' : color === 'green' ? '#10b981' : '#f59e0b';
  document.getElementById('ring-score').textContent = score;

  // Preview text
  document.getElementById('result-preview').textContent = `"${data.analyzedText}"`;

  // Breakdown
  const grid = document.getElementById('breakdown-grid');
  grid.innerHTML = '';
  const { ml, linguistics, source } = data.breakdown;

  // ML result
  grid.innerHTML += buildBreakdownItem(
    ml.available ? '🤖 BERT AI Model' : '🤖 BERT AI Model',
    ml.available ? ml.score : null,
    ml.available ? ml.model : 'Model unavailable (rate limit)',
    ml.available
  );

  // Linguistics
  grid.innerHTML += buildBreakdownItem('🔤 Linguistic Analysis', linguistics.score, `Confidence: ${linguistics.confidence}`, true);

  // Source
  if (source) {
    grid.innerHTML += buildBreakdownItem('🌐 Source Credibility', source.score, `${source.domainLabel} — ${source.domain}`, true);
  }

  // Indicators
  const indSection = document.getElementById('indicators-section');
  const indTags = document.getElementById('indicator-tags');
  if (linguistics.indicators && linguistics.indicators.length > 0) {
    indTags.innerHTML = linguistics.indicators.map(ind => {
      const isOk = ind.toLowerCase().includes('hedging') || ind.toLowerCase().includes('responsible');
      return `<span class="tag ${isOk ? 'tag-ok' : 'tag-warn'}">${ind}</span>`;
    }).join('');
    indSection.style.display = 'block';
  } else {
    indSection.style.display = 'none';
  }

  document.getElementById('result-section').style.display = 'block';
  document.getElementById('result-section').scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Refresh history
  setTimeout(loadHistory, 1000);
}

function buildBreakdownItem(label, score, sub, available) {
  if (!available || score === null) {
    return `<div class="breakdown-item">
      <div class="b-label">${label}</div>
      <div class="b-na">${sub || 'Unavailable'}</div>
    </div>`;
  }
  const barColor = score >= 65 ? '#ef4444' : score >= 45 ? '#f59e0b' : '#10b981';
  const scoreColor = score >= 65 ? '#f87171' : score >= 45 ? '#fbbf24' : '#34d399';
  return `<div class="breakdown-item">
    <div class="b-label">${label}</div>
    <div class="b-score" style="color:${scoreColor}">${score}<small style="font-size:.9rem;font-weight:500">/100</small></div>
    <div class="b-sub">${sub}</div>
    <div class="b-bar"><div class="b-bar-fill" style="width:${score}%;background:${barColor}"></div></div>
  </div>`;
}

// ── Reset form ────────────────────────────────────────────────────────────────
function resetForm() {
  document.getElementById('result-section').style.display = 'none';
  document.getElementById('input-text').value = '';
  document.getElementById('input-title').value = '';
  document.getElementById('input-url').value = '';
  document.getElementById('input-url-text').value = '';
  document.getElementById('char-count').textContent = '0';
  document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth' });
}

// ── History ───────────────────────────────────────────────────────────────────
async function loadHistory() {
  const container = document.getElementById('history-container');
  try {
    const res = await fetch(`${API}/api/history`);
    const data = await res.json();
    if (!data.success || !data.data.length) {
      container.innerHTML = '<div class="empty-history">No analyses yet. Be the first to analyze an article! 🎯</div>';
      return;
    }
    container.innerHTML = `<div class="history-list">
      ${data.data.map(item => {
        const colorMap = { 'LIKELY FAKE': 'red', 'LIKELY REAL': 'green', 'UNCERTAIN': 'yellow' };
        const c = colorMap[item.verdict] || 'yellow';
        const time = new Date(item.analyzed_at).toLocaleString();
        return `<div class="history-item">
          <span class="h-verdict ${c}">${item.verdict}</span>
          <span class="h-text">${escapeHtml(item.preview)}…</span>
          <span class="h-score">${item.composite_score}/100</span>
        </div>`;
      }).join('')}
    </div>`;
  } catch {
    container.innerHTML = '<div class="empty-history">Unable to load history.</div>';
  }
}

// ── Stats ─────────────────────────────────────────────────────────────────────
async function loadStats() {
  try {
    const res = await fetch(`${API}/api/stats`);
    const data = await res.json();
    if (data.success && data.data) {
      const s = data.data;
      document.getElementById('stat-total').textContent = s.total ?? '—';
      document.getElementById('stat-fake').textContent = s.fake_count ?? '—';
    }
  } catch { /* non-fatal */ }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function setLoading(on) {
  const btn = document.getElementById('analyze-btn');
  document.getElementById('btn-text').style.display = on ? 'none' : 'flex';
  document.getElementById('btn-loader').style.display = on ? 'inline-block' : 'none';
  btn.disabled = on;
}

function showError(msg) {
  const el = document.getElementById('analyze-error');
  el.textContent = `⚠️ ${msg}`;
  el.style.display = 'block';
}

function hideError() {
  document.getElementById('analyze-error').style.display = 'none';
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Init ──────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  loadHistory();
  loadStats();
});
