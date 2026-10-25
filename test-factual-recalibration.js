// test-factual-recalibration.js
const fs = require('fs');
const assert = require('assert');

console.log('=== RUNNING FACTUAL RE-CALIBRATION AUDIT SUITE ===');

const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');
const dataJs = fs.readFileSync('data.js', 'utf8');
let countiesJs = fs.readFileSync('kenya-counties-data.js', 'utf8');

// 1. Check for Infinity bug fix & inflated trillions
assert(!html.includes('Infinity'), 'HTML contains Infinity');
assert(!html.includes('$183.5T'), 'HTML contains outdated $183.5T');
assert(!html.includes('$18.6 Trillion'), 'HTML contains outdated $18.6 Trillion');
assert(!html.includes('$18.60 Trillion'), 'HTML contains outdated $18.60 Trillion');
assert(!html.includes('$1.04T'), 'HTML contains outdated $1.04T');
assert(!html.includes('$24 Trillion'), 'HTML contains outdated $24 Trillion');
console.log('[CHECK] PASS: No unrealistic trillion-dollar claims or Infinity in index.html');

// 2. Check data.js factual calibration
assert(dataJs.includes('totalForeignDebtB: 41.0'), 'Foreign debt must be $41.0B in HISTORICAL_AUDIT_MODEL');
assert(dataJs.includes('totalPublicDebtB: 84.5'), 'Total public debt must be $84.5B');
assert(dataJs.includes('annualGdpLostB: 220.0'), 'Annual lost GDP must be $220.0B');
assert(dataJs.includes('cumulative10YrLostB: 540.0'), 'Cumulative 10-year lost wealth must be $540.0B');
console.log('[CHECK] PASS: data.js grounded in $41.0B foreign debt, 10-yr window, -$220.0B annual lost GDP');

// 3. Check kenya-counties-data.js totals
countiesJs = countiesJs.replace(/const KENYA_47_COUNTIES_DATA/g, 'global.KENYA_47_COUNTIES_DATA');
eval(countiesJs);
const counties = Object.values(global.KENYA_47_COUNTIES_DATA);
assert(counties && counties.length === 47, 'Must have 47 counties');
let totalActual = 0;
let totalTarget = 0;
let totalLost = 0;
counties.forEach(c => {
    totalActual += c.gcp2026B;
    totalTarget += c.gcpShouldBe2026B;
    totalLost += c.lostPotentialB;
});

console.log(`[COUNTIES] Total Actual GCP: $${totalActual.toFixed(1)}B | Total Target: $${totalTarget.toFixed(1)}B | Total Foregone: +$${totalLost.toFixed(1)}B`);
assert(Math.abs(totalActual - 136.0) < 0.5, 'Counties actual GCP must sum to ~$136.0B');
assert(Math.abs(totalTarget - 356.0) < 0.5, 'Counties target GCP must sum to ~$356.0B');
assert(Math.abs(totalLost - 220.0) < 0.5, 'Counties foregone GCP must sum to ~$220.0B');
console.log('[CHECK] PASS: All 47 counties sum perfectly to national econometric model ($136B actual -> $356B potential)');

// 4. Check app.js default state & cures
assert(appJs.includes('graft: false, tiedAid: false, deadCapital: false'), 'Valves must start unlocked (leaking) by default');
assert(appJs.includes('benchmarkTargetPct = 28.0'), 'Benchmark target pct defined');
assert(appJs.includes('const progress = Math.max(0, Math.min(2.0, redirectPct / benchmarkTargetPct))'), 'Linear scaling with no division by zero');
assert(appJs.includes('const kenyaMarketCapB = +(356.0 * buffett).toFixed(1);'), 'NSE Market Cap scaled on $356.0B GDP');
console.log('[CHECK] PASS: app.js starts with status-quo defaults, realistic market cap, and division-by-zero protection');

console.log('\n>>> ALL FACTUAL RE-CALIBRATION TESTS PASSED 100%! <<<');
