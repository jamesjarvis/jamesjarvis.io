---
title: "Housing Affordability Simulator: 2019 vs 2026"
date: 2026-03-27
tags: ["thoughts", "personal-finance"]
slug: "housing-affordability-simulator"
summary: "An interactive simulator exploring what it would take to make UK housing as affordable as it was in 2019."
---

## Housing Affordability: 2019 vs 2026

Salaries in the UK have grown ~15-18% since 2019 (ONS ASHE). That sounds decent — until you look at what happened to everything else at the same time:

1. **House prices rose ~16-40%** depending on region (ONS UKHPI)
2. **Mortgage rates nearly doubled** from ~2.7% to ~4.8% on a 5-year fix (Bank of England)

So wages went up, but the cost of actually buying a home went up faster. The mortgage rate doubling is the big one — it affects monthly payments far more than the price increases alone.

To get housing affordability back to where it was in 2019, you'd need some combination of:

- Higher salaries
- Lower mortgage rates
- Lower house prices

The question is: how much of each?

## The Simulator

Rather than just telling you the numbers, here's an interactive tool. Pick your region, tweak the sliders, and see how different scenarios affect the percentage of your **post-tax** income that goes toward your mortgage payment.

The 2019 baseline is calculated automatically from regional data, using 2019/20 tax rates and NI thresholds. Your scenario uses 2025/26 tax rules.

<div id="affordability-simulator">
<style>
  #affordability-simulator {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 720px;
    margin: 2rem auto;
  }
  .sim-controls {
    background: var(--color-neutral-100, #f5f5f5);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .dark .sim-controls {
    background: var(--color-neutral-800, #262626);
  }
  .sim-controls label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }
  .sim-controls .slider-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }
  .sim-controls input[type="range"] {
    --thumb-color: #3b82f6;
    flex: 1;
    height: 22px;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    outline: none;
    cursor: pointer;
  }
  .sim-controls input[type="range"]::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: 4px;
    background: #c8c8c8;
    border: 1px solid #b0b0b0;
  }
  .dark .sim-controls input[type="range"]::-webkit-slider-runnable-track {
    background: #555;
    border-color: #666;
  }
  .sim-controls input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--thumb-color);
    margin-top: -8px;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
    border: 2px solid #fff;
  }
  .sim-controls input[type="range"]::-moz-range-track {
    height: 8px;
    border-radius: 4px;
    background: #c8c8c8;
    border: 1px solid #b0b0b0;
  }
  .dark .sim-controls input[type="range"]::-moz-range-track {
    background: #555;
    border-color: #666;
  }
  .sim-controls input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--thumb-color);
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  }
  .slider-value {
    min-width: 90px;
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    font-size: 0.95rem;
  }
  .sim-select {
    width: 100%;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid var(--color-neutral-300, #d4d4d4);
    background: var(--color-neutral-0, #fff);
    color: inherit;
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
  }
  .dark .sim-select {
    background: var(--color-neutral-700, #404040);
    border-color: var(--color-neutral-600, #525252);
  }
  .sim-results {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  @media (max-width: 500px) {
    .sim-results {
      grid-template-columns: 1fr;
    }
  }
  .sim-card {
    border-radius: 12px;
    padding: 1.25rem;
    text-align: center;
  }
  .sim-card-2019 {
    background: var(--color-neutral-100, #f5f5f5);
    border: 2px solid var(--color-neutral-300, #d4d4d4);
  }
  .dark .sim-card-2019 {
    background: var(--color-neutral-800, #262626);
    border-color: var(--color-neutral-600, #525252);
  }
  .sim-card-2026 {
    border: 2px solid currentColor;
  }
  .sim-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
  }
  .sim-pct {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 0.25rem;
  }
  .sim-pct-sub {
    font-size: 0.8rem;
    opacity: 0.7;
  }
  .sim-color-green { color: #16a34a; }
  .sim-color-amber { color: #d97706; }
  .sim-color-red { color: #dc2626; }
  .sim-gap {
    text-align: center;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 12px;
    background: var(--color-neutral-100, #f5f5f5);
    border: 2px dashed var(--color-neutral-300, #d4d4d4);
    transition: all 0.3s ease;
  }
  .dark .sim-gap {
    background: var(--color-neutral-800, #262626);
    border-color: var(--color-neutral-600, #525252);
  }
  .sim-gap-matched {
    border-style: solid;
    border-color: #16a34a;
    background: rgba(22, 163, 74, 0.08);
  }
  .dark .sim-gap-matched {
    background: rgba(22, 163, 74, 0.15);
  }
  .sim-gap-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
    margin-bottom: 0.25rem;
  }
  .sim-gap-value {
    font-size: 1.8rem;
    font-weight: 800;
    line-height: 1.2;
    transition: color 0.3s ease;
  }
  .sim-gap-bar {
    height: 8px;
    border-radius: 4px;
    background: var(--color-neutral-300, #d4d4d4);
    margin-top: 0.75rem;
    overflow: hidden;
    border: 1px solid var(--color-neutral-400, #a3a3a3);
  }
  .dark .sim-gap-bar {
    background: var(--color-neutral-600, #525252);
    border-color: var(--color-neutral-500, #737373);
  }
  .sim-gap-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease, background-color 0.3s ease;
    min-width: 2%;
  }
  .sim-gap-hint {
    font-size: 0.75rem;
    opacity: 0.6;
    margin-top: 0.5rem;
  }
  .slider-label-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.25rem;
  }
  .slider-delta {
    font-size: 0.75rem;
    font-weight: 600;
    transition: color 0.3s ease;
  }
  .sim-reset-btn {
    display: inline-block;
    padding: 0.4rem 1rem;
    border-radius: 6px;
    border: 1px solid var(--color-neutral-300, #d4d4d4);
    background: var(--color-neutral-0, #fff);
    color: inherit;
    font-size: 0.8rem;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background 0.2s;
  }
  .sim-reset-btn:hover {
    background: var(--color-neutral-200, #e5e5e5);
  }
  .dark .sim-reset-btn {
    background: var(--color-neutral-700, #404040);
    border-color: var(--color-neutral-600, #525252);
  }
  .dark .sim-reset-btn:hover {
    background: var(--color-neutral-600, #525252);
  }
  .sim-breakdown {
    background: var(--color-neutral-100, #f5f5f5);
    border-radius: 12px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    font-size: 0.85rem;
    line-height: 1.7;
    overflow-x: auto;
  }
  .dark .sim-breakdown {
    background: var(--color-neutral-800, #262626);
  }
  .sim-breakdown h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
  }
  .sim-breakdown table {
    width: 100%;
    border-collapse: collapse;
  }
  .sim-breakdown th,
  .sim-breakdown td {
    padding: 0.3rem 0.5rem;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .sim-breakdown th:first-child,
  .sim-breakdown td:first-child {
    text-align: left;
  }
  .sim-breakdown thead th {
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    opacity: 0.6;
    border-bottom: 2px solid var(--color-neutral-300, #d4d4d4);
    padding-bottom: 0.5rem;
  }
  .dark .sim-breakdown thead th {
    border-color: var(--color-neutral-600, #525252);
  }
  .sim-breakdown .indent-label {
    padding-left: 1rem;
    opacity: 0.75;
  }
  .sim-breakdown .row-total td {
    font-weight: 700;
    border-top: 1px solid var(--color-neutral-300, #d4d4d4);
    padding-top: 0.4rem;
  }
  .dark .sim-breakdown .row-total td {
    border-color: var(--color-neutral-600, #525252);
  }
  .sim-breakdown .col-delta {
    font-size: 0.8rem;
    opacity: 0.75;
  }
  .sim-delta-better { color: #16a34a; }
  .sim-delta-worse { color: #dc2626; }
  .sim-fixes {
    background: var(--color-neutral-100, #f5f5f5);
    border-radius: 12px;
    padding: 1.25rem;
    margin-bottom: 1rem;
  }
  .dark .sim-fixes {
    background: var(--color-neutral-800, #262626);
  }
  .sim-fixes h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
  }
  .sim-fix-item {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.4rem 0;
    font-size: 0.85rem;
    border-bottom: 1px solid var(--color-neutral-200, #e5e5e5);
  }
  .dark .sim-fix-item {
    border-color: var(--color-neutral-700, #404040);
  }
  .sim-fix-item:last-child {
    border-bottom: none;
  }
  .sim-fix-value {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .sim-note {
    font-size: 0.75rem;
    opacity: 0.6;
    margin-top: 0.5rem;
  }
</style>

<div class="sim-controls">
  <label for="sim-region">Region</label>
  <select id="sim-region" class="sim-select"></select>

  <div class="slider-label-row">
    <label for="sim-price">House Price</label>
    <span class="slider-delta" id="sim-price-delta"></span>
  </div>
  <div class="slider-row">
    <input type="range" id="sim-price" min="50000" max="800000" step="5000">
    <span class="slider-value" id="sim-price-val"></span>
  </div>

  <div class="slider-label-row">
    <label for="sim-rate">Mortgage Rate (5-year fixed)</label>
    <span class="slider-delta" id="sim-rate-delta"></span>
  </div>
  <div class="slider-row">
    <input type="range" id="sim-rate" min="1" max="10" step="0.1">
    <span class="slider-value" id="sim-rate-val"></span>
  </div>

  <div class="slider-label-row">
    <label for="sim-salary">Annual Gross Salary</label>
    <span class="slider-delta" id="sim-salary-delta"></span>
  </div>
  <div class="slider-row">
    <input type="range" id="sim-salary" min="15000" max="150000" step="500">
    <span class="slider-value" id="sim-salary-val"></span>
  </div>

  <button class="sim-reset-btn" id="sim-reset">Reset to 2026 defaults</button>
</div>

<div class="sim-results">
  <div class="sim-card sim-card-2019">
    <h3>2019 Baseline</h3>
    <div class="sim-pct" id="sim-pct-2019">--</div>
    <div class="sim-pct-sub" id="sim-sub-2019"></div>
  </div>
  <div class="sim-card sim-card-2026">
    <h3>Your Scenario (2025/26 tax rules)</h3>
    <div class="sim-pct" id="sim-pct-2026">--</div>
    <div class="sim-pct-sub" id="sim-sub-2026"></div>
  </div>
</div>

<div class="sim-gap" id="sim-gap">
  <div class="sim-gap-label">Distance from 2019 baseline</div>
  <div class="sim-gap-value" id="sim-gap-value">--</div>
  <div class="sim-gap-bar"><div class="sim-gap-bar-fill" id="sim-gap-fill"></div></div>
  <div class="sim-gap-hint" id="sim-gap-hint"></div>
</div>

<div class="sim-breakdown">
  <h4>Side-by-Side Breakdown</h4>
  <table>
    <thead>
      <tr><th></th><th>2019</th><th>Your Scenario</th><th class="col-delta">Δ</th></tr>
    </thead>
    <tbody>
      <tr><td>House price</td><td id="bd-price-19"></td><td id="bd-price"></td><td class="col-delta" id="bd-price-d"></td></tr>
      <tr><td>Mortgage rate</td><td id="bd-rate-19"></td><td id="bd-rate"></td><td class="col-delta" id="bd-rate-d"></td></tr>
      <tr><td>Gross salary</td><td id="bd-gross-19"></td><td id="bd-gross"></td><td class="col-delta" id="bd-gross-d"></td></tr>
      <tr><td class="indent-label">Income tax</td><td id="bd-tax-19"></td><td id="bd-tax"></td><td class="col-delta" id="bd-tax-d"></td></tr>
      <tr><td class="indent-label">National Insurance</td><td id="bd-ni-19"></td><td id="bd-ni"></td><td class="col-delta" id="bd-ni-d"></td></tr>
      <tr class="row-total"><td>Annual take-home</td><td id="bd-takehome-19"></td><td id="bd-takehome"></td><td class="col-delta" id="bd-takehome-d"></td></tr>
      <tr><td>Monthly take-home</td><td id="bd-monthly-takehome-19"></td><td id="bd-monthly-takehome"></td><td class="col-delta" id="bd-monthly-takehome-d"></td></tr>
      <tr><td>Monthly mortgage</td><td id="bd-mortgage-19"></td><td id="bd-mortgage"></td><td class="col-delta" id="bd-mortgage-d"></td></tr>
      <tr class="row-total"><td>% to housing</td><td id="bd-pct-19"></td><td id="bd-pct"></td><td class="col-delta" id="bd-pct-d"></td></tr>
    </tbody>
  </table>
  <div class="sim-note">Assumes 10% deposit, 25-year repayment mortgage. 2019 uses 2019/20 tax rates; your scenario uses 2025/26 rates.</div>
</div>

<div class="sim-fixes">
  <h4>What would it take to restore 2019 affordability?</h4>
  <div class="sim-fix-item">
    <span>Salary needed (at current price &amp; rate)</span>
    <span class="sim-fix-value" id="fix-salary"></span>
  </div>
  <div class="sim-fix-item">
    <span>Rate needed (at current price &amp; salary)</span>
    <span class="sim-fix-value" id="fix-rate"></span>
  </div>
  <div class="sim-fix-item">
    <span>Price needed (at current rate &amp; salary)</span>
    <span class="sim-fix-value" id="fix-price"></span>
  </div>
  <div class="sim-note">Each row shows the single change needed to match the 2019 affordability percentage for your selected region.</div>
</div>

<script>
(function() {
  // ── Regional data ──
  const regions = [
    { name: 'England (National)', price19: 251000, price26: 292000, salary19: 30400, salary26: 35400, scottish: false },
    { name: 'London', price19: 475000, price26: 551000, salary19: 37900, salary26: 44800, scottish: false },
    { name: 'South East', price19: 325000, price26: 375000, salary19: 32100, salary26: 37500, scottish: false },
    { name: 'South West', price19: 255000, price26: 300000, salary19: 28200, salary26: 33000, scottish: false },
    { name: 'East of England', price19: 290000, price26: 330000, salary19: 30800, salary26: 35800, scottish: false },
    { name: 'West Midlands', price19: 195000, price26: 245000, salary19: 28000, salary26: 32700, scottish: false },
    { name: 'East Midlands', price19: 190000, price26: 235000, salary19: 27600, salary26: 32200, scottish: false },
    { name: 'North West', price19: 165000, price26: 210000, salary19: 27700, salary26: 32300, scottish: false },
    { name: 'North East', price19: 131000, price26: 165000, salary19: 26500, salary26: 31000, scottish: false },
    { name: 'Yorkshire & Humber', price19: 167000, price26: 210000, salary19: 27200, salary26: 31800, scottish: false },
    { name: 'Scotland', price19: 155000, price26: 191000, salary19: 29000, salary26: 33800, scottish: true },
    { name: 'Wales', price19: 173000, price26: 215000, salary19: 27000, salary26: 31500, scottish: false },
    { name: 'Northern Ireland', price19: 140000, price26: 196000, salary19: 26200, salary26: 30600, scottish: false },
  ];

  const RATE_2019 = 2.74;
  const RATE_2026 = 4.80;
  const TERM_YEARS = 25;
  const DEPOSIT_PCT = 0.10;

  // ── Tax calculations ──
  function calcIncomeTax_rUK_2019(gross) {
    const pa = 12500;
    let allowance = pa;
    if (gross > 100000) allowance = Math.max(0, pa - (gross - 100000) / 2);
    const taxable = Math.max(0, gross - allowance);
    let tax = 0;
    const bands = [
      { limit: 37500, rate: 0.20 },
      { limit: 112500, rate: 0.40 },  // 150000 - 37500
      { limit: Infinity, rate: 0.45 },
    ];
    let remaining = taxable;
    for (const b of bands) {
      const amt = Math.min(remaining, b.limit);
      tax += amt * b.rate;
      remaining -= amt;
      if (remaining <= 0) break;
    }
    return tax;
  }

  function calcIncomeTax_rUK_2025(gross) {
    const pa = 12570;
    let allowance = pa;
    if (gross > 100000) allowance = Math.max(0, pa - (gross - 100000) / 2);
    const taxable = Math.max(0, gross - allowance);
    let tax = 0;
    const bands = [
      { limit: 37700, rate: 0.20 },   // 50270 - 12570
      { limit: 74870, rate: 0.40 },   // 125140 - 50270
      { limit: Infinity, rate: 0.45 },
    ];
    let remaining = taxable;
    for (const b of bands) {
      const amt = Math.min(remaining, b.limit);
      tax += amt * b.rate;
      remaining -= amt;
      if (remaining <= 0) break;
    }
    return tax;
  }

  function calcIncomeTax_Scot_2019(gross) {
    const pa = 12500;
    let allowance = pa;
    if (gross > 100000) allowance = Math.max(0, pa - (gross - 100000) / 2);
    const taxable = Math.max(0, gross - allowance);
    let tax = 0;
    const bands = [
      { limit: 2049, rate: 0.19 },    // 14549 - 12500
      { limit: 10395, rate: 0.20 },   // 24944 - 14549
      { limit: 18486, rate: 0.21 },   // 43430 - 24944
      { limit: 106570, rate: 0.41 },  // 150000 - 43430
      { limit: Infinity, rate: 0.46 },
    ];
    let remaining = taxable;
    for (const b of bands) {
      const amt = Math.min(remaining, b.limit);
      tax += amt * b.rate;
      remaining -= amt;
      if (remaining <= 0) break;
    }
    return tax;
  }

  function calcIncomeTax_Scot_2025(gross) {
    const pa = 12570;
    let allowance = pa;
    if (gross > 100000) allowance = Math.max(0, pa - (gross - 100000) / 2);
    const taxable = Math.max(0, gross - allowance);
    let tax = 0;
    const bands = [
      { limit: 2827, rate: 0.19 },    // 15397 - 12570
      { limit: 12094, rate: 0.20 },   // 27491 - 15397
      { limit: 16171, rate: 0.21 },   // 43662 - 27491
      { limit: 31338, rate: 0.42 },   // 75000 - 43662
      { limit: 50140, rate: 0.45 },   // 125140 - 75000
      { limit: Infinity, rate: 0.48 },
    ];
    let remaining = taxable;
    for (const b of bands) {
      const amt = Math.min(remaining, b.limit);
      tax += amt * b.rate;
      remaining -= amt;
      if (remaining <= 0) break;
    }
    return tax;
  }

  function calcNI_2019(gross) {
    const threshold = 8632;
    const upper = 50000;
    let ni = 0;
    if (gross > threshold) {
      ni += Math.min(gross, upper) - threshold;
      ni *= 0.12;
    }
    if (gross > upper) {
      ni += (gross - upper) * 0.02;
    }
    return ni;
  }

  function calcNI_2025(gross) {
    const threshold = 12570;
    const upper = 50270;
    let ni = 0;
    if (gross > threshold) {
      ni += (Math.min(gross, upper) - threshold) * 0.08;
    }
    if (gross > upper) {
      ni += (gross - upper) * 0.02;
    }
    return ni;
  }

  function calcTakeHome(gross, scottish, is2019) {
    let tax, ni;
    if (is2019) {
      tax = scottish ? calcIncomeTax_Scot_2019(gross) : calcIncomeTax_rUK_2019(gross);
      ni = calcNI_2019(gross);
    } else {
      tax = scottish ? calcIncomeTax_Scot_2025(gross) : calcIncomeTax_rUK_2025(gross);
      ni = calcNI_2025(gross);
    }
    return { tax, ni, takeHome: gross - tax - ni };
  }

  // ── Mortgage calculation ──
  function monthlyPayment(principal, annualRate, years) {
    if (annualRate === 0) return principal / (years * 12);
    const r = annualRate / 100 / 12;
    const n = years * 12;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  function calcAffordability(housePrice, ratePercent, grossSalary, scottish, is2019) {
    const loan = housePrice * (1 - DEPOSIT_PCT);
    const monthly = monthlyPayment(loan, ratePercent, TERM_YEARS);
    const { tax, ni, takeHome } = calcTakeHome(grossSalary, scottish, is2019);
    const monthlyTakeHome = takeHome / 12;
    const pct = monthlyTakeHome > 0 ? (monthly / monthlyTakeHome) * 100 : 999;
    return { pct, monthly, tax, ni, takeHome, monthlyTakeHome };
  }

  // ── Solver: find value to match target affordability ──
  function findSalaryForTarget(targetPct, housePrice, rate, scottish) {
    // Binary search for the salary that gives targetPct affordability under 2025/26 tax
    let lo = 15000, hi = 500000;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const r = calcAffordability(housePrice, rate, mid, scottish, false);
      if (r.pct > targetPct) lo = mid; else hi = mid;
    }
    return Math.round((lo + hi) / 2);
  }

  function findRateForTarget(targetPct, housePrice, salary, scottish) {
    const { takeHome } = calcTakeHome(salary, scottish, false);
    const monthlyBudget = (takeHome / 12) * (targetPct / 100);
    // Binary search for rate
    let lo = 0, hi = 15;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const loan = housePrice * (1 - DEPOSIT_PCT);
      const mp = monthlyPayment(loan, mid, TERM_YEARS);
      if (mp > monthlyBudget) hi = mid; else lo = mid;
    }
    const result = (lo + hi) / 2;
    return result < 0.1 ? null : result;
  }

  function findPriceForTarget(targetPct, rate, salary, scottish) {
    const { takeHome } = calcTakeHome(salary, scottish, false);
    const monthlyBudget = (takeHome / 12) * (targetPct / 100);
    // Binary search for house price
    let lo = 10000, hi = 2000000;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const loan = mid * (1 - DEPOSIT_PCT);
      const mp = monthlyPayment(loan, rate, TERM_YEARS);
      if (mp > monthlyBudget) hi = mid; else lo = mid;
    }
    return Math.round((lo + hi) / 2);
  }

  // ── Formatting ──
  const fmt = n => '\u00a3' + Math.round(n).toLocaleString('en-GB');
  const fmtPct = n => n.toFixed(1) + '%';

  function colorClass(pct) {
    if (pct < 25) return 'sim-color-green';
    if (pct < 35) return 'sim-color-amber';
    return 'sim-color-red';
  }

  // Smooth colour interpolation: green → amber → red based on distance from baseline.
  // ratio: 0.0 = matched 2019, 0.5 = halfway, 1.0+ = at/worse than 2026 defaults.
  function gapColor(ratio) {
    const clamped = Math.max(0, Math.min(1, ratio));
    // Anchor colours: green #16a34a, amber #d97706, red #dc2626
    let r, g, b;
    if (clamped <= 0.5) {
      // Green to amber (first half)
      const t = clamped / 0.5;
      r = Math.round(0x16 + (0xd9 - 0x16) * t);
      g = Math.round(0xa3 + (0x77 - 0xa3) * t);
      b = Math.round(0x4a + (0x06 - 0x4a) * t);
    } else {
      // Amber to red (second half)
      const t = (clamped - 0.5) / 0.5;
      r = Math.round(0xd9 + (0xdc - 0xd9) * t);
      g = Math.round(0x77 + (0x26 - 0x77) * t);
      b = Math.round(0x06 + (0x26 - 0x06) * t);
    }
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  // ── DOM setup ──
  const $ = id => document.getElementById(id);
  const regionSelect = $('sim-region');
  const priceSlider = $('sim-price');
  const rateSlider = $('sim-rate');
  const salarySlider = $('sim-salary');

  regions.forEach((r, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = r.name;
    regionSelect.appendChild(opt);
  });

  function setSliderDefaults() {
    const r = regions[regionSelect.value];
    priceSlider.value = r.price26;
    rateSlider.value = RATE_2026;
    salarySlider.value = r.salary26;
    update();
  }

  function update() {
    const r = regions[regionSelect.value];
    const price = +priceSlider.value;
    const rate = +rateSlider.value;
    const salary = +salarySlider.value;

    // Slider labels
    $('sim-price-val').textContent = fmt(price);
    $('sim-rate-val').textContent = fmtPct(rate);
    $('sim-salary-val').textContent = fmt(salary);

    // 2019 baseline (auto from region data)
    const b19 = calcAffordability(r.price19, RATE_2019, r.salary19, r.scottish, true);
    $('sim-pct-2019').textContent = fmtPct(b19.pct);
    $('sim-pct-2019').className = 'sim-pct ' + colorClass(b19.pct);
    $('sim-sub-2019').textContent = fmt(b19.monthly) + '/mo on ' + fmt(r.salary19) + ' salary';

    // 2026 defaults for comparison
    const def26 = calcAffordability(r.price26, RATE_2026, r.salary26, r.scottish, false);

    // Current scenario (user sliders, 2025/26 tax)
    const cur = calcAffordability(price, rate, salary, r.scottish, false);

    // Gap: how far current is from 2019 baseline, as a ratio of how far 2026-defaults were
    const totalGap = def26.pct - b19.pct;        // full distance (2026 defaults vs 2019)
    const currentGap = cur.pct - b19.pct;         // remaining distance
    const gapRatio = totalGap > 0 ? Math.max(0, currentGap / totalGap) : 0;
    const progressPct = Math.max(0, Math.min(100, (1 - gapRatio) * 100));
    const matched = cur.pct <= b19.pct;

    // Colour the 2026 card based on proximity to baseline
    const dynColor = matched ? '#16a34a' : gapColor(gapRatio);
    $('sim-pct-2026').textContent = fmtPct(cur.pct);
    $('sim-pct-2026').style.color = dynColor;
    $('sim-sub-2026').textContent = fmt(cur.monthly) + '/mo on ' + fmt(salary) + ' salary';

    const card26 = document.querySelector('.sim-card-2026');
    card26.style.borderColor = dynColor;

    // Gap indicator
    const gapEl = $('sim-gap');
    const gapDelta = cur.pct - b19.pct;
    if (matched) {
      $('sim-gap-value').textContent = 'Matched!';
      $('sim-gap-value').style.color = '#16a34a';
      $('sim-gap-hint').textContent = 'You\'ve restored 2019 affordability (or better).';
      gapEl.classList.add('sim-gap-matched');
    } else {
      $('sim-gap-value').textContent = '+' + gapDelta.toFixed(1) + ' pp';
      $('sim-gap-value').style.color = dynColor;
      $('sim-gap-hint').textContent = 'Your scenario costs ' + gapDelta.toFixed(1) + ' percentage points more of take-home than 2019.';
      gapEl.classList.remove('sim-gap-matched');
    }
    const fill = $('sim-gap-fill');
    fill.style.width = progressPct + '%';
    fill.style.backgroundColor = matched ? '#16a34a' : dynColor;

    // Slider deltas — show how each value compares to 2026 defaults
    const priceDelta = ((price / r.price26) - 1) * 100;
    const rateDelta = rate - RATE_2026;
    const salaryDelta = ((salary / r.salary26) - 1) * 100;

    function setDelta(id, value, invert, slider) {
      const el = $(id);
      // For price & rate, lower is better (invert=false means lower=green)
      // For salary, higher is better (invert=true)
      const better = invert ? value > 0.5 : value < -0.5;
      const worse = invert ? value < -0.5 : value > 0.5;
      const neutral = !better && !worse;

      const color = neutral ? 'var(--color-primary-500, #3b82f6)' : better ? '#16a34a' : '#dc2626';

      if (neutral) {
        el.textContent = '';
      } else {
        const sign = value > 0 ? '+' : '';
        el.textContent = sign + value.toFixed(1) + (id.includes('rate') ? ' pp' : '%');
        el.style.color = color;
      }

      // Colour the slider thumb via CSS custom property
      slider.style.setProperty('--thumb-color', color);
    }
    setDelta('sim-price-delta', priceDelta, false, priceSlider);
    setDelta('sim-rate-delta', rateDelta, false, rateSlider);
    setDelta('sim-salary-delta', salaryDelta, true, salarySlider);

    // Breakdown — side-by-side comparison
    // Helper: set a delta cell with colour
    function setDeltaCell(id, cur, base, flipSign) {
      // flipSign: true for costs (lower is better), false for income (higher is better)
      const diff = cur - base;
      const el = $(id);
      if (Math.abs(diff) < 1) {
        el.textContent = '—';
        el.className = 'col-delta';
      } else {
        const sign = diff > 0 ? '+' : '';
        el.textContent = sign + fmt(diff);
        const isBetter = flipSign ? diff < 0 : diff > 0;
        el.className = 'col-delta ' + (isBetter ? 'sim-delta-better' : 'sim-delta-worse');
      }
    }

    // 2019 column
    $('bd-price-19').textContent = fmt(r.price19);
    $('bd-rate-19').textContent = fmtPct(RATE_2019);
    $('bd-gross-19').textContent = fmt(r.salary19);
    $('bd-tax-19').textContent = '-' + fmt(b19.tax);
    $('bd-ni-19').textContent = '-' + fmt(b19.ni);
    $('bd-takehome-19').textContent = fmt(b19.takeHome);
    $('bd-monthly-takehome-19').textContent = fmt(b19.takeHome / 12);
    $('bd-mortgage-19').textContent = fmt(b19.monthly);
    $('bd-pct-19').textContent = fmtPct(b19.pct);

    // Your scenario column
    $('bd-price').textContent = fmt(price);
    $('bd-rate').textContent = fmtPct(rate);
    $('bd-gross').textContent = fmt(salary);
    $('bd-tax').textContent = '-' + fmt(cur.tax);
    $('bd-ni').textContent = '-' + fmt(cur.ni);
    $('bd-takehome').textContent = fmt(cur.takeHome);
    $('bd-monthly-takehome').textContent = fmt(cur.monthlyTakeHome);
    $('bd-mortgage').textContent = fmt(cur.monthly);
    $('bd-pct').textContent = fmtPct(cur.pct);

    // Delta column
    setDeltaCell('bd-price-d', price, r.price19, true);
    // Rate delta (percentage points, not £)
    const rateDiffVal = rate - RATE_2019;
    const rateEl = $('bd-rate-d');
    if (Math.abs(rateDiffVal) < 0.05) {
      rateEl.textContent = '—';
      rateEl.className = 'col-delta';
    } else {
      rateEl.textContent = (rateDiffVal > 0 ? '+' : '') + rateDiffVal.toFixed(2) + 'pp';
      rateEl.className = 'col-delta ' + (rateDiffVal < 0 ? 'sim-delta-better' : 'sim-delta-worse');
    }
    setDeltaCell('bd-gross-d', salary, r.salary19, false);
    setDeltaCell('bd-tax-d', cur.tax, b19.tax, true);
    setDeltaCell('bd-ni-d', cur.ni, b19.ni, true);
    setDeltaCell('bd-takehome-d', cur.takeHome, b19.takeHome, false);
    setDeltaCell('bd-monthly-takehome-d', cur.monthlyTakeHome, b19.takeHome / 12, false);
    setDeltaCell('bd-mortgage-d', cur.monthly, b19.monthly, true);

    // Affordability delta (percentage points)
    const pctDiff = cur.pct - b19.pct;
    const pctEl = $('bd-pct-d');
    if (Math.abs(pctDiff) < 0.1) {
      pctEl.textContent = '—';
      pctEl.className = 'col-delta';
    } else {
      pctEl.textContent = (pctDiff > 0 ? '+' : '') + pctDiff.toFixed(1) + 'pp';
      pctEl.className = 'col-delta ' + (pctDiff < 0 ? 'sim-delta-better' : 'sim-delta-worse');
    }

    // "What it would take" fixes
    const targetPct = b19.pct;

    const neededSalary = findSalaryForTarget(targetPct, price, rate, r.scottish);
    const salaryIncrease = ((neededSalary / salary) - 1) * 100;
    $('fix-salary').textContent = fmt(neededSalary) + ' (+' + Math.round(salaryIncrease) + '%)';

    const neededRate = findRateForTarget(targetPct, price, salary, r.scottish);
    $('fix-rate').textContent = neededRate !== null ? fmtPct(neededRate) : 'Not possible';

    const neededPrice = findPriceForTarget(targetPct, rate, salary, r.scottish);
    const priceDrop = ((1 - neededPrice / price) * 100);
    $('fix-price').textContent = fmt(neededPrice) + ' (-' + Math.round(priceDrop) + '%)';
  }

  regionSelect.addEventListener('change', setSliderDefaults);
  priceSlider.addEventListener('input', update);
  rateSlider.addEventListener('input', update);
  salarySlider.addEventListener('input', update);
  $('sim-reset').addEventListener('click', setSliderDefaults);

  // Initialise
  setSliderDefaults();
})();
</script>
</div>

## Methodology

**Affordability %** = Monthly Mortgage Payment / Monthly Take-Home Pay x 100

Where:

- **Monthly mortgage payment** uses the standard amortisation formula for a repayment mortgage: 25-year term, 10% deposit
- **Take-home pay** is gross salary minus income tax and employee National Insurance
- **2019 baseline** uses 2019/20 tax year rates (income tax + 12% NI) and the average 5-year fixed mortgage rate of 2.74%
- **2026 scenario** uses 2025/26 tax year rates (income tax + 8% NI) and a current average 5-year fixed rate of 4.80%
- **Scottish income tax** rates are applied automatically when Scotland is selected (Scotland has its own starter/intermediate/advanced bands)
- **Regional data** for median house prices comes from the ONS UK House Price Index. Salary data comes from the ONS Annual Survey of Hours and Earnings (ASHE)

This is a simplification. It excludes property taxes (stamp duty, council tax), insurance, maintenance, and service charges. The real cost of housing is higher than what's shown here.

## What the Numbers Show

For most regions, a median earner buying a median-priced home has gone from spending roughly 20-25% of their take-home on the mortgage in 2019, to roughly 30-40% in 2026.

An interesting detail: NI rates actually *fell* from 12% to 8% between 2019 and 2026, so take-home pay improved slightly beyond raw salary growth. It just wasn't enough to offset the combined effect of higher prices and higher rates.

If you've read my [previous post on buying a house]({{<ref "posts/on-buying-a-house">}}), you'll know I went through this process myself. And if you've seen my [UK tax burden breakdown]({{<ref "posts/uk-tax-burden-2025">}}), you'll know that housing is already one of the largest expenses after tax for many of us.

Getting back to 2019 affordability requires movement on all three levers. No single change is likely to do it alone — but some combination of modest salary growth, gradually falling rates, and flat-to-slightly-declining prices could get there over time.

## The Other Costs of Owning a Home

The simulator above only covers the mortgage payment. In practice, homeownership comes with a stack of other recurring costs that have also moved upward since 2019:

| Cost | 2019 | 2026 | Change |
|------|-----:|-----:|-------:|
| Council tax (Band D, England avg) | £1,750/yr | £2,280/yr | +30% |
| Energy (dual fuel, direct debit) | ~£1,150/yr | ~£1,700/yr | +48% |
| Water + sewerage | ~£415/yr | ~£600/yr | +45% |
| Broadband | ~£290/yr | ~£350/yr | +21% |
| Home insurance (buildings + contents) | ~£170/yr | ~£250/yr | +47% |
| **Total** | **~£3,775/yr** | **~£5,180/yr** | **+37%** |

That's an extra ~£115/month in running costs alone, before you've even touched the mortgage. Combined with the mortgage payment increases shown above, the total monthly cost of homeownership has grown considerably faster than salaries.

Council tax and energy are the two biggest movers in absolute terms. The energy figure is based on Ofgem's price cap for a typical dual-fuel household — actual bills vary with usage, but the cap sets the unit rates that suppliers can charge. Water bills jumped significantly for 2025/26 after Ofwat approved larger increases to fund infrastructure investment.

It's also worth noting that this table excludes maintenance and repairs, which for an older property can easily add another £1,000-3,000/yr depending on the state of the place (as I [found out the hard way]({{<ref "posts/a-year-of-renovations">}})).

---

*Data sources: [ONS UK House Price Index](https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/housepriceindex), [ONS ASHE](https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours), [Bank of England mortgage rate data](https://www.bankofengland.co.uk/statistics/interest-rate-statistics), [HMRC income tax rates](https://www.gov.uk/income-tax-rates), [Scottish income tax rates](https://www.gov.scot/publications/scottish-income-tax-rates-and-bands/), [GOV.UK council tax statistics](https://www.gov.uk/government/statistics/council-tax-levels-set-by-local-authorities-in-england-2025-to-2026), [Ofgem price cap](https://www.ofgem.gov.uk/information-consumers/energy-advice-households/energy-price-cap-explained), [Ofwat average bills](https://www.ofwat.gov.uk/average-bills-2025-26-press-statement/).*
