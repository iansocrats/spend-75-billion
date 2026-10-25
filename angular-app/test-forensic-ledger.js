const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING KENYA $160B FORENSIC LOAN LEDGER TEST SUITE ===');

const data = require('./data.js');

// 1. Check data models
assert(Array.isArray(data.KENYA_160B_LOAN_LEDGER), 'KENYA_160B_LOAN_LEDGER must be an array');
assert.strictEqual(data.KENYA_160B_LOAN_LEDGER.length, 10, 'Must contain 10 forensic loan packages');

const totalUsdB = data.KENYA_160B_LOAN_LEDGER.reduce((acc, l) => acc + l.amountUsdB, 0);
console.log(`[DATA]  PASS: 10 forensic loans found, Total USD = $${totalUsdB.toFixed(2)}B`);
assert(totalUsdB >= 75.0, 'Total loan value must account for Kenya external/sovereign debt package');

const requiredFields = [
  'id', 'name', 'category', 'categoryLabel', 'amountUsdB', 'amountKshB',
  'yearBorrowed', 'lender', 'interestRate', 'statedPurpose', 'actualOutcome',
  'auditorGeneral', 'oagCitation', 'statusBadge', 'statusBadgeClass',
  'capitalFlowCategory', 'beyondLomborgAlternative'
];

data.KENYA_160B_LOAN_LEDGER.forEach((loan, idx) => {
  requiredFields.forEach(field => {
    assert(loan[field] !== undefined && loan[field] !== '', `Loan #${idx + 1} (${loan.id}) missing field: ${field}`);
  });
});
console.log('[DATA]  PASS: All 10 forensic loan packages have complete verified schema');

// 2. Check Macro Capital Flows
assert(data.KENYA_MACRO_CAPITAL_FLOWS, 'KENYA_MACRO_CAPITAL_FLOWS must exist');
const totalPct = data.KENYA_MACRO_CAPITAL_FLOWS.categories.reduce((acc, c) => acc + c.pct, 0);
assert.strictEqual(totalPct, 100, 'Macro capital flows must sum to exactly 100%');
console.log(`[DATA]  PASS: Macro capital flows sum to exactly 100% across ${data.KENYA_MACRO_CAPITAL_FLOWS.categories.length} categories`);

// 3. Check index.html elements
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const requiredIds = [
  'kenyaExclusiveBorrowingLedger',
  'macroFlowBar',
  'loanFilterPills',
  'loanSearchInput',
  'visibleLoanCount',
  'visibleLoanUsdTotal',
  'visibleLoanKshTotal',
  'forensicLoansGrid',
  'forensicLoanModal',
  'modalCategoryBadge',
  'modalLoanTitle',
  'modalBody',
  'modalCloseBtn'
];

requiredIds.forEach(id => {
  assert(html.includes(`id="${id}"`), `index.html must include element with id="${id}"`);
});
console.log('[HTML]  PASS: All required interactive elements and modal present in index.html');

// 4. Check app.js functions
const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
assert(appJs.includes('function renderForensicLoanLedger('), 'app.js must declare renderForensicLoanLedger');
assert(appJs.includes('function initForensicLoanLedger('), 'app.js must declare initForensicLoanLedger');
assert(appJs.includes('function openLoanAuditModal('), 'app.js must declare openLoanAuditModal');
assert(appJs.includes('initForensicLoanLedger();'), 'app.js must invoke initForensicLoanLedger on boot');
console.log('[APP]   PASS: All forensic loan controller functions implemented and wired to boot');

// 5. Check styles.css
const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
const requiredClasses = [
  '.kenya-exclusive-ledger',
  '.macro-capital-flow-bar',
  '.flow-segment',
  '.flow-kpi-grid',
  '.flow-kpi-card',
  '.ledger-controls-row',
  '.ledger-filter-pill',
  '.forensic-loans-grid',
  '.forensic-loan-card',
  '.forensic-modal-backdrop',
  '.forensic-modal-window'
];

requiredClasses.forEach(cls => {
  assert(css.includes(cls), `styles.css must include selector ${cls}`);
});
console.log('[CSS]   PASS: All forensic ledger and modal classes present in styles.css');

console.log('\n>>> ALL 5 FORENSIC LOAN LEDGER SUITE CHECKS PASSED WITH 100% SUCCESS! <<<');
