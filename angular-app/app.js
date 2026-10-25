// ============================================================================
// APPLICATION CONTROLLER: HOW $75B GROWS AFRICA INTO HISTORY'S LARGEST ECONOMY
// Featuring 60FPS MapLibre WebGL 3D Extruded Map + 2026–2036 Growth Scrubber
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
  let activeCountryKey = "kenya"; // Exclusively Kenya // Macro blueprint tab ("africa", "drc", "kenya", "twinAxis")
  let activeCountryScope = "kenya"; // Exclusively Kenya // Country Scope Switcher ("africa" or "kenya")
  let activeDrcPhase = 1;
  let activeScenarioKey = "lomborg";

  // Interactive Map & Timeline State
  let selectedMapIso = "COD"; // Default to DRC
  let mapColorMetric = "gdp2036T"; // "gdp2036T", "bcrWeighted", "catalystShareB"
  let showCorridors = true;
  let countryDedicated75BMode = false;
  let mapSimYear = 2026; // 2026 to 2036
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

  // Helper: Interpolate country GDP at any year between 2026 and 2036 (compound curve)
  function getCountryGdpAtYear(c, year) {
    const t = Math.max(0, Math.min(1, (year - 2026) / 50.0));
    // Non-linear compound curve (t^2.15 matches 50-year compounding trajectory)
    const curve = Math.pow(t, 2.15);
    return +(c.gdp2026T + (c.gdp2036T - c.gdp2026T) * curve).toFixed(2);
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
      mapColorMetric === "gdp2036T"
        ? getCountryGdpAtYear(c, mapSimYear)
        : c[mapColorMetric] || 0;

    if (mapColorMetric === "gdp2036T") {
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
    if (typeof KENYA_COUNTIES_GEOJSON === "undefined" || typeof KENYA_47_COUNTIES_DATA === "undefined") return;

    KENYA_COUNTIES_GEOJSON.features.forEach((f) => {
      const c = KENYA_47_COUNTIES_DATA[f.properties.code];
      if (c) {
        const isSectorMatch = activeCountySector === "ALL" || c.sector === activeCountySector;
        const isBlocMatch = activeCountyBloc === "ALL" || c.bloc === activeCountyBloc;
        const isMatch = isSectorMatch && isBlocMatch;
        f.properties.extrusionHeight = mapEngineMode === "2d-gl" ? 0 : (isMatch ? Math.round(c.gcp2036T * 45000) : 4000);
        f.properties.fillColor = isMatch ? (SECTOR_COLORS[c.sector] || "#D97706") : "#334155";
      }
    });

    if (glMap && glMap.getSource("kenya-counties")) {
      glMap.getSource("kenya-counties").setData(KENYA_COUNTIES_GEOJSON);
    }
  }

  function initWebGlMap() {
    if (typeof maplibregl === "undefined" || typeof KENYA_COUNTIES_GEOJSON === "undefined") {
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
            "kenya-counties": {
              type: "geojson",
              data: KENYA_COUNTIES_GEOJSON,
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
              id: "kenya-counties-extrusion",
              type: "fill-extrusion",
              source: "kenya-counties",
              layout: {
                visibility: "visible",
              },
              paint: {
                "fill-extrusion-color": ["get", "fillColor"],
                "fill-extrusion-height": ["get", "extrusionHeight"],
                "fill-extrusion-base": 0,
                "fill-extrusion-opacity": 0.92,
              },
            },
            {
              id: "kenya-counties-borders",
              type: "line",
              source: "kenya-counties",
              layout: {
                visibility: "visible",
              },
              paint: {
                "line-color": "#FFFFFF",
                "line-width": 1.2,
                "line-opacity": 0.45,
              },
            },
            {
              id: "kenya-counties-selected-outline",
              type: "line",
              source: "kenya-counties",
              filter: ["==", ["get", "code"], selectedCountyCode],
              layout: {
                visibility: "visible",
              },
              paint: {
                "line-color": "#F59E0B",
                "line-width": 4.0,
              },
            },
          ],
        },
        center: [37.8, 0.4],
        zoom: 6.2,
        pitch: mapEngineMode === "3d" ? 52 : 0,
        bearing: mapEngineMode === "3d" ? -10 : 0,
        antialias: true,
      });

      glMap.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");

      glMap.on("load", () => {
        glMap.on("mousemove", "kenya-counties-extrusion", (e) => {
          if (!e.features || !e.features.length) return;
          glMap.getCanvas().style.cursor = "pointer";
          const p = e.features[0].properties;
          if (mapFloatingTooltip) {
            mapFloatingTooltip.innerHTML = `
              <strong style="font-size: 0.92rem;">${p.icon || "📍"} ${p.code} • ${p.name}</strong> (${p.sectorName || ""})<br/>
              Current GCP: <strong style="color: var(--crimson);">$${p.gcp2026B || 1.0}B</strong> ➔ $100B Fund: <strong style="color: #F59E0B;">+$${((p.alloc100BM || 2000) / 1000).toFixed(1)}B</strong><br/>
              Lost Potential & Horizon: <strong style="color: var(--emerald);">$${p.gcp2036T || 0.5} Trillion</strong> • <em>${p.multiplier || "Economic Multiplier"}</em>
            `;
          }
        });

        glMap.on("mouseleave", "kenya-counties-extrusion", () => {
          glMap.getCanvas().style.cursor = "";
        });

        glMap.on("click", "kenya-counties-extrusion", (e) => {
          if (!e.features || !e.features.length) return;
          const code = e.features[0].properties.code;
          selectKenyaCounty(code, true);
        });
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
      if (maplibreContainer) maplibreContainer.style.display = "none";
      if (kenyaCountySvgMap) {
        kenyaCountySvgMap.style.display = "block";
        renderKenyaCountyMap();
      }
    } else {
      if (kenyaCountySvgMap) kenyaCountySvgMap.style.display = "none";
      if (maplibreContainer) {
        maplibreContainer.style.display = "block";
        if (glMap) {
          glMap.resize();
          syncGeoJsonMetrics();
          glMap.easeTo({
            center: [37.8, 0.4],
            zoom: 6.2,
            pitch: mode === "3d" ? 52 : 0,
            bearing: mode === "3d" ? -10 : 0,
            duration: 800,
          });
        }
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
        const isK = activeCountryScope === "kenya";
        glMap.flyTo({
          center: isK ? [37.8, 0.4] : [21.5, 1.5],
          zoom: isK ? 6.2 : 2.55,
          pitch: mapEngineMode === "3d" ? (isK ? 52 : 50) : 0,
          bearing: mapEngineMode === "3d" ? (isK ? -10 : -8) : 0,
          duration: 1100,
        });
      }
    });
  }

  // Timeline Scrubber, Transport & Speed Controls for 3D Map (2026 -> 2036)
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
        mapSimYear >= 2036 ? "▶ Replay Yearly 3D Growth" : "▶ Play Yearly 3D Growth";
    }
  }

  function startMapPlayback() {
    if (timelineInterval) {
      clearInterval(timelineInterval);
      timelineInterval = null;
    }
    if (mapSimYear >= 2036) {
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
      if (mapSimYear >= 2036) {
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
      mapSimYear = Math.min(2036, mapSimYear + 1);
      updateTimelineDisplay();
    });
  }

  if (mapJumpEndBtn) {
    mapJumpEndBtn.addEventListener("click", () => {
      stopMapPlayback();
      mapSimYear = 2036;
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
          }>${c.flag} ${c.name} ($${c.gdp2036T}T Peak)</option>`
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
          Year ${mapSimYear} GDP: <strong style="color: var(--emerald);">$${curGdp}T</strong> (Potential: <strong>$${c.gdp2036T}T</strong>)
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
    if (activeCountryScope === "kenya") {
      renderCountyDossier();
      return;
    }
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
          <span class="dossier-metric-label">Year ${mapSimYear} GDP (Potential)</span>
          <span class="dossier-metric-val emerald">$${curGdpT}T ($${c.gdp2036T}T)</span>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; padding: 0.65rem 0.85rem; background: var(--emerald-soft); border-left: 3px solid #D97706; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.73rem;">
        <span>🏛️ <strong>2036 ${c.name} Stock Exchange (1.8× GDP):</strong> <strong style="color: var(--emerald);">$${(c.gdp2036T * 1.8).toFixed(2)}T Market Cap</strong></span>
        <span>💱 <strong>Friedman Currency Value:</strong> <strong style="color: #D97706;">+${Math.round(180 + c.bcrWeighted * 1.75)}% Real Appreciation</strong></span>
      </div>

      <div>
        <div style="font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; color: var(--ink-muted); font-weight: 700;">
          Natural &amp; Strategic Endowments (${c.name} • ~${c.pop2036M}M Pop by 2036)
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
      if (typeof window.goToUxStep === "function") {
        window.goToUxStep("4", false);
      }
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
  // 2B. KENYA 47 COUNTIES MAP, EXPLORER & $100B BEYOND LOMBORG MODULE
  // ==========================================================================
  let selectedCountyCode = "047"; // Default Nairobi Metropolis
  let activeCountySector = "ALL";
  let activeCountyBloc = "ALL";
  let countySearchQuery = "";
  let showCountyIcons = true;
  let showCountyCorridors = true;
  let showCountyLabels = true;

  const kenyaCountyControlsBar = document.getElementById("kenyaCountyControlsBar");
  const africaMapControlsBar = document.getElementById("africaMapControlsBar");
  const countySelectDropdown = document.getElementById("countySelectDropdown");
  const kenyaCountySvgMap = document.getElementById("kenyaCountySvgMap");
  const kenyaCountiesMatrixSection = document.getElementById("kenyaCountiesMatrixSection");
  const kenyaCountiesTableBody = document.getElementById("kenyaCountiesTableBody");
  const countySearchInput = document.getElementById("countySearchInput");
  const kenyaBreakthroughGrid = document.getElementById("kenyaBreakthroughGrid");

  const SECTOR_COLORS = {
    AGRO: "#16A34A",
    GEOTHERMAL: "#EAB308",
    MARITIME: "#0284C7",
    TECH: "#8B5CF6",
    MINING: "#F97316",
    NATURE: "#059669"
  };

  const COUNTY_BLOC_COLORS = {
    NAIROBI: "#D97706",
    RIFT: "#059669",
    PWANI: "#0284C7",
    LAKE: "#6366F1",
    MT_KENYA: "#8B5CF6",
    FRONTIER: "#EA580C",
    SEKEB: "#10B981"
  };

  function initKenyaCountyExplorer() {
    if (typeof KENYA_47_COUNTIES_DATA === "undefined" || !countySelectDropdown) return;
    if (countySelectDropdown.options.length === 0) {
      countySelectDropdown.innerHTML = Object.values(KENYA_47_COUNTIES_DATA)
        .map((c) => `<option value="${c.code}">${c.icon} ${c.code} • ${c.name} (${c.sectorName}) - $${c.gcp2036T}T</option>`)
        .join("");

      countySelectDropdown.addEventListener("change", (e) => {
        selectKenyaCounty(e.target.value, false);
      });
    }

    if (countySelectDropdown) {
      countySelectDropdown.value = selectedCountyCode;
    }

    // Attach listeners for layer toggles if not already attached
    const tIcons = document.getElementById("toggleCountyIcons");
    if (tIcons && !tIcons._bound) {
      tIcons._bound = true;
      tIcons.addEventListener("change", (e) => {
        showCountyIcons = e.target.checked;
        renderKenyaCountyMap();
      });
    }
    const tCorridors = document.getElementById("toggleCountyCorridors");
    if (tCorridors && !tCorridors._bound) {
      tCorridors._bound = true;
      tCorridors.addEventListener("change", (e) => {
        showCountyCorridors = e.target.checked;
        renderKenyaCountyMap();
      });
    }
    const tLabels = document.getElementById("toggleCountyLabels");
    if (tLabels && !tLabels._bound) {
      tLabels._bound = true;
      tLabels.addEventListener("change", (e) => {
        showCountyLabels = e.target.checked;
        renderKenyaCountyMap();
      });
    }

    // Attach listeners for sector filter buttons in controls bar
    document.querySelectorAll("#kenyaCountyControlsBar [data-county-sector]").forEach((btn) => {
      if (!btn._bound) {
        btn._bound = true;
        btn.addEventListener("click", () => {
          document.querySelectorAll("#kenyaCountyControlsBar [data-county-sector]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          activeCountySector = btn.getAttribute("data-county-sector");
          renderKenyaCountyMap();
          renderKenyaCountiesTable(activeCountyBloc, countySearchQuery);
        });
      }
    });
  }

  function selectKenyaCounty(code, flyCamera = false) {
    if (typeof KENYA_47_COUNTIES_DATA === "undefined") return;
    const c = KENYA_47_COUNTIES_DATA[code] || KENYA_47_COUNTIES_DATA["047"];
    selectedCountyCode = c.code;

    if (countySelectDropdown) {
      countySelectDropdown.value = c.code;
    }

    document.querySelectorAll("[data-quick-county]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-quick-county") === c.code);
    });

    if (kenyaCountySvgMap) {
      kenyaCountySvgMap.querySelectorAll(".kenya-county-path").forEach((path) => {
        path.classList.toggle("active", path.getAttribute("data-county-code") === c.code);
      });
      kenyaCountySvgMap.querySelectorAll(".county-marker-group").forEach((grp) => {
        grp.classList.toggle("active", grp.getAttribute("data-county-code") === c.code);
      });
    }

    if (kenyaCountiesTableBody) {
      kenyaCountiesTableBody.querySelectorAll("tr").forEach((tr) => {
        tr.classList.toggle("selected", tr.getAttribute("data-county-code") === c.code);
      });
    }

    if (glMap && glMap.getLayer("kenya-counties-selected-outline")) {
      glMap.setFilter("kenya-counties-selected-outline", ["==", ["get", "code"], c.code]);
    }

    renderCountyDossier(c);
  }

  function renderCountyDossier(county) {
    if (!countryDossierCard || typeof KENYA_47_COUNTIES_DATA === "undefined") return;
    const c = county || KENYA_47_COUNTIES_DATA[selectedCountyCode] || KENYA_47_COUNTIES_DATA["047"];
    const secColor = SECTOR_COLORS[c.sector] || "#D97706";
    const countyList = Object.keys(KENYA_47_COUNTIES_DATA);
    const currIdx = countyList.indexOf(c.code);
    const prevCode = countyList[(currIdx - 1 + countyList.length) % countyList.length];
    const nextCode = countyList[(currIdx + 1) % countyList.length];

    const sectorCount = Object.values(KENYA_47_COUNTIES_DATA).filter((x) => x.sector === c.sector).length;
    const allocPct = ((c.alloc100BM / 100000) * 100).toFixed(1);

    countryDossierCard.innerHTML = `
      <div class="dossier-header" style="align-items: flex-start; gap: 0.75rem;">
        <div>
          <div class="kicker" style="color: ${secColor}; display: flex; align-items: center; gap: 0.4rem; font-weight: 800;">
            <span style="font-size: 1.1rem;">${c.icon}</span>
            <span>COUNTY ${c.code} • ${c.sectorName.toUpperCase()}</span>
          </div>
          <h3 class="dossier-country-title" style="margin-top: 0.2rem; font-size: 1.5rem;">🇰🇪 ${c.name} County</h3>
          <div style="font-size: 0.76rem; color: var(--ink-secondary); margin-top: 0.15rem;">
            ${KENYA_ECONOMIC_BLOCS[c.bloc]?.name || c.bloc} • Population: <strong>${c.pop2026M} Million</strong>
          </div>
        </div>
        <div style="text-align: right;">
          <span class="filter-pill active" style="border-color: ${secColor}; color: ${secColor}; font-weight: 800; font-size: 0.78rem;">
            $${(c.alloc100BM / 1000).toFixed(1)}B Allocated (${allocPct}%)
          </span>
        </div>
      </div>

      <!-- Visual Comparative Bar Gauges -->
      <div class="visual-gauges-container" style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; margin: 0.9rem 0;">
        <div style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 800; color: var(--ink-muted); text-transform: uppercase; margin-bottom: 0.75rem; letter-spacing: 0.05em; display: flex; justify-content: space-between;">
          <span>📊 ECONOMIC POTENTIAL GROWTH SPECTRUM:</span>
          <span style="color: ${secColor}; font-weight: 800;">${c.roleBadge}</span>
        </div>

        <!-- Meter 1: Current GCP (Now) -->
        <div style="margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.76rem; font-family: var(--font-mono); margin-bottom: 0.25rem;">
            <span style="color: var(--crimson); font-weight: 700;">🔴 1. Current GCP (KNBS Actual 2026):</span>
            <strong style="color: var(--crimson); font-size: 0.85rem;">$${c.gcp2026B.toFixed(1)} Billion</strong>
          </div>
          <div style="height: 10px; background: rgba(239, 68, 68, 0.15); border-radius: 999px; overflow: hidden;">
            <div style="width: ${Math.max(6, Math.min(100, (c.gcp2026B / 40) * 100))}%; height: 100%; background: linear-gradient(90deg, #EF4444, #DC2626); border-radius: 999px;"></div>
          </div>
        </div>

        <!-- Meter 2: Beyond Lomborg $100B Fund Investment -->
        <div style="margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.76rem; font-family: var(--font-mono); margin-bottom: 0.25rem;">
            <span style="color: #F59E0B; font-weight: 700;">🟡 2. Targeted $100B Fund Investment:</span>
            <strong style="color: #F59E0B; font-size: 0.85rem;">+$${(c.alloc100BM / 1000).toFixed(1)} Billion</strong>
          </div>
          <div style="height: 10px; background: rgba(245, 158, 11, 0.15); border-radius: 999px; overflow: hidden;">
            <div style="width: ${Math.max(8, Math.min(100, (c.alloc100BM / 14000) * 100))}%; height: 100%; background: linear-gradient(90deg, #F59E0B, #D97706); border-radius: 999px;"></div>
          </div>
        </div>

        <!-- Meter 3: Lost Economic Potential -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.76rem; font-family: var(--font-mono); margin-bottom: 0.25rem;">
            <span style="color: var(--emerald); font-weight: 700;">🟢 3. Lost Potential & Horizon:</span>
            <strong style="color: var(--emerald); font-size: 0.85rem;">$${c.gcp2036T.toFixed(2)} Trillion</strong>
          </div>
          <div style="height: 10px; background: rgba(16, 185, 129, 0.15); border-radius: 999px; overflow: hidden;">
            <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #10B981, #059669); border-radius: 999px; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);"></div>
          </div>
        </div>
      </div>

      <!-- 3 Visual Step Cards: NOW vs FIX vs MULTIPLIER -->
      <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem;">
        <!-- Card 1: What is done right now -->
        <div style="background: rgba(239, 68, 68, 0.05); border-left: 4px solid #EF4444; border-radius: var(--radius-sm); padding: 0.75rem 0.95rem;">
          <div style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 800; color: #DC2626; text-transform: uppercase; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.35rem;">
            <span>🛑</span> WHAT THIS COUNTY DOES NOW (ACTUAL ACTIVITY)
          </div>
          <div style="font-size: 0.84rem; line-height: 1.45; color: var(--ink-primary);">
            ${c.whatNow}
          </div>
        </div>

        <!-- Card 2: The $100B Beyond Lomborg Fix -->
        <div style="background: rgba(245, 158, 11, 0.06); border-left: 4px solid #F59E0B; border-radius: var(--radius-sm); padding: 0.75rem 0.95rem;">
          <div style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 800; color: #D97706; text-transform: uppercase; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.35rem;">
            <span>⚡</span> THE BEYOND LOMBORG $100B FIX (ACTIVITY UPGRADE)
          </div>
          <div style="font-size: 0.84rem; line-height: 1.45; color: var(--ink-primary);">
            ${c.theFix}
          </div>
        </div>

        <!-- Card 3: The Economic Multiplier Result -->
        <div style="background: rgba(16, 185, 129, 0.07); border-left: 4px solid #10B981; border-radius: var(--radius-sm); padding: 0.75rem 0.95rem;">
          <div style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 800; color: #059669; text-transform: uppercase; margin-bottom: 0.25rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span>🚀</span> THE ECONOMIC MULTIPLIER RESULT</span>
            <span style="background: #10B981; color: #fff; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.68rem; font-weight: 800;">${c.multiplier}</span>
          </div>
          <div style="font-size: 0.84rem; line-height: 1.45; color: var(--ink-primary);">
            ${c.superpower}
          </div>
        </div>
      </div>

      <!-- Quick Navigation Controls -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--border-hairline);">
        <button type="button" class="btn-outline" id="prevCountyBtn" style="font-size: 0.76rem; padding: 0.35rem 0.75rem;">
          ◀ Prev County
        </button>
        <button type="button" class="btn-outline" id="filterByThisSectorBtn" style="font-size: 0.76rem; padding: 0.35rem 0.75rem; color: ${secColor}; border-color: ${secColor}; font-weight: 700;">
          Focus: ${c.sectorName} (${sectorCount} Counties)
        </button>
        <button type="button" class="btn-outline" id="nextCountyBtn" style="font-size: 0.76rem; padding: 0.35rem 0.75rem;">
          Next County ▶
        </button>
      </div>
    `;

    // Bind navigation buttons
    const pBtn = document.getElementById("prevCountyBtn");
    if (pBtn) pBtn.addEventListener("click", () => selectKenyaCounty(prevCode, false));
    const nBtn = document.getElementById("nextCountyBtn");
    if (nBtn) nBtn.addEventListener("click", () => selectKenyaCounty(nextCode, false));
    const fBtn = document.getElementById("filterByThisSectorBtn");
    if (fBtn) {
      fBtn.addEventListener("click", () => {
        activeCountySector = c.sector;
        document.querySelectorAll("#kenyaCountyControlsBar [data-county-sector]").forEach((b) => {
          b.classList.toggle("active", b.getAttribute("data-county-sector") === c.sector);
        });
        renderKenyaCountyMap();
        renderKenyaCountiesTable(activeCountyBloc, countySearchQuery);
      });
    }
  }

  function renderKenyaCountyMap() {
    if (typeof KENYA_47_COUNTIES_DATA === "undefined" || !kenyaCountySvgMap) return;
    if (typeof KENYA_COUNTY_SVG_PATHS === "undefined") {
      console.warn("KENYA_COUNTY_SVG_PATHS not loaded yet");
      return;
    }

    kenyaCountySvgMap.innerHTML = "";
    kenyaCountySvgMap.setAttribute("viewBox", "0 0 780 930");

    // SVG Defs (Glow and drop-shadow filters)
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <filter id="countyGlowActive" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#F59E0B" flood-opacity="0.9" />
      </filter>
      <filter id="corridorGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="#0284C7" flood-opacity="0.8" />
      </filter>
    `;
    kenyaCountySvgMap.appendChild(defs);

    // 1. County Polygons Layer (Real official county boundary paths)
    const polygonsLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    polygonsLayer.setAttribute("class", "county-polygons-layer");

    for (const [code, pathObj] of Object.entries(KENYA_COUNTY_SVG_PATHS)) {
      const c = KENYA_47_COUNTIES_DATA[code];
      if (!c) continue;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathObj.d);
      path.setAttribute("data-county-code", code);

      const color = SECTOR_COLORS[c.sector] || "#D97706";
      const isSectorMatch = activeCountySector === "ALL" || c.sector === activeCountySector;
      const isBlocMatch = activeCountyBloc === "ALL" || c.bloc === activeCountyBloc;
      const isMatch = isSectorMatch && isBlocMatch;
      const isSelected = code === selectedCountyCode;

      path.setAttribute("class", `kenya-county-path ${isSelected ? "active" : ""} ${isMatch ? "" : "county-path-dimmed"}`);
      path.setAttribute("fill", color);
      path.setAttribute("fill-opacity", isMatch ? (isSelected ? "0.95" : "0.78") : "0.18");

      path.addEventListener("mouseenter", () => {
        if (mapFloatingTooltip) {
          mapFloatingTooltip.innerHTML = `
            <strong style="font-size: 0.9rem;">${c.icon} ${c.code} • ${c.name}</strong> (${c.sectorName})<br/>
            Current GCP: <strong style="color: var(--crimson);">$${c.gcp2026B}B</strong> ➔ $100B Fund: <strong style="color: #F59E0B;">+$${(c.alloc100BM / 1000).toFixed(1)}B</strong><br/>
            2036 Potential: <strong style="color: var(--emerald);">$${c.gcp2036T} Trillion</strong> • <em>${c.multiplier}</em>
          `;
        }
      });

      path.addEventListener("click", () => {
        selectKenyaCounty(code, false);
      });

      polygonsLayer.appendChild(path);
    }
    kenyaCountySvgMap.appendChild(polygonsLayer);

    // 2. Corridors Layer (Real coordinates for SGR, LAPSSET, Geothermal)
    if (showCountyCorridors) {
      const corridorsLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
      corridorsLayer.setAttribute("class", "county-corridors-layer");

      const corridors = [
        {
          name: "SGR & Northern Trade Corridor",
          color: "#0284C7",
          points: [[554, 841], [446, 777], [393, 682], [359, 607], [311, 610], [236, 536], [138, 514], [78, 463]]
        },
        {
          name: "LAPSSET Northern Gateway Corridor",
          color: "#F59E0B",
          points: [[644, 683], [561, 516], [430, 435], [321, 385], [206, 263]]
        },
        {
          name: "10 GW Rift Geothermal Energy Backbone",
          color: "#EAB308",
          points: [[206, 263], [224, 451], [236, 536], [318, 673]]
        }
      ];

      corridors.forEach((corr) => {
        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        poly.setAttribute("points", corr.points.map((p) => `${p[0]},${p[1]}`).join(" "));
        poly.setAttribute("fill", "none");
        poly.setAttribute("stroke", corr.color);
        poly.setAttribute("stroke-width", "3.2");
        poly.setAttribute("class", "county-corridor-animated");
        poly.setAttribute("filter", "url(#corridorGlow)");
        corridorsLayer.appendChild(poly);
      });

      kenyaCountySvgMap.appendChild(corridorsLayer);
    }

    // 3. Markers Layer (Pins, Icons & Labels at exact centroids)
    if (showCountyIcons || showCountyLabels) {
      const markersLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
      markersLayer.setAttribute("class", "county-markers-layer");

      for (const [code, c] of Object.entries(KENYA_47_COUNTIES_DATA)) {
        const isSectorMatch = activeCountySector === "ALL" || c.sector === activeCountySector;
        const isBlocMatch = activeCountyBloc === "ALL" || c.bloc === activeCountyBloc;
        const isMatch = isSectorMatch && isBlocMatch;
        const isSelected = code === selectedCountyCode;

        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", `county-marker-group ${isSelected ? "active" : ""} ${isMatch ? "" : "county-path-dimmed"}`);
        group.setAttribute("data-county-code", code);
        group.setAttribute("transform", `translate(${c.cx}, ${c.cy})`);

        const color = SECTOR_COLORS[c.sector] || "#D97706";

        if (showCountyIcons) {
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("r", isSelected ? "13" : "9.5");
          circle.setAttribute("class", "county-marker-circle");
          circle.setAttribute("fill", color);
          circle.setAttribute("fill-opacity", "0.92");
          circle.setAttribute("stroke", isSelected ? "#F59E0B" : "#FFFFFF");
          circle.setAttribute("stroke-width", isSelected ? "2.5" : "1.2");
          group.appendChild(circle);

          const iconText = document.createElementNS("http://www.w3.org/2000/svg", "text");
          iconText.setAttribute("class", "county-marker-icon");
          iconText.setAttribute("text-anchor", "middle");
          iconText.setAttribute("y", "0.5");
          iconText.textContent = c.icon;
          group.appendChild(iconText);
        }

        if (showCountyLabels) {
          const lblText = document.createElementNS("http://www.w3.org/2000/svg", "text");
          lblText.setAttribute("class", "county-marker-label");
          lblText.setAttribute("text-anchor", "middle");
          lblText.setAttribute("y", showCountyIcons ? "18" : "3");
          lblText.textContent = `${c.code} ${c.name}`;
          group.appendChild(lblText);
        }

        group.addEventListener("click", () => {
          selectKenyaCounty(code, false);
        });

        markersLayer.appendChild(group);
      }

      kenyaCountySvgMap.appendChild(markersLayer);
    }
  }

  function renderKenyaCountiesTable(filterBloc = "ALL", searchQuery = "") {
    if (typeof KENYA_47_COUNTIES_DATA === "undefined" || !kenyaCountiesTableBody) return;
    const counties = Object.values(KENYA_47_COUNTIES_DATA);
    const q = (searchQuery || "").trim().toLowerCase();

    const filtered = counties.filter((c) => {
      const matchSector = activeCountySector === "ALL" || c.sector === activeCountySector;
      const matchBloc = filterBloc === "ALL" || c.bloc === filterBloc;
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.includes(q) ||
        c.sectorName.toLowerCase().includes(q) ||
        c.roleBadge.toLowerCase().includes(q) ||
        c.whatNow.toLowerCase().includes(q) ||
        c.theFix.toLowerCase().includes(q);
      return matchSector && matchBloc && matchSearch;
    });

    kenyaCountiesTableBody.innerHTML = filtered
      .map((c) => {
        const isSelected = c.code === selectedCountyCode;
        const secColor = SECTOR_COLORS[c.sector] || "#D97706";
        return `
          <tr class="${isSelected ? "selected" : ""}" data-county-code="${c.code}">
            <td style="font-family: var(--font-mono); font-weight: 800; color: ${secColor};">${c.code}</td>
            <td style="font-weight: 800; white-space: nowrap;">${c.icon} ${c.name}</td>
            <td style="font-size: 0.74rem;">
              <span style="display: inline-block; padding: 0.15rem 0.45rem; border-radius: 4px; background: ${secColor}22; color: ${secColor}; font-weight: 700;">
                ${c.sectorName}
              </span>
            </td>
            <td style="font-family: var(--font-mono); font-size: 0.78rem;">${c.pop2026M}M</td>
            <td style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--crimson); font-weight: 800;">$${c.gcp2026B.toFixed(1)}B</td>
            <td style="font-family: var(--font-mono); font-size: 0.8rem; color: #F59E0B; font-weight: 800;">${c.gcpShouldBe2026B ? c.gcpShouldBe2026B.toFixed(1) : (c.gcp2026B * 8.68).toFixed(1)}B</td>
            <td style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--emerald); font-weight: 800;">+${((c.gcpShouldBe2026B || c.gcp2026B * 8.68) - c.gcp2026B).toFixed(1)}B</td>
            <td>
              <span style="display: inline-block; padding: 0.15rem 0.45rem; border-radius: 4px; background: rgba(16, 185, 129, 0.15); color: var(--emerald); font-weight: 800; font-size: 0.72rem;">
                ${c.multiplier}
              </span>
            </td>
            <td style="font-size: 0.76rem; max-width: 240px; line-height: 1.35;">${c.whatNow}</td>
            <td style="font-size: 0.76rem; max-width: 240px; line-height: 1.35; color: var(--cobalt);">${c.theFix}</td>
          </tr>
        `;
      })
      .join("");

    kenyaCountiesTableBody.querySelectorAll("tr").forEach((tr) => {
      tr.addEventListener("click", () => {
        const code = tr.getAttribute("data-county-code");
        if (code) {
          selectKenyaCounty(code, false);
        }
      });
    });
  }

  function renderKenyaBreakthroughEngines() {
    if (typeof KENYA_HOMEGROWN_ENGINES === "undefined" || !kenyaBreakthroughGrid) return;
    kenyaBreakthroughGrid.innerHTML = KENYA_HOMEGROWN_ENGINES.map((e) => `
      <div class="megacap-card" style="border-top-color: #D97706;">
        <div class="megacap-header">
          <div>
            <div class="kicker" style="color: #D97706;">ENGINE ${e.num} • ${e.kicker}</div>
            <h4 style="font-family: var(--font-serif); font-size: 1.15rem; margin: 0.2rem 0 0.5rem 0;">${e.title}</h4>
          </div>
        </div>
        <div style="font-size: 0.8rem; margin-bottom: 0.6rem;">
          <strong style="color: var(--crimson);">Bottleneck Broken:</strong> ${e.currentPain}
        </div>
        <div style="font-size: 0.8rem; margin-bottom: 0.6rem;">
          <strong style="color: var(--cobalt);">Lomborg Solution:</strong> ${e.lomborgSolution}
        </div>
        <div style="background: var(--emerald-soft); border-left: 3px solid var(--emerald); padding: 0.5rem 0.65rem; border-radius: var(--radius-sm); font-size: 0.8rem;">
          <strong style="color: var(--emerald);">Economic Compound:</strong> ${e.economicImpact}
        </div>
      </div>
    `).join("");
  }

  // Quick county pills click listener
  document.querySelectorAll("[data-quick-county]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.getAttribute("data-quick-county");
      selectKenyaCounty(code, false);
    });
  });

  // Table bloc filters in matrix section
  document.querySelectorAll("#kenyaCountiesMatrixSection [data-table-bloc]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#kenyaCountiesMatrixSection [data-table-bloc]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCountyBloc = btn.getAttribute("data-table-bloc");
      renderKenyaCountyMap();
      renderKenyaCountiesTable(activeCountyBloc, countySearchQuery);
    });
  });

  // Search input listener
  if (countySearchInput) {
    countySearchInput.addEventListener("input", (e) => {
      countySearchQuery = e.target.value;
      renderKenyaCountiesTable(activeCountyBloc, countySearchQuery);
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

    const isKenya = activeCountryScope === "kenya";
    const budgetLimit = isKenya ? 160.0 : MAX_BUDGET_B;
    const scaleFactor = isKenya ? (160.0 / 75.0) : 1.0;

    GLOBAL_INTERVENTIONS.forEach((item) => {
      if (selectedIds.has(item.id)) {
        const { benefitB } = getEffectiveMetrics(item);
        totalCost += item.costBillions;
        totalBenefit += benefitB;
        count++;
        if (!item.isWinner) hasDecoys = true;
      }
    });

    const scaledCost = +(totalCost * scaleFactor).toFixed(1);
    const scaledBenefit = +(totalBenefit * scaleFactor).toFixed(1);
    const remaining = +(budgetLimit - scaledCost).toFixed(1);
    const avgBcr = totalCost > 0 ? (totalBenefit / totalCost).toFixed(1) : "0.0";

    const optimalSurplusRef = 3649.0;
    const gdpUnlockedT = isKenya
      ? (totalCost === 0 ? 1.4 : +(1.4 + (totalBenefit / optimalSurplusRef) * (18.6 - 1.4)).toFixed(1))
      : (totalCost === 0 ? 8.2 : +(8.2 + (totalBenefit / optimalSurplusRef) * (145.0 - 8.2)).toFixed(1));

    simSpentDisplay.textContent = `$${scaledCost}B / $${budgetLimit}B`;
    simBenefitDisplay.textContent = `$${scaledBenefit.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}B`;
    simAvgBcrDisplay.textContent = `${avgBcr} : 1`;
    simRemainingDisplay.textContent = `$${gdpUnlockedT.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}T`;

    const pct = Math.min(100, Math.max(0, (scaledCost / budgetLimit) * 100));
    simProgressBar.style.width = `${pct}%`;

    if (scaledCost > budgetLimit) {
      simProgressBar.classList.add("over-warning");
      simVerdictText.innerHTML = `<strong style="color: var(--crimson);">⚠ Over Budget by $${Math.abs(
        remaining
      ).toFixed(
        1
      )}B!</strong> Deselect lower-BCR proposals to stay within the $${budgetLimit}B catalytic cap.`;
    } else {
      simProgressBar.classList.remove("over-warning");
      if (count === 16 && !hasDecoys && Math.abs(scaledCost - budgetLimit) < 0.6) {
        simVerdictText.innerHTML = isKenya
          ? `✓ <strong>Optimal Kenya Superhub Portfolio Active:</strong> Unlocks $${scaledBenefit.toLocaleString()}B surplus &amp; compounds into an <strong>$${gdpUnlockedT} Trillion</strong> Silicon Savannah economy.`
          : `✓ <strong>Optimal African Superpower Portfolio Active:</strong> Unlocks $${totalBenefit.toLocaleString()}B immediately &amp; compounds into a <strong>$${gdpUnlockedT} Trillion</strong> continental economy.`;
      } else if (hasDecoys) {
        simVerdictText.innerHTML = `<strong style="color: var(--amber);">Notice the Opportunity Cost:</strong> Funding unsequenced debt traps crowds out high-return biological, agricultural, and property-rights breakthroughs!`;
      } else if (totalCost === 0) {
        simVerdictText.innerHTML = isKenya
          ? `Status Quo ($0 allocated): Kenya lingers at ~$1.4T by 2036. Select high-BCR catalysts below to unlock the $18.6T Silicon Savannah trajectory.`
          : `Status Quo ($0 allocated): Africa lingers at ~$8.2T by 2036. Select high-BCR catalysts below to unlock the $145T superpower trajectory.`;
      } else {
        simVerdictText.innerHTML = `You have <strong>$${remaining.toFixed(
          1
        )}B</strong> remaining in your $${budgetLimit}B catalyst fund. Fund the highest Benefit-Cost Ratio levers first.`;
      }
    }

    simCountText.textContent = `${count} of ${GLOBAL_INTERVENTIONS.length} proposals funded`;
  }

  function renderInterventionsGrid() {
    interventionsGrid.innerHTML = "";

    const isKenya = activeCountryScope === "kenya";
    const scaleFactor = isKenya ? (8.2 / 75.0) : 1.0;

    const filtered = GLOBAL_INTERVENTIONS.filter((item) => {
      if (activeCategory === "ALL") return true;
      if (activeCategory === "WINNERS") return item.isWinner;
      return item.category === activeCategory;
    });

    filtered.forEach((item) => {
      const isSelected = selectedIds.has(item.id);
      const { bcr, benefitB } = getEffectiveMetrics(item);

      const cardCost = +(item.costBillions * scaleFactor).toFixed(1);
      const cardBenefit = +(benefitB * scaleFactor).toFixed(0);

      const card = document.createElement("article");
      card.className = `intervention-card ${isSelected ? "selected" : ""} ${
        !item.isWinner ? "decoy-card" : ""
      }`;

      const badgeClass = item.isWinner ? "winner" : "decoy";
      const badgeLabel = item.isWinner
        ? (isKenya ? `KENYA CATALYST #${item.rank}` : `AFRICA CATALYST #${item.rank}`)
        : `LOW-BCR TRAP #${item.rank}`;

      const bcrClass = bcr >= 15 ? "high-bcr" : bcr < 4 ? "low-bcr" : "";

      let cardImpact = item.drcRelevance;
      if (isKenya) {
        if (item.africaImpact && item.africaImpact.includes("Kenya")) {
          cardImpact = item.africaImpact;
        } else if (item.whyItWins && item.whyItWins.includes("Kenya")) {
          cardImpact = item.whyItWins;
        }
      }

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
              <span class="strip-val">$${cardCost}B${isKenya ? ' <span style="font-size:0.65rem;color:var(--ink-muted);">(Kenya)</span>' : ''}</span>
            </div>
            <div class="strip-item">
              <span class="strip-label">Benefit-Cost</span>
              <span class="strip-val ${bcrClass}">${bcr} : 1</span>
            </div>
            <div class="strip-item">
              <span class="strip-label">Direct Surplus</span>
              <span class="strip-val">$${Number(cardBenefit).toLocaleString()}B</span>
            </div>
          </div>

          <div class="card-Verdict-box">
            <strong>${isKenya ? "Kenya Impact:" : "Superpower Impact:"}</strong> ${cardImpact}
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
          <button type="button" class="why-pill-btn">ℹ️ Why?</button>
          <p class="btf-impact card-prose-collapse">${item.africaImpact}</p>
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
  // 7. GLOBAL SUPERPOWER OVERTAKE RACE (Current Baseline vs. Potential) — YEARLY ENGINE & CONTROLS
  // ==========================================================================
  let raceYear = 2036;
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
    const decades = [2026, 2036, 2046, 2056, 2066, 2036];
    let baseVal = d[2036];
    if (yr <= 2026) {
      baseVal = d[2026];
    } else if (yr < 2036) {
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

  function getActiveOvertakeBlocs() {
    return activeCountryScope === "kenya" && typeof OVERTAKE_RACE_BLOCS_KENYA !== "undefined"
      ? OVERTAKE_RACE_BLOCS_KENYA
      : OVERTAKE_RACE_BLOCS;
  }

  function getMilestoneMessage(yr) {
    const blocs = getActiveOvertakeBlocs();
    if (activeCountryScope === "kenya") {
      const hero = blocs.find((b) => b.isAfricaHero) || blocs[0];
      const kyGdp = interpolateBlocGdp(hero, yr).toFixed(2);
      if (yr <= 2030) {
        return `<strong>${yr} • Phase I: Health &amp; Education Shield (Yr ${yr - 2026}/50):</strong> Kenya redirects its <strong>$160B debt</strong> into Busia school deworming (60:1), Tusome EdTech (65:1), and maternal survival. Child stunting falls below 8%.`;
      } else if (yr <= 2035) {
        return `<strong>${yr} • Phase II: Geothermal &amp; Land Rights Tiger (Yr ${yr - 2026}/50):</strong> Kenya reaches <strong>$${kyGdp}T</strong>! ArdhiSasa digital titles unlock $48B+ dead capital, and 10 GW Olkaria/Menengai geothermal steam delivers $0.038/kWh clean baseload.`;
      } else if (yr <= 2040) {
        return `<strong>${yr} • OVERTAKE #1 (SOUTH AFRICA SURPASSED):</strong> 🇰🇪 <strong>Kenya ($${kyGdp}T) overtakes South Africa!</strong> Kenya becomes the #1 largest and most industrialized economy in Sub-Saharan Africa.`;
      } else if (yr <= 2046) {
        return `<strong>${yr} • OVERTAKE #2 (FRANCE SURPASSED):</strong> 🇰🇪 <strong>Kenya ($${kyGdp}T) overtakes France!</strong> Silicon Savannah AI compute clusters and Mombasa–DRC 24-hr transit corridors boom.`;
      } else if (yr <= 2048) {
        return `<strong>${yr} • OVERTAKE #3 (UNITED KINGDOM SURPASSED):</strong> 🇰🇪 <strong>Kenya ($${kyGdp}T) overtakes the UK!</strong> Former colonial ruler surpassed; Nairobi Securities Exchange reaches $10T+ market cap.`;
      } else if (yr <= 2056) {
        return `<strong>${yr} • OVERTAKE #4 (GERMANY SURPASSED):</strong> 🇰🇪 <strong>Kenya ($${kyGdp}T) overtakes Germany!</strong> Kenya firmly enters the World Top 10 economies with an educated workforce of 68M+ youth.`;
      } else {
        return `<strong>${yr} • SILICON SAVANNAH ECONOMIC TITAN (#5 ON EARTH):</strong> 🇰🇪 <strong>Kenya reaches $${kyGdp} Trillion!</strong> An Indian Ocean financial, geothermal, and AI powerhouse entering the Global Top 5.`;
      }
    }

    const afGdp = interpolateBlocGdp(blocs[0], yr).toFixed(1);
    const twinGdp = interpolateBlocGdp(blocs[1] || blocs[0], yr).toFixed(1);
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
    const blocs = getActiveOvertakeBlocs();
    if (!raceBarsContainer || !blocs) return;
    if (Object.keys(raceRowElements).length === blocs.length && raceRowElements[blocs[0].id]) return;

    raceBarsContainer.innerHTML = "";
    raceRowElements = {};
    raceBarsContainer.style.height = `${blocs.length * getRaceRowPitchPx() + 20}px`;
    blocs.forEach((bloc, idx) => {
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
            <span class="race-bloc-sub">Workforce 2036: ${bloc.workingAge2036} • Power: ${bloc.powerCostKwh.split(" ")[0]}</span>
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
    const blocs = getActiveOvertakeBlocs();
    if (!raceBarsContainer || !blocs) return;
    ensureRaceRowsCreated();

    if (raceYearBigDisplay) raceYearBigDisplay.textContent = raceYear;
    if (overtakeYearSlider) overtakeYearSlider.value = raceYear;

    document.querySelectorAll("[data-race-year]").forEach((btn) => {
      btn.classList.toggle(
        "active",
        parseInt(btn.getAttribute("data-race-year"), 10) === raceYear
      );
    });

    const computed = blocs.map((bloc) => ({
      ...bloc,
      currentGdpT: interpolateBlocGdp(bloc, raceYear),
      yoyPct: getBlocYoYGrowthPct(bloc, raceYear),
    })).sort((a, b) => b.currentGdpT - a.currentGdpT);

    const maxBarGdp = Math.max(computed[0].currentGdpT, activeCountryScope === "kenya" ? 6.0 : 32.0);

    if (raceMilestoneCallout) {
      const heroBloc = computed.find((b) => b.isAfricaHero) || computed[0];
      const statusQuoBloc = computed.find((b) => b.id.includes("status_quo")) || computed[computed.length - 1];
      const gainT = +(heroBloc.currentGdpT - statusQuoBloc.currentGdpT).toFixed(2);
      raceMilestoneCallout.innerHTML = `
        <div style="flex: 1; min-width: 0;">${getMilestoneMessage(raceYear)}</div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: var(--emerald); text-align: right;">
          <div>+${gainT}T ${activeCountryScope === "kenya" ? "Kenya" : "Lomborg"} Dividend vs. Trap</div>
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
        raceYear >= 2036 ? "▶ Replay Yearly Race" : "▶ Play Yearly Race";
    }
  }

  function startRacePlayback() {
    if (raceInterval) {
      clearInterval(raceInterval);
      raceInterval = null;
    }
    if (raceYear >= 2036) {
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
      if (raceYear >= 2036) {
        stopRacePlayback();
      }
    }, stepMs);
  }

  function renderOvertakeProofTable() {
    const blocs = getActiveOvertakeBlocs();
    if (!raceProofTableBody || !blocs) return;
    raceProofTableBody.innerHTML = blocs.map((b) => {
      const gdp2036Full = interpolateBlocGdp(b, 2036);
      const extraBoost = +(gdp2036Full - b.gdpByDecade[2036]).toFixed(1);
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
        };">$${gdp2036Full.toFixed(2)}T${boostBadge}</td>
        <td style="font-family: var(--font-mono);">${b.workingAge2036}</td>
        <td style="font-family: var(--font-mono);">${b.medianAge2036}</td>
        <td style="font-family: var(--font-mono);">${b.powerCostKwh}</td>
      </tr>
    `;
    }).join("");
  }

  function renderUntappedSectorsAndCoProsperity() {
    const sectorsGrid = document.getElementById("untappedSectorsGrid");
    const partnersGrid = document.getElementById("coProsperityPartnersGrid");
    const isKenya = activeCountryScope === "kenya";

    if (isKenya) {
      if (sectorsGrid && typeof KENYA_HOMEGROWN_ENGINES !== "undefined") {
        sectorsGrid.innerHTML = KENYA_HOMEGROWN_ENGINES.map((e) => `
          <div class="megacap-card" style="border-top: 3px solid #D97706;">
            <div>
              <div class="megacap-top">
                <span class="megacap-ticker" style="background-color: #D97706;">🇰🇪 ENGINE ${e.num}</span>
                <span class="megacap-cap" style="color: #D97706; font-size: 0.76rem;">${e.kicker}</span>
              </div>
              <div style="font-weight: 700; font-size: 0.94rem; margin-top: 0.45rem; line-height: 1.25;">
                ${e.title}
              </div>
            </div>
            <div style="font-size: 0.78rem; color: var(--crimson); margin-top: 0.4rem;">
              <strong>Bottleneck Broken:</strong> ${e.currentPain}
            </div>
            <div style="font-size: 0.78rem; color: var(--ink-primary); margin-top: 0.25rem;">
              <strong>The Fix:</strong> ${e.lomborgSolution}
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--emerald); font-weight: 700; border-top: 1px dashed var(--border-hairline); padding-top: 0.4rem; margin-top: 0.4rem;">
              🚀 Result: ${e.economicImpact}
            </div>
          </div>
        `).join("");
      }

      if (partnersGrid) {
        partnersGrid.innerHTML = `
          <div class="friedman-kpi-card" style="border-left-color: #0284C7;">
            <div class="friedman-kpi-label">🇺🇬 Great Lakes Neighbors (Uganda, Rwanda, DRC)</div>
            <div class="friedman-kpi-val" style="color: #0284C7;">-65% Transport Costs</div>
            <div class="friedman-kpi-sub">Mombasa &amp; Lamu 24-hr rail corridors cut landlocked freight times from 14 days to 48 hours.</div>
          </div>
          <div class="friedman-kpi-card" style="border-left-color: #10B981;">
            <div class="friedman-kpi-label">🌍 AfCFTA Inter-African Trade</div>
            <div class="friedman-kpi-val emerald">+$180B Annual Flow</div>
            <div class="friedman-kpi-sub">M-Pesa payment rails settle African trade instantly in local currencies without dollar shortages.</div>
          </div>
          <div class="friedman-kpi-card" style="border-left-color: #D97706;">
            <div class="friedman-kpi-label">🇪🇺 European &amp; US Industry</div>
            <div class="friedman-kpi-val" style="color: #D97706;">$0.038/kWh Clean Power</div>
            <div class="friedman-kpi-sub">Global AI server farms and green titanium buyers source zero-carbon products directly at Rift steam wellheads.</div>
          </div>
        `;
      }
      return;
    }

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
              <span class="megacap-cap">+$${s.gdp2036T.toFixed(1)}T GDP</span>
            </div>
            <div style="font-weight: 700; font-size: 0.94rem; margin-top: 0.45rem; line-height: 1.25;">
              ${s.name}
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.66rem; color: var(--ink-muted); margin-top: 0.2rem;">
              ${s.hubs}
            </div>
          </div>
          <button type="button" class="why-pill-btn">ℹ️ Why?</button>
          <p class="card-prose-collapse" style="font-size: 0.77rem; color: var(--ink-secondary); line-height: 1.45; margin: 0;">
            ${s.explanation}
          </p>
          <div style="font-family: var(--font-mono); font-size: 0.67rem; color: var(--emerald); font-weight: 700; border-top: 1px dashed var(--border-hairline); padding-top: 0.4rem;">
            2026: $${s.baseline2026B}B → 2036 Bourse Cap: $${s.bourse2036T.toFixed(
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
              <strong>2036 GDP:</strong> $${p.baseGdp2036T}T → <strong>$${(
            p.baseGdp2036T + p.coProsperityGdpBoostT
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
      raceYear = Math.min(2036, raceYear + 1);
      renderOvertakeRace(true);
    });
  }

  if (raceJumpEndBtn) {
    raceJumpEndBtn.addEventListener("click", () => {
      stopRacePlayback();
      raceYear = 2036;
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

    // 1. Real Output Y in 2036 (calibrated so 7.6%/yr = $145.0T, 2.6%/yr = $8.2T)
    const simGdp2036T = +(3.71 * Math.pow(1 + yPct / 100, 50)).toFixed(1);
    const clampedGdp2036T = Math.min(260.0, Math.max(4.5, simGdp2036T));

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
    const panAfricanMarketCapT = +(clampedGdp2036T * buffett).toFixed(1);
    const twinAxisMarketCapT = +(panAfricanMarketCapT * 0.506).toFixed(1);

    // 5. Gordon Growth Model P/E Multiple: P/E = (1 - retention) / (r - g)
    const gLongRun = Math.min(rPct - 1.4, Math.max(1.2, yPct * 0.45));
    const spreadRG = Math.max(1.8, rPct - gLongRun);
    const peMultiple = +(62.0 / spreadRG).toFixed(1);

    // 6. Sovereign 10-Yr Bond Yield & Global Central Bank Reserve Share
    const bondYield10Yr = Math.max(1.8, +(rPct * 0.5 + Math.max(0, inflationPct * 0.65)).toFixed(1));
    const reserveSharePct = Math.max(
      0.2,
      Math.min(52.0, +((clampedGdp2036T / 340.0) * 100 * (reerIndex / 365)).toFixed(1))
    );

    const reg =
      FRIEDMAN_CAPITAL_MARKETS_MODEL.regimes[activeFriedmanRegime] ||
      FRIEDMAN_CAPITAL_MARKETS_MODEL.regimes.sankoreFriedman;

    if (friedmanRegimeCallout) {
      friedmanRegimeCallout.style.borderLeftColor = isHyperInflation
        ? "var(--crimson)"
        : "var(--emerald)";
      friedmanRegimeCallout.innerHTML = `
        <div style="flex: 1; min-width: 0;">
          <div style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: ${
            isHyperInflation ? "var(--crimson)" : "var(--emerald)"
          };">${reg.badge}</div>
          <div style="margin-top: 0.2rem;"><strong>${reg.name}:</strong> ${reg.summary}</div>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; text-align: right;">
          <div>Friedman Identity: M(${mPct.toFixed(1)}%) · V = P(${inflationPct > 0 ? "+" : ""}${inflationPct}%) · Y(${yPct.toFixed(1)}%)</div>
          <div style="color: var(--emerald);">2036 Real Output (Y): $${clampedGdp2036T.toFixed(1)} Trillion</div>
        </div>
      `;
    }

    const isKenya = activeCountryScope === "kenya";

    if (isKenya) {
      const kenyaMarketCapT = +(18.6 * buffett).toFixed(1);
      const kCurrencyChange = 380;
      friedmanKpiGrid.innerHTML = `
        <div class="friedman-kpi-card">
          <div class="friedman-kpi-label">2036 Nairobi Securities Exchange (NSE)</div>
          <div class="friedman-kpi-val" style="color: var(--emerald);">$${kenyaMarketCapT}T</div>
          <div class="friedman-kpi-sub">${buffett.toFixed(2)}× Buffett Ratio on $18.6T Kenya GDP</div>
        </div>

        <div class="friedman-kpi-card gold">
          <div class="friedman-kpi-label">East Africa Trade Settlement Rails</div>
          <div class="friedman-kpi-val" style="color: #D97706;">$38.5T</div>
          <div class="friedman-kpi-sub">Nairobi–Mombasa–Lamu Indo-Pacific Corridor</div>
        </div>

        <div class="friedman-kpi-card">
          <div class="friedman-kpi-label">Kenyan Shilling (KES) Strength</div>
          <div class="friedman-kpi-val" style="color: var(--emerald);">+${kCurrencyChange}%</div>
          <div class="friedman-kpi-sub">KSh 24 per $1 USD • Property Rights &amp; Geothermal Surplus</div>
        </div>

        <div class="friedman-kpi-card">
          <div class="friedman-kpi-label">Friedman Annual Inflation (P)</div>
          <div class="friedman-kpi-val" style="color: var(--ink-primary);">1.8%/yr</div>
          <div class="friedman-kpi-sub">10-Yr Kenya Sovereign Bond Yield: <strong>2.8%</strong></div>
        </div>

        <div class="friedman-kpi-card">
          <div class="friedman-kpi-label">Gordon Growth P/E Multiple</div>
          <div class="friedman-kpi-val">${peMultiple}× P/E</div>
          <div class="friedman-kpi-sub">P = D₁/(r - g) • Low Sovereign Risk Discount</div>
        </div>

        <div class="friedman-kpi-card gold">
          <div class="friedman-kpi-label">FinTech &amp; Mobile Payment Share</div>
          <div class="friedman-kpi-val" style="color: #D97706;">42%</div>
          <div class="friedman-kpi-sub">🏆 #1 Mobile Financial Protocol on Earth</div>
        </div>
      `;

      if (sankoreExchangeTotalLabel) {
        sankoreExchangeTotalLabel.textContent = `Simulated 2036 Nairobi Securities Exchange (NSE) Market Cap: $${kenyaMarketCapT} Trillion`;
      }

      if (megacapTickerBoard) {
        const kMegas = (typeof FRIEDMAN_CAPITAL_MARKETS_MODEL !== "undefined" && FRIEDMAN_CAPITAL_MARKETS_MODEL.megacapsKenya) || [];
        megacapTickerBoard.innerHTML = kMegas.map((co) => `
          <div class="megacap-card">
            <div>
              <div class="megacap-top">
                <span class="megacap-ticker">$${co.ticker}</span>
                <span class="megacap-cap">$${co.baseCap2036T}T</span>
              </div>
              <div style="font-weight: 700; font-size: 0.94rem; margin-top: 0.45rem; line-height: 1.25;">
                ${co.name}
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--ink-muted); margin-top: 0.15rem;">
                ${co.hq} • ${co.sector}
              </div>
            </div>
            <button type="button" class="why-pill-btn">ℹ️ Why?</button>
            <p class="card-prose-collapse" style="font-size: 0.78rem; color: var(--ink-secondary); line-height: 1.45; margin: 0;">
              ${co.catalyst}
            </p>
            <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.68rem; color: var(--ink-muted); border-top: 1px dashed var(--border-hairline); padding-top: 0.4rem;">
              <span>2026: $${co.marketCap2026B}B</span>
              <span>P/E: ${peMultiple}×</span>
              <span>Div: ${co.divYield}</span>
            </div>
          </div>
        `).join("");
      }
      return;
    }

    friedmanKpiGrid.innerHTML = `
      <div class="friedman-kpi-card">
        <div class="friedman-kpi-label">2036 Pan-African Stock Market</div>
        <div class="friedman-kpi-val" style="color: var(--emerald);">$${panAfricanMarketCapT.toFixed(1)}T</div>
        <div class="friedman-kpi-sub">${buffett.toFixed(2)}× Buffett Ratio on $${clampedGdp2036T.toFixed(1)}T GDP (vs. $1.1T in 2026)</div>
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
      sankoreExchangeTotalLabel.textContent = `Simulated 2036 Continental Market Cap: $${panAfricanMarketCapT.toFixed(1)} Trillion`;
    }

    if (megacapTickerBoard) {
      const capScale = panAfricanMarketCapT / 261.0;
      megacapTickerBoard.innerHTML = FRIEDMAN_CAPITAL_MARKETS_MODEL.megacaps
        .map((co) => {
          const scaledCapT = +(co.baseCap2036T * capScale).toFixed(2);
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
              <button type="button" class="why-pill-btn">ℹ️ Why?</button>
              <p class="card-prose-collapse" style="font-size: 0.78rem; color: var(--ink-secondary); line-height: 1.45; margin: 0;">
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
  // 9. GLOBAL STOCK MARKET & CURRENCY OVERTAKE RACE (Current Baseline vs. Potential)
  // ==========================================================================
  let stockRaceYear = 2036;
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
    const decades = [2026, 2036, 2046, 2056, 2066, 2036];
    let baseVal = d[2036];
    if (yr <= 2026) {
      baseVal = d[2026];
    } else if (yr < 2036) {
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
      bloc.currencyReer2026 + (bloc.currencyReer2036 - bloc.currencyReer2026) * t
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
            <span class="race-bloc-sub stock-meta-sub">Cap/GDP: ${bloc.buffett2036} • FX REER: ${bloc.currencyReer2036}</span>
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
        <div style="flex: 1; min-width: 0;">${getStockRaceMilestoneMessage(stockRaceYear)}</div>
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
        subEl.textContent = `2036 Cap/GDP: ${bloc.buffett2036} • FX REER: ${bloc.currentReer} (${fxDiff >= 0 ? "+" : ""}${fxDiff}%)`;
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
        stockRaceYear >= 2036
          ? "▶ Replay Stock Market Race"
          : "▶ Play Stock Market Race";
    }
  }

  function startStockRacePlayback() {
    if (stockRaceInterval) {
      clearInterval(stockRaceInterval);
      stockRaceInterval = null;
    }
    if (stockRaceYear >= 2036) {
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
      if (stockRaceYear >= 2036) {
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
      stockRaceYear = Math.min(2036, stockRaceYear + 1);
      renderStockMarketRace(true);
    });
  }

  if (stockRaceJumpEndBtn) {
    stockRaceJumpEndBtn.addEventListener("click", () => {
      stopStockRacePlayback();
      stockRaceYear = 2036;
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

    // 2. Marginal Value Product of African Labor (2036 Annual Wage in $)
    const annualWage2036 = Math.min(
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
        <div style="flex: 1; min-width: 0;">
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
        <div class="friedman-kpi-val" style="color: var(--emerald);">$${annualWage2036.toLocaleString()}/yr</div>
        <div class="friedman-kpi-sub">2036 Avg African Skilled Wage (vs. $1,850/yr under Raw-Ore Trap)</div>
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
            <button type="button" class="why-pill-btn">ℹ️ Why?</button>
            <p class="card-prose-collapse" style="font-size: 0.78rem; color: var(--ink-secondary); line-height: 1.48; margin: 0;">
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
  // 11. HISTORICAL $3.33T AUDIT (ALL-AFRICA) & KENYA $161B LEAKY-PIPE VALVE GAME
  // ==========================================================================
  let activeAuditScope = "kenya"; // Exclusively Kenya // "africa" | "kenya"
  const valveStates = { graft: false, tiedAid: false, deadCapital: false };
  const sliderHistoricalRedirect = document.getElementById("sliderHistoricalRedirect");
  const valHistoricalRedirect = document.getElementById("valHistoricalRedirect");
  const auditSummaryBanner = document.getElementById("auditSummaryBanner");
  const auditComparisonGrid = document.getElementById("auditComparisonGrid");
  const auditChannelsGrid = document.getElementById("auditChannelsGrid");
  const applyCounterfactualBaseBtn = document.getElementById("applyCounterfactualBaseBtn");
  const snapAllValvesShutBtn = document.getElementById("snapAllValvesShutBtn");
  const openAllValvesLeakBtn = document.getElementById("openAllValvesLeakBtn");

  function syncValveCardsUI() {
    document.querySelectorAll(".valve-card").forEach((card) => {
      const vid = card.getAttribute("data-valve-id");
      const isLocked = !!valveStates[vid];
      card.classList.toggle("locked", isLocked);
      card.classList.toggle("leaking", !isLocked);
      const pill = card.querySelector(".valve-state-pill");
      const fill = card.querySelector(".valve-meter-fill");
      if (pill) {
        if (vid === "graft") {
          pill.textContent = isLocked
            ? "🔒 PLUGGED (Digital Bidding • $38 back per $1)"
            : "💔 LEAKING (-30% stolen in fake contracts)";
        } else if (vid === "tiedAid") {
          pill.textContent = isLocked
            ? "🔒 PLUGGED (Vaccines & Tablet Schools • Up to $101 back per $1)"
            : "💔 LEAKING (Foreign consultants & untreated malaria)";
        } else {
          pill.textContent = isLocked
            ? "🔒 PLUGGED (Land Titles & 2¢ Power • $55 back per $1)"
            : "💔 LEAKING (Unregistered land & expensive power)";
        }
      }
      if (fill) {
        fill.style.width = isLocked ? "100%" : "22%";
      }
    });
  }

  function renderHistoricalAudit() {
    if (
      typeof HISTORICAL_AUDIT_MODEL === "undefined" ||
      !auditComparisonGrid ||
      !sliderHistoricalRedirect
    ) {
      return;
    }

    syncValveCardsUI();

    const kenyaLedger = document.getElementById("kenyaExclusiveBorrowingLedger");
    if (kenyaLedger) {
      kenyaLedger.style.display = activeAuditScope === "kenya" ? "block" : "none";
    }

    const audit =
      HISTORICAL_AUDIT_MODEL[activeAuditScope] || HISTORICAL_AUDIT_MODEL.africa;
    const redirectPct = parseFloat(sliderHistoricalRedirect.value);
    // Benchmark target is 28% of capital redirected into Lomborg priorities
    const benchmarkTargetPct = 28.0;
    const progress = Math.max(0, Math.min(2.0, redirectPct / benchmarkTargetPct));
    const redirectedCapitalB = +(
      (audit.totalPublicCapitalB * redirectPct) /
      100
    ).toFixed(1);

    const bcrNum = activeAuditScope === "kenya" ? 54.2 : 48.7;

    if (valHistoricalRedirect) {
      valHistoricalRedirect.textContent = `${redirectPct}% Sequenced (${redirectedCapitalB.toLocaleString()}B @ ${bcrNum}:1)`;
    }

    // When redirectPct is 0, economy equals actual 2026 baseline exactly (no Infinity)
    const cfGdpT = redirectPct === 0
      ? audit.actual2026.gdpT
      : +(
          audit.actual2026.gdpT +
          (audit.counterfactualBase2026.gdpT - audit.actual2026.gdpT) *
            Math.pow(progress, 0.85)
        ).toFixed(2);

    const cfPerCapita = redirectPct === 0
      ? audit.actual2026.perCapitaUsd
      : Math.round(
          audit.actual2026.perCapitaUsd +
            (audit.counterfactualBase2026.perCapitaUsd -
              audit.actual2026.perCapitaUsd) *
              Math.pow(progress, 0.85)
        );

    const cfBourseT = redirectPct === 0
      ? audit.actual2026.bourseCapT
      : +(
          audit.actual2026.bourseCapT +
          (audit.counterfactualBase2026.bourseCapT - audit.actual2026.bourseCapT) *
            Math.pow(progress, 0.92)
        ).toFixed(2);

    const gdpLostGapT = +(cfGdpT - audit.actual2026.gdpT).toFixed(2);
    const gdpMultiple = (cfGdpT / audit.actual2026.gdpT).toFixed(1);

    const kesRate = redirectPct === 0
      ? 129
      : Math.max(14, Math.round(129 / Math.max(1, Math.pow(progress * 3.1, 0.72))));

    const cfCurrencyText =
      activeAuditScope === "kenya"
        ? redirectPct === 0
          ? "KSh 129 / $1 USD"
          : `KSh ${kesRate} / $1 USD`
        : `REER ${Math.round(100 + 240 * Math.pow(progress, 0.8))}`;

    if (auditSummaryBanner) {
      auditSummaryBanner.style.borderLeftColor =
        redirectPct < 5 ? "var(--crimson)" : "var(--emerald)";
      auditSummaryBanner.innerHTML = `
        <div style="flex: 1; min-width: 0;">
          <div style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: ${
            redirectPct < 5 ? "var(--crimson)" : "var(--emerald)"
          };">
            ${audit.flag} ${audit.name} • Total Received: ${audit.amountReceivedLabel || "$" + audit.totalPublicCapitalB + "B"}
          </div>
          <div style="font-weight: 700; font-size: 0.98rem; margin-top: 0.15rem;">
            ${
              redirectPct === 0
                ? `💔 All 3 Leaks Open: Economy stuck at ${
                    audit.actual2026.gdpT < 1
                      ? `$${Math.round(audit.actual2026.gdpT * 1000)}B`
                      : `$${audit.actual2026.gdpT}T`
                  }`
                : `🔒 Leaks Plugged: Economy reaches ${
                    cfGdpT < 1 ? `$${Math.round(cfGdpT * 1000)}B` : `$${cfGdpT}T`
                  } today (${gdpMultiple}× larger!)`
            }
          </div>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; text-align: right;">
          <div style="color: var(--emerald);">Wealth Lost to Leaks: +$${gdpLostGapT}T/year</div>
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

    const realityBarPct = Math.max(8, Math.round((audit.actual2026.gdpT / Math.max(0.2, cfGdpT)) * 100));
    const cfBarPct = Math.min(100, Math.max(12, Math.round((cfGdpT / audit.counterfactualBase2026.gdpT) * 92)));

    auditComparisonGrid.innerHTML = `
      <div class="friedman-kpi-card">
        <div class="friedman-kpi-label">2026 Economy Size (${gdpMultiple}× Bigger If Fixed)</div>
        <div class="friedman-kpi-val" style="color: var(--emerald);">${cfGdpDisplay}</div>
        <div class="split-meter-wrap">
          <div class="split-meter-row">
            <span style="width: 65px; color: var(--crimson);">With Leaks:</span>
            <div class="split-meter-bar-bg"><div class="split-meter-bar-fill" style="width: ${realityBarPct}%; background: var(--crimson);"></div></div>
            <span>${actGdpDisplay}</span>
          </div>
          <div class="split-meter-row">
            <span style="width: 65px; color: var(--emerald);">Plugged:</span>
            <div class="split-meter-bar-bg"><div class="split-meter-bar-fill" style="width: ${cfBarPct}%; background: var(--emerald);"></div></div>
            <strong>${cfGdpDisplay}</strong>
          </div>
        </div>
      </div>

      <div class="friedman-kpi-card gold">
        <div class="friedman-kpi-label">Annual Income Per Person</div>
        <div class="friedman-kpi-val" style="color: #D97706;">$${cfPerCapita.toLocaleString()}/yr</div>
        <div class="split-meter-wrap">
          <div class="split-meter-row">
            <span style="width: 65px; color: var(--crimson);">With Leaks:</span>
            <div class="split-meter-bar-bg"><div class="split-meter-bar-fill" style="width: 13%; background: var(--crimson);"></div></div>
            <span>$${audit.actual2026.perCapitaUsd.toLocaleString()}</span>
          </div>
          <div class="split-meter-row">
            <span style="width: 65px; color: var(--emerald);">Plugged:</span>
            <div class="split-meter-bar-bg"><div class="split-meter-bar-fill" style="width: ${cfBarPct}%; background: #D97706;"></div></div>
            <strong>$${cfPerCapita.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div class="friedman-kpi-card">
        <div class="friedman-kpi-label">Stock Market Wealth</div>
        <div class="friedman-kpi-val" style="color: var(--emerald);">${cfBourseDisplay}</div>
        <div class="split-meter-wrap">
          <div class="split-meter-row">
            <span style="width: 65px; color: var(--crimson);">With Leaks:</span>
            <div class="split-meter-bar-bg"><div class="split-meter-bar-fill" style="width: 6%; background: var(--crimson);"></div></div>
            <span>${actBourseDisplay}</span>
          </div>
          <div class="split-meter-row">
            <span style="width: 65px; color: var(--emerald);">Plugged:</span>
            <div class="split-meter-bar-bg"><div class="split-meter-bar-fill" style="width: ${cfBarPct}%; background: var(--emerald);"></div></div>
            <strong>${cfBourseDisplay}</strong>
          </div>
        </div>
      </div>

      <div class="friedman-kpi-card gold">
        <div class="friedman-kpi-label">Currency Value (Purchasing Power)</div>
        <div class="friedman-kpi-val" style="color: #D97706; font-size: 1.35rem;">${cfCurrencyText}</div>
        <div class="friedman-kpi-sub">
          <span style="color: var(--crimson);">Today with Leaks: ${audit.actual2026.currencyLabel}</span>
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
              <div style="font-weight: 700; font-size: 0.92rem; margin-top: 0.4rem; line-height: 1.25;">
                ${ch.title}
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.68rem; color: #D97706; font-weight: 700; margin-top: 0.15rem;">
                ${ch.multipleLabel}
              </div>
            </div>
            <button type="button" class="why-pill-btn">ℹ️ Why?</button>
            <p class="card-prose-collapse" style="font-size: 0.78rem; color: var(--ink-secondary); line-height: 1.48; margin: 0;">
              ${ch.leakageDiagnosis}
            </p>
          </div>
        `
        )
        .join("");
    }
  }

  function updateRedirectFromValves() {
    const audit =
      HISTORICAL_AUDIT_MODEL[activeAuditScope] || HISTORICAL_AUDIT_MODEL.africa;
    const lockedCount =
      (valveStates.graft ? 1 : 0) +
      (valveStates.tiedAid ? 1 : 0) +
      (valveStates.deadCapital ? 1 : 0);
    const pct = Math.round((audit.defaultRedirectPct / 3) * lockedCount);
    if (sliderHistoricalRedirect) sliderHistoricalRedirect.value = pct;
    renderHistoricalAudit();
  }

  document.querySelectorAll(".valve-card").forEach((card) => {
    card.addEventListener("click", () => {
      const vid = card.getAttribute("data-valve-id");
      valveStates[vid] = !valveStates[vid];
      updateRedirectFromValves();
    });
  });

  if (snapAllValvesShutBtn) {
    snapAllValvesShutBtn.addEventListener("click", () => {
      valveStates.graft = true;
      valveStates.tiedAid = true;
      valveStates.deadCapital = true;
      updateRedirectFromValves();
    });
  }

  if (openAllValvesLeakBtn) {
    openAllValvesLeakBtn.addEventListener("click", () => {
      valveStates.graft = false;
      valveStates.tiedAid = false;
      valveStates.deadCapital = false;
      updateRedirectFromValves();
    });
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
      const v = parseFloat(sliderHistoricalRedirect.value);
      valveStates.graft = v >= 8;
      valveStates.tiedAid = v >= 16;
      valveStates.deadCapital = v >= 24;
      renderHistoricalAudit();
    });
  }

  if (applyCounterfactualBaseBtn) {
    applyCounterfactualBaseBtn.addEventListener("click", () => {
      counterfactual2026BaseActive = !counterfactual2026BaseActive;
      applyCounterfactualBaseBtn.textContent = counterfactual2026BaseActive
        ? "✓ $28.4T 2026 Base Active (Click to Reset)"
        : "🚀 Race From $28.4T 2026 Base";
      raceYear = 2026;
      prevBlocRanks = {};
      renderOvertakeRace(false);
      renderOvertakeProofTable();
      if (typeof window.goToUxStep === "function") {
        window.goToUxStep("3", true);
      } else {
        const raceSec = document.getElementById("overtake-race");
        if (raceSec) {
          raceSec.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  // ==========================================================================
  // 12. HERO 4-DIAL EQUALIZER, VISUAL MODE TOGGLE & 45s AUTO-TOUR
  // ==========================================================================
  const eqDialBiology = document.getElementById("eqDialBiology");
  const eqDialEdtech = document.getElementById("eqDialEdtech");
  const eqDialPowerTrade = document.getElementById("eqDialPowerTrade");
  const eqDialSuperSectors = document.getElementById("eqDialSuperSectors");
  const valEqBiology = document.getElementById("valEqBiology");
  const valEqEdtech = document.getElementById("valEqEdtech");
  const valEqPowerTrade = document.getElementById("valEqPowerTrade");
  const valEqSuperSectors = document.getElementById("valEqSuperSectors");
  const eqScoreGdp = document.getElementById("eqScoreGdp");
  const eqScoreBourse = document.getElementById("eqScoreBourse");
  const eqScoreOvertakeYr = document.getElementById("eqScoreOvertakeYr");
  const eqScoreCurrency = document.getElementById("eqScoreCurrency");
  const eqVerdictTitle = document.getElementById("eqVerdictTitle");
  const eqBarStunting = document.getElementById("eqBarStunting");
  const eqBarPower = document.getElementById("eqBarPower");
  const eqBarTwinAxis = document.getElementById("eqBarTwinAxis");
  const eqBarCoProsperity = document.getElementById("eqBarCoProsperity");
  const eqPresetMaxBtn = document.getElementById("eqPresetMaxBtn");
  const eqPresetTrapBtn = document.getElementById("eqPresetTrapBtn");

  function renderMasterEqualizer() {
    if (!eqDialBiology) return;
    const b = parseFloat(eqDialBiology.value) / 100;
    const e = parseFloat(eqDialEdtech.value) / 100;
    const p = parseFloat(eqDialPowerTrade.value) / 100;
    const s = parseFloat(eqDialSuperSectors.value) / 100;

    if (valEqBiology) valEqBiology.textContent = `${Math.round(b * 100)}%`;
    if (valEqEdtech) valEqEdtech.textContent = `${Math.round(e * 100)}%`;
    if (valEqPowerTrade) valEqPowerTrade.textContent = `${Math.round(p * 100)}%`;
    if (valEqSuperSectors) valEqSuperSectors.textContent = `${Math.round(s * 100)}%`;

    const coreComposite = b * 0.35 + e * 0.32 + p * 0.33;
    const isKenya = activeCountryScope === "kenya";

    let gdp2036, bourse2036, fxGainPct, overtakeText, verdictText, stuntingText, powerText, twinText, worldText;

    if (isKenya) {
      gdp2036 = +(1.4 + 13.8 * Math.pow(coreComposite, 1.35) + 3.4 * s * coreComposite).toFixed(1);
      bourse2036 = +(gdp2036 * (1.15 + 0.15 * coreComposite)).toFixed(1);
      fxGainPct = Math.round(-30 + 410 * coreComposite);
      overtakeText = gdp2036 >= 5.0 ? "Year 2048 (Passes UK & France)" : "Never (Trap)";
      verdictText = coreComposite >= 0.75
        ? "🏆 Top 10 Global Economy & Tech Hub"
        : coreComposite >= 0.35
        ? "⚡ Emerging African Tiger"
        : "⚠️ Trapped in Debt & Tender Graft";
      stuntingText = `${(24.0 - 22.8 * b).toFixed(1)}% Stunting`;
      powerText = `$${(0.19 - 0.152 * p).toFixed(3)} / kWh (Olkaria Geothermal)`;
      twinText = `$${gdp2036}T Kenya Superhub`;
      worldText = `+$${(4.8 * coreComposite).toFixed(1)}T Regional Boost`;
    } else {
      gdp2036 = +(
        8.2 +
        136.8 * Math.pow(coreComposite, 1.35) +
        38.5 * s * coreComposite
      ).toFixed(1);
      const buffettMult = 0.3 + 1.5 * Math.pow(p * 0.6 + e * 0.4, 1.1);
      bourse2036 = +(gdp2036 * buffettMult).toFixed(1);
      fxGainPct = Math.round(-55 + 320 * coreComposite);
      const twinGdp = +(gdp2036 * 0.484).toFixed(1);
      const worldBoost = +(42.0 * coreComposite).toFixed(1);

      overtakeText = "Never (Trap)";
      if (gdp2036 >= 65) {
        const yr = Math.round(2074 - 23 * coreComposite - 3 * s);
        overtakeText = `Year ${Math.max(2049, Math.min(2075, yr))}`;
      }
      verdictText = coreComposite >= 0.75
        ? "🏆 #1 Economy & #1 Currency in History"
        : coreComposite >= 0.35
        ? "⚡ Emerging Industrial Continent"
        : "⚠️ Stuck in 1324 Raw-Ore Export Trap";
      stuntingText = `${(30.5 - 29.3 * b).toFixed(1)}% Stunting`;
      powerText = `$${(0.2 - 0.182 * p).toFixed(3)} / kWh`;
      twinText = `$${twinGdp}T GDP`;
      worldText = `+$${worldBoost}T Global Boost`;
    }

    if (eqScoreGdp) eqScoreGdp.textContent = `$${gdp2036}T`;
    if (eqScoreBourse) eqScoreBourse.textContent = `$${bourse2036}T`;
    if (eqScoreOvertakeYr) eqScoreOvertakeYr.textContent = overtakeText;
    if (eqScoreCurrency) {
      eqScoreCurrency.textContent = `${fxGainPct >= 0 ? "+" : ""}${fxGainPct}%`;
    }
    if (eqVerdictTitle) {
      eqVerdictTitle.textContent = verdictText;
    }
    if (eqBarStunting) {
      eqBarStunting.textContent = stuntingText;
    }
    if (eqBarPower) {
      eqBarPower.textContent = powerText;
    }
    if (eqBarTwinAxis) {
      eqBarTwinAxis.textContent = twinText;
    }
    if (eqBarCoProsperity) {
      eqBarCoProsperity.textContent = worldText;
    }
  }

  [eqDialBiology, eqDialEdtech, eqDialPowerTrade, eqDialSuperSectors].forEach(
    (dl) => {
      if (dl) dl.addEventListener("input", renderMasterEqualizer);
    }
  );

  if (eqPresetMaxBtn) {
    eqPresetMaxBtn.addEventListener("click", () => {
      if (eqDialBiology) eqDialBiology.value = 100;
      if (eqDialEdtech) eqDialEdtech.value = 100;
      if (eqDialPowerTrade) eqDialPowerTrade.value = 100;
      if (eqDialSuperSectors) eqDialSuperSectors.value = 100;
      eqPresetMaxBtn.classList.add("active");
      if (eqPresetTrapBtn) eqPresetTrapBtn.classList.remove("active");
      renderMasterEqualizer();
    });
  }

  if (eqPresetTrapBtn) {
    eqPresetTrapBtn.addEventListener("click", () => {
      if (eqDialBiology) eqDialBiology.value = 0;
      if (eqDialEdtech) eqDialEdtech.value = 0;
      if (eqDialPowerTrade) eqDialPowerTrade.value = 0;
      if (eqDialSuperSectors) eqDialSuperSectors.value = 0;
      eqPresetTrapBtn.classList.add("active");
      if (eqPresetMaxBtn) eqPresetMaxBtn.classList.remove("active");
      renderMasterEqualizer();
    });
  }

  // Global "[ℹ️ Why?]" pill click handler & Visual Mode toggle
  document.addEventListener("click", (e) => {
    const whyBtn = e.target.closest(".why-pill-btn");
    if (whyBtn) {
      const parent = whyBtn.parentElement;
      const prose = parent && parent.querySelector(".card-prose-collapse");
      if (prose) {
        const isExp = prose.classList.toggle("expanded");
        whyBtn.textContent = isExp ? "✕ Hide" : "ℹ️ Why?";
      }
    }
  });

  const toggleTextModeBtn = document.getElementById("toggleTextModeBtn");
  if (toggleTextModeBtn) {
    toggleTextModeBtn.addEventListener("click", () => {
      const html = document.documentElement;
      const cur = html.getAttribute("data-visual-mode");
      const next = cur === "compact" ? "full" : "compact";
      html.setAttribute("data-visual-mode", next);
      toggleTextModeBtn.textContent =
        next === "compact" ? "📖 Show Text" : "⚡ Visual Mode";
    });
  }

  // ==========================================================================
  // 13. COUNTRY SCOPE NAVBAR & 4-STEP GUIDED INTERACTIVE WIZARD
  // ==========================================================================

  // ==========================================================================
  // OAG (AUDITOR-GENERAL) FORENSIC INVESTIGATION CONTROLLER (KENYA STEP 3)
  // ==========================================================================
  const oagAuditState = {
    pendingBills: false,
    debtChoke: false,
    deadLand: false,
    thermalIpp: false,
    portDelays: false,
  };

  const OAG_CURE_SPECS = {
    pendingBills: {
      capitalB: 4.2,
      annualTaxB: 45,
      gdpBoostB: 95,
      curePill: "🔒 TSA + MILESTONE ESCROW",
      leakPill: "💔 UNVERIFIED PENDING BILLS",
      cureBtn: "✓ Cure Enforced (TSA Escrow Active)",
      leakBtn: "🔒 Enforce Cure (Plug $4.2B Leak)",
    },
    debtChoke: {
      capitalB: 12.5,
      annualTaxB: 210,
      gdpBoostB: 340,
      curePill: "🔒 DEBT-FOR-PRODUCTIVITY SWAP",
      leakPill: "💔 65% REVENUE CHOKE",
      cureBtn: "✓ Cure Enforced (Commercial Rollover Halted)",
      leakBtn: "🔒 Enforce Cure (Halt Commercial Rollover)",
    },
    deadLand: {
      capitalB: 65.0,
      annualTaxB: 65,
      gdpBoostB: 380,
      curePill: "🔒 ARDHISASA DIGITAL TITLES",
      leakPill: "💔 DEAD PAPER CAPITAL",
      cureBtn: "✓ Cure Enforced (ArdhiSasa Active)",
      leakBtn: "🔒 Enforce Cure (Unlock $65B Land Collateral)",
    },
    thermalIpp: {
      capitalB: 1.8,
      annualTaxB: 32,
      gdpBoostB: 140,
      curePill: "🔒 4¢ OLKARIA BASELOAD POWER",
      leakPill: "💔 KSh 32B/YR IDLE CAPACITY",
      cureBtn: "✓ Cure Enforced (Thermal IPPs Decommissioned)",
      leakBtn: "🔒 Enforce Cure (Decommission Thermal IPPs)",
    },
    portDelays: {
      capitalB: 18.0,
      annualTaxB: 28,
      gdpBoostB: 85,
      curePill: "🔒 24-HR SINGLE WINDOW AI CUSTOMS",
      leakPill: "💔 18-SIGNATURE DELAYS",
      cureBtn: "✓ Cure Enforced (24-Hr Port Automated)",
      leakBtn: "🔒 Enforce Cure (Automate 24-Hr Port)",
    },
  };

  function updateOagDashboard() {
    let recoveredCapB = 0;
    let savedTaxKshB = 0;
    let boostGdpB = 0;
    let curedCount = 0;

    Object.keys(oagAuditState).forEach((key) => {
      const isCured = oagAuditState[key];
      const spec = OAG_CURE_SPECS[key];
      if (!spec) return;
      if (isCured) {
        curedCount++;
        recoveredCapB += spec.capitalB;
        savedTaxKshB += spec.annualTaxB;
        boostGdpB += spec.gdpBoostB;
      }

      const pill = document.querySelector(`[data-status-for="${key}"]`);
      if (pill) {
        pill.textContent = isCured ? spec.curePill : spec.leakPill;
        pill.style.background = isCured ? "rgba(16, 185, 129, 0.15)" : "rgba(220, 38, 38, 0.15)";
        pill.style.color = isCured ? "var(--emerald)" : "var(--crimson)";
      }

      const btn = document.querySelector(`[data-oag-toggle="${key}"]`);
      if (btn) {
        btn.textContent = isCured ? spec.cureBtn : spec.leakBtn;
        btn.style.background = isCured ? "var(--emerald)" : "var(--bg-tertiary)";
        btn.style.color = isCured ? "#FFFFFF" : "var(--ink-pure)";
        btn.style.borderColor = isCured ? "var(--emerald)" : "var(--border-subtle)";
      }
    });

    const capEl = document.getElementById("oagRecoveredCapital");
    const capSubEl = document.getElementById("oagRecoveredSub");
    const taxEl = document.getElementById("oagAnnualTaxSaved");
    const gdpEl = document.getElementById("oagKenyaGdpProjected");
    const gdpSubEl = document.getElementById("oagKenyaGdpSub");

    if (capEl) capEl.textContent = `$${recoveredCapB.toFixed(1)} Billion`;
    if (capSubEl) capSubEl.textContent = `${curedCount} of 5 Cures Enforced`;
    if (taxEl) taxEl.textContent = `+KSh ${savedTaxKshB} Billion / yr`;

    const projectedGdpB = 136 + boostGdpB;
    if (gdpEl) {
      if (curedCount === 0) {
        gdpEl.textContent = "$136B (Current Stagnation)";
        gdpEl.style.color = "var(--ink-pure)";
      } else if (curedCount === 5) {
        gdpEl.textContent = "$1.18 Trillion (Tiger Unleashed!)";
        gdpEl.style.color = "var(--emerald)";
      } else {
        gdpEl.textContent = `$${(projectedGdpB / 1000).toFixed(2)}T (${projectedGdpB}B)`;
        gdpEl.style.color = "var(--emerald)";
      }
    }

    if (gdpSubEl) {
      const lostPotentialB = 1180 - projectedGdpB;
      if (lostPotentialB <= 0) {
        gdpSubEl.textContent = "✓ 100% Potential Recovered!";
        gdpSubEl.style.color = "var(--emerald)";
      } else {
        gdpSubEl.textContent = `-$${lostPotentialB}B Lost Potential Remaining`;
        gdpSubEl.style.color = "var(--crimson)";
      }
    }
  }

  
  // ==========================================================================
  // KENYA $160B FORENSIC LOAN LEDGER & CAPITAL FLOW CONTROLLER
  // ==========================================================================
  let activeLoanFilter = 'all';
  let activeLoanSearch = '';

  function openLoanAuditModal(loanId) {
    if (typeof KENYA_160B_LOAN_LEDGER === 'undefined') return;
    const loan = KENYA_160B_LOAN_LEDGER.find((l) => l.id === loanId);
    if (!loan) return;

    const modal = document.getElementById('forensicLoanModal');
    const modalBadge = document.getElementById('modalCategoryBadge');
    const modalTitle = document.getElementById('modalLoanTitle');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalBody) return;

    if (modalBadge) {
      modalBadge.className = 'status-badge ' + loan.statusBadgeClass;
      modalBadge.textContent = loan.statusBadge;
    }
    if (modalTitle) {
      modalTitle.textContent = loan.name;
    }

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 1.15rem; background: var(--bg-primary); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-hairline);">
        <div>
          <span style="font-size: 0.65rem; font-family: var(--font-mono); color: var(--ink-muted); text-transform: uppercase;">Amount Borrowed</span>
          <div style="font-family: var(--font-mono); font-size: 1.25rem; font-weight: 800; color: #D97706;">$${loan.amountUsdB.toFixed(2)} Billion</div>
          <span style="font-size: 0.72rem; color: var(--ink-secondary);">Approx. KSh ${loan.amountKshB.toLocaleString()} Billion</span>
        </div>
        <div>
          <span style="font-size: 0.65rem; font-family: var(--font-mono); color: var(--ink-muted); text-transform: uppercase;">Year & Execution Date</span>
          <div style="font-size: 0.95rem; font-weight: 700; color: var(--ink-pure);">${loan.yearBorrowed}</div>
          <span style="font-size: 0.72rem; color: var(--ink-secondary);">${loan.categoryLabel}</span>
        </div>
        <div>
          <span style="font-size: 0.65rem; font-family: var(--font-mono); color: var(--ink-muted); text-transform: uppercase;">Lender & Lead Arrangers</span>
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--ink-pure);">${loan.lender}</div>
          <span style="font-size: 0.72rem; color: var(--ink-muted);">Terms: ${loan.interestRate}</span>
        </div>
      </div>

      <div style="margin-bottom: 1.15rem;">
        <h4 style="margin: 0 0 0.35rem; font-size: 0.92rem; font-weight: 800; color: #475569; text-transform: uppercase;">
          1. Official Stated Objective &amp; Promised Development Return
        </h4>
        <div style="background: rgba(100, 116, 139, 0.08); border-left: 4px solid #64748B; padding: 0.85rem; border-radius: 4px; font-size: 0.85rem; line-height: 1.55;">
          ${loan.statedPurpose}
        </div>
      </div>

      <div style="margin-bottom: 1.15rem;">
        <h4 style="margin: 0 0 0.35rem; font-size: 0.92rem; font-weight: 800; color: var(--crimson); text-transform: uppercase;">
          2. Forensic Audit Findings by ${loan.auditorGeneral}
        </h4>
        <div style="background: rgba(220, 38, 38, 0.08); border-left: 4px solid var(--crimson); padding: 0.85rem; border-radius: 4px; font-size: 0.85rem; line-height: 1.55;">
          <p style="margin: 0 0 0.5rem; font-weight: 600; color: var(--ink-pure);">${loan.actualOutcome}</p>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted); border-top: 1px solid var(--border-hairline); padding-top: 0.4rem; margin-top: 0.4rem;">
            🏛️ <strong>Official Parliamentary & OAG Citation:</strong> ${loan.oagCitation}
          </div>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <h4 style="margin: 0 0 0.35rem; font-size: 0.92rem; font-weight: 800; color: var(--emerald); text-transform: uppercase;">
          3. Beyond Lomborg Copenhagen Consensus Counterfactual Alternative
        </h4>
        <div style="background: rgba(16, 185, 129, 0.08); border-left: 4px solid var(--emerald); padding: 0.85rem; border-radius: 4px; font-size: 0.85rem; line-height: 1.55;">
          ${loan.beyondLomborgAlternative}
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border-hairline); padding-top: 0.85rem;">
        <button type="button" class="btn-outline" id="modalDismissBtn" style="padding: 0.45rem 1rem;">Close Dossier</button>
        <button type="button" class="btn-primary" id="modalCureLinkBtn" style="padding: 0.45rem 1rem;">
          ⚡ Go to Step 3 (Test Forensic Cures) →
        </button>
      </div>
    `;

    modal.style.display = 'flex';

    const dismissBtn = document.getElementById('modalDismissBtn');
    if (dismissBtn) {
      dismissBtn.onclick = () => { modal.style.display = 'none'; };
    }

    const cureLinkBtn = document.getElementById('modalCureLinkBtn');
    if (cureLinkBtn) {
      cureLinkBtn.onclick = () => {
        modal.style.display = 'none';
        const step3Tab = document.querySelector('[data-step-btn="3"]');
        if (step3Tab) step3Tab.click();
      };
    }
  }

  function renderForensicLoanLedger() {
    if (typeof KENYA_160B_LOAN_LEDGER === 'undefined') return;

    const grid = document.getElementById('forensicLoansGrid');
    if (!grid) return;

    const query = (activeLoanSearch || '').toLowerCase().trim();

    const filtered = KENYA_160B_LOAN_LEDGER.filter((loan) => {
      // Category filter check
      let categoryMatch = false;
      if (activeLoanFilter === 'all') {
        categoryMatch = true;
      } else if (loan.category === activeLoanFilter) {
        categoryMatch = true;
      } else if (loan.capitalFlowCategory === activeLoanFilter) {
        categoryMatch = true;
      }

      if (!categoryMatch) return false;

      // Text query check
      if (!query) return true;
      return (
        loan.name.toLowerCase().includes(query) ||
        loan.lender.toLowerCase().includes(query) ||
        loan.statedPurpose.toLowerCase().includes(query) ||
        loan.actualOutcome.toLowerCase().includes(query) ||
        loan.auditorGeneral.toLowerCase().includes(query) ||
        loan.oagCitation.toLowerCase().includes(query) ||
        loan.beyondLomborgAlternative.toLowerCase().includes(query) ||
        loan.statusBadge.toLowerCase().includes(query) ||
        loan.categoryLabel.toLowerCase().includes(query)
      );
    });

    // Update count & totals
    const countEl = document.getElementById('visibleLoanCount');
    const usdEl = document.getElementById('visibleLoanUsdTotal');
    const kshEl = document.getElementById('visibleLoanKshTotal');

    const totalUsd = filtered.reduce((acc, l) => acc + l.amountUsdB, 0);
    const totalKsh = filtered.reduce((acc, l) => acc + l.amountKshB, 0);

    if (countEl) countEl.textContent = filtered.length;
    if (usdEl) usdEl.textContent = `$${totalUsd.toFixed(1)} Billion`;
    if (kshEl) kshEl.textContent = `KSh ${Math.round(totalKsh).toLocaleString()}B`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--ink-secondary);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
          <div style="font-size: 1rem; font-weight: 700;">No matching forensic loan dossiers found</div>
          <div style="font-size: 0.8rem; margin-top: 0.35rem;">Try clearing the search box or selecting "All 10 Packages" above.</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map((loan) => {
        return `
          <div class="forensic-loan-card" data-loan-id="${loan.id}">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div>
                  <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--ink-muted); text-transform: uppercase;">
                    ${loan.categoryLabel} • ${loan.yearBorrowed}
                  </span>
                </div>
                <span class="status-badge ${loan.statusBadgeClass}">${loan.statusBadge}</span>
              </div>

              <h4 style="margin: 0 0 0.5rem; font-size: 0.98rem; font-weight: 800; color: var(--ink-pure); line-height: 1.35;">
                ${loan.name}
              </h4>

              <div class="loan-financial-box">
                <div class="loan-fin-item">
                  <span class="loan-fin-label">Loan Amount</span>
                  <span class="loan-fin-val">$${loan.amountUsdB.toFixed(2)}B <span style="font-size: 0.72rem; color: var(--ink-secondary); font-weight: normal;">(KSh ${loan.amountKshB.toLocaleString()}B)</span></span>
                </div>
                <div class="loan-fin-item">
                  <span class="loan-fin-label">Interest / Terms</span>
                  <span class="loan-fin-val" style="font-size: 0.78rem; color: var(--ink-pure); line-height: 1.25;">${loan.interestRate}</span>
                </div>
              </div>

              <div style="font-size: 0.72rem; color: var(--ink-muted); margin-bottom: 0.6rem;">
                <strong>Lender:</strong> ${loan.lender}
              </div>

              <div class="loan-comparison-split">
                <div class="loan-split-box loan-promise-box">
                  <div style="font-family: var(--font-mono); font-size: 0.64rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 0.2rem;">
                    📋 Stated Development Promise
                  </div>
                  <div>${loan.statedPurpose}</div>
                </div>

                <div class="loan-split-box loan-reality-box">
                  <div style="font-family: var(--font-mono); font-size: 0.64rem; font-weight: 700; color: var(--crimson); text-transform: uppercase; margin-bottom: 0.2rem;">
                    🔍 Official Auditor-General Finding
                  </div>
                  <div>${loan.actualOutcome}</div>
                  <div style="margin-top: 0.35rem; font-size: 0.68rem; color: var(--ink-muted); font-style: italic;">
                    Source: ${loan.oagCitation}
                  </div>
                </div>

                <div class="loan-split-box loan-lomborg-box">
                  <div style="font-family: var(--font-mono); font-size: 0.64rem; font-weight: 700; color: var(--emerald); text-transform: uppercase; margin-bottom: 0.2rem;">
                    💡 Beyond Lomborg Opportunity Cost
                  </div>
                  <div>${loan.beyondLomborgAlternative}</div>
                </div>
              </div>
            </div>

            <button type="button" class="btn-inspect-audit" data-loan-inspect="${loan.id}">
              📑 Inspect Official Audit Dossier
            </button>
          </div>
        `;
      })
      .join('');

    // Attach inspect click handlers
    grid.querySelectorAll('[data-loan-inspect]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-loan-inspect');
        if (id) openLoanAuditModal(id);
      });
    });
  }

  function initForensicLoanLedger() {
    // 1. Category Filter Buttons
    document.querySelectorAll('[data-loan-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-loan-filter]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeLoanFilter = btn.getAttribute('data-loan-filter') || 'all';

        // Clear active flow kpi cards if any
        document.querySelectorAll('[data-flow-card]').forEach((c) => c.classList.remove('active'));

        renderForensicLoanLedger();
      });
    });

    // 2. Macro Flow Segments & KPI Cards Click-to-Filter
    document.querySelectorAll('[data-flow-filter]').forEach((seg) => {
      seg.addEventListener('click', () => {
        const filterVal = seg.getAttribute('data-flow-filter');
        activeLoanFilter = filterVal;
        document.querySelectorAll('[data-loan-filter]').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('[data-flow-card]').forEach((c) => {
          c.classList.toggle('active', c.getAttribute('data-flow-card') === filterVal);
        });
        renderForensicLoanLedger();
      });
    });

    document.querySelectorAll('[data-flow-card]').forEach((card) => {
      card.addEventListener('click', () => {
        const filterVal = card.getAttribute('data-flow-card');
        activeLoanFilter = filterVal;
        document.querySelectorAll('[data-loan-filter]').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('[data-flow-card]').forEach((c) => {
          c.classList.toggle('active', c === card);
        });
        renderForensicLoanLedger();
      });
    });

    // 3. Search Input
    const searchInput = document.getElementById('loanSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        activeLoanSearch = e.target.value;
        renderForensicLoanLedger();
      });
    }

    // 4. Modal Close Handlers
    const modal = document.getElementById('forensicLoanModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
        modal.style.display = 'none';
      }
    });

    // Initial render
    renderForensicLoanLedger();
  }

  function initOagInvestigation() {
    document.querySelectorAll("[data-oag-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-oag-toggle");
        if (id && oagAuditState.hasOwnProperty(id)) {
          oagAuditState[id] = !oagAuditState[id];
          updateOagDashboard();
        }
      });
    });

    const plugAllBtn = document.getElementById("btnPlugAllOagLeaks");
    if (plugAllBtn) {
      plugAllBtn.addEventListener("click", () => {
        Object.keys(oagAuditState).forEach((k) => (oagAuditState[k] = true));
        updateOagDashboard();
      });
    }

    const resetStatusQuoBtn = document.getElementById("btnResetOagStatusQuo");
    if (resetStatusQuoBtn) {
      resetStatusQuoBtn.addEventListener("click", () => {
        Object.keys(oagAuditState).forEach((k) => (oagAuditState[k] = false));
        updateOagDashboard();
      });
    }

    const chinaApplyBtn = document.getElementById("btnApplyChinaLessonToKenya");
    if (chinaApplyBtn) {
      chinaApplyBtn.addEventListener("click", () => {
        const eqMaxBtn = document.getElementById("eqPresetMaxBtn");
        if (eqMaxBtn) eqMaxBtn.click();
      });
    }

    updateOagDashboard();
  }

  function setCountryScope(targetScope) {
    if (!targetScope || (targetScope !== "africa" && targetScope !== "kenya")) {
      targetScope = "africa";
    }

    activeCountryScope = targetScope;
    const isKenya = targetScope === "kenya";

    const html = document.documentElement;
    html.setAttribute("data-country-scope", targetScope);

    // 1. Update active tab in header country navbar
    document.querySelectorAll("[data-scope-btn]").forEach((btn) => {
      const isMatch = btn.getAttribute("data-scope-btn") === targetScope;
      btn.classList.toggle("active", isMatch);
      btn.setAttribute("aria-selected", isMatch ? "true" : "false");
    });

    // 2. Brand badge in masthead
    const brandBadge = document.getElementById("scopeBrandBadge");
    if (brandBadge) {
      brandBadge.textContent = isKenya ? "Special Edition • Kenya Superhub" : "Interactive Thesis";
      brandBadge.style.backgroundColor = isKenya ? "#D97706" : "#B45309";
    }

    // 3. Stepper tab titles
    const t1 = document.getElementById("stepTab1Title");
    const t2 = document.getElementById("stepTab2Title");
    const t3 = document.getElementById("stepTab3Title");
    const t4 = document.getElementById("stepTab4Title");
    if (t1) t1.textContent = isKenya ? "🇰🇪 1. Kenya Debt Audit ($41.0B Foreign)" : "💔 1. Where Did the Money Go?";
    if (t2) t2.textContent = isKenya ? "🎛️ 2. How Kenya's $160B Grows the Economy" : "🎛️ 2. The $75B Solution";
    if (t3) t3.textContent = isKenya ? "📑 3. Auditor-General's $160B Forensic Audit" : "🏁 3. Africa Takes the Lead";
    if (t4) t4.textContent = isKenya ? "🇰🇪 4. Explore Kenya in 3D" : "🌍 4. Explore 54 Countries in 3D";

    // 4. Step 1 Historical Audit
    activeAuditScope = targetScope;
    document.querySelectorAll("[data-audit-scope]").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-audit-scope") === targetScope);
    });
    if (sliderHistoricalRedirect && HISTORICAL_AUDIT_MODEL[targetScope]) {
      sliderHistoricalRedirect.value = HISTORICAL_AUDIT_MODEL[targetScope].defaultRedirectPct;
    }
    const s1Badge = document.getElementById("step1CalloutBadge");
    const s1Callout = document.getElementById("step1CalloutText");
    const s1Kicker = document.getElementById("step1Kicker");
    const s1Title = document.getElementById("step1Title");
    const s1Subtitle = document.getElementById("step1Subtitle");
    if (s1Badge) s1Badge.textContent = isKenya ? "🇰🇪 STEP 1 OF 4 • KENYA SPECIAL AUDIT" : "👉 STEP 1 OF 4 • START HERE";
    if (s1Callout) {
      s1Callout.innerHTML = isKenya
        ? `<strong>Why is Kenya's GDP $136B instead of $1.18 Trillion?</strong> Kenya borrowed <strong>$41.0 Billion</strong> in foreign debt ($84.5B total public debt), but tender fraud, debt interest, and unbankable land drained it away. <strong>Click the 3 valves below</strong> to see how directing just 28% into high-return priorities turns Kenya into a <strong>$1.18 Trillion</strong> high-income tiger today!`
        : `<strong>Why is Africa still poor?</strong> Africa already received <strong>$3.33 Trillion</strong> in foreign aid and loans (and Kenya <strong>$161 Billion</strong>). But <strong>3 big leaks</strong> drained almost all of it away. <strong>Click the 3 valves below</strong> to plug the leaks and see what Africa (<strong>$28.4T</strong>) &amp; Kenya (<strong>$1.18T</strong>) should already be worth today!`;
    }
    if (s1Kicker) s1Kicker.textContent = isKenya ? "STEP 1 • WHERE DID KENYA'S BORROWED DEBT GO?" : "STEP 1 • WHERE DID $3.33 TRILLION GO?";
    if (s1Title) s1Title.textContent = isKenya ? "Kenya Special Audit: How Fixing 3 Leaks Unlocks a $1.18 Trillion Tiger Today" : "Plug the 3 Leaks: See What Africa & Kenya Should Already Be Worth Today";
    if (s1Subtitle) {
      s1Subtitle.innerHTML = isKenya
        ? `Since 1963, Kenya received <strong>$76.5 Billion</strong> in foreign aid and borrowed <strong>$84.5 Billion</strong> in debt ($41.0B foreign debt + $43.5B domestic debt = $84.5B total public debt) Yet tender cartels, ghost payroll, and dead paper land titles drained it. Click each valve below to redirect funding into high-return priorities:`
        : `Over the past 40 years, Africa was given <strong>$3.33 Trillion</strong> in loans and aid—44 times what we need today. Yet for every $1 received, Africa only kept <strong>$1.30</strong> in real value because 3 broken pipes drained the rest away. Click each valve below to plug the leaks:`;
    }
    renderHistoricalAudit();

    // 5. Step 2 Premise & Equalizer
    const s2Badge = document.getElementById("step2CalloutBadge");
    const s2Callout = document.getElementById("step2CalloutText");
    const s2Kicker = document.getElementById("step2Kicker");
    const heroHeadline = document.getElementById("heroHeadline");
    const heroLead = document.getElementById("heroLead");
    const eqTopBarTitle = document.getElementById("eqTopBarTitle");
    const eqMaxBtn = document.getElementById("eqPresetMaxBtn");
    const eqTrapBtn = document.getElementById("eqPresetTrapBtn");
    const nobelKicker = document.getElementById("nobelBriefKicker");
    const eqGdpLbl = document.getElementById("eqScoreGdpLabel");
    const eqBourseLbl = document.getElementById("eqScoreBourseLabel");
    const eqOvertakeLbl = document.getElementById("eqScoreOvertakeLabel");
    const eqCurrencyLbl = document.getElementById("eqScoreCurrencyLabel");
    const eqTwinLbl = document.getElementById("eqBarTwinAxisLabel");

    if (s2Badge) s2Badge.textContent = isKenya ? "🎛️ STEP 2 OF 4 • HOW KENYA'S $160B DEBT GROWS THE ECONOMY" : "🎛️ STEP 2 OF 4 • THE $75B FIX";
    if (s2Callout) {
      s2Callout.innerHTML = isKenya
        ? `<strong>Your Action:</strong> Move the <strong>4 Dials below</strong> (or click <strong>🔥 Max Kenya Growth</strong> vs. <strong>⚠️ Old $160B Debt Trap</strong>) to see how investing Kenya's <strong>$160 Billion</strong> debt and borrowing into high-return Beyond Lomborg priorities grows the economy from $136B to <strong>$1.18 Trillion today</strong> and <strong>$18.6 Trillion by 2036</strong>.`
        : `<strong>Your Action:</strong> Move the <strong>4 Dials below</strong> (or click <strong>🔥 Max Growth</strong> vs. <strong>⚠️ Old Trap</strong>) to see how spending $75 Billion smartly unlocks an <strong>$183.5 Trillion</strong> economy.`;
    }
    if (s2Kicker) s2Kicker.textContent = isKenya ? "STEP 2 • MOVE THE 4 CONTROLS ($160B KENYA INVESTMENT)" : "STEP 2 • MOVE THE 4 CONTROLS";
    if (heroHeadline) {
      heroHeadline.innerHTML = isKenya
        ? `<span class="highlight">How Kenya's $160 Billion Grows the Economy:</span> Turn the 4 Dials to Build an <span class="highlight-drc">$18.6 Trillion Superpower</span>`
        : `<span class="highlight">How $75 Billion Changes Everything:</span> Turn the 4 Dials to Build a <span class="highlight-drc">$183.5 Trillion Superpower</span>`;
    }
    if (heroLead) {
      heroLead.innerHTML = isKenya
        ? `Kenya already borrowed and received over <strong>$160 Billion</strong> in debt and aid, but 65% of national taxes are eaten by debt interest while funds leaked into tender corruption. What if that $160 Billion was invested through the Beyond Lomborg blueprint into Busia deworming (60:1), Tusome EdTech (65:1), 10,000 MW Olkaria geothermal steam, Mombasa 24-hr paperless customs, and 100% onshore agro-processing? Move the 4 dials below to test:`
        : `In 1324, Emperor Mansa Musa handed out raw gold in Cairo and crashed Egypt's economy for 12 years. Realizing his mistake, in 1325 he pivoted to building <strong>Sankore University in Timbuktu</strong>—investing in education, trade routes, and local industries. Move the 4 dials below to test what happens when we invest in human potential and cheap clean energy instead of just digging up raw minerals:`;
    }
    if (eqTopBarTitle) eqTopBarTitle.textContent = isKenya ? "🎛️ Live 4-Pillar Economic Controls ($160B Kenya Growth Model)" : "🎛️ Live 4-Pillar Economic Controls ($75B Catalyst)";
    if (eqMaxBtn) eqMaxBtn.textContent = isKenya ? "🔥 Max Kenya Growth ($18.6T)" : "🔥 Max Growth ($183.5T)";
    if (eqTrapBtn) eqTrapBtn.textContent = isKenya ? "⚠️ Old $160B Debt Trap ($1.4T)" : "⚠️ Old Raw-Ore Trap ($8.2T)";
    if (nobelKicker) nobelKicker.textContent = isKenya ? "KENYA'S LIVE SCORECARD (YEAR 2036)" : "AFRICA'S LIVE SCORECARD (YEAR 2036)";
    if (eqGdpLbl) eqGdpLbl.textContent = isKenya ? "Total Economy Size (vs. $136B Today)" : "Total Economy Size (vs. $3.7T Today)";
    if (eqBourseLbl) eqBourseLbl.textContent = isKenya ? "Nairobi Securities Exchange (NSE)" : "Stock Market Value (1.8× Economy)";
    if (eqOvertakeLbl) eqOvertakeLbl.textContent = isKenya ? "Year Kenya Passes the UK & France" : "Year Africa Passes the US as #1 on Earth";
    if (eqCurrencyLbl) eqCurrencyLbl.textContent = isKenya ? "Kenyan Shilling (KES) vs. Dollar" : "African Currency Strength vs. Dollar";
    if (eqTwinLbl) eqTwinLbl.textContent = isKenya ? "🇰🇪 Kenya Silicon Savannah Share" : "🇰🇪🇨🇩 Kenya + Congo Engine";

    renderMasterEqualizer();

    // 6. Step 2 Simulator
    const simKicker = document.getElementById("simulatorKicker");
    const simTitle = document.getElementById("simulatorTitle");
    const simSub = document.getElementById("simulatorSubtitle");
    const btfBadge = document.getElementById("btfMatrixStatBadge");
    const btfPanelKicker = document.getElementById("btfMatrixPanelKicker");
    const btfPanelTitle = document.getElementById("btfMatrixPanelTitle");
    const loadNobelBtn = document.getElementById("loadNobelBtn");
    const loadTrapBtn = document.getElementById("loadTrapBtn");

    if (simKicker) simKicker.textContent = isKenya ? "KENYA'S $160 BILLION PRODUCTIVE ALLOCATION • BEYOND LOMBORG BREAKTHROUGHS" : "HOW $75 BILLION IS ALLOCATED • 12 HIGHEST-RETURN INVESTMENTS";
    if (simTitle) simTitle.textContent = isKenya ? "How Investing Kenya's $160B into Proven Breakthroughs (Geothermal, EdTech & Ports) Multiplies the Economy" : "Why Education, Health & Trade Beat Concrete Every Time";
    if (simSub) {
      simSub.innerHTML = isKenya
        ? `Kenya already spent $160 Billion on foreign loans, Eurobonds, and bilateral aid—with little lasting growth. Scaling Tusome adaptive pedagogy, Busia school deworming, Olkaria geothermal steam, and ArdhiSasa digital land titles across all 47 counties yields over <strong>$58 in real economic output per $1 spent</strong>:`
        : `Why did Mansa Musa invest in universities and trade routes rather than just digging more gold mines? Because raw resource mining only yields <strong>$1.90 per $1 spent</strong>, while basic health, schooling, and open trade return <strong>$33 to $101 per $1 spent</strong>. Test your own budget below:`;
    }
    if (btfBadge) btfBadge.textContent = isKenya ? "Saves 165,000 Kenyan Lives / Year • 58.4 : 1 Return Per $1" : "Saves 4.2M Lives Every Year • $52 Average Return Per $1";
    if (btfPanelKicker) btfPanelKicker.textContent = isKenya ? "KENYA'S 12 HIGHEST-RETURN POLICIES" : "THE 12 HIGHEST-RETURN POLICIES ON EARTH";
    if (btfPanelTitle) btfPanelTitle.textContent = isKenya ? "12 Solutions That Propel Kenya into the World Top 10" : "12 Proven Solutions That Save Lives and Multiply Wealth";
    if (loadNobelBtn) loadNobelBtn.textContent = isKenya ? "★ Load Optimal $160B Kenya Portfolio" : "★ Load Optimal $75B Superpower Portfolio";
    if (loadTrapBtn) loadTrapBtn.textContent = isKenya ? "⚠️ Load Old $160B Debt & Tender Trap" : "⚠️ Load White-Elephant Decoys (Low BCR Trap)";

    updateSimulatorSummary();
    renderInterventionsGrid();
    renderMarimekkoChart();

    // 7. Step 3 Overtake Race: Full Top 10 Leaderboard
    const s3Badge = document.getElementById("step3CalloutBadge");
    const s3Callout = document.getElementById("step3CalloutText");
    const raceKicker = document.getElementById("overtakeRaceKicker");
    const raceTitle = document.getElementById("overtakeRaceTitle");
    const raceSub = document.getElementById("overtakeRaceSubtitle");
    if (s3Badge) s3Badge.textContent = isKenya ? "📑 STEP 3 OF 4 • AUDITOR-GENERAL'S $160B FORENSIC AUDIT" : "🏁 STEP 3 OF 4 • THE PAYOFF";
    if (s3Callout) {
      s3Callout.innerHTML = isKenya
        ? `<strong>Your Action:</strong> Toggle the <strong>5 Forensic Cures below</strong> to see how halting Eurobond commercial rollovers, unfreezing paper land titles, and cutting thermal IPP capacity charges recovers over <strong>$101.5 Billion</strong> in lost capital and expands Kenya's economy to <strong>$1.18 Trillion</strong> today.`
        : `<strong>Your Action:</strong> Press <strong>▶ Play Yearly Race</strong> (or click the <strong>Key Years</strong> below) to watch Africa pass Europe, India, China, and the United States to become the world's #1 economy.`;
    }

    if (raceKicker) raceKicker.textContent = isKenya ? "STEP 3 • 2026 TO 2036 • WATCH KENYA ENTER THE GLOBAL TOP 10" : "STEP 3 • 2026 TO 2036 • WATCH AFRICA TAKE THE LEAD";
    if (raceTitle) raceTitle.textContent = isKenya ? "The Global Race: Watch Kenya Enter the World Top 10 by 2036" : "The Global Race: Watch Africa Overtake Europe, India, China & the United States";
    if (raceSub) {
      raceSub.innerHTML = isKenya
        ? `Starting from $136B in 2026 (#74 globally), Kenya redirects its $160B borrowing into geothermal energy, port automation, and digital education—racing past South Africa, France, the UK, and Germany to become an $18.6 Trillion powerhouse by 2036:`
        : `In 1324, Mansa Musa’s Mali was wealthier than any kingdom in Europe or Asia. Press <strong>▶ Play Yearly Race</strong> (or slide the years 2026 to 2036) to watch how high-impact investments lift Africa’s young population past aging world powers into the #1 economic spot on Earth:`;
    }

    // Dynamic Milestone Buttons for Kenya vs Africa
    const raceMilestonesBar = document.getElementById("raceMilestonesBar");
    if (raceMilestonesBar) {
      if (isKenya) {
        raceMilestonesBar.innerHTML = `
          <span style="font-family: var(--font-mono); font-size: 0.68rem; text-transform: uppercase; color: var(--ink-muted); font-weight: 700; margin-right: 0.25rem;">
            Kenya Milestones:
          </span>
          <button type="button" class="filter-pill" data-race-year="2026">2026 (#74: $136B)</button>
          <button type="button" class="filter-pill" data-race-year="2036">2036 (Passes Nigeria: $1.18T)</button>
          <button type="button" class="filter-pill" data-race-year="2040">2040 (Overtakes South Africa: $2.4T)</button>
          <button type="button" class="filter-pill" data-race-year="2046">2046 (Overtakes France: $4.5T)</button>
          <button type="button" class="filter-pill" data-race-year="2048">2048 (Overtakes UK: $5.8T)</button>
          <button type="button" class="filter-pill" data-race-year="2056">2056 (Overtakes Germany: $8.5T)</button>
          <button type="button" class="filter-pill active" data-race-year="2036">2036 (Enters Global Top 5: $18.6T)</button>
        `;
      } else {
        raceMilestonesBar.innerHTML = `
          <span style="font-family: var(--font-mono); font-size: 0.68rem; text-transform: uppercase; color: var(--ink-muted); font-weight: 700; margin-right: 0.25rem;">
            Milestones:
          </span>
          <button type="button" class="filter-pill" data-race-year="2026">2026 (Starting Point)</button>
          <button type="button" class="filter-pill" data-race-year="2036">2036 (Growth Takeoff)</button>
          <button type="button" class="filter-pill" data-race-year="2045">2045 (Passes Europe)</button>
          <button type="button" class="filter-pill" data-race-year="2051">2051 (Passes India)</button>
          <button type="button" class="filter-pill" data-race-year="2053">2053 (Passes China)</button>
          <button type="button" class="filter-pill" data-race-year="2055">2055 (Passes USA to become #1)</button>
          <button type="button" class="filter-pill" data-race-year="2068">2068 (Kenya + Congo Alone Passes USA)</button>
          <button type="button" class="filter-pill active" data-race-year="2036">2036 ($183.5T Superpower)</button>
        `;
      }
      raceMilestonesBar.querySelectorAll("[data-race-year]").forEach((b) => {
        b.addEventListener("click", () => {
          raceYear = parseInt(b.getAttribute("data-race-year"), 10);
          renderOvertakeRace(false);
        });
      });
    }

    raceRowElements = {};
    if (raceBarsContainer) raceBarsContainer.innerHTML = "";
    renderOvertakeRace(false);
    renderOvertakeProofTable();
    renderUntappedSectorsAndCoProsperity();

    // 8. Step 3 Friedman Engine
    const fKicker = document.getElementById("friedmanKicker");
    const fTitle = document.getElementById("friedmanTitle");
    const fSub = document.getElementById("friedmanSubtitle");
    if (fKicker) fKicker.textContent = isKenya ? "NAIROBI CAPITAL MARKETS & KENYAN SHILLING" : "FINANCIAL MARKETS & CURRENCY STRENGTH";
    if (fTitle) fTitle.textContent = isKenya ? "Why Property Rights, Free Markets & E-Procurement Unleash Kenya's Hustler Economy" : "From Currency Crash to the World’s Strongest Money";
    if (fSub) {
      fSub.innerHTML = isKenya
        ? `By replacing paper land registries with ArdhiSasa digital titles (unlocking $150B+ in dead capital), enforcing open e-procurement against tender cartels, and deploying $0.038/kWh geothermal steam, the Nairobi Securities Exchange (NSE) swells to $24.2 Trillion with the Kenyan Shilling strengthening to KSh 24 / $1 USD:`
        : `In 1324, Mansa Musa gave away tons of raw gold, which caused prices to skyrocket because goods hadn't increased. By contrast, under our $75B plan, real production skyrockets 39-fold while money supply stays disciplined—turning African currency into a rock-solid global reserve.`;
    }
    renderFriedmanMarkets();

    // 9. Step 4 3D Map
    const mapKicker = document.getElementById("africaMapKicker");
    const mapTitle = document.getElementById("africaMapTitle");
    const mapSub = document.getElementById("africaMapSubtitle");
    if (mapKicker) mapKicker.textContent = isKenya ? "STEP 4 • KENYA 3D SUPERHUB ATLAS" : "STEP 4 • THE 54-NATION 3D ATLAS";
    if (mapTitle) mapTitle.textContent = isKenya ? "Explore Kenya's 47 Counties, Rift Geothermal & Port Corridor" : "Interactive 3D Map: Click Any Country to See Its Custom Plan";
    if (mapSub) {
      mapSub.innerHTML = isKenya
        ? `Explore Kenya's strategic crossroads: from the <strong>10 GW Rift Valley geothermal belt (Olkaria & Menengai)</strong> and the <strong>Port of Mombasa & Lamu deepwater gateways</strong>, to <strong>Nairobi's Silicon Savannah FinTech ecosystem</strong> and <strong>Turkana's clean wind & aquifer basin</strong>.`
        : `Every African nation has a unique superpower—from the <strong>DRC’s $24 Trillion in critical green minerals and hydro power</strong> and <strong>Kenya’s tech hub & geothermal energy</strong>, to <strong>Nigeria’s massive youth workforce</strong> and <strong>Mali’s solar basin</strong>. Click any country below to see its customized 4-step path to prosperity:`;
    }
    if (isKenya) {
      if (africaMapControlsBar) africaMapControlsBar.style.display = "none";
      if (kenyaCountyControlsBar) kenyaCountyControlsBar.style.display = "flex";
      if (africaSvgMap) africaSvgMap.style.display = "none";

      if (mapEngineMode === "svg") {
        if (maplibreContainer) maplibreContainer.style.display = "none";
        if (kenyaCountySvgMap) {
          kenyaCountySvgMap.style.display = "block";
          renderKenyaCountyMap();
        }
      } else {
        // 3D or 2D-GL WebGL Extrusion Mode
        if (kenyaCountySvgMap) kenyaCountySvgMap.style.display = "none";
        if (maplibreContainer) {
          maplibreContainer.style.display = "block";
          if (glMap) {
            glMap.resize();
            ["africa-extrusion", "africa-borders", "africa-selected-outline"].forEach((id) => {
              if (glMap.getLayer(id)) glMap.setLayoutProperty(id, "visibility", "none");
            });
            ["kenya-counties-extrusion", "kenya-counties-borders", "kenya-counties-selected-outline"].forEach((id) => {
              if (glMap.getLayer(id)) glMap.setLayoutProperty(id, "visibility", "visible");
            });
            syncGeoJsonMetrics();
            glMap.flyTo({
              center: [37.8, 0.4],
              zoom: 6.2,
              pitch: mapEngineMode === "3d" ? 52 : 0,
              bearing: -12,
              duration: 1500,
            });
          }
        }
      }

      if (kenyaCountiesMatrixSection) kenyaCountiesMatrixSection.style.display = "block";
      initKenyaCountyExplorer();
      renderKenyaCountiesTable(activeCountyBloc, countySearchQuery);
      renderKenyaBreakthroughEngines();
  initOagInvestigation();
      selectKenyaCounty(selectedCountyCode, true);
    } else {
      if (africaMapControlsBar) africaMapControlsBar.style.display = "flex";
      if (kenyaCountyControlsBar) kenyaCountyControlsBar.style.display = "none";
      if (kenyaCountySvgMap) kenyaCountySvgMap.style.display = "none";

      if (glMap) {
        ["kenya-counties-extrusion", "kenya-counties-borders", "kenya-counties-selected-outline"].forEach((id) => {
          if (glMap.getLayer(id)) glMap.setLayoutProperty(id, "visibility", "none");
        });
        ["africa-extrusion", "africa-borders", "africa-selected-outline"].forEach((id) => {
          if (glMap.getLayer(id)) glMap.setLayoutProperty(id, "visibility", "visible");
        });
      }

      if (mapEngineMode === "svg") {
        if (maplibreContainer) maplibreContainer.style.display = "none";
        if (africaSvgMap) {
          africaSvgMap.style.display = "block";
          renderAfricaSvgMap();
        }
      } else {
        if (maplibreContainer) maplibreContainer.style.display = "block";
        if (africaSvgMap) africaSvgMap.style.display = "none";
        if (glMap) glMap.resize();
      }
      if (kenyaCountiesMatrixSection) kenyaCountiesMatrixSection.style.display = "none";
      selectMapCountry(selectedMapIso || "COD", true);
    }

    // 10. Step 4 Blueprint Showcase
    if (isKenya) {
      activeCountryKey = "kenya";
      document.querySelectorAll("#countrySwitcherBar .country-switch-btn").forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-country") === "kenya");
      });
      renderAllBlueprintSections();
    } else {
      activeCountryKey = "africa";
      document.querySelectorAll("#countrySwitcherBar .country-switch-btn").forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-country") === "africa");
      });
      renderAllBlueprintSections();
    }

    // 11. Fly WebGL Camera and apply layer visibility
    applyWebGlScopeVisibility(targetScope);
    if (glMap) {
      glMap.flyTo({
        center: isKenya ? [37.8, 0.4] : [21.5, 1.5],
        zoom: isKenya ? 6.2 : 2.55,
        pitch: mapEngineMode === "3d" ? (isKenya ? 52 : 50) : 0,
        bearing: mapEngineMode === "3d" ? (isKenya ? -10 : -8) : 0,
        duration: 900,
      });
    }

    // 12. Default Kenya Equalizer Dials & Special Audit to 0% (Current Reality / The Trap)
    // To visibly demonstrate how much potential Kenya has lost before moving the controls!
    if (isKenya) {
      // Step 1: 0% redirect & unplugged valves (showing $136B current GDP & leaks)
      if (sliderHistoricalRedirect) sliderHistoricalRedirect.value = 0;
      if (typeof auditValves !== "undefined") {
        Object.keys(auditValves).forEach((k) => (auditValves[k].plugged = false));
      }
      renderHistoricalAudit();

      // Step 2: Dials at 0% (Old Debt Trap)
      const eqDials = [eqDialBiology, eqDialEdtech, eqDialPowerTrade, eqDialSuperSectors];
      eqDials.forEach((d) => { if (d) d.value = 0; });
      const eqVals = [valEqBiology, valEqEdtech, valEqPowerTrade, valEqSuperSectors];
      eqVals.forEach((v) => { if (v) { v.textContent = "0%"; v.className = "friedman-slider-val"; } });
      const eqMaxBtn = document.getElementById("eqPresetMaxBtn");
      const eqTrapBtn = document.getElementById("eqPresetTrapBtn");
      if (eqMaxBtn) eqMaxBtn.classList.remove("active");
      if (eqTrapBtn) eqTrapBtn.classList.add("active");
      renderMasterEqualizer();
    }
  }
  window.setCountryScope = setCountryScope;

  // Handle Country Scope Navbar clicks
  document.querySelectorAll("[data-scope-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const scope = btn.getAttribute("data-scope-btn");
      setCountryScope(scope);
    });
  });

  function goToUxStep(stepId, shouldScrollTop = true) {
    const stepStr = String(stepId || "1");
    const html = document.documentElement;
    html.setAttribute("data-ux-step", stepStr);

    // Sync active state on header stepper tabs & mobile bottom tabs
    document.querySelectorAll("[data-step-btn]").forEach((btn) => {
      btn.classList.toggle(
        "active",
        btn.getAttribute("data-step-btn") === stepStr
      );
    });

    const progBar = document.getElementById("uxStepProgressBar");
    if (progBar) {
      const pctMap = { "1": "25%", "2": "50%", "3": "75%", "4": "100%", "all": "100%" };
      progBar.style.width = pctMap[stepStr] || "25%";
    }

    // If switching to Step 4 or All, resize MapLibre WebGL canvas & SVG map
    if (stepStr === "4" || stepStr === "all") {
      setTimeout(() => {
        if (glMap && typeof glMap.resize === "function") {
          glMap.resize();
        }
        renderAfricaSvgMap();
        renderTrajectoryChart();
      }, 65);
    }

    // If switching to Step 2 or All, refresh Marimekko chart
    if (stepStr === "2" || stepStr === "all") {
      setTimeout(() => {
        renderMarimekkoChart();
      }, 65);
    }

    // If switching to Step 3 or All, refresh Overtake Race row positions
    if (stepStr === "3" || stepStr === "all") {
      setTimeout(() => {
        renderOvertakeRace(false);
        renderStockMarketRace(false);
      }, 45);
    }

    if (shouldScrollTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  window.goToUxStep = goToUxStep;

  document.addEventListener("click", (e) => {
    const stepBtn = e.target.closest("[data-step-btn]");
    if (stepBtn) {
      const targetStep = stepBtn.getAttribute("data-step-btn");
      goToUxStep(targetStep, true);
      return;
    }

    const gotoBtn = e.target.closest("[data-goto-step]");
    if (gotoBtn) {
      e.preventDefault();
      const targetStep = gotoBtn.getAttribute("data-goto-step");
      goToUxStep(targetStep, true);
    }
  });

  // Re-render charts inside <details class="ux-deep-drawer"> when expanded
  document.querySelectorAll("details.ux-deep-drawer").forEach((det) => {
    det.addEventListener("toggle", () => {
      if (det.open) {
        setTimeout(() => {
          renderMarimekkoChart();
          renderStockMarketRace(false);
          renderTrajectoryChart();
        }, 50);
      }
    });
  });

  // 45-Second Interactive Auto-Tour (Steps 1 -> 2 -> 3 -> 4)
  const autoTourBtn = document.getElementById("autoTourBtn");
  let autoTourTimers = [];

  function stopAutoTour() {
    autoTourTimers.forEach((t) => clearTimeout(t));
    autoTourTimers = [];
    if (autoTourBtn) autoTourBtn.textContent = "🎬 45s Auto-Tour";
  }

  if (autoTourBtn) {
    autoTourBtn.addEventListener("click", () => {
      if (autoTourTimers.length > 0) {
        stopAutoTour();
        return;
      }
      autoTourBtn.textContent = "⏹ Stop Tour";

      // Step 1: Leaky Pipe Audit — Open leaks then lock all 3 valves on Kenya & Africa
      goToUxStep("1", true);
      if (openAllValvesLeakBtn) openAllValvesLeakBtn.click();

      autoTourTimers.push(
        setTimeout(() => {
          const keBtn = document.querySelector('[data-audit-scope="kenya"]');
          if (keBtn) keBtn.click();
          if (snapAllValvesShutBtn) snapAllValvesShutBtn.click();
        }, 2500)
      );

      // Step 2: The $75B Fix — Show 1324 Trap vs Max Sankore on the 4 Dials
      autoTourTimers.push(
        setTimeout(() => {
          goToUxStep("2", true);
          if (eqPresetTrapBtn) eqPresetTrapBtn.click();
        }, 6500)
      );

      autoTourTimers.push(
        setTimeout(() => {
          if (eqPresetMaxBtn) eqPresetMaxBtn.click();
        }, 9000)
      );

      // Step 3: Global GDP Overtake Race at 2x Speed
      autoTourTimers.push(
        setTimeout(() => {
          goToUxStep("3", true);
          raceSpeedMultiplier = 2;
          raceYear = 2026;
          startRacePlayback();
        }, 12500)
      );

      // Step 4: 54-Country 3D Map & 3D Extrusion Growth
      autoTourTimers.push(
        setTimeout(() => {
          goToUxStep("4", true);
          mapSpeedMultiplier = 2;
          mapSimYear = 2026;
          startMapPlayback();
        }, 22000)
      );

      autoTourTimers.push(
        setTimeout(() => {
          stopAutoTour();
        }, 31000)
      );
    });
  }

  function renderAllBlueprintSections() {
    renderBlueprintHeader();
    renderDrcEndowments();
    renderDrcPhases();
    renderTrajectoryChart();
    renderValueChains();
  }

  // Initial Boot (Exclusively Kenya)
  syncAngularDeviceSignal();
  renderMasterEqualizer();
  initWebGlMap();
  renderHistoricalAudit();
  initForensicLoanLedger();
  initOagInvestigation();
  renderFriedmanMarkets();
  renderStockMarketRace();
  renderPriceTheoryEngine();
  renderBtfMatrix();
  updateSimulatorSummary();
  renderInterventionsGrid();
  renderMarimekkoChart();
  initKenyaCountyExplorer();
  renderKenyaCountyMap();
  renderKenyaCountiesTable();
  renderKenyaBreakthroughEngines();
  selectKenyaCounty("047", false);

  // If user opened with ?scope=kenya, automatically switch to Kenya scope
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("scope") === "kenya") {
      setCountryScope("kenya");
    }
  } catch (e) {
    // Ignore in non-browser env
  }
})();
