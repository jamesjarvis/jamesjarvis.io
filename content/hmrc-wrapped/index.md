---
title: "HMRC Wrapped 🧾"
date: 2026-03-07
summary: "Find out exactly what you personally funded with your taxes this year — doctors, missiles, pensioners and all."
showTableOfContents: false
showAuthor: false
showDate: false
showReadingTime: false
showPagination: false
showTaxonomies: false
sharingLinks: ["x-twitter", "linkedin", "bluesky"]
---

*Like Spotify Wrapped, but instead of embarrassing music taste, it's your contribution to the national debt.*

Enter your income below to see a personalised breakdown of where your taxes went in 2025-26, based on [HM Treasury's official spending data](https://www.gov.uk/government/statistics/public-expenditure-statistical-analyses-2024).

<div class="hmrc-wrapped">

<div class="hw-card hw-input-card">
  <h2 class="hw-section-title">💷 Your Income</h2>

  <div class="hw-field">
    <label class="hw-label" for="hw-salary">Gross annual salary / income</label>
    <div class="hw-input-wrap">
      <span class="hw-prefix">£</span>
      <input class="hw-input" type="number" id="hw-salary" placeholder="50000" min="0" max="10000000" step="1000">
    </div>
  </div>

  <div class="hw-field">
    <label class="hw-label hw-toggle-label" for="hw-advanced-toggle">
      <input type="checkbox" id="hw-advanced-toggle" class="hw-checkbox">
      <span>Advanced mode</span>
      <span class="hw-badge">self-employed · capital gains · VAT · more</span>
    </label>
  </div>

  <div id="hw-advanced" class="hw-advanced-panel" style="display:none">
    <div class="hw-divider"></div>

    <div class="hw-field">
      <label class="hw-label">Employment type</label>
      <div class="hw-radio-group">
        <label class="hw-radio-label">
          <input type="radio" name="hw-emp-type" value="paye" checked class="hw-radio"> PAYE (employed)
        </label>
        <label class="hw-radio-label">
          <input type="radio" name="hw-emp-type" value="se" class="hw-radio"> Self-employed
        </label>
      </div>
    </div>

    <div class="hw-field" id="hw-employer-ni-field">
      <label class="hw-label hw-toggle-label" for="hw-show-employer-ni">
        <input type="checkbox" id="hw-show-employer-ni" class="hw-checkbox" checked>
        <span>Include employer's NI</span>
        <span class="hw-badge">the tax your employer pays on your behalf — ultimately it's yours</span>
      </label>
    </div>

    <div class="hw-field">
      <label class="hw-label" for="hw-pension">Salary sacrifice pension contribution (annual)</label>
      <div class="hw-input-wrap">
        <span class="hw-prefix">£</span>
        <input class="hw-input" type="number" id="hw-pension" placeholder="0" min="0" step="500">
      </div>
      <span class="hw-hint">Reduces your taxable income</span>
    </div>

    <div class="hw-field">
      <label class="hw-label" for="hw-cap-gains">Capital gains this year</label>
      <div class="hw-input-wrap">
        <span class="hw-prefix">£</span>
        <input class="hw-input" type="number" id="hw-cap-gains" placeholder="0" min="0" step="1000">
      </div>
      <div class="hw-radio-group hw-mt-xs">
        <label class="hw-radio-label">
          <input type="radio" name="hw-cgt-type" value="other" checked class="hw-radio"> Shares / other (18% / 24%)
        </label>
        <label class="hw-radio-label">
          <input type="radio" name="hw-cgt-type" value="residential" class="hw-radio"> Residential property (18% / 24%)
        </label>
      </div>
    </div>

    <div class="hw-field">
      <label class="hw-label" for="hw-interest">Savings interest this year</label>
      <div class="hw-input-wrap">
        <span class="hw-prefix">£</span>
        <input class="hw-input" type="number" id="hw-interest" placeholder="0" min="0" step="100">
      </div>
      <span class="hw-hint">Personal Savings Allowance: £1,000 (basic rate), £500 (higher rate)</span>
    </div>

    <div class="hw-field">
      <label class="hw-label" for="hw-council-tax">Council tax (annual)</label>
      <div class="hw-input-wrap">
        <span class="hw-prefix">£</span>
        <input class="hw-input" type="number" id="hw-council-tax" placeholder="2280" min="0" step="100">
      </div>
      <span class="hw-hint">England Band D average 2025-26 ≈ £2,280</span>
    </div>

    <div class="hw-field">
      <label class="hw-label hw-toggle-label" for="hw-show-vat">
        <input type="checkbox" id="hw-show-vat" class="hw-checkbox" checked>
        <span>Include estimated VAT</span>
        <span class="hw-badge">≈13.5% of your consumer spending</span>
      </label>
    </div>
  </div>

  <button class="hw-btn" id="hw-calculate-btn" onclick="hwCalculate()">Calculate my tax receipt →</button>
</div>

<div id="hw-results" style="display:none">

  <div class="hw-card" id="hw-summary-card">
    <h2 class="hw-section-title">🧾 Your Tax Receipt — 2025/26</h2>
    <table class="hw-table" id="hw-tax-table"></table>
    <div class="hw-total-row" id="hw-total-row"></div>
  </div>

  <div class="hw-card">
    <h2 class="hw-section-title">📊 Where It Goes</h2>
    <p class="hw-subtitle">Based on HM Treasury's functional spending breakdown (PESA 2024)</p>
    <div id="hw-spending-bars"></div>
  </div>

  <div class="hw-card">
    <h2 class="hw-section-title">🎁 What You Actually Funded</h2>
    <p class="hw-subtitle">Your direct tax contribution, expressed in real terms. You're welcome, Britain.</p>
    <div id="hw-fun-section" class="hw-fun-grid"></div>
  </div>

  <div class="hw-card hw-sources-card">
    <h2 class="hw-section-title">📎 Data Sources & Notes</h2>
    <ul class="hw-sources-list">
      <li>Tax rates: <a href="https://www.gov.uk/income-tax-rates" target="_blank" rel="noopener">HMRC Income Tax rates 2025-26</a></li>
      <li>Spending breakdown: <a href="https://www.gov.uk/government/statistics/public-expenditure-statistical-analyses-2024" target="_blank" rel="noopener">HM Treasury PESA 2024</a>, using HMRC's own tax summary categories</li>
      <li>Employer NI: 15% on earnings above £5,000 secondary threshold (from April 2025)</li>
      <li>VAT estimate: 13.5% of estimated consumer spending (OBR methodology)</li>
      <li>Fun equivalents are approximate. GP cost: <a href="https://www.pssru.ac.uk/project-pages/unit-costs/" target="_blank" rel="noopener">PSSRU Unit Costs of Health &amp; Social Care 2023</a>. Brimstone missile: <a href="https://www.nao.org.uk/" target="_blank" rel="noopener">NAO defence procurement data</a>.</li>
      <li>This tool is for illustration only and does not constitute financial or tax advice. For personal tax calculations please consult a qualified adviser or <a href="https://www.gov.uk/self-assessment-tax-returns" target="_blank" rel="noopener">HMRC directly</a>.</li>
    </ul>
  </div>

</div>

</div>

<style>
/* ── HMRC Wrapped scoped styles ── */
.hmrc-wrapped {
  font-family: inherit;
  max-width: 680px;
  margin: 0 auto;
}

.hw-card {
  background: var(--color-neutral-50, #fafafa);
  border: 1px solid var(--color-neutral-200, #e5e5e5);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
}

.dark .hw-card {
  background: var(--color-neutral-800, #262626);
  border-color: var(--color-neutral-700, #404040);
}

.hw-section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  padding: 0;
  border: none;
}

.hw-subtitle {
  font-size: 0.82rem;
  opacity: 0.65;
  margin: 0 0 1rem 0;
}

.hw-field {
  margin-bottom: 1rem;
}

.hw-label {
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
  opacity: 0.9;
}

.hw-toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.hw-badge {
  font-size: 0.72rem;
  font-weight: 400;
  opacity: 0.6;
  background: var(--color-neutral-200, #e5e5e5);
  border-radius: 4px;
  padding: 0.1em 0.4em;
}

.dark .hw-badge {
  background: var(--color-neutral-700, #404040);
}

.hw-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-neutral-300, #d4d4d4);
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-neutral-100, #f5f5f5);
  transition: border-color 0.15s;
}

.dark .hw-input-wrap {
  background: var(--color-neutral-900, #171717);
  border-color: var(--color-neutral-600, #525252);
}

.hw-input-wrap:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
}

.hw-prefix {
  padding: 0.5rem 0.65rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-neutral-500, #737373);
  background: var(--color-neutral-200, #e5e5e5);
  border-right: 1px solid var(--color-neutral-300, #d4d4d4);
  line-height: 1;
}

.dark .hw-prefix {
  background: var(--color-neutral-700, #404040);
  border-color: var(--color-neutral-600, #525252);
}

.hw-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  color: inherit;
  outline: none;
  -moz-appearance: textfield;
}

.hw-input::-webkit-outer-spin-button,
.hw-input::-webkit-inner-spin-button { -webkit-appearance: none; }

.hw-hint {
  display: block;
  font-size: 0.75rem;
  opacity: 0.55;
  margin-top: 0.3rem;
}

.hw-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
}

.hw-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hw-radio-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.hw-radio {
  cursor: pointer;
}

.hw-mt-xs { margin-top: 0.5rem; }

.hw-divider {
  border: none;
  border-top: 1px solid var(--color-neutral-200, #e5e5e5);
  margin: 0.75rem 0 1rem;
}

.dark .hw-divider {
  border-color: var(--color-neutral-700, #404040);
}

.hw-advanced-panel {
  animation: hwFadeIn 0.2s ease;
}

@keyframes hwFadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.hw-btn {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.65rem 1.4rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}

.hw-btn:hover { background: #2563eb; }
.hw-btn:active { transform: scale(0.98); }

/* ── Tax table ── */
.hw-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.hw-table tr {
  border-bottom: 1px solid var(--color-neutral-200, #e5e5e5);
}

.dark .hw-table tr {
  border-color: var(--color-neutral-700, #404040);
}

.hw-table td {
  padding: 0.45rem 0.25rem;
}

.hw-table td:last-child {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.hw-table .hw-row-note {
  font-size: 0.75rem;
  opacity: 0.55;
  padding-left: 1rem;
}

.hw-total-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-weight: 700;
  font-size: 1.05rem;
  padding-top: 0.5rem;
  border-top: 2px solid var(--color-neutral-400, #a3a3a3);
}

/* ── Spending bars ── */
.hw-bar-row {
  display: grid;
  grid-template-columns: 1.5rem 10rem 1fr 3.5rem;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.55rem;
  font-size: 0.85rem;
}

@media (max-width: 520px) {
  .hw-bar-row {
    grid-template-columns: 1.5rem 1fr 3rem;
  }
  .hw-bar-track { grid-column: 1 / -1; margin-top: -0.3rem; }
}

.hw-bar-emoji { text-align: center; font-size: 1rem; line-height: 1; }
.hw-bar-label { opacity: 0.85; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hw-bar-track {
  height: 8px;
  background: var(--color-neutral-200, #e5e5e5);
  border-radius: 4px;
  overflow: hidden;
}

.dark .hw-bar-track {
  background: var(--color-neutral-700, #404040);
}

.hw-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
}

.hw-bar-pct {
  text-align: right;
  font-size: 0.78rem;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}

/* ── Fun section ── */
.hw-fun-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (max-width: 480px) {
  .hw-fun-grid { grid-template-columns: 1fr; }
}

.hw-fun-card {
  background: var(--color-neutral-100, #f0f0f0);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  border-left: 4px solid #ccc;
}

.dark .hw-fun-card {
  background: var(--color-neutral-700, #404040);
}

.hw-fun-card-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
}

.hw-fun-card-amount {
  font-size: 0.75rem;
  opacity: 0.55;
  font-weight: 400;
}

.hw-fun-item {
  font-size: 0.83rem;
  line-height: 1.5;
  opacity: 0.9;
}

.hw-fun-item::before {
  content: "→ ";
  opacity: 0.5;
}

/* ── Sources ── */
.hw-sources-card {
  font-size: 0.82rem;
  opacity: 0.85;
}

.hw-sources-list {
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
}

.hw-sources-list li {
  margin-bottom: 0.35rem;
}
</style>

<script>
(function() {

// ── 2025-26 Tax Rates ──────────────────────────────────────────────────────

var TR = {
  personalAllowance: 12570,
  basicRateLimit: 50270,
  higherRateLimit: 125140,
  taperStart: 100000,
  basicRate: 0.20,
  higherRate: 0.40,
  additionalRate: 0.45,

  niPrimary: 12570,
  niUEL: 50270,
  niBasicRate: 0.08,
  niHighRate: 0.02,

  // Employer NI 2025-26 (post Autumn Budget 2024)
  niSecondaryThreshold: 5000,
  niEmployerRate: 0.15,

  // Self-employed Class 4
  se4Rate: 0.06,
  se4HighRate: 0.02,

  // CGT (post Oct 2024 Budget – unified rates)
  cgtExempt: 3000,
  cgtBasicRate: 0.18,
  cgtHigherRate: 0.24,

  // PSA
  psaBasic: 1000,
  psaHigher: 500,
  psaAdditional: 0,
  startingRateBand: 5000,
  startingRateThreshold: 17570,
};

// ── Spending Categories ───────────────────────────────────────────────────

var SPENDING = [
  { key: 'welfare',    label: 'Welfare',          pct: 0.245, emoji: '🏠', color: '#f59e0b' },
  { key: 'health',     label: 'Health (NHS)',      pct: 0.206, emoji: '🏥', color: '#10b981' },
  { key: 'pensions',   label: 'State Pensions',    pct: 0.125, emoji: '👴', color: '#8b5cf6' },
  { key: 'education',  label: 'Education',         pct: 0.113, emoji: '📚', color: '#3b82f6' },
  { key: 'debt',       label: 'Debt Interest',     pct: 0.080, emoji: '📉', color: '#ef4444' },
  { key: 'defence',    label: 'Defence',           pct: 0.050, emoji: '🛡️', color: '#6b7280' },
  { key: 'transport',  label: 'Transport',         pct: 0.044, emoji: '🚆', color: '#0ea5e9' },
  { key: 'business',   label: 'Business & Industry',pct: 0.030,emoji: '🏭', color: '#d97706' },
  { key: 'housing',    label: 'Housing & Environment',pct:0.022,emoji:'🌿', color: '#22c55e' },
  { key: 'overseas',   label: 'Overseas Aid',      pct: 0.015, emoji: '🌍', color: '#14b8a6' },
  { key: 'admin',      label: 'Government Admin',  pct: 0.020, emoji: '🏛️', color: '#a855f7' },
  { key: 'other',      label: 'Other',             pct: 0.050, emoji: '📦', color: '#94a3b8' },
];

// ── Fun Equivalents ────────────────────────────────────────────────────────

var FUN = {
  health: [
    { unit: 'GP appointment', cost: 43,  fmt: function(n){ return fmtN(n) + ' GP appointment' + (n!==1?'s':''); } },
    { unit: 'A&E visit',      cost: 200, fmt: function(n){ return fmtN(n) + ' A&E visit' + (n!==1?'s':''); } },
    { unit: 'hospital bed-day',cost:400, fmt: function(n){ return fmtN(n) + ' hospital bed-day' + (n!==1?'s':''); } },
  ],
  pensions: [
    { unit: 'week of State Pension', cost: 221.20, fmt: function(n){ return fmtN(n) + ' week' + (n!==1?'s':'')+' of State Pension (£221.20/wk)'; } },
  ],
  welfare: [
    { unit: 'week of Universal Credit', cost: 85.45, fmt: function(n){ return fmtN(n)+' week'+(n!==1?'s':'')+' of Universal Credit'; } },
    { unit: 'month of housing benefit', cost: 120, fmt: function(n){ return fmtN(n)+' month'+(n!==1?'s':'')+' of housing benefit'; } },
  ],
  education: [
    { unit: 'primary school pupil-day', cost: 36.82, fmt: function(n){ return fmtN(n)+' primary school pupil-day'+(n!==1?'s':''); } },
    { unit: "teacher's day salary",     cost: 230,   fmt: function(n){ return fmtN(n)+" teacher day"+(n!==1?'s':'')+" of salary"; } },
  ],
  defence: [
    { unit: 'Brimstone missile',         cost: 105000, fmt: function(n){ return fmtFrac(n,'Brimstone missile'); } },
    { unit: 'Typhoon flight-hour',        cost: 10000,  fmt: function(n){ return fmtFrac(n,'Typhoon flight-hour'); } },
    { unit: 'Royal Marines salary (day)', cost: 82,     fmt: function(n){ return fmtN(n)+' Royal Marines salary-day'+(n!==1?'s':''); } },
  ],
  transport: [
    { unit: 'metre of new A-road',    cost: 3000,   fmt: function(n){ return fmtN(n)+' metre'+(n!==1?'s':'')+' of new A-road'; } },
    { unit: 'pothole repair',         cost: 50,     fmt: function(n){ return fmtN(n)+' pothole repair'+(n!==1?'s':''); } },
  ],
  debt: [
    { unit: 'second of national debt interest', cost: 3263, fmt: function(n){ return fmtFrac(n,'second')+' of national debt interest'; } },
  ],
  housing: [
    { unit: 'social housing tenancy (month)', cost: 180, fmt: function(n){ return fmtN(n)+' month'+(n!==1?'s':'')+' of social housing'; } },
  ],
  overseas: [
    { unit: 'aid meal',            cost: 0.30, fmt: function(n){ return fmtN(n)+' aid meal'+(n!==1?'s':''); } },
    { unit: 'vaccine dose',        cost: 1.80, fmt: function(n){ return fmtN(n)+' vaccine dose'+(n!==1?'s':''); } },
  ],
  business: [
    { unit: 'enterprise grant (day)',cost: 250, fmt: function(n){ return fmtFrac(n,'enterprise grant-day'); } },
  ],
  admin: [
    { unit: 'civil servant salary-day', cost: 110, fmt: function(n){ return fmtN(n)+' civil servant salary-day'+(n!==1?'s':''); } },
  ],
  other: [
    { unit: 'miscellaneous public service',cost: 100, fmt: function(n){ return fmtN(n)+' miscellaneous public service unit'+(n!==1?'s':''); } },
  ],
};

// ── Formatting helpers ─────────────────────────────────────────────────────

function fmt(n) {
  return '£' + Math.round(n).toLocaleString('en-GB');
}

function fmtDec(n) {
  return '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtN(n) {
  if (n >= 100) return Math.round(n).toLocaleString('en-GB');
  if (n >= 10)  return Math.round(n).toLocaleString('en-GB');
  if (n >= 1)   return parseFloat(n.toFixed(1)).toLocaleString('en-GB');
  // fractional
  var frac = 1 / n;
  if (frac < 100) return '1/' + Math.round(frac);
  return '<1/' + Math.round(frac);
}

function fmtFrac(n, label) {
  if (n >= 1) return fmtN(n) + ' ' + label + (n >= 2 ? 's' : '');
  var frac = 1 / n;
  if (frac >= 1000000) return 'about 1/' + Math.round(frac/1000000) + 'M of a ' + label;
  if (frac >= 1000)    return 'about 1/' + Math.round(frac/1000) + 'k of a ' + label;
  return 'about 1/' + Math.round(frac) + ' of a ' + label;
}

// ── Tax Calculations ───────────────────────────────────────────────────────

function calcPersonalAllowance(income) {
  if (income <= TR.taperStart) return TR.personalAllowance;
  var reduction = Math.floor((income - TR.taperStart) / 2);
  return Math.max(0, TR.personalAllowance - reduction);
}

function calcIncomeTax(grossIncome, pensionContrib) {
  var income = Math.max(0, grossIncome - pensionContrib);
  var pa = calcPersonalAllowance(income);
  var taxable = Math.max(0, income - pa);
  var tax = 0;
  // basic
  var inBasic = Math.min(taxable, TR.basicRateLimit - pa);
  tax += Math.max(0, inBasic) * TR.basicRate;
  // higher
  var inHigher = Math.min(Math.max(0, taxable - (TR.basicRateLimit - pa)), TR.higherRateLimit - TR.basicRateLimit);
  tax += Math.max(0, inHigher) * TR.higherRate;
  // additional
  var inAdditional = Math.max(0, taxable - (TR.higherRateLimit - pa));
  tax += Math.max(0, inAdditional) * TR.additionalRate;
  return Math.max(0, tax);
}

function calcEmployeeNI(grossIncome) {
  var ni = 0;
  if (grossIncome > TR.niPrimary) {
    ni += Math.min(grossIncome, TR.niUEL) * TR.niBasicRate - TR.niPrimary * TR.niBasicRate;
  }
  if (grossIncome > TR.niUEL) {
    ni += (grossIncome - TR.niUEL) * TR.niHighRate;
  }
  return Math.max(0, ni);
}

function calcEmployerNI(grossIncome) {
  if (grossIncome <= TR.niSecondaryThreshold) return 0;
  return (grossIncome - TR.niSecondaryThreshold) * TR.niEmployerRate;
}

function calcSelfEmployedNI(profit) {
  var ni = 0;
  if (profit > TR.niPrimary) {
    ni += (Math.min(profit, TR.niUEL) - TR.niPrimary) * TR.se4Rate;
  }
  if (profit > TR.niUEL) {
    ni += (profit - TR.niUEL) * TR.se4HighRate;
  }
  return Math.max(0, ni);
}

function getTaxpayerBand(grossIncome, pensionContrib) {
  var income = Math.max(0, grossIncome - pensionContrib);
  var pa = calcPersonalAllowance(income);
  var taxable = Math.max(0, income - pa);
  if (taxable > (TR.higherRateLimit - pa)) return 'additional';
  if (taxable > (TR.basicRateLimit - pa)) return 'higher';
  return 'basic';
}

function calcCapitalGainsTax(gains, band) {
  var taxable = Math.max(0, gains - TR.cgtExempt);
  if (taxable <= 0) return 0;
  var rate = (band === 'basic') ? TR.cgtBasicRate : TR.cgtHigherRate;
  return taxable * rate;
}

function calcInterestTax(interest, grossIncome, pensionContrib) {
  var income = Math.max(0, grossIncome - pensionContrib);
  var band = getTaxpayerBand(grossIncome, pensionContrib);
  // Personal Savings Allowance
  var psa = band === 'basic' ? TR.psaBasic : (band === 'higher' ? TR.psaHigher : TR.psaAdditional);
  // Starting rate for savings (0% on up to £5k if non-savings income < £17,570)
  var startingRateAllowance = 0;
  var pa = calcPersonalAllowance(income);
  var nonSavings = Math.max(0, income - pa);
  if (nonSavings < TR.startingRateBand) {
    startingRateAllowance = TR.startingRateBand - nonSavings;
  }
  var taxFreeInterest = psa + startingRateAllowance;
  var taxableInterest = Math.max(0, interest - taxFreeInterest);
  var rate = band === 'basic' ? TR.basicRate : (band === 'higher' ? TR.higherRate : TR.additionalRate);
  return taxableInterest * rate;
}

function estimateVAT(grossIncome, directTaxes, pensionContrib) {
  // spending = income - direct taxes - pension - rough savings assumption (10%)
  var savings = (grossIncome - directTaxes) * 0.10;
  var spending = Math.max(0, grossIncome - directTaxes - pensionContrib - savings);
  return spending * 0.135;
}

// ── Best unit picker ───────────────────────────────────────────────────────

function pickBestUnit(amount, units) {
  // Prefer a unit that gives 1–500 of something
  var best = units[0];
  var bestScore = Infinity;
  for (var i = 0; i < units.length; i++) {
    var n = amount / units[i].cost;
    var score;
    if (n >= 1 && n <= 500) {
      score = 0; // ideal range
    } else if (n >= 0.01 && n < 1) {
      score = 1;
    } else if (n > 500) {
      score = n / 500;
    } else {
      score = 1 / n;
    }
    if (score < bestScore) { bestScore = score; best = units[i]; }
  }
  return best;
}

// ── Main calculate ─────────────────────────────────────────────────────────

window.hwCalculate = function() {
  var salaryEl = document.getElementById('hw-salary');
  var salary = parseFloat(salaryEl.value) || 0;
  if (salary <= 0) {
    salaryEl.focus();
    return;
  }

  var advanced = document.getElementById('hw-advanced-toggle').checked;
  var isSE = advanced && document.querySelector('input[name="hw-emp-type"]:checked').value === 'se';
  var showEmployerNI = advanced ? document.getElementById('hw-show-employer-ni').checked : true;
  var pensionContrib = advanced ? (parseFloat(document.getElementById('hw-pension').value) || 0) : 0;
  var capGains = advanced ? (parseFloat(document.getElementById('hw-cap-gains').value) || 0) : 0;
  var cgtType = advanced ? document.querySelector('input[name="hw-cgt-type"]:checked').value : 'other';
  var interest = advanced ? (parseFloat(document.getElementById('hw-interest').value) || 0) : 0;
  var councilTaxRaw = advanced ? document.getElementById('hw-council-tax').value : '';
  var councilTax = advanced ? (parseFloat(councilTaxRaw) || 2280) : 0;
  var showVAT = advanced ? document.getElementById('hw-show-vat').checked : false;

  // Tax calculations
  var incomeTax = calcIncomeTax(salary, pensionContrib);
  var employeeNI = isSE ? 0 : calcEmployeeNI(salary);
  var seNI = isSE ? calcSelfEmployedNI(salary) : 0;
  var employerNI = (!isSE && showEmployerNI) ? calcEmployerNI(salary) : 0;
  var band = getTaxpayerBand(salary, pensionContrib);
  var cgt = calcCapitalGainsTax(capGains, band);
  var interestTax = calcInterestTax(interest, salary, pensionContrib);
  var directTaxes = incomeTax + employeeNI + seNI + employerNI + cgt + interestTax + councilTax;
  var vatEst = showVAT ? estimateVAT(salary, directTaxes, pensionContrib) : 0;
  var totalTax = directTaxes + vatEst;

  // For spending breakdown, use income tax + employee/SE NI only
  // (Spending data is funded by direct taxes — employer NI and VAT go into same pot but
  //  we scale to the user's direct contribution to keep things proportional)
  var directForBreakdown = incomeTax + employeeNI + seNI + cgt + interestTax;

  var grossForEffectiveRate = salary + (isSE ? 0 : employerNI);
  var effectiveRate = grossForEffectiveRate > 0 ? (totalTax / grossForEffectiveRate * 100) : 0;

  // Build tax table rows
  var rows = [];
  rows.push({ label: 'Income Tax', note: '(2025-26 rates)', amount: incomeTax });
  if (!isSE) {
    rows.push({ label: 'Employee National Insurance', note: '', amount: employeeNI });
    if (showEmployerNI && employerNI > 0) {
      rows.push({ label: "Employer's National Insurance", note: '(paid by your employer, but ultimately a cost of your labour)', amount: employerNI });
    }
  } else {
    rows.push({ label: 'Self-employed NI (Class 4)', note: '', amount: seNI });
  }
  if (cgt > 0) rows.push({ label: 'Capital Gains Tax', note: '', amount: cgt });
  if (interestTax > 0) rows.push({ label: 'Interest Income Tax', note: '', amount: interestTax });
  if (advanced && councilTax > 0) rows.push({ label: 'Council Tax', note: '(entered or estimated)', amount: councilTax });
  if (showVAT && vatEst > 0) rows.push({ label: 'VAT (estimated)', note: '≈13.5% of consumer spending', amount: vatEst });
  if (pensionContrib > 0) rows.push({ label: 'Pension contribution', note: '(pre-tax — reduces your taxable income)', amount: pensionContrib });

  renderTaxTable(rows, totalTax, effectiveRate);

  // Spending breakdown (using direct personal taxes excluding employer NI/VAT for the breakdown display)
  var breakdownBase = directForBreakdown + (showEmployerNI ? employerNI : 0) + vatEst + councilTax;
  renderSpendingBars(breakdownBase);
  renderFunSection(breakdownBase);

  document.getElementById('hw-results').style.display = 'block';
  document.getElementById('hw-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function renderTaxTable(rows, total, effectiveRate) {
  var tbody = document.getElementById('hw-tax-table');
  var html = '';
  rows.forEach(function(r) {
    html += '<tr><td>' + r.label;
    if (r.note) html += '<br><span class="hw-row-note">' + r.note + '</span>';
    html += '</td><td>' + fmt(r.amount) + '</td></tr>';
  });
  tbody.innerHTML = html;

  var totalEl = document.getElementById('hw-total-row');
  totalEl.innerHTML = '<span>Total tax</span><span>' + fmt(total) + ' <small style="font-weight:400;font-size:0.8rem;opacity:0.65">(' + effectiveRate.toFixed(1) + '% effective rate)</small></span>';
}

function renderSpendingBars(totalTax) {
  var container = document.getElementById('hw-spending-bars');
  var html = '';
  SPENDING.forEach(function(cat) {
    var amount = totalTax * cat.pct;
    var pct = (cat.pct * 100).toFixed(1);
    html += '<div class="hw-bar-row">';
    html += '<span class="hw-bar-emoji">' + cat.emoji + '</span>';
    html += '<span class="hw-bar-label">' + cat.label + '</span>';
    html += '<div class="hw-bar-track"><div class="hw-bar-fill" style="width:0%;background:' + cat.color + '" data-pct="' + cat.pct + '"></div></div>';
    html += '<span class="hw-bar-pct">' + pct + '%<br><small style="opacity:0.55">' + fmt(amount) + '</small></span>';
    html += '</div>';
  });
  container.innerHTML = html;
  // animate bars after paint
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      container.querySelectorAll('.hw-bar-fill').forEach(function(el) {
        el.style.width = (parseFloat(el.dataset.pct) * 100) + '%';
      });
    });
  });
}

function renderFunSection(totalTax) {
  var container = document.getElementById('hw-fun-section');
  var html = '';
  SPENDING.forEach(function(cat) {
    var amount = totalTax * cat.pct;
    var units = FUN[cat.key];
    if (!units || units.length === 0) return;
    var u = pickBestUnit(amount, units);
    var n = amount / u.cost;
    var desc = u.fmt(n);
    html += '<div class="hw-fun-card" style="border-left-color:' + cat.color + '">';
    html += '<div class="hw-fun-card-header">';
    html += '<span>' + cat.emoji + '</span>';
    html += '<span>' + cat.label + ' <span class="hw-fun-card-amount">' + fmt(amount) + '</span></span>';
    html += '</div>';
    html += '<div class="hw-fun-item">' + desc + '</div>';
    html += '</div>';
  });
  container.innerHTML = html;
}

// ── Advanced mode toggle ───────────────────────────────────────────────────

document.getElementById('hw-advanced-toggle').addEventListener('change', function() {
  var panel = document.getElementById('hw-advanced');
  panel.style.display = this.checked ? 'block' : 'none';
});

document.querySelectorAll('input[name="hw-emp-type"]').forEach(function(radio) {
  radio.addEventListener('change', function() {
    var employerField = document.getElementById('hw-employer-ni-field');
    employerField.style.display = this.value === 'paye' ? 'block' : 'none';
  });
});

// Allow Enter to calculate
document.getElementById('hw-salary').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') window.hwCalculate();
});

})();
</script>
