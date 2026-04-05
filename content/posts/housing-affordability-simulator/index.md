---
title: "Housing Affordability Simulator: 2019 vs 2025"
date: 2026-03-27
tags: ["thoughts", "personal-finance"]
slug: "housing-affordability-simulator"
summary: "An interactive simulator exploring what it would take to make UK housing as affordable as it was in 2019. Spoiler: it's not pretty."
---

## The Housing Affordability Crisis

If you've been following housing affordability in the uk already, you'll know that it's not exactly affordable.

We are in the "find out" decade; after a decade of low interest rates that boosted the price of assets, the market is still adjusting back to a world of higher interest rates.

The fun thing about the housing market is that it _really_ doesn't like price corrections:

- Those on mortgages are incentivised to keep re-valuing their homes to easily reduce their "LTV" (Loan to Value) ratio for securing lower rate mortgages.
- At the sign of trouble in the housing market, people may delay a decision to sell (to avoid falling into negative equity), which reduces market supply and thus keeps prices artificially higher.
- The government is incentivised to keep prices higher to avoid the political fallout of a housing crash, hence pressuring to keep relaxing regulations on borrowing.

The _general_ result is that prices are more or less monotonically increasing, so rather than correcting when they should, they tend to just stagnate until other conditions (like wages) catch up.

Another interesting piece to this puzzle, is that right at the end of the zero interest rate era, we had a surge in activity in the housing market.

1. Stamp duty holiday boosted demand temporarily
2. WFH allowed people to move further out of cities, extending the reach of "city prices"
3. Section 24 tax changes came into effect, reducing the supply of rental properties / raising rents and thus prices

/// TODO: Fix up the below.

- https://www.statista.com/statistics/463920/halifax-average-first-time-buyer-monthly-costs-of-buying-renting-property/
- https://www.statista.com/statistics/285705/monthly-house-price-index-in-the-united-kingdom-uk/

Between 2019 and 2025, three things happened simultaneously:

1. **House prices rose ~16-40%** depending on region (ONS UKHPI)
2. **Mortgage rates nearly doubled** from ~2.7% to ~4.8% on a 5-year fix (Bank of England)
3. **Salaries grew ~15-18%** which sounds decent until you factor in the above (ONS ASHE)

The combination is brutal. Even though wages have grown, the doubling of mortgage rates means monthly payments have ballooned far beyond what salary growth can absorb.

To get housing affordability back to where it was in 2019, one of three things has to happen:

- Salaries jump significantly
- Mortgage rates fall back to historic lows
- House prices drop substantially

Or, more realistically, some combination of all three.

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
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: var(--color-neutral-300, #d4d4d4);
    border-radius: 3px;
    outline: none;
  }
  .dark .sim-controls input[type="range"] {
    background: var(--color-neutral-600, #525252);
  }
  .sim-controls input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-primary-500, #3b82f6);
    cursor: pointer;
  }
  .sim-controls input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-primary-500, #3b82f6);
    cursor: pointer;
    border: none;
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
  .sim-card-2025 {
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
  .sim-breakdown {
    background: var(--color-neutral-100, #f5f5f5);
    border-radius: 12px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    font-size: 0.85rem;
    line-height: 1.7;
  }
  .dark .sim-breakdown {
    background: var(--color-neutral-800, #262626);
  }
  .sim-breakdown h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
  }
  .sim-breakdown .row {
    display: flex;
    justify-content: space-between;
  }
  .sim-breakdown .row.indent {
    padding-left: 1rem;
    opacity: 0.75;
  }
  .sim-breakdown .row.total {
    font-weight: 700;
    border-top: 1px solid var(--color-neutral-300, #d4d4d4);
    margin-top: 0.25rem;
    padding-top: 0.25rem;
  }
  .dark .sim-breakdown .row.total {
    border-color: var(--color-neutral-600, #525252);
  }
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

<label for="sim-price">House Price</label>

  <div class="slider-row">
    <input type="range" id="sim-price" min="50000" max="800000" step="5000">
    <span class="slider-value" id="sim-price-val"></span>
  </div>

<label for="sim-rate">Mortgage Rate (5-year fixed)</label>

  <div class="slider-row">
    <input type="range" id="sim-rate" min="1" max="10" step="0.1">
    <span class="slider-value" id="sim-rate-val"></span>
  </div>

<label for="sim-salary">Annual Gross Salary</label>

  <div class="slider-row">
    <input type="range" id="sim-salary" min="15000" max="150000" step="500">
    <span class="slider-value" id="sim-salary-val"></span>
  </div>
</div>

<div class="sim-results">
  <div class="sim-card sim-card-2019">
    <h3>2019 Baseline</h3>
    <div class="sim-pct" id="sim-pct-2019">--</div>
    <div class="sim-pct-sub" id="sim-sub-2019"></div>
  </div>
  <div class="sim-card sim-card-2025">
    <h3>Your Scenario (2025 tax rules)</h3>
    <div class="sim-pct" id="sim-pct-2025">--</div>
    <div class="sim-pct-sub" id="sim-sub-2025"></div>
  </div>
</div>

<div class="sim-breakdown">
  <h4>Your Scenario Breakdown</h4>
  <div class="row"><span>Gross annual salary</span><span id="bd-gross"></span></div>
  <div class="row indent"><span>Income tax</span><span id="bd-tax"></span></div>
  <div class="row indent"><span>National Insurance</span><span id="bd-ni"></span></div>
  <div class="row total"><span>Annual take-home</span><span id="bd-takehome"></span></div>
  <div class="row" style="margin-top:0.5rem"><span>Monthly take-home</span><span id="bd-monthly-takehome"></span></div>
  <div class="row"><span>Monthly mortgage payment</span><span id="bd-mortgage"></span></div>
  <div class="row total"><span>% of take-home to housing</span><span id="bd-pct"></span></div>
  <div class="sim-note">Assumes <span id="bd-deposit-pct">10</span>% deposit, 25-year repayment mortgage. Tax calculated using 2025/26 rates.</div>
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
    { name: 'England (National)', price19: 251000, price25: 292000, salary19: 30400, salary25: 35400, scottish: false },
    { name: 'London', price19: 475000, price25: 551000, salary19: 37900, salary25: 44800, scottish: false },
    { name: 'South East', price19: 325000, price25: 375000, salary19: 32100, salary25: 37500, scottish: false },
    { name: 'South West', price19: 255000, price25: 300000, salary19: 28200, salary25: 33000, scottish: false },
    { name: 'East of England', price19: 290000, price25: 330000, salary19: 30800, salary25: 35800, scottish: false },
    { name: 'West Midlands', price19: 195000, price25: 245000, salary19: 28000, salary25: 32700, scottish: false },
    { name: 'East Midlands', price19: 190000, price25: 235000, salary19: 27600, salary25: 32200, scottish: false },
    { name: 'North West', price19: 165000, price25: 210000, salary19: 27700, salary25: 32300, scottish: false },
    { name: 'North East', price19: 131000, price25: 165000, salary19: 26500, salary25: 31000, scottish: false },
    { name: 'Yorkshire & Humber', price19: 167000, price25: 210000, salary19: 27200, salary25: 31800, scottish: false },
    { name: 'Scotland', price19: 155000, price25: 191000, salary19: 29000, salary25: 33800, scottish: true },
    { name: 'Wales', price19: 173000, price25: 215000, salary19: 27000, salary25: 31500, scottish: false },
    { name: 'Northern Ireland', price19: 140000, price25: 196000, salary19: 26200, salary25: 30600, scottish: false },
  ];

  const RATE_2019 = 2.74;
  const RATE_2025 = 4.80;
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
    // Binary search for the salary that gives targetPct affordability under 2025 tax
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
    priceSlider.value = r.price25;
    rateSlider.value = RATE_2025;
    salarySlider.value = r.salary25;
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

    // Current scenario (user sliders, 2025 tax)
    const cur = calcAffordability(price, rate, salary, r.scottish, false);
    $('sim-pct-2025').textContent = fmtPct(cur.pct);
    $('sim-pct-2025').className = 'sim-pct ' + colorClass(cur.pct);
    $('sim-sub-2025').textContent = fmt(cur.monthly) + '/mo on ' + fmt(salary) + ' salary';

    // Card border color
    const card25 = document.querySelector('.sim-card-2025');
    card25.style.borderColor = cur.pct < 25 ? '#16a34a' : cur.pct < 35 ? '#d97706' : '#dc2626';

    // Breakdown
    $('bd-gross').textContent = fmt(salary);
    $('bd-tax').textContent = '-' + fmt(cur.tax);
    $('bd-ni').textContent = '-' + fmt(cur.ni);
    $('bd-takehome').textContent = fmt(cur.takeHome);
    $('bd-monthly-takehome').textContent = fmt(cur.monthlyTakeHome);
    $('bd-mortgage').textContent = fmt(cur.monthly);
    $('bd-pct').textContent = fmtPct(cur.pct);

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
- **2025 scenario** uses 2025/26 tax year rates (income tax + 8% NI) and a current average 5-year fixed rate of 4.80%
- **Scottish income tax** rates are applied automatically when Scotland is selected (Scotland has its own starter/intermediate/advanced bands)
- **Regional data** for median house prices comes from the ONS UK House Price Index. Salary data comes from the ONS Annual Survey of Hours and Earnings (ASHE)

This is a simplification. It excludes property taxes (stamp duty, council tax), insurance, maintenance, and service charges. The real cost of housing is higher than what's shown here.

## The Uncomfortable Maths

Look at the numbers for your region. In most of the country, a median earner buying a median-priced home has gone from spending roughly 20-25% of their take-home on the mortgage in 2019, to spending 30-40%+ in 2025.

The cruel irony is that NI rates actually _fell_ from 12% to 8% between 2019 and 2025, meaning take-home pay improved slightly beyond raw salary growth. And it still wasn't enough to offset the combined hit of higher prices and higher rates.

If you've read my [previous post on buying a house]({{<ref "posts/on-buying-a-house">}}), you'll know I went through this process myself. And if you've seen my [UK tax burden breakdown]({{<ref "posts/uk-tax-burden-2025">}}), you'll know that housing is already the second largest expense after tax for many of us.

The path back to 2019 affordability requires movement on all three levers. No single change is likely on its own: salaries won't jump 40%+ overnight, rates won't return to pandemic-era lows anytime soon, and a 30%+ price crash would bring its own set of problems.

The most realistic outcome is a slow grind: modest salary growth, gradually falling rates, and flat-to-slightly-declining prices, converging over years rather than months.

---

_Data sources: [ONS UK House Price Index](https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/housepriceindex), [ONS ASHE](https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours), [Bank of England mortgage rate data](https://www.bankofengland.co.uk/statistics/interest-rate-statistics), [HMRC income tax rates](https://www.gov.uk/income-tax-rates), [Scottish income tax rates](https://www.gov.scot/publications/scottish-income-tax-rates-and-bands/)._
