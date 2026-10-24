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
  // 0. AUTOMATIC ANGULAR SIGNALS RESPONSIVE BREAKPOINT & DRAWER CONTROLLER
  // ==========================================================================
  const ngAppRoot = document.getElementById("ngAppRoot");
  const mobileMenuToggleBtn = document.getElementById("mobileMenuToggleBtn");
  const mobileNavDrawer = document.getElementById("mobileNavDrawer");
  const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");
  const mobileDrawerCloseBtn = document.getElementById("mobileDrawerCloseBtn");

  let ngActiveBreakpoint = "desktop"; // Automatically computed from window.innerWidth
  let includeUntappedSectors = true; // +$38.5T (Football/Sports, Eco-Tourism, Creative IP, Carbon Sink, Spaceports)
  let includeGlobalCoProsperity = true; // +$42.0T Foreign Investor Dividend to US, China, EU & India

  function getRaceRowPitchPx() {
    if (ngActiveBreakpoint === "mobile" || window.innerWidth <= 680) {
      return 74;
    }
    return 64;
  }

  function syncAngularDeviceSignal() {
    const w = window.innerWidth;
    if (w <= 680) ngActiveBreakpoint = "mobile";
    else if (w <= 1024) ngActiveBreakpoint = "tablet";
    else if (w < 1536) ngActiveBreakpoint = "desktop";
    else ngActiveBreakpoint = "ultrawide";

    if (ngAppRoot) {
      ngAppRoot.setAttribute("data-breakpoint", ngActiveBreakpoint);
    }

    if (typeof renderOvertakeRace === "function") {
      renderOvertakeRace(false);
    }
    if (typeof renderStockMarketRace === "function") {
      renderStockMarketRace(false);
    }
    if (glMap && typeof glMap.resize === "function") {
      setTimeout(() => glMap.resize(), 180);
    }
  }

  window.addEventListener("resize", () => {
    syncAngularDeviceSignal();
    if (window.innerWidth > 1024) {
      closeMobileDrawer();
    }
  });

  function openMobileDrawer() {
    if (mobileNavDrawer) mobileNavDrawer.hidden = false;
    if (mobileNavBackdrop) mobileNavBackdrop.hidden = false;
    if (mobileMenuToggleBtn)
      mobileMenuToggleBtn.setAttribute("aria-expanded", "true");
  }

  function closeMobileDrawer() {
    if (mobileNavDrawer) mobileNavDrawer.hidden = true;
    if (mobileNavBackdrop) mobileNavBackdrop.hidden = true;
    if (mobileMenuToggleBtn)
      mobileMenuToggleBtn.setAttribute("aria-expanded", "false");
  }

  if (mobileMenuToggleBtn) {
    mobileMenuToggleBtn.addEventListener("click", () => {
      const isHidden = mobileNavDrawer ? mobileNavDrawer.hidden : true;
      if (isHidden) openMobileDrawer();
      else closeMobileDrawer();
    });
  }

  if (mobileDrawerCloseBtn) {
    mobileDrawerCloseBtn.addEventListener("click", closeMobileDrawer);
  }
  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener("click", closeMobileDrawer);
  }

  document
    .querySelectorAll("[data-drawer-link], [data-drawer-close]")
    .forEach((el) => {
      el.addEventListener("click", () => {
        closeMobileDrawer();
      });
    });

  // Scroll-Spy for Mobile Bottom Tab Bar & Header Nav
  const spySectionIds = [
    "premise",
    "overtake-race",
    "friedman-markets",
    "africa-map",
    "simulator",
    "drc-superpower",
  ];
  window.addEventListener(
    "scroll",
    () => {
      let currentId = "premise";
      const scrollY = window.scrollY + 220;
      spySectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          currentId = id;
        }
      });
      document.querySelectorAll("[data-spy-tab]").forEach((tab) => {
        tab.classList.toggle(
          "active",
          tab.getAttribute("data-spy-tab") === currentId
        );
      });
    },
    { passive: true }
  );

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

  // Timeline Scrubber, Transport & Speed Controls for 3D Map (2026 -> 2076)
  let mapSpeedMultiplier = 1;
  const MAP_BASE_YEAR_MS = 220;
  const mapResetStartBtn = document.getElementById("mapResetStartBtn");
  const mapStepBackBtn = document.getElementById("mapStepBackBtn");
  const mapStepFwdBtn = document.getElementById("mapStepFwdBtn");
  const mapJumpEndBtn = document.getElementById("mapJumpEndBtn");

  function updateTimelineDisplay() {
    if (mapYearSlider) mapYearSlider.value = mapSimYear;
    if (mapYearLabel) mapYearLabel.textContent = `Year ${mapSimYear}`;
    if (mapContinentalGdpLabel) {
      const contGdp = getContinentalGdpAtYear(mapSimYear);
      const tProg = (mapSimYear - 2026) / 50;
      const buffettAtYr = 0.30 + 1.50 * tProg;
      const contBourse = +(contGdp * buffettAtYr).toFixed(1);
      mapContinentalGdpLabel.textContent = `$${contGdp.toFixed(1)}T GDP • $${contBourse}T Bourse`;
    }
    syncGeoJsonMetrics();
    if (mapEngineMode === "svg") {
      renderAfricaSvgMap();
    }
    renderCountryDossier();
  }

  function stopMapPlayback() {
    if (timelineInterval) {
      clearInterval(timelineInterval);
      timelineInterval = null;
    }
    if (playTimelineBtn) {
      playTimelineBtn.textContent =
        mapSimYear >= 2076 ? "▶ Replay Yearly 3D Growth" : "▶ Play Yearly 3D Growth";
    }
  }

  function startMapPlayback() {
    if (timelineInterval) {
      clearInterval(timelineInterval);
      timelineInterval = null;
    }
    if (mapSimYear >= 2076) {
      mapSimYear = 2026;
      updateTimelineDisplay();
    }
    if (playTimelineBtn) {
      playTimelineBtn.textContent = `⏸ Pause 3D (${mapSpeedMultiplier}x)`;
    }
    const stepMs = Math.max(25, Math.round(MAP_BASE_YEAR_MS / mapSpeedMultiplier));
    timelineInterval = setInterval(() => {
      mapSimYear += 1;
      updateTimelineDisplay();
      if (mapSimYear >= 2076) {
        stopMapPlayback();
      }
    }, stepMs);
  }

  if (mapYearSlider) {
    mapYearSlider.addEventListener("input", (e) => {
      stopMapPlayback();
      mapSimYear = parseInt(e.target.value, 10);
      updateTimelineDisplay();
    });
  }

  if (playTimelineBtn) {
    playTimelineBtn.addEventListener("click", () => {
      if (timelineInterval) {
        stopMapPlayback();
      } else {
        startMapPlayback();
      }
    });
  }

  if (mapResetStartBtn) {
    mapResetStartBtn.addEventListener("click", () => {
      stopMapPlayback();
      mapSimYear = 2026;
      updateTimelineDisplay();
    });
  }

  if (mapStepBackBtn) {
    mapStepBackBtn.addEventListener("click", () => {
      stopMapPlayback();
      mapSimYear = Math.max(2026, mapSimYear - 1);
      updateTimelineDisplay();
    });
  }

  if (mapStepFwdBtn) {
    mapStepFwdBtn.addEventListener("click", () => {
      stopMapPlayback();
      mapSimYear = Math.min(2076, mapSimYear + 1);
      updateTimelineDisplay();
    });
  }

  if (mapJumpEndBtn) {
    mapJumpEndBtn.addEventListener("click", () => {
      stopMapPlayback();
      mapSimYear = 2076;
      updateTimelineDisplay();
    });
  }

  document.querySelectorAll("[data-map-speed]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const spd = parseFloat(btn.getAttribute("data-map-speed"));
      if (!isNaN(spd) && spd > 0) {
        mapSpeedMultiplier = spd;
        document.querySelectorAll("[data-map-speed]").forEach((b) => {
          b.classList.toggle("active", b === btn);
        });
        if (timelineInterval) {
          startMapPlayback();
        }
      }
    });
  });

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

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; padding: 0.65rem 0.85rem; background: var(--emerald-soft); border-left: 3px solid #D97706; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.73rem;">
        <span>🏛️ <strong>2076 ${c.name} Stock Exchange (1.8× GDP):</strong> <strong style="color: var(--emerald);">$${(c.gdp2076T * 1.8).toFixed(2)}T Market Cap</strong></span>
        <span>💱 <strong>Friedman Currency Value:</strong> <strong style="color: #D97706;">+${Math.round(180 + c.bcrWeighted * 1.75)}% Real Appreciation</strong></span>
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

  let counterfactual2026BaseActive = false;

  // Smooth exponential/compound interpolation between decadal checkpoints
  function getExtraGdpBoostAtYear(blocId, yr) {
    const t = Math.max(0, Math.min(1, (yr - 2026) / 50.0));
    const curve = Math.pow(t, 2.05);
    let boost = 0;
    if (includeUntappedSectors) {
      if (blocId === "africa_lomborg") boost += 38.5 * curve;
      if (blocId === "kenya_drc_axis") boost += 15.4 * curve;
    }
    if (includeGlobalCoProsperity) {
      if (blocId === "usa") boost += 14.5 * curve;
      if (blocId === "china") boost += 10.4 * curve;
      if (blocId === "eu") boost += 9.2 * curve;
      if (blocId === "india") boost += 7.9 * curve;
    }
    if (counterfactual2026BaseActive) {
      if (blocId === "africa_lomborg") boost += 24.7 + 62.0 * t;
      if (blocId === "kenya_drc_axis") boost += 3.1 + 18.5 * t;
    }
    return boost;
  }

  function interpolateBlocGdp(bloc, yr) {
    const d = bloc.gdpByDecade;
    const decades = [2026, 2036, 2046, 2056, 2066, 2076];
    let baseVal = d[2076];
    if (yr <= 2026) {
      baseVal = d[2026];
    } else if (yr < 2076) {
      for (let i = 0; i < decades.length - 1; i++) {
        const y0 = decades[i];
        const y1 = decades[i + 1];
        if (yr >= y0 && yr <= y1) {
          const t = (yr - y0) / (y1 - y0);
          const v0 = Math.max(0.01, d[y0]);
          const v1 = Math.max(0.01, d[y1]);
          const geo = v0 * Math.pow(v1 / v0, t);
          const lin = v0 + (v1 - v0) * t;
          baseVal = geo * 0.7 + lin * 0.3;
          break;
        }
      }
    }
    return +(baseVal + getExtraGdpBoostAtYear(bloc.id, yr)).toFixed(2);
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
      row.style.transform = `translateY(${idx * getRaceRowPitchPx()}px)`;
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

      // Smooth vertical position swap (adapts to 74px on Mobile, 64px on Desktop)
      row.style.transform = `translateY(${idx * getRaceRowPitchPx()}px)`;

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
    raceProofTableBody.innerHTML = OVERTAKE_RACE_BLOCS.map((b) => {
      const gdp2076Full = interpolateBlocGdp(b, 2076);
      const extraBoost = +(gdp2076Full - b.gdpByDecade[2076]).toFixed(1);
      const boostBadge =
        extraBoost > 0
          ? ` <span style="font-size: 0.68rem; color: #D97706;">(+$${extraBoost}T ${
              b.isAfricaHero ? "8 Super-Sectors" : "Co-Prosperity"
            })</span>`
          : "";
      return `
      <tr style="${
        b.isAfricaHero ? "background-color: var(--emerald-soft); font-weight: 600;" : ""
      }">
        <td>${b.flag} ${b.name}</td>
        <td style="font-family: var(--font-mono);">$${b.gdpByDecade[2026].toFixed(2)}T</td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: ${
          b.isAfricaHero ? "var(--emerald)" : "var(--ink-primary)"
        };">$${gdp2076Full.toFixed(2)}T${boostBadge}</td>
        <td style="font-family: var(--font-mono);">${b.workingAge2076}</td>
        <td style="font-family: var(--font-mono);">${b.medianAge2076}</td>
        <td style="font-family: var(--font-mono);">${b.powerCostKwh}</td>
      </tr>
    `;
    }).join("");
  }

  function renderUntappedSectorsAndCoProsperity() {
    const sectorsGrid = document.getElementById("untappedSectorsGrid");
    const partnersGrid = document.getElementById("coProsperityPartnersGrid");

    if (sectorsGrid && typeof UNTAPPED_SUPER_SECTORS !== "undefined") {
      sectorsGrid.innerHTML = UNTAPPED_SUPER_SECTORS.map(
        (s) => `
        <div class="megacap-card" style="opacity: ${
          includeUntappedSectors ? "1" : "0.55"
        };">
          <div>
            <div class="megacap-top">
              <span class="megacap-ticker" style="background-color: #0D9488;">${
                s.icon
              } $${s.ticker}</span>
              <span class="megacap-cap">+$${s.gdp2076T.toFixed(1)}T GDP</span>
            </div>
            <div style="font-weight: 700; font-size: 0.94rem; margin-top: 0.45rem; line-height: 1.25;">
              ${s.name}
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.66rem; color: var(--ink-muted); margin-top: 0.2rem;">
              ${s.hubs}
            </div>
          </div>
          <p style="font-size: 0.77rem; color: var(--ink-secondary); line-height: 1.45; margin: 0;">
            ${s.explanation}
          </p>
          <div style="font-family: var(--font-mono); font-size: 0.67rem; color: var(--emerald); font-weight: 700; border-top: 1px dashed var(--border-hairline); padding-top: 0.4rem;">
            2026: $${s.baseline2026B}B → 2076 Bourse Cap: $${s.bourse2076T.toFixed(
          1
        )}T (1.8×)
          </div>
        </div>
      `
      ).join("");
    }

    if (partnersGrid && typeof GLOBAL_COPROSPERITY_MODEL !== "undefined") {
      partnersGrid.innerHTML = GLOBAL_COPROSPERITY_MODEL.partnerDividends
        .map(
          (p) => `
          <div class="friedman-kpi-card gold" style="opacity: ${
            includeGlobalCoProsperity ? "1" : "0.55"
          };">
            <div class="friedman-kpi-label">${p.flag} ${
            p.name
          } Co-Prosperity Boost</div>
            <div class="friedman-kpi-val" style="color: #D97706;">+$${p.coProsperityGdpBoostT.toFixed(
              1
            )}T GDP</div>
            <div class="friedman-kpi-sub" style="margin-bottom: 0.3rem;">
              <strong>2076 GDP:</strong> $${p.baseGdp2076T}T → <strong>$${(
            p.baseGdp2076T + p.coProsperityGdpBoostT
          ).toFixed(1)}T</strong> (+$${p.coProsperityBourseBoostT}T Bourse)
            </div>
            <div style="font-size: 0.72rem; color: var(--ink-secondary); line-height: 1.35;">
              ${p.pensionReturnBoost}
            </div>
          </div>
        `
        )
        .join("");
    }
  }

  const toggleUntappedSectorsEl = document.getElementById(
    "toggleUntappedSectors"
  );
  const toggleGlobalCoProsperityEl = document.getElementById(
    "toggleGlobalCoProsperity"
  );

  if (toggleUntappedSectorsEl) {
    toggleUntappedSectorsEl.addEventListener("change", (e) => {
      includeUntappedSectors = e.target.checked;
      renderOvertakeRace(false);
      renderOvertakeProofTable();
      renderStockMarketRace(false);
      renderUntappedSectorsAndCoProsperity();
      updateTimelineDisplay();
    });
  }

  if (toggleGlobalCoProsperityEl) {
    toggleGlobalCoProsperityEl.addEventListener("change", (e) => {
      includeGlobalCoProsperity = e.target.checked;
      renderOvertakeRace(false);
      renderOvertakeProofTable();
      renderStockMarketRace(false);
      renderUntappedSectorsAndCoProsperity();
    });
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

  // ==========================================================================
  // 8. MILTON FRIEDMAN MONETARY ENGINE (M·V = P·Y) & $261T STOCK MARKET
  // ==========================================================================
  let activeFriedmanRegime = "sankoreFriedman";
  const sliderMGrowth = document.getElementById("sliderMGrowth");
  const sliderYGrowth = document.getElementById("sliderYGrowth");
  const sliderBuffettRatio = document.getElementById("sliderBuffettRatio");
  const sliderDiscountR = document.getElementById("sliderDiscountR");
  const valMGrowth = document.getElementById("valMGrowth");
  const valYGrowth = document.getElementById("valYGrowth");
  const valBuffettRatio = document.getElementById("valBuffettRatio");
  const valDiscountR = document.getElementById("valDiscountR");
  const friedmanRegimeCallout = document.getElementById("friedmanRegimeCallout");
  const friedmanKpiGrid = document.getElementById("friedmanKpiGrid");
  const megacapTickerBoard = document.getElementById("megacapTickerBoard");
  const sankoreExchangeTotalLabel = document.getElementById("sankoreExchangeTotalLabel");

  function renderFriedmanMarkets() {
    if (
      typeof FRIEDMAN_CAPITAL_MARKETS_MODEL === "undefined" ||
      !friedmanKpiGrid ||
      !sliderMGrowth
    ) {
      return;
    }

    const mPct = parseFloat(sliderMGrowth.value);
    const yPct = parseFloat(sliderYGrowth.value);
    const buffett = parseFloat(sliderBuffettRatio.value);
    const rPct = parseFloat(sliderDiscountR.value);

    if (valMGrowth) valMGrowth.textContent = `${mPct.toFixed(1)}%/yr`;
    if (valYGrowth) valYGrowth.textContent = `${yPct.toFixed(1)}%/yr`;
    if (valBuffettRatio) {
      valBuffettRatio.textContent = `${buffett.toFixed(2)}× (${Math.round(buffett * 100)}%)`;
    }
    if (valDiscountR) valDiscountR.textContent = `${rPct.toFixed(1)}%`;

    // 1. Real Output Y in 2076 (calibrated so 7.6%/yr = $145.0T, 2.6%/yr = $8.2T)
    const simGdp2076T = +(3.71 * Math.pow(1 + yPct / 100, 50)).toFixed(1);
    const clampedGdp2076T = Math.min(260.0, Math.max(4.5, simGdp2076T));

    // 2. Friedman Equation of Exchange: Inflation P_dot = M_dot + V_dot - Y_dot
    // With digital velocity V_dot ~ +1.8% in deepening markets
    const inflationPct = +(mPct + 1.8 - yPct).toFixed(1);
    const isHyperInflation = inflationPct > 8.0;

    // 3. Real Currency Valuation (REER Index, base 100 in 2026)
    // Driven by Friedman (Y_dot - M_dot) + Balassa-Samuelson productivity premium
    const outputSurplus = yPct - mPct;
    const reerIndex = Math.max(
      18,
      Math.min(480, Math.round(100 + outputSurplus * 42 + yPct * 18))
    );
    const currencyChangePct = reerIndex - 100;

    // 4. Total Pan-African Stock Market Cap (Buffett Indicator: Market Cap = GDP * buffett)
    const panAfricanMarketCapT = +(clampedGdp2076T * buffett).toFixed(1);
    const twinAxisMarketCapT = +(panAfricanMarketCapT * 0.506).toFixed(1);

    // 5. Gordon Growth Model P/E Multiple: P/E = (1 - retention) / (r - g)
    const gLongRun = Math.min(rPct - 1.4, Math.max(1.2, yPct * 0.45));
    const spreadRG = Math.max(1.8, rPct - gLongRun);
    const peMultiple = +(62.0 / spreadRG).toFixed(1);

    // 6. Sovereign 10-Yr Bond Yield & Global Central Bank Reserve Share
    const bondYield10Yr = Math.max(1.8, +(rPct * 0.5 + Math.max(0, inflationPct * 0.65)).toFixed(1));
    const reserveSharePct = Math.max(
      0.2,
      Math.min(52.0, +((clampedGdp2076T / 340.0) * 100 * (reerIndex / 365)).toFixed(1))
    );

    const reg =
      FRIEDMAN_CAPITAL_MARKETS_MODEL.regimes[activeFriedmanRegime] ||
      FRIEDMAN_CAPITAL_MARKETS_MODEL.regimes.sankoreFriedman;

    if (friedmanRegimeCallout) {
      friedmanRegimeCallout.style.borderLeftColor = isHyperInflation
        ? "var(--crimson)"
        : "var(--emerald)";
      friedmanRegimeCallout.innerHTML = `
        <div style="flex: 1; min-width: 260px;">
          <div style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: ${
            isHyperInflation ? "var(--crimson)" : "var(--emerald)"
          };">${reg.badge}</div>
          <div style="margin-top: 0.2rem;"><strong>${reg.name}:</strong> ${reg.summary}</div>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; text-align: right;">
          <div>Friedman Identity: M(${mPct.toFixed(1)}%) · V = P(${inflationPct > 0 ? "+" : ""}${inflationPct}%) · Y(${yPct.toFixed(1)}%)</div>
          <div style="color: var(--emerald);">2076 Real Output (Y): $${clampedGdp2076T.toFixed(1)} Trillion</div>
        </div>
      `;
    }

    friedmanKpiGrid.innerHTML = `
      <div class="friedman-kpi-card">
        <div class="friedman-kpi-label">2076 Pan-African Stock Market</div>
        <div class="friedman-kpi-val" style="color: var(--emerald);">$${panAfricanMarketCapT.toFixed(1)}T</div>
        <div class="friedman-kpi-sub">${buffett.toFixed(2)}× Buffett Ratio on $${clampedGdp2076T.toFixed(1)}T GDP (vs. $1.1T in 2026)</div>
      </div>

      <div class="friedman-kpi-card gold">
        <div class="friedman-kpi-label">Kenya–DRC Twin-Axis Exchange</div>
        <div class="friedman-kpi-val" style="color: #D97706;">$${twinAxisMarketCapT.toFixed(1)}T</div>
        <div class="friedman-kpi-sub">Nairobi–Kinshasa Bourse (#1 Liquidity Hub on Earth)</div>
      </div>

      <div class="friedman-kpi-card ${currencyChangePct < 0 ? "warn" : ""}">
        <div class="friedman-kpi-label">Real Currency Value (REER)</div>
        <div class="friedman-kpi-val" style="color: ${
          currencyChangePct >= 0 ? "var(--emerald)" : "var(--crimson)"
        };">
          ${currencyChangePct >= 0 ? "+" : ""}${currencyChangePct}%
        </div>
        <div class="friedman-kpi-sub">Index: ${reerIndex} (2026=100) • Balassa–Samuelson + Friedman</div>
      </div>

      <div class="friedman-kpi-card ${isHyperInflation ? "warn" : ""}">
        <div class="friedman-kpi-label">Friedman Annual Inflation (P)</div>
        <div class="friedman-kpi-val" style="color: ${
          isHyperInflation ? "var(--crimson)" : "var(--ink-primary)"
        };">
          ${inflationPct > 0 ? "+" : ""}${inflationPct}%/yr
        </div>
        <div class="friedman-kpi-sub">10-Yr Sovereign Bond Yield: <strong>${bondYield10Yr}%</strong></div>
      </div>

      <div class="friedman-kpi-card">
        <div class="friedman-kpi-label">Gordon Growth P/E Multiple</div>
        <div class="friedman-kpi-val">${peMultiple}× P/E</div>
        <div class="friedman-kpi-sub">P = D₁/(r - g) • Discount r=${rPct.toFixed(1)}% (vs. 7.5× P/E in 2026)</div>
      </div>

      <div class="friedman-kpi-card gold">
        <div class="friedman-kpi-label">Global Reserve Currency Share</div>
        <div class="friedman-kpi-val" style="color: #D97706;">${reserveSharePct}%</div>
        <div class="friedman-kpi-sub">${
          reserveSharePct >= 25
            ? "🏆 #1 Global Central Bank Reserve Asset"
            : "Share of Global FX Reserves"
        }</div>
      </div>
    `;

    if (sankoreExchangeTotalLabel) {
      sankoreExchangeTotalLabel.textContent = `Simulated 2076 Continental Market Cap: $${panAfricanMarketCapT.toFixed(1)} Trillion`;
    }

    if (megacapTickerBoard) {
      const capScale = panAfricanMarketCapT / 261.0;
      megacapTickerBoard.innerHTML = FRIEDMAN_CAPITAL_MARKETS_MODEL.megacaps
        .map((co) => {
          const scaledCapT = +(co.baseCap2076T * capScale).toFixed(2);
          return `
            <div class="megacap-card">
              <div>
                <div class="megacap-top">
                  <span class="megacap-ticker">$${co.ticker}</span>
                  <span class="megacap-cap">$${scaledCapT}T</span>
                </div>
                <div style="font-weight: 700; font-size: 0.94rem; margin-top: 0.45rem; line-height: 1.25;">
                  ${co.name}
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--ink-muted); margin-top: 0.15rem;">
                  ${co.hq} • ${co.sector}
                </div>
              </div>
              <p style="font-size: 0.78rem; color: var(--ink-secondary); line-height: 1.45; margin: 0;">
                ${co.catalyst}
              </p>
              <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.68rem; color: var(--ink-muted); border-top: 1px dashed var(--border-hairline); padding-top: 0.4rem;">
                <span>2026: $${co.marketCap2026B}B</span>
                <span>P/E: ${peMultiple}×</span>
                <span>Div: ${co.divYield}</span>
              </div>
            </div>
          `;
        })
        .join("");
    }
  }

  document.querySelectorAll("[data-friedman-regime]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const regKey = btn.getAttribute("data-friedman-regime");
      const reg =
        FRIEDMAN_CAPITAL_MARKETS_MODEL &&
        FRIEDMAN_CAPITAL_MARKETS_MODEL.regimes[regKey];
      if (!reg) return;
      activeFriedmanRegime = regKey;
      document.querySelectorAll("[data-friedman-regime]").forEach((b) => {
        b.classList.toggle("active", b === btn);
      });
      if (sliderMGrowth) sliderMGrowth.value = reg.mGrowthPct;
      if (sliderYGrowth) sliderYGrowth.value = reg.yGrowthPct;
      if (sliderBuffettRatio) sliderBuffettRatio.value = reg.buffettRatio;
      if (sliderDiscountR) sliderDiscountR.value = reg.discountRateR;
      renderFriedmanMarkets();
    });
  });

  [sliderMGrowth, sliderYGrowth, sliderBuffettRatio, sliderDiscountR].forEach(
    (sl) => {
      if (sl) {
        sl.addEventListener("input", () => {
          renderFriedmanMarkets();
        });
      }
    }
  );

  // ==========================================================================
  // 9. GLOBAL STOCK MARKET & CURRENCY OVERTAKE RACE (2026–2076)
  // ==========================================================================
  let stockRaceYear = 2076;
  let stockRaceInterval = null;
  let stockRaceSpeedMultiplier = 1;
  const STOCK_BASE_YEAR_MS = 220;
  let prevStockBlocRanks = {};
  const stockRaceRowElements = {};

  const stockRaceYearSlider = document.getElementById("stockRaceYearSlider");
  const playStockRaceBtn = document.getElementById("playStockRaceBtn");
  const stockRaceResetBtn = document.getElementById("stockRaceResetBtn");
  const stockRaceStepBackBtn = document.getElementById("stockRaceStepBackBtn");
  const stockRaceStepFwdBtn = document.getElementById("stockRaceStepFwdBtn");
  const stockRaceJumpEndBtn = document.getElementById("stockRaceJumpEndBtn");
  const stockRaceYearBigDisplay = document.getElementById("stockRaceYearBigDisplay");
  const stockRaceMilestoneCallout = document.getElementById("stockRaceMilestoneCallout");
  const stockRaceBarsContainer = document.getElementById("stockRaceBarsContainer");

  function getExtraStockCapBoostAtYear(blocId, yr) {
    const t = Math.max(0, Math.min(1, (yr - 2026) / 50.0));
    const curve = Math.pow(t, 2.05);
    if (includeUntappedSectors) {
      if (blocId === "africa_bourse") return 69.3 * curve;
      if (blocId === "twin_axis_bourse") return 27.7 * curve;
    }
    if (includeGlobalCoProsperity) {
      if (blocId === "us_bourse") return 26.1 * curve;
      if (blocId === "china_bourse") return 18.7 * curve;
      if (blocId === "eu_bourse") return 16.6 * curve;
      if (blocId === "india_bourse") return 14.2 * curve;
    }
    return 0;
  }

  function interpolateStockCap(bloc, yr) {
    const d = bloc.capByDecade;
    const decades = [2026, 2036, 2046, 2056, 2066, 2076];
    let baseVal = d[2076];
    if (yr <= 2026) {
      baseVal = d[2026];
    } else if (yr < 2076) {
      for (let i = 0; i < decades.length - 1; i++) {
        const y0 = decades[i];
        const y1 = decades[i + 1];
        if (yr >= y0 && yr <= y1) {
          const t = (yr - y0) / (y1 - y0);
          const v0 = Math.max(0.01, d[y0]);
          const v1 = Math.max(0.01, d[y1]);
          const geo = v0 * Math.pow(v1 / v0, t);
          const lin = v0 + (v1 - v0) * t;
          baseVal = geo * 0.68 + lin * 0.32;
          break;
        }
      }
    }
    return +(baseVal + getExtraStockCapBoostAtYear(bloc.id, yr)).toFixed(2);
  }

  function interpolateCurrencyReer(bloc, yr) {
    const t = Math.max(0, Math.min(1, (yr - 2026) / 50));
    return Math.round(
      bloc.currencyReer2026 + (bloc.currencyReer2076 - bloc.currencyReer2026) * t
    );
  }

  function getStockYoYGrowthPct(bloc, yr) {
    const curr = interpolateStockCap(bloc, yr);
    const prev = interpolateStockCap(bloc, Math.max(2026, yr - 1));
    if (yr === 2026) {
      const next = interpolateStockCap(bloc, 2027);
      return (((next - curr) / curr) * 100).toFixed(1);
    }
    return (((curr - prev) / prev) * 100).toFixed(1);
  }

  function getStockRaceMilestoneMessage(yr) {
    const afCap = interpolateStockCap(STOCK_MARKET_RACE_BLOCS[0], yr).toFixed(1);
    const twinCap = interpolateStockCap(STOCK_MARKET_RACE_BLOCS[1], yr).toFixed(1);
    const afReer = interpolateCurrencyReer(STOCK_MARKET_RACE_BLOCS[0], yr);

    if (yr <= 2033) {
      return `<strong>${yr} • Capital Union &amp; Collateral Unlock (Yr ${yr - 2026}/50):</strong> 28:1 Digital Land Titling unlocks $2.5T+ in dead capital as bankable collateral; 95:1 AfCFTA rails merge 54 fragmented bourses into the SANKORE-500 Exchange ($${afCap}T).`;
    } else if (yr <= 2041) {
      return `<strong>${yr} • Multiple Expansion Takeoff (Yr ${yr - 2026}/50):</strong> 38:1 E-Procurement cuts sovereign discount rate r; African P/E multiples expand from 7.5× toward 16×. All-Africa Bourse hits <strong>$${afCap}T</strong> (Currency REER: ${afReer}).`;
    } else if (yr <= 2044) {
      return `<strong>${yr} • BOURSE OVERTAKE #1 (EU SURPASSED):</strong> 🌍 <strong>All-Africa Stock Exchange ($${afCap}T) overtakes Euronext &amp; Frankfurt!</strong> Global pension funds rotate into Grand Inga &amp; Rift Valley clean-power megacaps.`;
    } else if (yr <= 2046) {
      return `<strong>${yr} • BOURSE OVERTAKE #2 (INDIA SURPASSED):</strong> 🌍 <strong>All-Africa Stock Exchange ($${afCap}T) overtakes India’s NSE + BSE!</strong> Meanwhile 🇰🇪🇨🇩 Nairobi–Kinshasa Bourse hits $${twinCap}T.`;
    } else if (yr <= 2053) {
      return `<strong>${yr} • BOURSE OVERTAKE #3 (CHINA SURPASSED):</strong> 🌍 <strong>All-Africa Stock Exchange ($${afCap}T) overtakes Shanghai + Shenzhen + Hong Kong!</strong> Friedman currency index reaches ${afReer} (+${afReer - 100}% appreciation).`;
    } else if (yr <= 2070) {
      return `<strong>${yr} • BOURSE OVERTAKE #4 (#1 WALL STREET SURPASSED):</strong> 🌍 <strong>The Pan-African Stock Exchange ($${afCap}T) overtakes US NYSE + NASDAQ to become the #1 Capital Market on Earth!</strong>`;
    } else {
      return `<strong>${yr} • UNASSAILABLE $261T FINANCIAL THRONE:</strong> 🌍 <strong>All-Africa Bourse hits $${afCap}T</strong> (180% Buffett Ratio, REER ${afReer})—and 🇰🇪🇨🇩 <strong>the Nairobi–Kinshasa Exchange alone ($${twinCap}T) overtakes Wall Street!</strong>`;
    }
  }

  function ensureStockRaceRowsCreated() {
    if (!stockRaceBarsContainer || typeof STOCK_MARKET_RACE_BLOCS === "undefined") return;
    if (Object.keys(stockRaceRowElements).length === STOCK_MARKET_RACE_BLOCS.length) return;

    stockRaceBarsContainer.innerHTML = "";
    STOCK_MARKET_RACE_BLOCS.forEach((bloc, idx) => {
      const row = document.createElement("div");
      row.className = `race-bar-row ${bloc.isAfricaHero ? "hero-bloc" : ""}`;
      row.style.transform = `translateY(${idx * getRaceRowPitchPx()}px)`;
      row.innerHTML = `
        <div class="race-bloc-meta">
          <span class="race-rank-num">#${idx + 1}</span>
          <div style="min-width: 0;">
            <div class="race-bloc-name">
              <span class="bloc-title-text">${bloc.flag} ${bloc.shortName}</span>
              <span class="overtake-flash-badge" style="display: none;">🔥 OVERTAKE!</span>
            </div>
            <span class="race-bloc-sub stock-meta-sub">Cap/GDP: ${bloc.buffett2076} • FX REER: ${bloc.currencyReer2076}</span>
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
      stockRaceBarsContainer.appendChild(row);
      stockRaceRowElements[bloc.id] = row;
    });
  }

  function renderStockMarketRace(trackOvertakes = true) {
    if (!stockRaceBarsContainer || typeof STOCK_MARKET_RACE_BLOCS === "undefined") return;
    ensureStockRaceRowsCreated();

    if (stockRaceYearBigDisplay) stockRaceYearBigDisplay.textContent = stockRaceYear;
    if (stockRaceYearSlider) stockRaceYearSlider.value = stockRaceYear;

    document.querySelectorAll("[data-stock-year]").forEach((btn) => {
      btn.classList.toggle(
        "active",
        parseInt(btn.getAttribute("data-stock-year"), 10) === stockRaceYear
      );
    });

    const computed = STOCK_MARKET_RACE_BLOCS.map((bloc) => ({
      ...bloc,
      currentCapT: interpolateStockCap(bloc, stockRaceYear),
      currentReer: interpolateCurrencyReer(bloc, stockRaceYear),
      yoyPct: getStockYoYGrowthPct(bloc, stockRaceYear),
    })).sort((a, b) => b.currentCapT - a.currentCapT);

    const maxBarCap = Math.max(computed[0].currentCapT, 60.0);

    if (stockRaceMilestoneCallout) {
      const afBourse = computed.find((b) => b.id === "africa_bourse");
      const sqBourse = computed.find((b) => b.id === "africa_sq_bourse");
      const wealthGainT = +(afBourse.currentCapT - sqBourse.currentCapT).toFixed(2);

      stockRaceMilestoneCallout.innerHTML = `
        <div style="flex: 1; min-width: 260px;">${getStockRaceMilestoneMessage(stockRaceYear)}</div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: #D97706; text-align: right;">
          <div>+$${wealthGainT}T Equity Wealth Created vs. Status Quo</div>
          <div style="font-size: 0.68rem; color: var(--ink-muted);">Speed: ${stockRaceSpeedMultiplier}x • Africa FX REER: ${afBourse.currentReer} (${afBourse.currentReer >= 100 ? "+" : ""}${afBourse.currentReer - 100}%)</div>
        </div>
      `;
    }

    const newRanks = {};
    computed.forEach((bloc, idx) => {
      newRanks[bloc.id] = idx;
      const row = stockRaceRowElements[bloc.id];
      if (!row) return;

      row.style.transform = `translateY(${idx * getRaceRowPitchPx()}px)`;

      const prevRank = prevStockBlocRanks[bloc.id];
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

      const subEl = row.querySelector(".stock-meta-sub");
      if (subEl) {
        const fxDiff = bloc.currentReer - 100;
        subEl.textContent = `2076 Cap/GDP: ${bloc.buffett2076} • FX REER: ${bloc.currentReer} (${fxDiff >= 0 ? "+" : ""}${fxDiff}%)`;
      }

      const widthPct = Math.max(2.5, (bloc.currentCapT / maxBarCap) * 100);
      const fillEl = row.querySelector(".race-fill");
      if (fillEl) fillEl.style.width = `${widthPct}%`;

      const capNumEl = row.querySelector(".bloc-gdp-num");
      if (capNumEl) capNumEl.textContent = `$${bloc.currentCapT.toFixed(2)}T`;

      const yoyEl = row.querySelector(".bloc-yoy-sub");
      if (yoyEl) {
        yoyEl.textContent = `+${bloc.yoyPct}%/yr`;
        yoyEl.style.color = bloc.isAfricaHero ? "var(--emerald)" : "var(--ink-muted)";
      }
    });

    prevStockBlocRanks = newRanks;
  }

  function stopStockRacePlayback() {
    if (stockRaceInterval) {
      clearInterval(stockRaceInterval);
      stockRaceInterval = null;
    }
    if (playStockRaceBtn) {
      playStockRaceBtn.textContent =
        stockRaceYear >= 2076
          ? "▶ Replay Stock Market Race"
          : "▶ Play Stock Market Race";
    }
  }

  function startStockRacePlayback() {
    if (stockRaceInterval) {
      clearInterval(stockRaceInterval);
      stockRaceInterval = null;
    }
    if (stockRaceYear >= 2076) {
      stockRaceYear = 2026;
      prevStockBlocRanks = {};
      renderStockMarketRace(false);
    }
    if (playStockRaceBtn) {
      playStockRaceBtn.textContent = `⏸ Pause Bourse (${stockRaceSpeedMultiplier}x)`;
    }
    const stepMs = Math.max(
      25,
      Math.round(STOCK_BASE_YEAR_MS / stockRaceSpeedMultiplier)
    );
    stockRaceInterval = setInterval(() => {
      stockRaceYear += 1;
      renderStockMarketRace(true);
      if (stockRaceYear >= 2076) {
        stopStockRacePlayback();
      }
    }, stepMs);
  }

  if (stockRaceYearSlider) {
    stockRaceYearSlider.addEventListener("input", (e) => {
      stopStockRacePlayback();
      stockRaceYear = parseInt(e.target.value, 10);
      renderStockMarketRace(true);
    });
  }

  document.querySelectorAll("[data-stock-year]").forEach((btn) => {
    btn.addEventListener("click", () => {
      stopStockRacePlayback();
      stockRaceYear = parseInt(btn.getAttribute("data-stock-year"), 10);
      prevStockBlocRanks = {};
      renderStockMarketRace(false);
    });
  });

  document.querySelectorAll("[data-stock-speed]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const spd = parseFloat(btn.getAttribute("data-stock-speed"));
      if (!isNaN(spd) && spd > 0) {
        stockRaceSpeedMultiplier = spd;
        document.querySelectorAll("[data-stock-speed]").forEach((b) => {
          b.classList.toggle("active", b === btn);
        });
        if (stockRaceInterval) {
          startStockRacePlayback();
        } else {
          renderStockMarketRace(false);
        }
      }
    });
  });

  if (stockRaceResetBtn) {
    stockRaceResetBtn.addEventListener("click", () => {
      stopStockRacePlayback();
      stockRaceYear = 2026;
      prevStockBlocRanks = {};
      renderStockMarketRace(false);
    });
  }

  if (stockRaceStepBackBtn) {
    stockRaceStepBackBtn.addEventListener("click", () => {
      stopStockRacePlayback();
      stockRaceYear = Math.max(2026, stockRaceYear - 1);
      renderStockMarketRace(true);
    });
  }

  if (stockRaceStepFwdBtn) {
    stockRaceStepFwdBtn.addEventListener("click", () => {
      stopStockRacePlayback();
      stockRaceYear = Math.min(2076, stockRaceYear + 1);
      renderStockMarketRace(true);
    });
  }

  if (stockRaceJumpEndBtn) {
    stockRaceJumpEndBtn.addEventListener("click", () => {
      stopStockRacePlayback();
      stockRaceYear = 2076;
      prevStockBlocRanks = {};
      renderStockMarketRace(false);
    });
  }

  if (playStockRaceBtn) {
    playStockRaceBtn.addEventListener("click", () => {
      if (stockRaceInterval) {
        stopStockRacePlayback();
      } else {
        startStockRacePlayback();
      }
    });
  }

  // ==========================================================================
  // 10. MILTON FRIEDMAN "PRICE THEORY" (1962/1976) MICROECONOMIC ENGINE
  // ==========================================================================
  let activePtPreset = "sankoreComplementarity";
  const sliderPtHumanH = document.getElementById("sliderPtHumanH");
  const sliderPtEnergyCost = document.getElementById("sliderPtEnergyCost");
  const sliderPtElasticity = document.getElementById("sliderPtElasticity");
  const sliderPtPricePurity = document.getElementById("sliderPtPricePurity");
  const valPtHumanH = document.getElementById("valPtHumanH");
  const valPtEnergyCost = document.getElementById("valPtEnergyCost");
  const valPtElasticity = document.getElementById("valPtElasticity");
  const valPtPricePurity = document.getElementById("valPtPricePurity");
  const priceTheoryCallout = document.getElementById("priceTheoryCallout");
  const priceTheoryKpiGrid = document.getElementById("priceTheoryKpiGrid");
  const priceTheoryChaptersGrid = document.getElementById("priceTheoryChaptersGrid");

  function renderPriceTheoryEngine() {
    if (
      typeof FRIEDMAN_PRICE_THEORY_MODEL === "undefined" ||
      !priceTheoryKpiGrid ||
      !sliderPtHumanH
    ) {
      return;
    }

    const hIdx = parseFloat(sliderPtHumanH.value);
    const eCost = parseFloat(sliderPtEnergyCost.value);
    const eps = parseFloat(sliderPtElasticity.value);
    const iPurity = parseFloat(sliderPtPricePurity.value);

    if (valPtHumanH) valPtHumanH.textContent = `${Math.round(hIdx)} / 100`;
    if (valPtEnergyCost) valPtEnergyCost.textContent = `$${eCost.toFixed(3)}/kWh`;
    if (valPtElasticity) {
      const elLabel =
        eps < 1.0
          ? "(Inelastic Trap)"
          : eps < 1.8
          ? "(Semi-Processed)"
          : "(Elastic High-Tech)";
      valPtElasticity.textContent = `${eps.toFixed(2)} ${elLabel}`;
    }
    if (valPtPricePurity) valPtPricePurity.textContent = `${Math.round(iPurity)} / 100`;

    // 1. Ch. 7 Factor Complementarity Multiplier: VMP rises as H -> 100 and E -> $0.018/kWh
    const energyFactor = Math.pow(0.20 / Math.max(0.015, eCost), 0.85);
    const humanFactor = Math.pow(hIdx / 38.0, 1.45);
    const instFactor = Math.pow(iPurity / 28.0, 0.75);
    const elasticityFactor = Math.pow(eps / 0.35, 0.65);

    const complementarityMultiplier = +(
      energyFactor *
      humanFactor *
      instFactor
    ).toFixed(1);

    // 2. Marginal Value Product of African Labor (2076 Annual Wage in $)
    const annualWage2076 = Math.min(
      68000,
      Math.max(
        1450,
        Math.round(1850 * (complementarityMultiplier / 1.0) * (0.45 + 0.22 * eps))
      )
    );

    // 3. Onshore Value Capture (%) of Minerals & Agro (2.1% raw dirt -> 94.5% refined tech)
    const rawCaptureScore =
      (hIdx / 100) * 0.35 +
      ((0.225 - eCost) / 0.21) * 0.30 +
      (Math.min(3.0, eps) / 3.0) * 0.25 +
      (iPurity / 100) * 0.10;
    const onshoreValueCapturePct = Math.min(
      96.5,
      Math.max(1.9, +(rawCaptureScore * 99.0).toFixed(1))
    );

    // 4. Ch. 2 & 3 Terms-of-Trade Relative Price Index (P_Africa / P_World, 2026 = 100)
    // When |ε_d| < 1, expanding output crashes relative price (1324 Cairo trap)
    const totIndex =
      eps < 1.0
        ? Math.round(35 + eps * 65)
        : Math.round(100 + (eps - 1.0) * 115 * (hIdx / 90));

    // 5. Ch. 9 Deadweight Loss Eliminated ($ Trillions/yr via 95:1 AfCFTA & 38:1 E-Procurement)
    const dwlSavedT = +((iPurity / 94.0) * 1.42 * (hIdx / 96.0)).toFixed(2);

    // 6. Implied Real Output Y Growth Rate fed into Friedman's M*V = P*Y
    const impliedYGrowthPct = Math.min(
      8.9,
      Math.max(
        1.4,
        +(
          1.4 +
          (hIdx / 100) * 2.6 +
          ((0.22 - eCost) / 0.205) * 1.9 +
          (eps / 3.0) * 1.6 +
          (iPurity / 100) * 0.9
        ).toFixed(1)
      )
    );

    const preset =
      FRIEDMAN_PRICE_THEORY_MODEL.presets[activePtPreset] ||
      FRIEDMAN_PRICE_THEORY_MODEL.presets.sankoreComplementarity;

    const isInelasticTrap = eps < 1.0;

    if (priceTheoryCallout) {
      priceTheoryCallout.style.borderLeftColor = isInelasticTrap
        ? "var(--crimson)"
        : "var(--emerald)";
      priceTheoryCallout.innerHTML = `
        <div style="flex: 1; min-width: 260px;">
          <div style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: ${
            isInelasticTrap ? "var(--crimson)" : "var(--emerald)"
          };">${preset.badge}</div>
          <div style="margin-top: 0.2rem;"><strong>${preset.name}:</strong> ${preset.summary}</div>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; text-align: right;">
          <div>Marginal Revenue Law: MR = P · (1 − 1/${eps.toFixed(2)}) = ${
        eps < 1
          ? `<span style="color: var(--crimson);">NEGATIVE (Price Crash!)</span>`
          : `<span style="color: var(--emerald);">+${(1 - 1 / eps).toFixed(2)}P (Compounding!)</span>`
      }</div>
          <div style="color: var(--emerald);">Feeds Real Output Growth (Y): +${impliedYGrowthPct}%/yr</div>
        </div>
      `;
    }

    priceTheoryKpiGrid.innerHTML = `
      <div class="friedman-kpi-card">
        <div class="friedman-kpi-label">Ch. 7 Marginal Product of Labor</div>
        <div class="friedman-kpi-val" style="color: var(--emerald);">$${annualWage2076.toLocaleString()}/yr</div>
        <div class="friedman-kpi-sub">2076 Avg African Skilled Wage (vs. $1,850/yr under Raw-Ore Trap)</div>
      </div>

      <div class="friedman-kpi-card gold">
        <div class="friedman-kpi-label">Onshore Value-Chain Capture</div>
        <div class="friedman-kpi-val" style="color: #D97706;">${onshoreValueCapturePct}%</div>
        <div class="friedman-kpi-sub">Share of Final Battery, Steel &amp; AI Value Kept in Africa (vs. 2.1% raw)</div>
      </div>

      <div class="friedman-kpi-card ${isInelasticTrap ? "warn" : ""}">
        <div class="friedman-kpi-label">Ch. 2 Relative Price / Terms of Trade</div>
        <div class="friedman-kpi-val" style="color: ${
          isInelasticTrap ? "var(--crimson)" : "var(--emerald)"
        };">${totIndex}</div>
        <div class="friedman-kpi-sub">${
          isInelasticTrap
            ? "⚠ |ε_d| < 1: More Raw Supply Crashes Price!"
            : "✓ |ε_d| > 1: High-Tech Pricing Power (2026=100)"
        }</div>
      </div>

      <div class="friedman-kpi-card">
        <div class="friedman-kpi-label">Ch. 7 Factor Complementarity</div>
        <div class="friedman-kpi-val">${complementarityMultiplier}×</div>
        <div class="friedman-kpi-sub">VMP Multiplier from Pairing H(${Math.round(hIdx)}) × E($${eCost.toFixed(3)}/kWh)</div>
      </div>

      <div class="friedman-kpi-card gold">
        <div class="friedman-kpi-label">Ch. 11 Human vs. Concrete IRR</div>
        <div class="friedman-kpi-val" style="color: #D97706;">48.7 : 1</div>
        <div class="friedman-kpi-sub">25.6× Higher Return than Unsequenced Concrete (1.9:1)</div>
      </div>

      <div class="friedman-kpi-card">
        <div class="friedman-kpi-label">Ch. 9 Price Signal Welfare Gain</div>
        <div class="friedman-kpi-val" style="color: var(--emerald);">+$${dwlSavedT}T/yr</div>
        <div class="friedman-kpi-sub">Deadweight Loss &amp; Quota Rents Eliminated (AfCFTA + Titles)</div>
      </div>
    `;

    if (priceTheoryChaptersGrid && priceTheoryChaptersGrid.children.length === 0) {
      priceTheoryChaptersGrid.innerHTML = FRIEDMAN_PRICE_THEORY_MODEL.chapters
        .map(
          (ch) => `
          <div class="megacap-card">
            <div>
              <div class="megacap-top">
                <span class="megacap-ticker" style="background-color: var(--cobalt);">${ch.chapter}</span>
                <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: #D97706;">${ch.formula}</span>
              </div>
              <div style="font-weight: 700; font-size: 0.94rem; margin-top: 0.45rem; line-height: 1.25;">
                ${ch.lawTitle}
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--emerald); font-weight: 700; margin-top: 0.2rem;">
                Lomborg Catalyst: ${ch.lomborgLink}
              </div>
            </div>
            <p style="font-size: 0.78rem; color: var(--ink-secondary); line-height: 1.48; margin: 0;">
              ${ch.explanation}
            </p>
          </div>
        `
        )
        .join("");
    }
  }

  document.querySelectorAll("[data-pt-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-pt-preset");
      const preset =
        FRIEDMAN_PRICE_THEORY_MODEL &&
        FRIEDMAN_PRICE_THEORY_MODEL.presets[key];
      if (!preset) return;
      activePtPreset = key;
      document.querySelectorAll("[data-pt-preset]").forEach((b) => {
        b.classList.toggle("active", b === btn);
      });
      if (sliderPtHumanH) sliderPtHumanH.value = preset.humanH;
      if (sliderPtEnergyCost) sliderPtEnergyCost.value = preset.energyCostKwh;
      if (sliderPtElasticity) sliderPtElasticity.value = preset.elasticityEps;
      if (sliderPtPricePurity) sliderPtPricePurity.value = preset.pricePurityI;
      renderPriceTheoryEngine();
    });
  });

  [
    sliderPtHumanH,
    sliderPtEnergyCost,
    sliderPtElasticity,
    sliderPtPricePurity,
  ].forEach((sl) => {
    if (sl) {
      sl.addEventListener("input", () => {
        renderPriceTheoryEngine();
      });
    }
  });

  // ==========================================================================
  // 11. HISTORICAL $3.33T AUDIT (ALL-AFRICA) & KENYA $161B AUDIT + TIME MACHINE
  // ==========================================================================
  let activeAuditScope = "africa"; // "africa" | "kenya"
  const sliderHistoricalRedirect = document.getElementById("sliderHistoricalRedirect");
  const valHistoricalRedirect = document.getElementById("valHistoricalRedirect");
  const auditSummaryBanner = document.getElementById("auditSummaryBanner");
  const auditComparisonGrid = document.getElementById("auditComparisonGrid");
  const auditChannelsGrid = document.getElementById("auditChannelsGrid");
  const applyCounterfactualBaseBtn = document.getElementById("applyCounterfactualBaseBtn");

  function renderHistoricalAudit() {
    if (
      typeof HISTORICAL_AUDIT_MODEL === "undefined" ||
      !auditComparisonGrid ||
      !sliderHistoricalRedirect
    ) {
      return;
    }

    const audit =
      HISTORICAL_AUDIT_MODEL[activeAuditScope] || HISTORICAL_AUDIT_MODEL.africa;
    const redirectPct = parseFloat(sliderHistoricalRedirect.value);
    const scaleVsDefault = redirectPct / audit.defaultRedirectPct;
    const redirectedCapitalB = +(
      (audit.totalPublicCapitalB * redirectPct) /
      100
    ).toFixed(1);

    const bcrNum = activeAuditScope === "kenya" ? 54.2 : 48.7;

    if (valHistoricalRedirect) {
      valHistoricalRedirect.textContent = `${redirectPct}% Redirected ($${redirectedCapitalB.toLocaleString()}B @ ${bcrNum}:1)`;
    }

    // Dynamic 2026 Counterfactual Values scaled by slider
    const cfGdpT = +(
      audit.actual2026.gdpT +
      (audit.counterfactualBase2026.gdpT - audit.actual2026.gdpT) *
        Math.pow(scaleVsDefault, 0.85)
    ).toFixed(2);

    const cfPerCapita = Math.round(
      audit.actual2026.perCapitaUsd +
        (audit.counterfactualBase2026.perCapitaUsd -
          audit.actual2026.perCapitaUsd) *
          Math.pow(scaleVsDefault, 0.85)
    );

    const cfBourseT = +(
      audit.actual2026.bourseCapT +
      (audit.counterfactualBase2026.bourseCapT - audit.actual2026.bourseCapT) *
        Math.pow(scaleVsDefault, 0.92)
    ).toFixed(2);

    const gdpLostGapT = +(cfGdpT - audit.actual2026.gdpT).toFixed(2);
    const gdpMultiple = (cfGdpT / audit.actual2026.gdpT).toFixed(1);

    const cfCurrencyText =
      activeAuditScope === "kenya"
        ? `KSh ${Math.max(12, Math.round(68 / Math.pow(scaleVsDefault, 0.72)))} per $1 USD`
        : `REER Index ${Math.round(100 + 240 * Math.pow(scaleVsDefault, 0.8))} (+${Math.round(240 * Math.pow(scaleVsDefault, 0.8))}% Stronger)`;

    if (auditSummaryBanner) {
      auditSummaryBanner.innerHTML = `
        <div style="flex: 1; min-width: 260px;">
          <div style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--crimson);">
            ${audit.flag} ${audit.name} • ${audit.period} • ${audit.multipleOf75B}
          </div>
          <div style="font-weight: 700; font-size: 1.02rem; margin: 0.25rem 0;">${audit.headline}</div>
          <div style="font-size: 0.85rem; color: var(--ink-secondary); line-height: 1.5;">${audit.summary}</div>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; text-align: right; min-width: 230px;">
          <div style="color: var(--crimson);">Historical Realized ROI: ${audit.realizedBcr}</div>
          <div style="color: var(--emerald);">Lomborg Counterfactual ROI: ${audit.lomborgPotentialBcr}</div>
          <div style="color: #D97706; margin-top: 0.2rem;">2026 Lost Output Gap: -$${gdpLostGapT}T/yr</div>
        </div>
      `;
    }

    const actGdpDisplay =
      audit.actual2026.gdpT < 1
        ? `$${Math.round(audit.actual2026.gdpT * 1000)}B`
        : `$${audit.actual2026.gdpT.toFixed(2)}T`;
    const cfGdpDisplay =
      cfGdpT < 1 ? `$${Math.round(cfGdpT * 1000)}B` : `$${cfGdpT.toFixed(2)}T`;

    const actBourseDisplay =
      audit.actual2026.bourseCapT < 0.1
        ? `$${(audit.actual2026.bourseCapT * 1000).toFixed(1)}B`
        : `$${audit.actual2026.bourseCapT.toFixed(2)}T`;
    const cfBourseDisplay =
      cfBourseT < 0.1
        ? `$${(cfBourseT * 1000).toFixed(1)}B`
        : `$${cfBourseT.toFixed(2)}T`;

    auditComparisonGrid.innerHTML = `
      <div class="friedman-kpi-card">
        <div class="friedman-kpi-label">2026 GDP (Reality vs. Counterfactual)</div>
        <div class="friedman-kpi-val" style="color: var(--emerald);">${cfGdpDisplay}</div>
        <div class="friedman-kpi-sub">
          <span style="color: var(--crimson);">2026 Reality: ${actGdpDisplay}</span> • <strong>${gdpMultiple}× Larger Today!</strong>
        </div>
      </div>

      <div class="friedman-kpi-card gold">
        <div class="friedman-kpi-label">2026 Income Per Capita (Annual)</div>
        <div class="friedman-kpi-val" style="color: #D97706;">$${cfPerCapita.toLocaleString()}/yr</div>
        <div class="friedman-kpi-sub">
          <span style="color: var(--crimson);">2026 Reality: $${audit.actual2026.perCapitaUsd.toLocaleString()}/yr</span> • High-Income Tiger Today
        </div>
      </div>

      <div class="friedman-kpi-card">
        <div class="friedman-kpi-label">2026 Stock Exchange Market Cap</div>
        <div class="friedman-kpi-val" style="color: var(--emerald);">${cfBourseDisplay}</div>
        <div class="friedman-kpi-sub">
          <span style="color: var(--crimson);">2026 Reality: ${actBourseDisplay}</span> • Deep Pension &amp; Land Collateral
        </div>
      </div>

      <div class="friedman-kpi-card gold">
        <div class="friedman-kpi-label">2026 Friedman Currency Valuation</div>
        <div class="friedman-kpi-val" style="color: #D97706; font-size: 1.35rem;">${cfCurrencyText}</div>
        <div class="friedman-kpi-sub">
          <span style="color: var(--crimson);">2026 Reality: ${audit.actual2026.currencyLabel}</span>
        </div>
      </div>

      <div class="friedman-kpi-card">
        <div class="friedman-kpi-label">2026 Tax Eaten by Debt Interest</div>
        <div class="friedman-kpi-val" style="color: var(--emerald);">${audit.counterfactualBase2026.debtServiceTaxPct.split(" ")[0]}</div>
        <div class="friedman-kpi-sub">
          <span style="color: var(--crimson);">2026 Reality: ${audit.actual2026.debtServiceTaxPct}</span> • Zero Debt Distress
        </div>
      </div>

      <div class="friedman-kpi-card">
        <div class="friedman-kpi-label">2026 Power Tariff &amp; Child Stunting</div>
        <div class="friedman-kpi-val" style="color: var(--emerald); font-size: 1.3rem;">${audit.counterfactualBase2026.powerTariff.split(" ")[0]} • ${audit.counterfactualBase2026.stuntingPct.split(" ")[0]}${audit.counterfactualBase2026.stuntingPct.split(" ")[1] || ""}</div>
        <div class="friedman-kpi-sub">
          <span style="color: var(--crimson);">2026 Reality: ${audit.actual2026.powerTariff.split(" ")[0]} &amp; ${audit.actual2026.stuntingPct}</span>
        </div>
      </div>
    `;

    if (auditChannelsGrid) {
      auditChannelsGrid.innerHTML = audit.inflowChannels
        .map(
          (ch) => `
          <div class="megacap-card" style="border-top: 3px solid var(--crimson);">
            <div>
              <div class="megacap-top">
                <span class="megacap-ticker" style="background-color: var(--crimson);">${ch.realizedBcr}</span>
                <span class="megacap-cap" style="color: var(--ink-primary);">${ch.amountLabel}</span>
              </div>
              <div style="font-weight: 700; font-size: 0.94rem; margin-top: 0.45rem; line-height: 1.25;">
                ${ch.title}
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.68rem; color: #D97706; font-weight: 700; margin-top: 0.2rem;">
                Scale: ${ch.multipleLabel}
              </div>
            </div>
            <p style="font-size: 0.78rem; color: var(--ink-secondary); line-height: 1.48; margin: 0;">
              ${ch.leakageDiagnosis}
            </p>
          </div>
        `
        )
        .join("");
    }
  }

  document.querySelectorAll("[data-audit-scope]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const scope = btn.getAttribute("data-audit-scope");
      if (!HISTORICAL_AUDIT_MODEL || !HISTORICAL_AUDIT_MODEL[scope]) return;
      activeAuditScope = scope;
      document.querySelectorAll("[data-audit-scope]").forEach((b) => {
        b.classList.toggle("active", b === btn);
      });
      if (sliderHistoricalRedirect) {
        sliderHistoricalRedirect.value =
          HISTORICAL_AUDIT_MODEL[scope].defaultRedirectPct;
      }
      renderHistoricalAudit();
    });
  });

  if (sliderHistoricalRedirect) {
    sliderHistoricalRedirect.addEventListener("input", () => {
      renderHistoricalAudit();
    });
  }

  if (applyCounterfactualBaseBtn) {
    applyCounterfactualBaseBtn.addEventListener("click", () => {
      counterfactual2026BaseActive = !counterfactual2026BaseActive;
      applyCounterfactualBaseBtn.textContent = counterfactual2026BaseActive
        ? "✓ Counterfactual 2026 Base Active ($28.4T Start — Click to Reset to $3.7T)"
        : "🚀 Launch Overtake Race From Counterfactual 2026 Base ($28.4T Africa)";
      raceYear = 2026;
      prevBlocRanks = {};
      renderOvertakeRace(false);
      renderOvertakeProofTable();
      const raceSec = document.getElementById("overtake-race");
      if (raceSec) {
        raceSec.scrollIntoView({ behavior: "smooth" });
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
  syncAngularDeviceSignal();
  populateCountryDropdown();
  renderAfricaSvgMap();
  renderCountryDossier();
  initWebGlMap();
  renderHistoricalAudit();
  renderOvertakeRace();
  renderOvertakeProofTable();
  renderUntappedSectorsAndCoProsperity();
  renderFriedmanMarkets();
  renderStockMarketRace();
  renderPriceTheoryEngine();
  renderBtfMatrix();
  updateSimulatorSummary();
  renderInterventionsGrid();
  renderMarimekkoChart();
  renderAllBlueprintSections();
})();
