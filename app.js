// ============================================================================
// APPLICATION CONTROLLER: HOW $75B GROWS AFRICA INTO HISTORY'S LARGEST ECONOMY
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
  let activeCountryKey = "africa"; // "africa", "drc", "kenya", or "twinAxis"
  let activeDrcPhase = 1;
  let activeScenarioKey = "lomborg";

  // Helper: Calculate effective BCR and Benefit ($B) for an intervention
  function getEffectiveMetrics(item) {
    const baseBcr = discountRate === "3" ? item.bcr3pct : item.bcr5pct;
    const multiplier = dalyValuation === "high" ? item.dalyMultiplierHigh : 1.0;
    const bcr = +(baseBcr * multiplier).toFixed(1);
    const benefitB = +(item.costBillions * bcr).toFixed(1);
    return { bcr, benefitB };
  }

  // Helper: Get currently active African Blueprint object
  function getActiveBlueprint() {
    return AFRICAN_BLUEPRINTS[activeCountryKey] || AFRICAN_BLUEPRINTS.africa;
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
  });

  // ==========================================================================
  // 2. SIMULATOR RENDER & AFRICAN SUPERPOWER BUDGET ENGINE
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

    // Calculate projected 50-year African GDP unlocked based on immediate surplus ratio
    // Baseline Status Quo = $8.2T; Optimal $2,342B surplus unlocks $145.0T
    const optimalSurplusRef = 2342.4;
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

  // Preset Buttons
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

  // Category Filter Pills
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

  // Sensitivity Selects
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
  // 3. MARIMEKKO ROI VISUALIZER (WIDTH = COST, HEIGHT = BCR)
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
  // 4. ALL-AFRICA, DRC, KENYA & TWIN-AXIS SUPERPOWER BLUEPRINT ENGINE
  // ==========================================================================

  // Country Switcher Buttons
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

  // ==========================================================================
  // 5. 50-YEAR COMPOUNDING GDP TRAJECTORY CHART (SVG)
  // ==========================================================================

  function renderTrajectoryChart() {
    const bp = getActiveBlueprint();
    const trajectories = bp.trajectories;
    const svgWrap = document.getElementById("trajectorySvgWrap");
    const milestonesWrap = document.getElementById("trajectoryMilestones");

    // Update scenario button labels dynamically
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

  // ==========================================================================
  // 6. ONSHORE VALUE-CHAIN MULTIPLIER CARDS
  // ==========================================================================
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

  function renderAllBlueprintSections() {
    renderBlueprintHeader();
    renderDrcEndowments();
    renderDrcPhases();
    renderTrajectoryChart();
    renderValueChains();
  }

  // Initial Boot
  updateSimulatorSummary();
  renderInterventionsGrid();
  renderMarimekkoChart();
  renderAllBlueprintSections();
})();
