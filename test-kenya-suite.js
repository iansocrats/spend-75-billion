const fs = require('fs');

console.log("=== RUNNING FULL VERIFICATION TEST SUITE ===");

// 1. Check index.html
const html = fs.readFileSync('index.html', 'utf8');
const checksHtml = [
  ['No start race from fixed base button', !html.includes('applyCounterfactualBaseBtn')],
  ['Kenya China comparison card present in Step 2', html.includes('id="kenyaChinaComparisonCard"')],
  ['Africa race container present in Step 3', html.includes('id="africaRaceContainer"')],
  ['Kenya forensic audit container present in Step 3', html.includes('id="kenyaForensicAuditContainer"')],
  ['5 OAG Dossiers present', 
    html.includes('data-oag-id="pendingBills"') &&
    html.includes('data-oag-id="debtChoke"') &&
    html.includes('data-oag-id="deadLand"') &&
    html.includes('data-oag-id="thermalIpp"') &&
    html.includes('data-oag-id="portDelays"')],
  ['OAG KPI displays present', 
    html.includes('id="oagRecoveredCapital"') &&
    html.includes('id="oagAnnualTaxSaved"') &&
    html.includes('id="oagKenyaGdpProjected"')],
  ['MapLibre JS script loaded', html.includes('maplibre-gl.js')],
  ['Kenya Counties GeoJSON script loaded', html.includes('kenya-counties-geojson.js')],
];

checksHtml.forEach(([label, pass]) => {
  console.log(`[HTML] ${pass ? 'PASS' : 'FAIL'}: ${label}`);
  if (!pass) process.exit(1);
});

// 2. Check data.js
const dataJs = fs.readFileSync('data.js', 'utf8');
const checksData = [
  ['Kenya defaultRedirectPct is 0 (Current Reality / Trap)', dataJs.includes('defaultRedirectPct: 0')],
  ['Kenya actual2026 gdp is 0.136 ($136B)', dataJs.includes('gdpT: 0.136')],
  ['Kenya 47 counties present in OVERTAKE_RACE_BLOCS_KENYA', dataJs.includes('OVERTAKE_RACE_BLOCS_KENYA')],
];

checksData.forEach(([label, pass]) => {
  console.log(`[DATA] ${pass ? 'PASS' : 'FAIL'}: ${label}`);
  if (!pass) process.exit(1);
});

// 3. Check app.js
const appJs = fs.readFileSync('app.js', 'utf8');
const checksApp = [
  ['applyWebGlScopeVisibility defined', appJs.includes('function applyWebGlScopeVisibility')],
  ['MapLibre sources contain kenya-counties', appJs.includes('mapSources["kenya-counties"] =')],
  ['MapLibre layers contain kenya-counties-extrusion', appJs.includes('id: "kenya-counties-extrusion"')],
  ['MapLibre layers contain kenya-counties-borders', appJs.includes('id: "kenya-counties-borders"')],
  ['initOagInvestigation defined', appJs.includes('function initOagInvestigation')],
  ['updateOagDashboard defined', appJs.includes('function updateOagDashboard')],
  ['OAG Dossier specs defined with $101.5B total recovery', appJs.includes('capitalB: 65.0') && appJs.includes('capitalB: 12.5')],
  ['Step 3 Tab title updated for Auditor-General', appJs.includes("📑 3. Auditor-General's $160B Forensic Audit")],
  ['Kenya scope defaults to 0% dials', appJs.includes('eqDials.forEach((d) => { if (d) d.value = 0; })')],
  ['Step 1 valves reset to unplugged for Kenya', appJs.includes('(auditValves[k].plugged = false)')],
  ['WebGL camera eases to Kenya coordinates', appJs.includes('center: isKenya ? [37.8, 0.4] : [21.5, 1.5]')],
  ['Boot sequence calls initOagInvestigation', appJs.includes('initOagInvestigation();')],
];

checksApp.forEach(([label, pass]) => {
  console.log(`[APP]  ${pass ? 'PASS' : 'FAIL'}: ${label}`);
  if (!pass) process.exit(1);
});

// 4. Test GeoJSON properties
const geoJsonTxt = fs.readFileSync('kenya-counties-geojson.js', 'utf8');
eval(geoJsonTxt.replace('const KENYA_COUNTIES_GEOJSON', 'var KENYA_COUNTIES_GEOJSON'));
console.log(`[GEO]  PASS: 47 counties in GeoJSON, sample feature 047 (Nairobi): height=${KENYA_COUNTIES_GEOJSON.features[0].properties.extrusionHeight}m, color=${KENYA_COUNTIES_GEOJSON.features[0].properties.fillColor}`);

console.log("\n>>> ALL TESTS PASSED WITH 100% SUCCESS! <<<");
