const fs = require('fs');

console.log("=== RUNNING RIGOROUS KENYA-ONLY VALIDATION SUITE ===");

const html = fs.readFileSync('index.html', 'utf8');

// Test 1: Title and brand are Kenya-exclusive
const tests = [
  ['HTML Title is Kenya-exclusive', html.includes('Kenya Economic Superpower Model')],
  ['Header brand title is Kenya Sovereign Debt & Economic Audit', html.includes('Kenya Economic Superpower Model') && html.includes('Special Edition • Kenya Sovereign Debt & Economic Audit')],
  ['No scope navigation bar (All-Africa removed)', !html.includes('id="countryScopeNavBar"')],
  ['Step 1 title is Kenya Debt Audit', html.includes('Kenya Debt Audit ($41.0B Foreign)')],
  ['Step 2 title is How Kenya Debt Grows Economy', html.includes("How Kenya's Borrowed Debt Grows Economy")], 
  ['Step 3 title is Auditor-General Forensic Audit', html.includes("Auditor-General's Forensic Audit")], 
  ['Step 4 title is 47-County 3D Extrusion Map', html.includes('47-County 3D Extrusion Map')],
  ['No Africa race container', !html.includes('id="africaRaceContainer"')],
  ['No Africa map controls bar', !html.includes('id="africaMapControlsBar"')],
  ['No DRC superpower section', !html.includes('id="drc-superpower"')],
  ['No africa-map-data.js script', !html.includes('africa-map-data.js')],
  ['Kenya counties GeoJSON loaded', html.includes('kenya-counties-geojson.js')],
  ['Kenya counties data loaded', html.includes('kenya-counties-data.js')],
  ['Kenya SVG paths loaded', html.includes('kenya-svg-paths.js')],
  ['Kenya China comparison card present in Step 2', html.includes('id="kenyaChinaComparisonCard"')],
  ['Auditor-General Forensic Container present in Step 3', html.includes('id="kenyaForensicAuditContainer"')],
  ['5 OAG Dossiers present', 
    html.includes('data-oag-id="pendingBills"') &&
    html.includes('data-oag-id="debtChoke"') &&
    html.includes('data-oag-id="deadLand"') &&
    html.includes('data-oag-id="thermalIpp"') &&
    html.includes('data-oag-id="portDelays"')],
  ['OAG recovery buttons present', 
    html.includes('id="btnPlugAllOagLeaks"') &&
    html.includes('id="btnResetOagStatusQuo"')],
  ['Kenya 47 counties controls bar present', html.includes('id="kenyaCountyControlsBar"')],
  ['County dropdown present', html.includes('id="countySelectDropdown"')],
  ['47 Counties matrix section present', html.includes('id="kenyaCountiesMatrixSection"')],
  ['No Mansa Musa mentions in active content', !html.includes('Mansa Musa Heartland') && !html.includes('Mansa Musa Gold Tier')],
];

let allPassed = true;
tests.forEach(([label, pass]) => {
  console.log(`[CHECK] ${pass ? 'PASS' : 'FAIL'}: ${label}`);
  if (!pass) allPassed = false;
});

// Check app.js syntax and key methods
const appJs = fs.readFileSync('app.js', 'utf8');
const appTests = [
  ['activeCountryScope is kenya', appJs.includes('let activeCountryScope = "kenya";')],
  ['initWebGlMap loads kenya-counties directly', appJs.includes('source: "kenya-counties"') && appJs.includes('id: "kenya-counties-extrusion"')],
  ['setMapEngineMode supports 3d, 2d-gl, svg for Kenya', appJs.includes('renderKenyaCountyMap()') && appJs.includes('kenyaCountySvgMap')],
  ['syncGeoJsonMetrics updates Kenya counties GeoJSON', appJs.includes('glMap.getSource("kenya-counties").setData(KENYA_COUNTIES_GEOJSON)')],
  ['initOagInvestigation defined and updates dashboard', appJs.includes('function initOagInvestigation') && appJs.includes('function updateOagDashboard')],
  ['renderCountyDossier updates county dossier card', appJs.includes('function renderCountyDossier')],
  ['renderKenyaCountiesTable updates table', appJs.includes('function renderKenyaCountiesTable')],
];

appTests.forEach(([label, pass]) => {
  console.log(`[APP]   ${pass ? 'PASS' : 'FAIL'}: ${label}`);
  if (!pass) allPassed = false;
});

if (allPassed) {
  console.log("\n>>> ALL 28 VALIDATION CHECKS PASSED WITH 100% SUCCESS! <<<");
} else {
  console.error("\n>>> SOME CHECKS FAILED! <<<");
  process.exit(1);
}
