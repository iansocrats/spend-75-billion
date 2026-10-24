// ============================================================================
// APPLICATION CONTROLLER: HOW $75B GROWS AFRICA INTO HISTORY'S LARGEST ECONOMY
// Featuring 60FPS MapLibre WebGL 3D Extruded Map + 2026–2076 Growth Scrubber
// ============================================================================

(function () {
  const MAX_BUDGET_B = 75.0;

  // State
  let selectedIds = new Set(
    GLOBAL_INTERVENTIONS.filter((item) => item.isWinner).map((item) => item.id)
  );
  let activeCategory = "ALL";
  let discountRate = "3"; // "3" or "5"
  let dalyValuation = "base"; // "base" ($1k) or "high" ($5k)
  let activeCountryKey = "africa"; // Macro blueprint tab ("africa", "drc", "kenya", "twinAxis")
  let activeDrcPhase = 1;
  let activeScenarioKey = "lomborg";

  // Interactive Map & Timeline State
  let selectedMapIso = "COD"; // Default to DRC
  let mapColorMetric = "gdp2076T"; // "gdp2076T", "bcrWeighted", "catalystShareB"
  let showCorridors = true;
  let countryDedicated75BMode = false;
  let mapSimYear = 2076; // 2026 to 2076
  let timelineInterval = null;
  let mapEngineMode = "3d"; // "3d", "2d-gl", or "svg"
  let glMap = null;

  // Helper: Calculate effective BCR and Benefit ($B) for an intervention
  function getEffectiveMetrics(item) {
    const baseBcr = discountRate === "3" ? item.bcr3pct : item.bcr5pct;
    const multiplier = dalyValuation === "high" ? item.dalyMultiplierHigh : 1.0;
    const bcr = +(baseBcr * multiplier).toFixed(1);
    const benefitB = +(item.costBillions * bcr).toFixed(1);
    return { bcr, benefitB };
  }

  function getActiveBlueprint() {
    return AFRICAN_BLUEPRINTS[activeCountryKey] || AFRICAN_BLUEPRINTS.africa;
  }

  // Helper: Interpolate country GDP at any year between 2026 and 2076 (compound curve)
  function getCountryGdpAtYear(c, year) {
    const t = Math.max(0, Math.min(1, (year - 2026) / 50.0));
    // Non-linear compound curve (t^2.15 matches 50-year compounding trajectory)
    const curve = Math.pow(t, 2.15);
    return +(c.gdp2026T + (c.gdp2076T - c.gdp2026T) * curve).toFixed(2);
  }

  function getContinentalGdpAtYear(year) {
    const t = Math.max(0, Math.min(1, (year - 2026) / 50.0));
    const curve = Math.pow(t, 2.15);
    return +(3.1 + (145.0 - 3.1) * curve).toFixed(1);
  }

  // ==========================================================================
  // 1. THEME TOGGLE
  // ==========================================================================
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  themeToggleBtn.addEventListener("click", () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    themeToggleBtn.textContent =
      next === "dark" ? "☀ Newsprint Mode" : "◑ Terminal Mode";
    renderTrajectoryChart();
    renderAfricaSvgMap();
  });

  // ==========================================================================
  // 2. 60FPS MAPLIBRE WEBGL 3D EXTRUDED MAP + 2D VECTOR ATLAS
  // ==========================================================================
  const africaSvgMap = document.getElementById("africaSvgMap");
  const maplibreContainer = document.getElementById("maplibreContainer");
  const mapFloatingTooltip = document.getElementById("mapFloatingTooltip");
  const countryDossierCard = document.getElementById("countryDossierCard");
  const countrySelectDropdown = document.getElementById("countrySelectDropdown");
  const mapYearSlider = document.getElementById("mapYearSlider");
  const mapYearLabel = document.getElementById("mapYearLabel");
  const mapContinentalGdpLabel = document.getElementById("mapContinentalGdpLabel");
  const playTimelineBtn = document.getElementById("playTimelineBtn");

  function getCountryFillColor(c) {
    if (!c) return "#CBD5E1";
    const val =
      mapColorMetric === "gdp2076T"
        ? getCountryGdpAtYear(c, mapSimYear)
        : c[mapColorMetric] || 0;

    if (mapColorMetric === "gdp2076T") {
      if (val >= 15) return "#F59E0B"; // Gold Superpower Peak ($15T–$54.8T)
      if (val >= 5.0) return "#1D4ED8"; // Cobalt Regional Titan ($5T–$15T)
      if (val >= 2.0) return "#0D9488"; // Emerald Industrial Power ($2T–$5T)
      if (val >= 0.7) return "#2DD4BF"; // Teal Rising Engine
      return "#99F6E4"; // Mint Frontier
    } else if (mapColorMetric === "bcrWeighted") {
      if (val >= 41) return "#F59E0B";
      if (val >= 38) return "#1D4ED8";
      if (val >= 35) return "#0D9488";
      if (val >= 31) return "#2DD4BF";
      return "#99F6E4";
    } else {
      if (val >= 5.0) return "#F59E0B";
      if (val >= 2.5) return "#1D4ED8";
      if (val >= 1.2) return "#0D9488";
      if (val >= 0.5) return "#2DD4BF";
      return "#99F6E4";
    }
  }

  // Build GeoJSON for Trans-African Megacorridors
  function buildCorridorsGeoJson() {
    const corridors = [
      {
        name: "Kenya–DRC–Lobito Twin-Ocean Axis",
        isos: ["KEN", "UGA", "RWA", "COD", "AGO"],
      },
      {
        name: "Cape-to-Cairo Continental Spine",
        isos: ["EGY", "SDN", "ETH", "KEN", "TZA", "ZMB", "ZAF"],
      },
      {
        name: "West African Atlantic-to-Congo Spine",
        isos: ["SEN", "CIV", "GHA", "NGA", "CMR", "COD"],
      },
    ];
    const features = corridors.map((corr) => {
      const coords = corr.isos
        .map((iso) => AFRICA_MAP_COUNTRIES[iso])
        .filter((c) => c && typeof c.lon === "number")
        .map((c) => [c.lon, c.lat]);
      return {
        type: "Feature",
        properties: { name: corr.name },
        geometry: { type: "LineString", coordinates: coords },
      };
    });
    return { type: "FeatureCollection", features };
  }

  // Update dynamic properties on AFRICA_GEOJSON features for current year & metric
  function syncGeoJsonMetrics() {
    if (typeof AFRICA_GEOJSON === "undefined") return;
    AFRICA_GEOJSON.features.forEach((f) => {
      const iso = f.properties.iso;
      const c = AFRICA_MAP_COUNTRIES[iso];
      if (!c) return;
      const curGdp = getCountryGdpAtYear(c, mapSimYear);
      f.properties.currentGdpT = curGdp;
      f.properties.fillColor = getCountryFillColor(c);

      // Compute 3D extrusion height in meters for WebGL view
      let h = 25000;
      if (mapColorMetric === "gdp2076T") {
        h = Math.max(25000, curGdp * 42000);
      } else if (mapColorMetric === "bcrWeighted") {
        h = Math.max(25000, (c.bcrWeighted - 22) * 65000);
      } else {
        h = Math.max(25000, c.catalystShareB * 140000);
      }
      f.properties.extrusionHeight = mapEngineMode === "2d-gl" ? 0 : Math.round(h);
      f.properties.label = `${c.iso}\n$${curGdp}T`;
    });

    if (glMap && glMap.getSource("africa-countries")) {
      glMap.getSource("africa-countries").setData(AFRICA_GEOJSON);
    }
  }

  function initWebGlMap() {
    if (typeof maplibregl === "undefined" || typeof AFRICA_GEOJSON === "undefined") {
      // Fallback to SVG if MapLibre script didn't load
      setMapEngineMode("svg");
      return;
    }

    syncGeoJsonMetrics();

    try {
      glMap = new maplibregl.Map({
        container: "maplibreContainer",
        style: {
          version: 8,
          sources: {
            "africa-countries": {
              type: "geojson",
              data: AFRICA_GEOJSON,
            },
            "africa-corridors": {
              type: "geojson",
              data: buildCorridorsGeoJson(),
            },
          },
          layers: [
            {
              id: "ocean-bg",
              type: "background",
              paint: {
                "background-color": "#090D16",
              },
            },
            {
              id: "africa-extrusion",
              type: "fill-extrusion",
              source: "africa-countries",
              paint: {
                "fill-extrusion-color": ["get", "fillColor"],
                "fill-extrusion-height": ["get", "extrusionHeight"],
                "fill-extrusion-base": 0,
                "fill-extrusion-opacity": 0.9,
              },
            },
            {
              id: "africa-borders",
              type: "line",
              source: "africa-countries",
              paint: {
                "line-color": "#0F172A",
                "line-width": 1.2,
              },
            },
            {
              id: "africa-selected-outline",
              type: "line",
              source: "africa-countries",
              filter: ["==", ["get", "iso"], selectedMapIso],
              paint: {
                "line-color": "#FF3B30",
                "line-width": 3.5,
              },
            },
            {
              id: "corridors-glow",
              type: "line",
              source: "africa-corridors",
              paint: {
                "line-color": "#FF3B30",
                "line-width": 6,
                "line-blur": 4,
                "line-opacity": 0.55,
              },
            },
            {
              id: "corridors-core",
              type: "line",
              source: "africa-corridors",
              paint: {
                "line-color": "#FFFFFF",
                "line-width": 2,
                "line-dasharray": [2, 2],
                "line-opacity": 0.9,
              },
            },
          ],
        },
        center: [21.5, 1.5],
        zoom: 2.55,
        pitch: 50,
        bearing: -8,
        antialias: true,
      });

      glMap.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");

      glMap.on("mousemove", "africa-extrusion", (e) => {
        glMap.getCanvas().style.cursor = "pointer";
        if (e.features && e.features.length > 0) {
          const props = e.features[0].properties;
          const c = AFRICA_MAP_COUNTRIES[props.iso];
          if (c) {
            const curGdp = getCountryGdpAtYear(c, mapSimYear);
            mapFloatingTooltip.innerHTML = `
              <strong>${c.flag} ${c.name}</strong> (${c.region})<br/>
              Year ${mapSimYear} GDP: <strong style="color: var(--emerald);">$${curGdp}T</strong> (2076 Peak: <strong>$${c.gdp2076T}T</strong>) • BCR: <strong>${c.bcrWeighted}:1</strong>
            `;
          }
        }
      });

      glMap.on("mouseleave", "africa-extrusion", () => {
        glMap.getCanvas().style.cursor = "";
      });

      glMap.on("click", "africa-extrusion", (e) => {
        if (e.features && e.features.length > 0) {
          const iso = e.features[0].properties.iso;
          selectMapCountry(iso, true);
        }
      });
    } catch (err) {
      console.warn("WebGL fallback to SVG:", err);
      setMapEngineMode("svg");
    }
  }

  function setMapEngineMode(mode) {
    mapEngineMode = mode;
    document.querySelectorAll("[data-engine-mode]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-engine-mode") === mode);
    });

    if (mode === "svg") {
      maplibreContainer.style.display = "none";
      africaSvgMap.style.display = "block";
      renderAfricaSvgMap();
    } else {
      maplibreContainer.style.display = "block";
      africaSvgMap.style.display = "none";
      syncGeoJsonMetrics();
      if (glMap) {
        glMap.resize();
        glMap.easeTo({
          pitch: mode === "3d" ? 50 : 0,
          bearing: mode === "3d" ? -8 : 0,
          duration: 700,
        });
      }
    }
  }

  document.querySelectorAll("[data-engine-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setMapEngineMode(btn.getAttribute("data-engine-mode"));
    });
  });

  const resetCameraBtn = document.getElementById("resetCameraBtn");
  if (resetCameraBtn) {
    resetCameraBtn.addEventListener("click", () => {
      if (glMap) {
        glMap.flyTo({
          center: [21.5, 1.5],
          zoom: 2.55,
          pitch: mapEngineMode === "3d" ? 50 : 0,
          bearing: mapEngineMode === "3d" ? -8 : 0,
          duration: 1100,
        });
      }
    });
  }

  // Timeline Scrubber & Play Animation (2026 -> 2076)
  function updateTimelineDisplay() {
    if (mapYearLabel) mapYearLabel.textContent = `Year ${mapSimYear}`;
    if (mapContinentalGdpLabel) {
      const contGdp = getContinentalGdpAtYear(mapSimYear);
      mapContinentalGdpLabel.textContent = `$${contGdp.toFixed(1)}T Africa GDP`;
    }
    syncGeoJsonMetrics();
    if (mapEngineMode === "svg") {
      renderAfricaSvgMap();
    }
    renderCountryDossier();
  }

  if (mapYearSlider) {
    mapYearSlider.addEventListener("input", (e) => {
      mapSimYear = parseInt(e.target.value, 10);
      updateTimelineDisplay();
    });
  }

  if (playTimelineBtn) {
    playTimelineBtn.addEventListener("click", () => {
      if (timelineInterval) {
        clearInterval(timelineInterval);
        timelineInterval = null;
        playTimelineBtn.textContent = "▶ Play 2026–2076 Growth";
        return;
      }
      if (mapSimYear >= 2076) {
        mapSimYear = 2026;
      }
      playTimelineBtn.textContent = "⏸ Pause Simulation";
      timelineInterval = setInterval(() => {
        mapSimYear += 1;
        if (mapYearSlider) mapYearSlider.value = mapSimYear;
        updateTimelineDisplay();
        if (mapSimYear >= 2076) {
          clearInterval(timelineInterval);
          timelineInterval = null;
          playTimelineBtn.textContent = "▶ Replay 2026–2076 Growth";
        }
      }, 95);
    });
  }

  function populateCountryDropdown() {
    if (typeof AFRICA_MAP_COUNTRIES === "undefined") return;
    const sorted = Object.values(AFRICA_MAP_COUNTRIES).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    countrySelectDropdown.innerHTML = sorted
      .map(
        (c) =>
          `<option value="${c.iso}" ${
            c.iso === selectedMapIso ? "selected" : ""
          }>${c.flag} ${c.name} ($${c.gdp2076T}T Peak)</option>`
      )
      .join("");
  }

  function renderAfricaSvgMap() {
    if (typeof AFRICA_MAP_COUNTRIES === "undefined" || !africaSvgMap) return;
    africaSvgMap.innerHTML = "";

    const countries = Object.values(AFRICA_MAP_COUNTRIES);

    countries.forEach((c) => {
      if (!c.d) return;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", c.d);
      path.setAttribute("fill", getCountryFillColor(c));
      path.setAttribute(
        "class",
        `country-path ${c.iso === selectedMapIso ? "active" : ""}`
      );
      path.setAttribute("data-iso", c.iso);

      path.addEventListener("mouseenter", () => {
        const curGdp = getCountryGdpAtYear(c, mapSimYear);
        mapFloatingTooltip.innerHTML = `
          <strong>${c.flag} ${c.name}</strong> (${c.region})<br/>
          Year ${mapSimYear} GDP: <strong style="color: var(--emerald);">$${curGdp}T</strong> (2076 Peak: <strong>$${c.gdp2076T}T</strong>)
        `;
      });

      path.addEventListener("click", () => {
        selectMapCountry(c.iso, false);
      });

      africaSvgMap.appendChild(path);
    });

    const islandIsos = ["CPV", "STP", "SYC", "MUS", "COM"];
    islandIsos.forEach((iso) => {
      const c = AFRICA_MAP_COUNTRIES[iso];
      if (!c) return;
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", c.cx);
      circle.setAttribute("cy", c.cy);
      circle.setAttribute("r", c.iso === selectedMapIso ? "8" : "5.5");
      circle.setAttribute("fill", getCountryFillColor(c));
      circle.setAttribute(
        "stroke",
        c.iso === selectedMapIso ? "var(--crimson)" : "#FFFFFF"
      );
      circle.setAttribute("stroke-width", "2");
      circle.style.cursor = "pointer";
      circle.addEventListener("click", () => selectMapCountry(c.iso, false));
      africaSvgMap.appendChild(circle);
    });

    if (showCorridors) {
      const corridors = [
        ["KEN", "UGA", "RWA", "COD", "AGO"],
        ["EGY", "SDN", "ETH", "KEN", "TZA", "ZMB", "ZAF"],
        ["SEN", "CIV", "GHA", "NGA", "CMR", "COD"],
      ];

      corridors.forEach((isoList) => {
        const pts = isoList
          .map((code) => AFRICA_MAP_COUNTRIES[code])
          .filter(Boolean)
          .map((c) => `${c.cx},${c.cy}`);
        if (pts.length > 1) {
          const poly = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "polyline"
          );
          poly.setAttribute("points", pts.join(" "));
          poly.setAttribute("class", "corridor-line");
          africaSvgMap.appendChild(poly);
        }
      });
    }

    const labeledIsos = [
      "COD",
      "KEN",
      "NGA",
      "ETH",
      "ZAF",
      "EGY",
      "TZA",
      "AGO",
      "DZA",
      "MAR",
      "ZMB",
      "GHA",
      "CIV",
      "SEN",
      "MDG",
      "MOZ",
      "SDN",
      "MLI",
      "NER",
      "TCD",
      "NAM",
      "BWA",
      "LBY",
    ];
    labeledIsos.forEach((iso) => {
      const c = AFRICA_MAP_COUNTRIES[iso];
      if (!c) return;
      const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      txt.setAttribute("x", c.cx);
      txt.setAttribute("y", c.cy + 3);
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("font-family", "JetBrains Mono, monospace");
      txt.setAttribute(
        "font-size",
        c.iso === selectedMapIso ? "11.5" : "9.5"
      );
      txt.setAttribute("font-weight", "700");
      txt.setAttribute("fill", "#FFFFFF");
      txt.setAttribute("stroke", "rgba(20,20,19,0.75)");
      txt.setAttribute("stroke-width", "2.5");
      txt.setAttribute("paint-order", "stroke");
      txt.style.pointerEvents = "none";
      txt.textContent = c.iso;
      africaSvgMap.appendChild(txt);
    });
  }

  function renderCountryDossier() {
    if (typeof AFRICA_MAP_COUNTRIES === "undefined" || !countryDossierCard) return;
    const c = AFRICA_MAP_COUNTRIES[selectedMapIso] || AFRICA_MAP_COUNTRIES["COD"];

    const scaleFactor = countryDedicated75BMode
      ? +(75.0 / Math.max(c.catalystShareB, 0.05)).toFixed(1)
      : 1.0;

    const displayedCatalystB = countryDedicated75BMode
      ? 75.0
      : c.catalystShareB;
    const immediateSurplusB = +(displayedCatalystB * c.bcrWeighted).toFixed(1);
    const curGdpT = getCountryGdpAtYear(c, mapSimYear);

    const endowmentsHtml = c.keyEndowments
      .map((e) => `<li>${e}</li>`)
      .join("");

    function formatPhaseText(text) {
      if (!countryDedicated75BMode) return text;
      return text.replace(/\$(\d+(\.\d+)?)B/g, (_, num) => {
        const scaled = +(parseFloat(num) * scaleFactor).toFixed(1);
        return `$${scaled}B`;
      });
    }

    countryDossierCard.innerHTML = `
      <div class="dossier-header">
        <div>
          <div class="kicker emerald">${c.region.toUpperCase()} • ${c.roleBadge}</div>
          <h3 class="dossier-country-title">${c.flag} ${c.name}</h3>
        </div>
        <button id="toggleCountry75BModeBtn" type="button" class="btn-outline" style="font-size: 0.74rem; padding: 0.42rem 0.72rem;">
          ${
            countryDedicated75BMode
              ? "Viewing: Dedicated $75B Here (Switch to Continental Share)"
              : `Viewing: $${c.catalystShareB}B Share (Simulate Full $75B Here)`
          }
        </button>
      </div>

      <div class="dossier-metrics-grid">
        <div class="dossier-metric-box">
          <span class="dossier-metric-label">${
            countryDedicated75BMode ? "Dedicated Catalyst" : "Share of $75B Fund"
          }</span>
          <span class="dossier-metric-val">$${displayedCatalystB.toFixed(2)}B</span>
        </div>
        <div class="dossier-metric-box">
          <span class="dossier-metric-label">Weighted BCR</span>
          <span class="dossier-metric-val emerald">${c.bcrWeighted} : 1</span>
        </div>
        <div class="dossier-metric-box">
          <span class="dossier-metric-label">Immediate Surplus</span>
          <span class="dossier-metric-val emerald">$${immediateSurplusB.toLocaleString()}B</span>
        </div>
        <div class="dossier-metric-box">
          <span class="dossier-metric-label">Year ${mapSimYear} GDP (2076 Peak)</span>
          <span class="dossier-metric-val emerald">$${curGdpT}T ($${c.gdp2076T}T)</span>
        </div>
      </div>

      <div>
        <div style="font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; color: var(--ink-muted); font-weight: 700;">
          Natural &amp; Strategic Endowments (${c.name} • ~${c.pop2076M}M Pop by 2076)
        </div>
        <ul class="dossier-endowment-list">
          ${endowmentsHtml}
        </ul>
      </div>

      <div class="endowment-bottleneck" style="margin-bottom: 1rem;">
        <strong>Primary Bottleneck Diagnosed:</strong> ${c.topBottleneck}
      </div>

      <div>
        <div style="font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; color: var(--cobalt); font-weight: 700;">
          4-Phase Lomborg Benefit-Cost Ratio Sequence for ${c.name}
        </div>
        <div class="dossier-phases-stack">
          <div class="dossier-phase-item">
            <strong>Phase I • Biology &amp; Brains</strong>
            ${formatPhaseText(c.phase1)}
          </div>
          <div class="dossier-phase-item">
            <strong>Phase II • Caloric &amp; Water Surplus</strong>
            ${formatPhaseText(c.phase2)}
          </div>
          <div class="dossier-phase-item">
            <strong>Phase III • STEM &amp; Adult Health</strong>
            ${formatPhaseText(c.phase3)}
          </div>
          <div class="dossier-phase-item">
            <strong>Phase IV • Titles, Power &amp; AfCFTA</strong>
            ${formatPhaseText(c.phase4)}
          </div>
        </div>
      </div>

      <div style="background: var(--emerald-soft); border-left: 4px solid var(--emerald); padding: 0.85rem 1rem; border-radius: var(--radius-sm); font-size: 0.84rem;">
        <strong style="color: var(--emerald); font-family: var(--font-mono); text-transform: uppercase; font-size: 0.74rem; display: block; margin-bottom: 0.2rem;">
          Onshore Value-Chain Superpower Endgame:
        </strong>
        ${c.valueChainWin}
      </div>
    `;

    const modeBtn = document.getElementById("toggleCountry75BModeBtn");
    if (modeBtn) {
      modeBtn.addEventListener("click", () => {
        countryDedicated75BMode = !countryDedicated75BMode;
        renderCountryDossier();
      });
    }
  }

  function selectMapCountry(iso, flyCamera = true) {
    const c = AFRICA_MAP_COUNTRIES[iso];
    if (!c) return;
    selectedMapIso = iso;
    if (countrySelectDropdown) {
      countrySelectDropdown.value = iso;
    }

    if (glMap && glMap.getLayer("africa-selected-outline")) {
      glMap.setFilter("africa-selected-outline", ["==", ["get", "iso"], iso]);
      if (flyCamera && typeof c.lon === "number") {
        glMap.flyTo({
          center: [c.lon, c.lat],
          zoom: 3.6,
          pitch: mapEngineMode === "3d" ? 52 : 0,
          bearing: mapEngineMode === "3d" ? -12 : 0,
          duration: 1100,
        });
      }
    }

    renderAfricaSvgMap();
    renderCountryDossier();
  }

  if (countrySelectDropdown) {
    countrySelectDropdown.addEventListener("change", (e) => {
      selectMapCountry(e.target.value, true);
    });
  }

  document.querySelectorAll("[data-quick-iso]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectMapCountry(btn.getAttribute("data-quick-iso"), true);
    });
  });

  const mapColorMetricSelect = document.getElementById("mapColorMetricSelect");
  if (mapColorMetricSelect) {
    mapColorMetricSelect.addEventListener("change", (e) => {
      mapColorMetric = e.target.value;
      syncGeoJsonMetrics();
      renderAfricaSvgMap();
    });
  }

  const toggleCorridorsCheckbox = document.getElementById(
    "toggleCorridorsCheckbox"
  );
  if (toggleCorridorsCheckbox) {
    toggleCorridorsCheckbox.addEventListener("change", (e) => {
      showCorridors = e.target.checked;
      if (glMap) {
        const vis = showCorridors ? "visible" : "none";
        if (glMap.getLayer("corridors-glow"))
          glMap.setLayoutProperty("corridors-glow", "visibility", vis);
        if (glMap.getLayer("corridors-core"))
          glMap.setLayoutProperty("corridors-core", "visibility", vis);
      }
      renderAfricaSvgMap();
    });
  }

  // ==========================================================================
  // 3. SIMULATOR RENDER & AFRICAN SUPERPOWER BUDGET ENGINE
  // ==========================================================================
  const simSpentDisplay = document.getElementById("simSpentDisplay");
  const simRemainingDisplay = document.getElementById("simRemainingDisplay");
  const simBenefitDisplay = document.getElementById("simBenefitDisplay");
  const simAvgBcrDisplay = document.getElementById("simAvgBcrDisplay");
  const simProgressBar = document.getElementById("simProgressBar");
  const simVerdictText = document.getElementById("simVerdictText");
  const simCountText = document.getElementById("simCountText");
  const interventionsGrid = document.getElementById("interventionsGrid");

  function updateSimulatorSummary() {
    let totalCost = 0;
    let totalBenefit = 0;
    let count = 0;
    let hasDecoys = false;

    GLOBAL_INTERVENTIONS.forEach((item) => {
      if (selectedIds.has(item.id)) {
        const { benefitB } = getEffectiveMetrics(item);
        totalCost += item.costBillions;
        totalBenefit += benefitB;
        count++;
        if (!item.isWinner) hasDecoys = true;
      }
    });

    totalCost = +totalCost.toFixed(1);
    totalBenefit = +totalBenefit.toFixed(1);
    const remaining = +(MAX_BUDGET_B - totalCost).toFixed(1);
    const avgBcr = totalCost > 0 ? (totalBenefit / totalCost).toFixed(1) : "0.0";

    const optimalSurplusRef = 3649.0;
    const gdpUnlockedT =
      totalCost === 0
        ? 8.2
        : +(8.2 + (totalBenefit / optimalSurplusRef) * (145.0 - 8.2)).toFixed(1);

    simSpentDisplay.textContent = `$${totalCost.toFixed(1)}B / $${MAX_BUDGET_B.toFixed(1)}B`;
    simBenefitDisplay.textContent = `$${totalBenefit.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}B`;
    simAvgBcrDisplay.textContent = `${avgBcr} : 1`;
    simRemainingDisplay.textContent = `$${gdpUnlockedT.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}T`;

    const pct = Math.min(100, Math.max(0, (totalCost / MAX_BUDGET_B) * 100));
    simProgressBar.style.width = `${pct}%`;

    if (totalCost > MAX_BUDGET_B) {
      simProgressBar.classList.add("over-warning");
      simVerdictText.innerHTML = `<strong style="color: var(--crimson);">⚠ Over Budget by $${Math.abs(
        remaining
      ).toFixed(
        1
      )}B!</strong> Deselect lower-BCR proposals to stay within the $75B catalytic cap.`;
    } else {
      simProgressBar.classList.remove("over-warning");
      if (count === 16 && !hasDecoys && Math.abs(totalCost - 75.0) < 0.5) {
        simVerdictText.innerHTML = `✓ <strong>Optimal African Superpower Portfolio Active:</strong> Unlocks $${totalBenefit.toLocaleString()}B immediately &amp; compounds into a <strong>$${gdpUnlockedT} Trillion</strong> continental economy.`;
      } else if (hasDecoys) {
        simVerdictText.innerHTML = `<strong style="color: var(--amber);">Notice the Opportunity Cost:</strong> Funding unsequenced debt traps crowds out 40:1 biological, agricultural, and property-rights breakthroughs—costing Africa over $120 Trillion in long-term GDP!`;
      } else if (totalCost === 0) {
        simVerdictText.innerHTML = `Status Quo ($0 allocated): Africa lingers at ~$8.2T by 2076. Select high-BCR catalysts below to unlock the $145T superpower trajectory.`;
      } else {
        simVerdictText.innerHTML = `You have <strong>$${remaining.toFixed(
          1
        )}B</strong> remaining in your $75B catalyst fund. Fund the highest Benefit-Cost Ratio levers first.`;
      }
    }

    simCountText.textContent = `${count} of ${GLOBAL_INTERVENTIONS.length} proposals funded`;
  }

  function renderInterventionsGrid() {
    interventionsGrid.innerHTML = "";

    const filtered = GLOBAL_INTERVENTIONS.filter((item) => {
      if (activeCategory === "ALL") return true;
      if (activeCategory === "WINNERS") return item.isWinner;
      return item.category === activeCategory;
    });

    filtered.forEach((item) => {
      const isSelected = selectedIds.has(item.id);
      const { bcr, benefitB } = getEffectiveMetrics(item);

      const card = document.createElement("article");
      card.className = `intervention-card ${isSelected ? "selected" : ""} ${
        !item.isWinner ? "decoy-card" : ""
      }`;

      const badgeClass = item.isWinner ? "winner" : "decoy";
      const badgeLabel = item.isWinner
        ? `AFRICA CATALYST #${item.rank}`
        : `LOW-BCR TRAP #${item.rank}`;

      const bcrClass = bcr >= 15 ? "high-bcr" : bcr < 4 ? "low-bcr" : "";

      card.innerHTML = `
        <div>
          <div class="card-top-meta">
            <span class="rank-badge ${badgeClass}">${badgeLabel}</span>
            <span class="category-tag">${item.category}</span>
          </div>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-summary">${item.summary}</p>

          <div class="card-metrics-strip">
            <div class="strip-item">
              <span class="strip-label">Catalyst Cost</span>
              <span class="strip-val">$${item.costBillions.toFixed(1)}B</span>
            </div>
            <div class="strip-item">
              <span class="strip-label">Benefit-Cost</span>
              <span class="strip-val ${bcrClass}">${bcr} : 1</span>
            </div>
            <div class="strip-item">
              <span class="strip-label">Direct Surplus</span>
              <span class="strip-val">$${benefitB.toLocaleString()}B</span>
            </div>
          </div>

          <div class="card-Verdict-box">
            <strong>Superpower Impact:</strong> ${item.drcRelevance}
          </div>
        </div>

        <div class="card-action-footer">
          <span style="color: var(--ink-muted);">${item.livesSavedOrImpacted}</span>
          <button type="button" class="fund-toggle-btn">
            ${isSelected ? "✓ FUNDED" : "+ FUND"}
          </button>
        </div>
      `;

      card.addEventListener("click", () => {
        if (selectedIds.has(item.id)) {
          selectedIds.delete(item.id);
        } else {
          selectedIds.add(item.id);
        }
        updateSimulatorSummary();
        renderInterventionsGrid();
        renderMarimekkoChart();
      });

      interventionsGrid.appendChild(card);
    });
  }

  document.getElementById("loadNobelBtn").addEventListener("click", () => {
    selectedIds = new Set(
      GLOBAL_INTERVENTIONS.filter((i) => i.isWinner).map((i) => i.id)
    );
    updateSimulatorSummary();
    renderInterventionsGrid();
    renderMarimekkoChart();
  });

  document.getElementById("loadTrapBtn").addEventListener("click", () => {
    selectedIds = new Set([
      "megaproject-prestige",
      "blanket-carbon-cuts",
      "raw-ore-enclave",
    ]);
    updateSimulatorSummary();
    renderInterventionsGrid();
    renderMarimekkoChart();
  });

  document.getElementById("clearSimBtn").addEventListener("click", () => {
    selectedIds.clear();
    updateSimulatorSummary();
    renderInterventionsGrid();
    renderMarimekkoChart();
  });

  document
    .querySelectorAll("#categoryFilterGroup .filter-pill")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll("#categoryFilterGroup .filter-pill")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.getAttribute("data-category");
        renderInterventionsGrid();
      });
    });

  document
    .getElementById("discountRateSelect")
    .addEventListener("change", (e) => {
      discountRate = e.target.value;
      updateSimulatorSummary();
      renderInterventionsGrid();
      renderMarimekkoChart();
    });

  document.getElementById("dalyValueSelect").addEventListener("change", (e) => {
    dalyValuation = e.target.value;
    updateSimulatorSummary();
    renderInterventionsGrid();
    renderMarimekkoChart();
  });

  // ==========================================================================
  // 4. MARIMEKKO ROI VISUALIZER (WIDTH = COST, HEIGHT = BCR)
  // ==========================================================================
  const marimekkoChart = document.getElementById("marimekkoChart");
  const marimekkoTooltip = document.getElementById("marimekkoTooltip");

  function renderMarimekkoChart() {
    marimekkoChart.innerHTML = "";

    const fundedItems = GLOBAL_INTERVENTIONS.filter((item) =>
      selectedIds.has(item.id)
    )
      .map((item) => {
        const { bcr, benefitB } = getEffectiveMetrics(item);
        return { ...item, effectiveBcr: bcr, effectiveBenefitB: benefitB };
      })
      .sort((a, b) => b.effectiveBcr - a.effectiveBcr);

    if (fundedItems.length === 0) {
      marimekkoChart.innerHTML = `<div style="margin: auto; font-family: var(--font-mono); color: var(--ink-muted);">No interventions currently funded. Click "+ FUND" on cards above or "★ Load Optimal $75B Superpower Portfolio".</div>`;
      return;
    }

    const maxBcr = Math.max(...fundedItems.map((i) => i.effectiveBcr), 45);
    const totalCost = fundedItems.reduce((acc, i) => acc + i.costBillions, 0);

    fundedItems.forEach((item) => {
      const widthPct = Math.max(
        2.5,
        (item.costBillions / Math.max(totalCost, 1)) * 100
      );
      const heightPct = Math.max(6, (item.effectiveBcr / maxBcr) * 100);

      const bar = document.createElement("div");
      bar.className = "marimekko-bar";
      bar.style.flex = `${widthPct} 1 0%`;

      const fill = document.createElement("div");
      fill.className = "marimekko-bar-fill";
      fill.style.height = `${heightPct}%`;
      if (!item.isWinner) {
        fill.style.backgroundColor = "var(--amber)";
      }

      const label = document.createElement("span");
      label.className = "marimekko-bar-label";
      label.textContent = `#${item.rank}`;

      bar.appendChild(fill);
      bar.appendChild(label);

      bar.addEventListener("mouseenter", () => {
        marimekkoTooltip.innerHTML = `
          <div>
            <strong>#${item.rank} ${item.shortTitle}</strong> — 
            Cost (Width): <strong>$${item.costBillions.toFixed(1)}B</strong> × 
            BCR (Height): <strong>${item.effectiveBcr}:1</strong>
          </div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: var(--emerald);">
            Continental Surplus (Area) = $${item.effectiveBenefitB.toLocaleString()} Billion
          </div>
        `;
      });

      marimekkoChart.appendChild(bar);
    });
  }

  // ==========================================================================
  // 5. ALL-AFRICA, DRC, KENYA & TWIN-AXIS SUPERPOWER BLUEPRINT ENGINE
  // ==========================================================================

  document
    .querySelectorAll("#countrySwitcherBar .country-switch-btn")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll("#countrySwitcherBar .country-switch-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCountryKey = btn.getAttribute("data-country");
        activeDrcPhase = 1;
        renderAllBlueprintSections();
      });
    });

  function renderBlueprintHeader() {
    const bp = getActiveBlueprint();
    document.getElementById("blueprintBadge").textContent = bp.badge;
    document.getElementById("blueprintHeadline").textContent = bp.headline;
    document.getElementById("blueprintIntro").textContent = bp.intro;
  }

  function renderDrcEndowments() {
    const bp = getActiveBlueprint();
    const grid = document.getElementById("drcEndowmentGrid");
    grid.innerHTML = "";

    bp.endowments.forEach((endow) => {
      const card = document.createElement("div");
      card.className = "endowment-card";
      card.innerHTML = `
        <div class="endowment-metric">${endow.metric}</div>
        <div class="endowment-label">${endow.label}</div>
        <p class="endowment-detail">${endow.detail}</p>
        <div class="endowment-bottleneck">
          <strong>Lomborg Unlock:</strong> ${endow.bottleneck}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderDrcPhases() {
    const bp = getActiveBlueprint();
    const tabsContainer = document.getElementById("drcPhaseTabs");
    const detailContainer = document.getElementById("drcPhaseDetail");
    tabsContainer.innerHTML = "";

    bp.phases.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `phase-tab-btn ${
        p.phaseNumber === activeDrcPhase ? "active" : ""
      }`;
      btn.innerHTML = `
        <span class="phase-tab-num">STEP 0${p.phaseNumber} • $${
        p.budgetBillions
      }B ALLOCATION</span>
        <span class="phase-tab-title">${p.phaseTitle.replace(
          /^Phase [I|V]+:\s*/,
          ""
        )}</span>
        <span class="phase-tab-meta">Avg ROI: ${p.avgBcr}:1 → +$${
        p.directEconomicBenefitBillions
      }B Surplus</span>
      `;
      btn.addEventListener("click", () => {
        activeDrcPhase = p.phaseNumber;
        renderDrcPhases();
      });
      tabsContainer.appendChild(btn);
    });

    const currentPhase = bp.phases.find(
      (p) => p.phaseNumber === activeDrcPhase
    );
    if (!currentPhase) return;

    const subcardsHtml = currentPhase.interventions
      .map(
        (intv) => `
        <div class="phase-subcard">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem; flex-wrap: wrap; gap: 0.4rem;">
            <span class="rank-badge winner">${intv.lomborgRef}</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: var(--emerald);">
              $${intv.costB}B × ${intv.bcr}:1 = $${intv.benefitB}B Surplus
            </span>
          </div>
          <h4 style="font-family: var(--font-serif); font-size: 1.15rem; margin-bottom: 0.4rem;">
            ${intv.title}
          </h4>
          <p style="font-size: 0.85rem; color: var(--ink-secondary);">
            ${intv.outcome}
          </p>
        </div>
      `
      )
      .join("");

    detailContainer.innerHTML = `
      <div class="phase-detail-header">
        <div>
          <div class="kicker emerald">${currentPhase.phaseSubtitle}</div>
          <h3 style="font-family: var(--font-serif); font-size: 1.75rem;">
            ${currentPhase.phaseTitle}
          </h3>
        </div>
        <div style="display: flex; gap: 1.5rem; font-family: var(--font-mono);">
          <div>
            <div style="font-size: 0.7rem; color: var(--ink-muted);">PHASE BUDGET</div>
            <div style="font-size: 1.35rem; font-weight: 700;">$${currentPhase.budgetBillions}B</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; color: var(--ink-muted);">WEIGHTED BCR</div>
            <div style="font-size: 1.35rem; font-weight: 700; color: var(--emerald);">${currentPhase.avgBcr} : 1</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; color: var(--ink-muted);">DIRECT ECONOMIC VALUE</div>
            <div style="font-size: 1.35rem; font-weight: 700; color: var(--emerald);">$${currentPhase.directEconomicBenefitBillions}B</div>
          </div>
        </div>
      </div>

      <p style="font-size: 0.96rem; color: var(--ink-secondary); line-height: 1.65;">
        ${currentPhase.description}
      </p>

      <div style="margin-top: 0.9rem; font-family: var(--font-mono); font-size: 0.82rem; color: var(--ink-primary); background: var(--bg-secondary); padding: 0.6rem 0.9rem; border-radius: 4px; display: inline-block;">
        <strong>Macro Structural Unlock:</strong> ${currentPhase.gdpMultiplierEffect}
      </div>

      <div class="phase-interventions-list">
        ${subcardsHtml}
      </div>
    `;
  }

  function renderTrajectoryChart() {
    const bp = getActiveBlueprint();
    const trajectories = bp.trajectories;
    const svgWrap = document.getElementById("trajectorySvgWrap");
    const milestonesWrap = document.getElementById("trajectoryMilestones");

    document.getElementById("scenBtnLomborg").textContent =
      "1. " + trajectories.lomborg.name;
    document.getElementById("scenBtnMega").textContent =
      "2. " + trajectories.megaproject.name;
    document.getElementById("scenBtnStatusQuo").textContent =
      "3. " + trajectories.statusQuo.name;

    const width = 920;
    const height = 310;
    const padLeft = 65;
    const padRight = 35;
    const padTop = 28;
    const padBottom = 42;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;
    const maxGdp = trajectories.maxAxisT || 60.0;

    const years = trajectories.lomborg.points.map((p) => p.year);

    function getX(idx) {
      return padLeft + (idx / (years.length - 1)) * plotW;
    }

    function getY(gdpT) {
      return padTop + plotH - (gdpT / maxGdp) * plotH;
    }

    const step = maxGdp / 4;
    const yTicks = [0, step, step * 2, step * 3, maxGdp];
    const gridLines = yTicks
      .map((val) => {
        const y = getY(val);
        return `
          <line x1="${padLeft}" y1="${y}" x2="${
          width - padRight
        }" y2="${y}" stroke="var(--border-hairline)" stroke-dasharray="4 4" />
          <text x="${
            padLeft - 10
          }" y="${y + 4}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--ink-muted)">$${val.toFixed(
          0
        )}T</text>
        `;
      })
      .join("");

    const xLabels = years
      .map((yr, idx) => {
        const x = getX(idx);
        return `<text x="${x}" y="${
          height - 12
        }" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="var(--ink-muted)">${yr}</text>`;
      })
      .join("");

    const scenarioOrder = ["statusQuo", "megaproject", "lomborg"];
    const pathsHtml = scenarioOrder
      .map((key) => {
        const scen = trajectories[key];
        const isActive = key === activeScenarioKey;
        const coords = scen.points.map(
          (pt, idx) => `${getX(idx)},${getY(pt.gdpT)}`
        );
        const d = `M ${coords.join(" L ")}`;

        const circles = scen.points
          .map((pt, idx) => {
            const cx = getX(idx);
            const cy = getY(pt.gdpT);
            return `
              <circle cx="${cx}" cy="${cy}" r="${
              isActive ? 6 : 3.5
            }" fill="${scen.color}" stroke="var(--bg-card)" stroke-width="2" />
              ${
                isActive
                  ? `<text x="${cx}" y="${
                      cy - 11
                    }" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="var(--ink-primary)">$${
                      pt.gdpT
                    }T</text>`
                  : ""
              }
            `;
          })
          .join("");

        return `
          <path d="${d}" fill="none" stroke="${scen.color}" stroke-width="${
          isActive ? 4 : 2
        }" stroke-opacity="${isActive ? 1 : 0.35}" />
          ${circles}
        `;
      })
      .join("");

    svgWrap.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" role="img" aria-label="50-year GDP trajectory comparison">
        ${gridLines}
        ${xLabels}
        ${pathsHtml}
      </svg>
    `;

    const activeScen = trajectories[activeScenarioKey];
    milestonesWrap.innerHTML = activeScen.points
      .map(
        (pt) => `
        <div class="milestone-card" style="border-top: 3px solid ${
          activeScen.color
        };">
          <div class="milestone-year">${pt.year}</div>
          <div class="milestone-gdp" style="color: ${
            activeScen.color
          };">$${pt.gdpT.toFixed(2)} Trillion</div>
          <p class="milestone-note">${pt.note}</p>
        </div>
      `
      )
      .join("");
  }

  document
    .querySelectorAll("#scenarioButtonGroup .scenario-btn")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll("#scenarioButtonGroup .scenario-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeScenarioKey = btn.getAttribute("data-scenario");
        renderTrajectoryChart();
      });
    });

  function renderValueChains() {
    const bp = getActiveBlueprint();
    const grid = document.getElementById("valueChainGrid");
    grid.innerHTML = "";

    const maxProcessed = Math.max(
      ...bp.valueChains.map((v) => v.onshoreProcessedValueB),
      500
    );

    bp.valueChains.forEach((vc) => {
      const card = document.createElement("div");
      card.className = "vc-card";
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem;">
          <span class="rank-badge winner">${vc.multiplier}</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--ink-muted);">Annual Output Potential</span>
        </div>
        <h4 style="font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 0.5rem;">
          ${vc.sector}
        </h4>
        <div class="vc-bars">
          <div class="vc-bar-row">
            <span style="width: 115px; color: var(--ink-muted);">Raw Commodity:</span>
            <div class="vc-bar-raw" style="width: ${Math.max(
              4,
              (vc.rawExportValueB / maxProcessed) * 100
            )}%;"></div>
            <strong>$${vc.rawExportValueB}B/yr</strong>
          </div>
          <div class="vc-bar-row">
            <span style="width: 115px; color: var(--emerald); font-weight: 700;">Onshore Processed:</span>
            <div class="vc-bar-processed" style="width: ${Math.max(
              15,
              (vc.onshoreProcessedValueB / maxProcessed) * 65
            )}%;"></div>
            <strong style="color: var(--emerald);">$${
              vc.onshoreProcessedValueB
            }B/yr</strong>
          </div>
        </div>
        <p style="font-size: 0.84rem; color: var(--ink-secondary); line-height: 1.5;">
          ${vc.explanation}
        </p>
      `;
      grid.appendChild(card);
    });
  }

  function renderBtfMatrix() {
    const grid = document.getElementById("btfMatrixGrid");
    if (!grid || typeof BEST_THINGS_FIRST_12 === "undefined") return;
    grid.innerHTML = BEST_THINGS_FIRST_12.map(
      (item) => `
      <div class="btf-card">
        <div>
          <div class="btf-card-top">
            <span class="btf-num-badge">SOLUTION #${item.num}</span>
            <span class="btf-bcr-pill">${item.bcr} ROI</span>
          </div>
          <h4 class="btf-title">${item.title}</h4>
          <p class="btf-impact">${item.africaImpact}</p>
        </div>
        <div class="btf-meta-foot">
          <span>${item.phase}</span>
          <span>${item.globalCostYr}</span>
        </div>
      </div>
    `
    ).join("");
  }

  // ==========================================================================
  // 7. GLOBAL SUPERPOWER OVERTAKE RACE (2026–2076) — YEARLY ENGINE & CONTROLS
  // ==========================================================================
  let raceYear = 2076;
  let raceInterval = null;
  let raceSpeedMultiplier = 1; // 0.25x, 0.5x, 1x, 2x, 4x (base 1x = 220ms/year)
  const BASE_YEAR_MS = 220;
  let prevBlocRanks = {};
  const raceRowElements = {};

  const overtakeYearSlider = document.getElementById("overtakeYearSlider");
  const playOvertakeRaceBtn = document.getElementById("playOvertakeRaceBtn");
  const raceResetStartBtn = document.getElementById("raceResetStartBtn");
  const raceStepBackBtn = document.getElementById("raceStepBackBtn");
  const raceStepFwdBtn = document.getElementById("raceStepFwdBtn");
  const raceJumpEndBtn = document.getElementById("raceJumpEndBtn");
  const raceYearBigDisplay = document.getElementById("raceYearBigDisplay");
  const raceMilestoneCallout = document.getElementById("raceMilestoneCallout");
  const raceBarsContainer = document.getElementById("raceBarsContainer");
  const raceProofTableBody = document.getElementById("raceProofTableBody");

  // Smooth exponential/compound interpolation between decadal checkpoints
  function interpolateBlocGdp(bloc, yr) {
    const d = bloc.gdpByDecade;
    const decades = [2026, 2036, 2046, 2056, 2066, 2076];
    if (yr <= 2026) return d[2026];
    if (yr >= 2076) return d[2076];
    for (let i = 0; i < decades.length - 1; i++) {
      const y0 = decades[i];
      const y1 = decades[i + 1];
      if (yr >= y0 && yr <= y1) {
        const t = (yr - y0) / (y1 - y0);
        const v0 = Math.max(0.01, d[y0]);
        const v1 = Math.max(0.01, d[y1]);
        // Blend geometric compound growth (70%) + linear (30%) for realistic yearly curve
        const geo = v0 * Math.pow(v1 / v0, t);
        const lin = v0 + (v1 - v0) * t;
        return +(geo * 0.7 + lin * 0.3).toFixed(2);
      }
    }
    return d[2076];
  }

  function getBlocYoYGrowthPct(bloc, yr) {
    const curr = interpolateBlocGdp(bloc, yr);
    const prev = interpolateBlocGdp(bloc, Math.max(2026, yr - 1));
    if (yr === 2026) {
      const next = interpolateBlocGdp(bloc, 2027);
      return (((next - curr) / curr) * 100).toFixed(1);
    }
    return (((curr - prev) / prev) * 100).toFixed(1);
  }

  function getMilestoneMessage(yr) {
    const afGdp = interpolateBlocGdp(OVERTAKE_RACE_BLOCS[0], yr).toFixed(1);
    const twinGdp = interpolateBlocGdp(OVERTAKE_RACE_BLOCS[1], yr).toFixed(1);
    if (yr <= 2030) {
      return `<strong>${yr} • Phase I Biological Shield (Yr ${yr - 2026}/50):</strong> $75B + <em>Best Things First</em> deploys 101:1 vaccines, 87:1 neonatal care &amp; 52:1 TB cure. Child mortality drops 65%; stunting prevented across 45M African newborns.`;
    } else if (yr <= 2035) {
      return `<strong>${yr} • Phase II Cognitive &amp; Agro Surge (Yr ${yr - 2026}/50):</strong> 65:1 adaptive EdTech tablets in local languages + 33:1 climate-resilient seeds double smallholder yields; Africa ends Its $110B/yr food import bill.`;
    } else if (yr <= 2040) {
      return `<strong>${yr} • Phase III Fiscal &amp; Trade Integrity (Yr ${yr - 2026}/50):</strong> 38:1 E-Procurement &amp; 95:1 AfCFTA paperless corridors save $150B+/yr in procurement graft—unlocking sovereign self-financing for Grand Inga &amp; Rift Geothermal.`;
    } else if (yr <= 2044) {
      return `<strong>${yr} • Industrial Takeoff (Yr ${yr - 2026}/50):</strong> First wave of non-stunted, STEM-trained youth enters the workforce. All-Africa hits <strong>$${afGdp}T</strong> and closes in rapidly on the European Union.`;
    } else if (yr <= 2050) {
      return `<strong>${yr} • HISTORIC OVERTAKE #1 (EU SURPASSED):</strong> 🌍 <strong>All-Africa ($${afGdp}T) overtakes the European Union!</strong> $0.02/kWh clean baseload power pulls global battery, green steel &amp; AI compute onshore.`;
    } else if (yr <= 2052) {
      return `<strong>${yr} • HISTORIC OVERTAKE #2 (INDIA SURPASSED):</strong> 🌍 <strong>All-Africa ($${afGdp}T) overtakes India!</strong> Meanwhile, 🇰🇪🇨🇩 the Kenya–DRC Twin Axis surges to <strong>$${twinGdp}T</strong> and passes the EU.`;
    } else if (yr <= 2054) {
      return `<strong>${yr} • HISTORIC OVERTAKE #3 (CHINA SURPASSED):</strong> 🌍 <strong>All-Africa ($${afGdp}T) overtakes China!</strong> China’s workforce shrinks by >300M while Africa’s 500M+ STEM workforce compounds at 8.8%/yr.`;
    } else if (yr <= 2067) {
      return `<strong>${yr} • HISTORIC OVERTAKE #4 (#1 ON EARTH):</strong> 🌍 <strong>All-Africa ($${afGdp}T) overtakes the United States to reclaim Mansa Musa’s #1 global throne!</strong>`;
    } else {
      return `<strong>${yr} • UNASSAILABLE GLOBAL THRONE:</strong> 🌍 <strong>All-Africa reaches $${afGdp}T</strong> (larger than the US, China &amp; EU combined!)—and 🇰🇪🇨🇩 <strong>the Kenya–DRC Axis alone ($${twinGdp}T) overtakes the United States!</strong>`;
    }
  }

  function ensureRaceRowsCreated() {
    if (!raceBarsContainer || typeof OVERTAKE_RACE_BLOCS === "undefined") return;
    if (Object.keys(raceRowElements).length === OVERTAKE_RACE_BLOCS.length) return;

    raceBarsContainer.innerHTML = "";
    OVERTAKE_RACE_BLOCS.forEach((bloc, idx) => {
      const row = document.createElement("div");
      row.className = `race-bar-row ${bloc.isAfricaHero ? "hero-bloc" : ""}`;
      row.style.transform = `translateY(${idx * 64}px)`;
      row.innerHTML = `
        <div class="race-bloc-meta">
          <span class="race-rank-num">#${idx + 1}</span>
          <div style="min-width: 0;">
            <div class="race-bloc-name">
              <span class="bloc-title-text">${bloc.flag} ${bloc.shortName}</span>
              <span class="overtake-flash-badge" style="display: none;">🔥 OVERTAKE!</span>
            </div>
            <span class="race-bloc-sub">Workforce 2076: ${bloc.workingAge2076} • Power: ${bloc.powerCostKwh.split(" ")[0]}</span>
          </div>
        </div>
        <div class="race-track">
          <div class="race-fill" style="width: 3%; background-color: ${bloc.color};"></div>
        </div>
        <div class="race-gdp-val" style="color: ${bloc.isAfricaHero ? "var(--emerald)" : "var(--ink-primary)"};">
          <div class="bloc-gdp-num">$0.00T</div>
          <div class="bloc-yoy-sub" style="font-size: 0.65rem; font-weight: 500; color: var(--ink-muted);">+0.0%/yr</div>
        </div>
      `;
      raceBarsContainer.appendChild(row);
      raceRowElements[bloc.id] = row;
    });
  }

  function renderOvertakeRace(trackOvertakes = true) {
    if (!raceBarsContainer || typeof OVERTAKE_RACE_BLOCS === "undefined") return;
    ensureRaceRowsCreated();

    if (raceYearBigDisplay) raceYearBigDisplay.textContent = raceYear;
    if (overtakeYearSlider) overtakeYearSlider.value = raceYear;

    document.querySelectorAll("[data-race-year]").forEach((btn) => {
      btn.classList.toggle(
        "active",
        parseInt(btn.getAttribute("data-race-year"), 10) === raceYear
      );
    });

    const computed = OVERTAKE_RACE_BLOCS.map((bloc) => ({
      ...bloc,
      currentGdpT: interpolateBlocGdp(bloc, raceYear),
      yoyPct: getBlocYoYGrowthPct(bloc, raceYear),
    })).sort((a, b) => b.currentGdpT - a.currentGdpT);

    const maxBarGdp = Math.max(computed[0].currentGdpT, 32.0);

    if (raceMilestoneCallout) {
      const africaLomborg = computed.find((b) => b.id === "africa_lomborg");
      const africaStatusQuo = computed.find((b) => b.id === "africa_status_quo");
      const gainT = +(
        africaLomborg.currentGdpT - africaStatusQuo.currentGdpT
      ).toFixed(2);
      raceMilestoneCallout.innerHTML = `
        <div style="flex: 1; min-width: 260px;">${getMilestoneMessage(raceYear)}</div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: var(--emerald); text-align: right;">
          <div>+${gainT}T Lomborg Dividend vs. Status Quo</div>
          <div style="font-size: 0.68rem; color: var(--ink-muted);">Speed: ${raceSpeedMultiplier}x (${Math.round(BASE_YEAR_MS / raceSpeedMultiplier)}ms/yr) • Year ${raceYear - 2026} of 50</div>
        </div>
      `;
    }

    const newRanks = {};
    computed.forEach((bloc, idx) => {
      newRanks[bloc.id] = idx;
      const row = raceRowElements[bloc.id];
      if (!row) return;

      // Smooth vertical position swap
      row.style.transform = `translateY(${idx * 64}px)`;

      // Check if this bloc just climbed in rank compared to previous rendered step
      const prevRank = prevBlocRanks[bloc.id];
      const didOvertake =
        trackOvertakes &&
        typeof prevRank === "number" &&
        idx < prevRank;

      row.classList.toggle("just-overtook", didOvertake);
      const badgeEl = row.querySelector(".overtake-flash-badge");
      if (badgeEl) {
        badgeEl.style.display = didOvertake ? "inline-block" : "none";
      }

      const rankEl = row.querySelector(".race-rank-num");
      if (rankEl) rankEl.textContent = `#${idx + 1}`;

      const widthPct = Math.max(2.5, (bloc.currentGdpT / maxBarGdp) * 100);
      const fillEl = row.querySelector(".race-fill");
      if (fillEl) fillEl.style.width = `${widthPct}%`;

      const gdpNumEl = row.querySelector(".bloc-gdp-num");
      if (gdpNumEl) gdpNumEl.textContent = `$${bloc.currentGdpT.toFixed(2)}T`;

      const yoyEl = row.querySelector(".bloc-yoy-sub");
      if (yoyEl) {
        yoyEl.textContent = `+${bloc.yoyPct}%/yr`;
        yoyEl.style.color = bloc.isAfricaHero ? "var(--emerald)" : "var(--ink-muted)";
      }
    });

    prevBlocRanks = newRanks;
  }

  function stopRacePlayback() {
    if (raceInterval) {
      clearInterval(raceInterval);
      raceInterval = null;
    }
    if (playOvertakeRaceBtn) {
      playOvertakeRaceBtn.textContent =
        raceYear >= 2076 ? "▶ Replay Yearly Race" : "▶ Play Yearly Race";
    }
  }

  function startRacePlayback() {
    if (raceInterval) {
      clearInterval(raceInterval);
      raceInterval = null;
    }
    if (raceYear >= 2076) {
      raceYear = 2026;
      prevBlocRanks = {};
      renderOvertakeRace(false);
    }
    if (playOvertakeRaceBtn) {
      playOvertakeRaceBtn.textContent = `⏸ Pause (${raceSpeedMultiplier}x)`;
    }
    const stepMs = Math.max(25, Math.round(BASE_YEAR_MS / raceSpeedMultiplier));
    raceInterval = setInterval(() => {
      raceYear += 1;
      renderOvertakeRace(true);
      if (raceYear >= 2076) {
        stopRacePlayback();
      }
    }, stepMs);
  }

  function renderOvertakeProofTable() {
    if (!raceProofTableBody || typeof OVERTAKE_RACE_BLOCS === "undefined") return;
    raceProofTableBody.innerHTML = OVERTAKE_RACE_BLOCS.map(
      (b) => `
      <tr style="${
        b.isAfricaHero ? "background-color: var(--emerald-soft); font-weight: 600;" : ""
      }">
        <td>${b.flag} ${b.name}</td>
        <td style="font-family: var(--font-mono);">$${b.gdpByDecade[2026].toFixed(2)}T</td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: ${
          b.isAfricaHero ? "var(--emerald)" : "var(--ink-primary)"
        };">$${b.gdpByDecade[2076].toFixed(2)}T</td>
        <td style="font-family: var(--font-mono);">${b.workingAge2076}</td>
        <td style="font-family: var(--font-mono);">${b.medianAge2076}</td>
        <td style="font-family: var(--font-mono);">${b.powerCostKwh}</td>
      </tr>
    `
    ).join("");
  }

  if (overtakeYearSlider) {
    overtakeYearSlider.addEventListener("input", (e) => {
      stopRacePlayback();
      raceYear = parseInt(e.target.value, 10);
      renderOvertakeRace(true);
    });
  }

  document.querySelectorAll("[data-race-year]").forEach((btn) => {
    btn.addEventListener("click", () => {
      stopRacePlayback();
      raceYear = parseInt(btn.getAttribute("data-race-year"), 10);
      prevBlocRanks = {};
      renderOvertakeRace(false);
    });
  });

  document.querySelectorAll("[data-race-speed]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const spd = parseFloat(btn.getAttribute("data-race-speed"));
      if (!isNaN(spd) && spd > 0) {
        raceSpeedMultiplier = spd;
        document.querySelectorAll("[data-race-speed]").forEach((b) => {
          b.classList.toggle("active", b === btn);
        });
        if (raceInterval) {
          // Live speed change while playing!
          startRacePlayback();
        } else {
          renderOvertakeRace(false);
        }
      }
    });
  });

  if (raceResetStartBtn) {
    raceResetStartBtn.addEventListener("click", () => {
      stopRacePlayback();
      raceYear = 2026;
      prevBlocRanks = {};
      renderOvertakeRace(false);
    });
  }

  if (raceStepBackBtn) {
    raceStepBackBtn.addEventListener("click", () => {
      stopRacePlayback();
      raceYear = Math.max(2026, raceYear - 1);
      renderOvertakeRace(true);
    });
  }

  if (raceStepFwdBtn) {
    raceStepFwdBtn.addEventListener("click", () => {
      stopRacePlayback();
      raceYear = Math.min(2076, raceYear + 1);
      renderOvertakeRace(true);
    });
  }

  if (raceJumpEndBtn) {
    raceJumpEndBtn.addEventListener("click", () => {
      stopRacePlayback();
      raceYear = 2076;
      prevBlocRanks = {};
      renderOvertakeRace(false);
    });
  }

  if (playOvertakeRaceBtn) {
    playOvertakeRaceBtn.addEventListener("click", () => {
      if (raceInterval) {
        stopRacePlayback();
      } else {
        startRacePlayback();
      }
    });
  }

  function renderAllBlueprintSections() {
    renderBlueprintHeader();
    renderDrcEndowments();
    renderDrcPhases();
    renderTrajectoryChart();
    renderValueChains();
  }

  // Initial Boot
  populateCountryDropdown();
  renderAfricaSvgMap();
  renderCountryDossier();
  initWebGlMap();
  renderOvertakeRace();
  renderOvertakeProofTable();
  renderBtfMatrix();
  updateSimulatorSummary();
  renderInterventionsGrid();
  renderMarimekkoChart();
  renderAllBlueprintSections();
})();
