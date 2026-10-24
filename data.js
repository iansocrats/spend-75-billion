// ============================================================================
// DATA: HOW $75 BILLION CAN GROW AFRICA INTO THE BIGGEST ECONOMY TO EVER EXIST
// Applying Bjørn Lomborg's Copenhagen Consensus Benefit-Cost Ratio (BCR) Triage
// Across All 54 African Nations, the DRC Heartland & the Kenya Superhub
// ============================================================================

const GLOBAL_INTERVENTIONS = [
  // --- THE 16 LOMBORG HIGH-BCR AFRICAN SUPERPOWER CATALYSTS ($75B TOTAL) ---
  {
    id: "micronutrients",
    rank: 1,
    isWinner: true,
    title: "Continental Micronutrient & Anti-Stunting Blitz (First 1,000 Days)",
    shortTitle: "Anti-Stunting Micronutrients",
    category: "Biological & Cognitive Foundation",
    costBillions: 12.0,
    bcr3pct: 48,
    bcr5pct: 32,
    dalyMultiplierHigh: 1.8,
    authors: "Lomborg Priority #1 • Horton, Alderman & Rivera",
    livesSavedOrImpacted: "120M+ African children protected from cognitive stunting",
    summary: "Universal Vitamin A, zinc supplementation, iodized salt, and iron/folic acid fortification for mothers and infants across the DRC (42% stunting), rural Kenya (18–26%), and Sub-Saharan Africa.",
    whyItWins: "Chronic malnutrition in the first 1,000 days permanently stunts brain development. Eradicating stunting across Africa's booming youth population raises average IQ by 6–10 points and boosts lifetime adult wages by 30–40%.",
    drcRelevance: "Creates the largest cognitive capital surge in human history across Africa's 1.5B (soon 2.8B) population—the non-negotiable foundation of a $145T economy."
  },
  {
    id: "malaria-act",
    rank: 2,
    isWinner: true,
    title: "Pan-African Malaria Eradication: ACT Subsidies & Vector Control",
    shortTitle: "Malaria ACT & Eradication",
    category: "Biological & Cognitive Foundation",
    costBillions: 4.5,
    bcr3pct: 42,
    bcr5pct: 35,
    dalyMultiplierHigh: 2.1,
    authors: "Lomborg Priority #2 • Laxminarayan, Over & Smith",
    livesSavedOrImpacted: "500,000+ African lives & 400M+ workdays saved annually",
    summary: "Full subsidy for Artemisinin-based Combination Therapies (ACTs), long-lasting insecticide nets, and next-gen malaria vaccines across the Congo Basin, Lake Victoria, and West/East African endemic zones.",
    whyItWins: "Africa bears 94% of global malaria deaths (DRC alone has 12%). Just as eradicating malaria unlocked the American South and the Panama Canal, crushing malaria makes Africa's tropical interior habitable for dense industrial cities.",
    drcRelevance: "Unlocks tens of millions of healthy labor years in the DRC Copperbelt, Congo Basin, and Kenya's Lake Victoria & Coastal corridors."
  },
  {
    id: "deworming",
    rank: 3,
    isWinner: true,
    title: "Universal African School Deworming (The Busia, Kenya Model)",
    shortTitle: "Universal School Deworming",
    category: "Education & STEM Workforce",
    costBillions: 1.5,
    bcr3pct: 60,
    bcr5pct: 36,
    dalyMultiplierHigh: 1.6,
    authors: "Lomborg Priority #4 • Kremer, Miguel, Verguet & Jamison",
    livesSavedOrImpacted: "250M+ African schoolchildren treated every year",
    summary: "Scaling Kenya's Nobel-winning Busia primary school deworming model ($0.50/child/year) to every primary and secondary school from Kinshasa and Nairobi to Lagos and Addis Ababa.",
    whyItWins: "Proven in Western Kenya: deworming cuts school absenteeism by 25% and increases adult earnings by ~20% decades later—delivering an extraordinary 60:1 return.",
    drcRelevance: "A homegrown Kenyan economic breakthrough scaled continent-wide so African students convert classroom hours into high-tech mastery."
  },
  {
    id: "childhood-immunization",
    rank: 4,
    isWinner: true,
    title: "100% African Childhood Immunization & Demographic Catalyst",
    shortTitle: "Childhood Immunization",
    category: "Biological & Cognitive Foundation",
    costBillions: 4.0,
    bcr3pct: 28,
    bcr5pct: 20,
    dalyMultiplierHigh: 2.2,
    authors: "Lomborg Priority #3 • Resch & Bärnighausen",
    livesSavedOrImpacted: "800,000+ African childhood deaths prevented/yr",
    summary: "Reaching the final 20% of unimmunized children across rural DRC, northern Kenya, the Sahel, and Central Africa with measles, DTP, pneumococcal, and rotavirus vaccines.",
    whyItWins: "Triggers the 'Demographic Dividend': when parents are certain their children will survive, fertility stabilizes and household investment per child's education skyrockets.",
    drcRelevance: "Accelerates Africa's transition into a powerhouse where working-age adults outnumber dependents 2-to-1."
  },
  {
    id: "tuberculosis",
    rank: 5,
    isWinner: true,
    title: "Crushing Tuberculosis (DOTS) Among Prime Working-Age Africans",
    shortTitle: "TB Eradication (DOTS)",
    category: "Biological & Cognitive Foundation",
    costBillions: 5.0,
    bcr3pct: 34,
    bcr5pct: 23,
    dalyMultiplierHigh: 2.0,
    authors: "Lomborg Priority #5 • Verguet, Laxminarayan & Dye",
    livesSavedOrImpacted: "750,000+ prime working-age African workers saved/yr",
    summary: "Rapid molecular diagnostics and Directly Observed Treatment (DOTS) across high-density African megacities (Kinshasa, Nairobi, Lagos, Johannesburg, Cairo) and mining belts.",
    whyItWins: "TB strikes adults aged 20–50 at the peak of their industrial, mining, and entrepreneurial output. Curing a worker for ~$100 preserves 30+ years of compounding GDP contribution.",
    drcRelevance: "Protects skilled miners in Katanga, factory workers in Nairobi/Mombasa, and logistics operators across AfCFTA corridors."
  },
  {
    id: "agricultural-rd",
    rank: 6,
    isWinner: true,
    title: "African Tropical & ASAL Crop R&D + Soil Micronutrient Revolution",
    shortTitle: "Tropical & ASAL Crop R&D",
    category: "Caloric & Agricultural Surplus",
    costBillions: 9.0,
    bcr3pct: 26,
    bcr5pct: 18,
    dalyMultiplierHigh: 1.4,
    authors: "Lomborg Priority #6 • Rosegrant, Ringler & KALRO/INERA",
    livesSavedOrImpacted: "Triples yields across DRC's 80M ha & Kenya's ASAL lands",
    summary: "Massive R&D into disease-resistant cassava, drought-tolerant maize/sorghum, high-yield rice/soy, and precision soil fertility across Africa's 600M hectares of uncultivated arable land.",
    whyItWins: "No nation in history has ever industrialized while importing its food. Tripling African smallholder yields ends the $70B/yr food import drain and slashes urban food costs by 40%.",
    drcRelevance: "Turns the DRC's 80M rain-fed hectares and Kenya's irrigated ASAL lands into the breadbasket of 3 billion people."
  },
  {
    id: "boreholes-water",
    rank: 7,
    isWinner: true,
    title: "Solar Boreholes, Aquifer Micro-Irrigation & Cold-Chain Storage",
    shortTitle: "Solar Boreholes & Cold Chains",
    category: "Caloric & Agricultural Surplus",
    costBillions: 6.0,
    bcr3pct: 16,
    bcr5pct: 11,
    dalyMultiplierHigh: 1.6,
    authors: "Lomborg Priority #15 • Whittington, Hanemann & Jeuland",
    livesSavedOrImpacted: "180M+ rural Africans gaining clean water & crop storage",
    summary: "Tapping Africa's massive underground aquifers (like Turkana/Lotikipi in Kenya and Congo Basin villages) with solar boreholes, drip irrigation, and solar cold-chain packhouses.",
    whyItWins: "Slashes post-harvest crop rot from 38% to <5%, eliminates waterborne diarrheal nutrient loss, and liberates 2+ hours/day for tens of millions of African women and girls.",
    drcRelevance: "Drought-proofs Kenya's 83% ASAL landmass and brings clean village water to rural DRC."
  },
  {
    id: "early-warning",
    rank: 8,
    isWinner: true,
    title: "Continental Weather Radar, Hydrological & Climate Early Warning",
    shortTitle: "Climate & Flood Early Warning",
    category: "Trade, Rights & Clean Power",
    costBillions: 3.0,
    bcr3pct: 35,
    bcr5pct: 21,
    dalyMultiplierHigh: 1.5,
    authors: "Lomborg Priority #7 • Buhaug & Weather Resilience Panel",
    livesSavedOrImpacted: "$40B+/yr in African harvests, hydro dams & rails protected",
    summary: "Continent-wide Doppler radar, satellite soil-moisture tracking, and SMS/mobile alerts for farmers, hydropower operators, and port authorities.",
    whyItWins: "Gives Kenyan and Horn of Africa farmers weeks of lead time for El Niño/La Niña shifts and protects Congo River hydro and coastal port infrastructure.",
    drcRelevance: "Safeguards the Mombasa–Nairobi–Goma–Kinshasa–Lobito infrastructure spine."
  },
  {
    id: "conditional-cash-education",
    rank: 9,
    isWinner: true,
    title: "Mobile-Money (M-Pesa) Conditional Cash Transfers for STEM & TVET",
    shortTitle: "STEM & Secondary Stipends",
    category: "Education & STEM Workforce",
    costBillions: 8.0,
    bcr3pct: 17,
    bcr5pct: 12,
    dalyMultiplierHigh: 1.5,
    authors: "Lomborg Priority #13 • Pritchett, King & Orazem",
    livesSavedOrImpacted: "50M+ African youth completing secondary & technical training",
    summary: "Direct mobile-wallet stipends paid to families when youth—especially girls—complete secondary school, vocational metallurgy, electrical, and software engineering tracks.",
    whyItWins: "By 2050, over 50% of the world's new workforce entrants will be African. Keeping healthy, non-stunted youth in STEM and TVET creates an unbeatable global talent monopoly.",
    drcRelevance: "Fuses Kenya's Silicon Savannah software ecosystem with DRC's metallurgical and hydro engineering workforce."
  },
  {
    id: "surgical-capacity",
    rank: 10,
    isWinner: true,
    title: "County & District Surgical, Trauma & Maternal Care Theatres",
    shortTitle: "District Surgical Capacity",
    category: "Health & Workforce Resilience",
    costBillions: 7.0,
    bcr3pct: 19,
    bcr5pct: 14,
    dalyMultiplierHigh: 1.9,
    authors: "Lomborg Priority #8 • Jamison, Weiser & Gawande",
    livesSavedOrImpacted: "2.5M+ African workers & mothers saved from disability/death",
    summary: "Equipping Kenya's 47 County Hospitals, DRC's district hospitals, and regional hubs with modern surgical theatres, anesthesia, trauma care, and safe childbirth capacity.",
    whyItWins: "Protects young workers and mothers from preventable trauma, road accidents, and obstetric emergencies at a fraction of tertiary hospital costs.",
    drcRelevance: "Keeps Africa's skilled technicians and entrepreneurs productive across 40-year careers."
  },
  {
    id: "hepatitis-b",
    rank: 11,
    isWinner: true,
    title: "Universal Birth-Dose Hepatitis B & HPV Immunization",
    shortTitle: "Hep B & Cancer Vaccines",
    category: "Biological & Cognitive Foundation",
    costBillions: 0.8,
    bcr3pct: 24,
    bcr5pct: 16,
    dalyMultiplierHigh: 1.8,
    authors: "Lomborg Priority #9 • Resch & Harvard Public Health",
    livesSavedOrImpacted: "Millions of adult liver & cervical cancer deaths prevented",
    summary: "Pennies-per-dose newborn Hepatitis B and adolescent HPV vaccination across all African maternity wards and schools.",
    whyItWins: "Prevents fatal liver and cervical cancers that otherwise strike African professionals and mothers in their prime 35–55 working years.",
    drcRelevance: "Effortless human-capital preservation across Central, East, and West Africa."
  },
  {
    id: "heart-drugs",
    rank: 12,
    isWinner: true,
    title: "Low-Cost Generic Cardiovascular 'Polypill' & Acute Care",
    shortTitle: "Low-Cost Cardiac Meds",
    category: "Health & Workforce Resilience",
    costBillions: 1.0,
    bcr3pct: 25,
    bcr5pct: 19,
    dalyMultiplierHigh: 2.0,
    authors: "Lomborg Priority #10 • Gaziano, Nugent & Mozaffarian",
    livesSavedOrImpacted: "400,000+ senior African managers, teachers & engineers saved/yr",
    summary: "Off-patent statins, beta-blockers, ACE inhibitors, and aspirin for high-risk adults across rapidly urbanizing African cities.",
    whyItWins: "Prevents premature stroke and heart attack deaths among Africa's most experienced 40–65-year-old leaders, executives, professors, and master engineers.",
    drcRelevance: "Protects institutional memory as Nairobi, Kinshasa, Lagos, and Cairo scale."
  },
  {
    id: "salt-reduction",
    rank: 13,
    isWinner: true,
    title: "Urban Hypertension, Salt Reduction & Tobacco Excise Policy",
    shortTitle: "Chronic Disease Prevention",
    category: "Health & Workforce Resilience",
    costBillions: 1.2,
    bcr3pct: 21,
    bcr5pct: 15,
    dalyMultiplierHigh: 1.7,
    authors: "Lomborg Priorities #11 & #16 • Gaziano & Jha",
    livesSavedOrImpacted: "Millions of strokes prevented; raises domestic tax revenue",
    summary: "Public health sodium standards and tobacco excise taxes across African urban centers.",
    whyItWins: "Costs virtually nothing to enforce, raises domestic fiscal revenue, and prevents non-communicable diseases from bankrupting national health insurance (like Kenya's SHA).",
    drcRelevance: "Keeps healthcare spending lean as Africa urbanizes."
  },
  {
    id: "hiv-vaccine-rd",
    rank: 14,
    isWinner: true,
    title: "KEMRI–INRB Biomedical, HIV/Epidemic Vaccine R&D & Local Pharma",
    shortTitle: "African Vaccine & Pharma R&D",
    category: "Health & Workforce Resilience",
    costBillions: 3.0,
    bcr3pct: 18,
    bcr5pct: 12,
    dalyMultiplierHigh: 1.7,
    authors: "Lomborg Priority #14 • Laxminarayan, Hecht & KEMRI",
    livesSavedOrImpacted: "Ends Africa's 95% dependency on imported vaccines/meds",
    summary: "Accelerating vaccine R&D and onshore pharmaceutical manufacturing anchored at KEMRI (Kenya), INRB (DRC), and regional biotech hubs.",
    whyItWins: "Saves tens of billions in lifelong treatment obligations while building a high-margin domestic African biotechnology industry.",
    drcRelevance: "Positions Nairobi and Kinshasa as the biomedical shield of the continent."
  },
  {
    id: "geoengineering-rd",
    rank: 15,
    isWinner: true,
    title: "Modular Baseload Hydro (Congo) & Geothermal (Rift Valley) Catalyst",
    shortTitle: "Modular Hydro & Geothermal",
    category: "Trade, Rights & Clean Power",
    costBillions: 5.0,
    bcr3pct: 30,
    bcr5pct: 19,
    dalyMultiplierHigh: 1.4,
    authors: "Lomborg Priority #12 • Green Energy R&D & Baseload Deployment",
    livesSavedOrImpacted: "Unlocks $0.02–$0.04/kWh industrial power across DRC & Kenya",
    summary: "Deploying catalytic R&D and de-risking guarantees for modular Congo River run-of-river hydro (100–1,000 MW) and Kenya's Olkaria/Menengai geothermal steam SEZs.",
    whyItWins: "Lomborg showed that making clean energy genuinely cheaper than fossil fuels is the ultimate climate and poverty solution. DRC hydro ($0.02/kWh) + Kenya geothermal ($0.04/kWh) gives Africa the cheapest green baseload electricity on Earth.",
    drcRelevance: "Forces global battery refining, green steel, ammonia fertilizer, and AI hyperscale data centers to relocate to the DRC and Kenya."
  },
  {
    id: "afcfta-property-rights",
    rank: 16,
    isWinner: true,
    title: "Digitized Land/Mining Titles (ArdhiSasa) & AfCFTA Paperless Customs",
    shortTitle: "Digital Titles & AfCFTA Customs",
    category: "Trade, Rights & Clean Power",
    costBillions: 4.0,
    bcr3pct: 52,
    bcr5pct: 38,
    dalyMultiplierHigh: 1.3,
    authors: "Copenhagen Consensus Trade & Property Rights Priorities",
    livesSavedOrImpacted: "Unlocks $4T+ in dead capital & slashes border delays by 85%",
    summary: "Digitizing land and mining cadastres across the DRC, Kenya (ArdhiSasa), and AfCFTA while eliminating non-tariff customs delays from Mombasa/Lamu to Goma, Kinshasa, and Lobito.",
    whyItWins: "Institutional and trade reforms have the highest leverage in economics (50:1+ BCR): verifiable land titles turn informal plots into bankable SME collateral, and paperless borders fuse 54 nations into one superpower market.",
    drcRelevance: "Connects Kenya's Indian Ocean gateway and FinTech rails directly to the DRC's $24T mineral heartland."
  },

  // --- 4 LOW-BCR AFRICAN DEVELOPMENT TRAPS (DECOYS FOR SIMULATOR COMPARISON) ---
  {
    id: "megaproject-prestige",
    rank: 17,
    isWinner: false,
    title: "Unsequenced $80B Mega-Dams & White-Elephant Projects on Day 1",
    shortTitle: "Unsequenced Mega-Projects",
    category: "Trade, Rights & Clean Power",
    costBillions: 30.0,
    bcr3pct: 1.7,
    bcr5pct: 1.1,
    dalyMultiplierHigh: 1.0,
    authors: "LOW-BCR TRAP • Conventional 'Concrete-First' Fallacy",
    livesSavedOrImpacted: "High external debt service; low domestic SME spillover",
    summary: "Borrowing $30B in commercial debt for giant prestige infrastructure before fixing childhood stunting, malaria, high industrial tariffs, or SME property rights.",
    whyItWins: "RANKED POOR WHEN UNSEQUENCED: Without healthy skilled workers, cheap food, and local industrial off-takers, mega-projects suffer massive cost overruns and debt distress. Sequence Phases 1–3 first so mega-infrastructure becomes self-financing!",
    drcRelevance: "Why DRC's Grand Inga and Kenya's SGR/LAPSSET must be paired with biological, agricultural, and SEZ tariff reforms."
  },
  {
    id: "blanket-carbon-cuts",
    rank: 18,
    isWinner: false,
    title: "Anti-Growth Energy Restrictions & Expensive Power Tariffs",
    shortTitle: "Energy Austerity & High Tariffs",
    category: "Trade, Rights & Clean Power",
    costBillions: 25.0,
    bcr3pct: 0.8,
    bcr5pct: 0.4,
    dalyMultiplierHigh: 1.0,
    authors: "LOW-BCR TRAP • Lomborg Climate Policy Critique",
    livesSavedOrImpacted: "Chokes African manufacturing & forces charcoal deforestation",
    summary: "Penalizing African industrial energy use or maintaining $0.18–$0.22/kWh retail tariffs instead of scaling cheap baseload hydro and geothermal.",
    whyItWins: "RANKED POOR BY NOBEL PANEL: Starving Africa of cheap abundant electricity keeps billions poor and forces families to burn wood and charcoal—destroying the Congo Basin and Mau forests.",
    drcRelevance: "Abundant $0.02–$0.04/kWh hydro and geothermal is how Africa industrializes AND saves its forests."
  },
  {
    id: "untargeted-school-spending",
    rank: 19,
    isWinner: false,
    title: "Brick-and-Mortar Classrooms Without Nutrition or Deworming",
    shortTitle: "Classrooms Without Nutrition",
    category: "Education & STEM Workforce",
    costBillions: 15.0,
    bcr3pct: 2.3,
    bcr5pct: 1.5,
    dalyMultiplierHigh: 1.2,
    authors: "LOW-BCR TRAP • Pritchett Education Analysis",
    livesSavedOrImpacted: "Low cognitive retention when students are stunted/parasite-burdened",
    summary: "Spending $15B purely on concrete school buildings while leaving 30–40% of students stunted, iron-deficient, and burdened by malaria and worms.",
    whyItWins: "RANKED LOW BY NOBEL PANEL: A child suffering from chronic stunting and hookworm cannot absorb complex mathematics. Pairing schools with Micronutrients (#1) and Busia Deworming (#3) yields 20x higher learning per dollar.",
    drcRelevance: "Demonstrates why biological liberation must always lead educational capital spending."
  },
  {
    id: "raw-ore-enclave",
    rank: 20,
    isWinner: false,
    title: "Subsidizing Raw Unrefined Mineral & Bulk Crop Export Enclaves",
    shortTitle: "Raw Ore Export Enclaves",
    category: "Caloric & Agricultural Surplus",
    costBillions: 20.0,
    bcr3pct: 1.9,
    bcr5pct: 1.2,
    dalyMultiplierHigh: 1.1,
    authors: "LOW-BCR TRAP • Resource Curse Status Quo",
    livesSavedOrImpacted: "95% of value-chain wealth exported to foreign refineries",
    summary: "Spending $20B on enclave extraction infrastructure just to ship raw cobalt dirt, unrefined copper, and unroasted bulk coffee/tea overseas.",
    whyItWins: "RANKED LOW: Captures less than 5% of final product value while leaving Africa dependent on imported batteries, steel, fertilizer, and food.",
    drcRelevance: "Replaced in our blueprint by onshore beneficiation powered by Congo hydro and Kenya geothermal."
  }
];

// ============================================================================
// THE 4 AFRICAN SUPERPOWER BLUEPRINTS:
// 1. ALL-AFRICA CONTINENTAL COLOSSUS ($145.0T)
// 2. DRC & CONGO BASIN HEARTLAND ($54.8T)
// 3. KENYA SILICON SAVANNAH & INDIAN OCEAN HUB ($18.6T)
// 4. KENYA + DRC TWIN-ENGINE MEGACORRIDOR ($73.4T)
// ============================================================================

const AFRICAN_BLUEPRINTS = {
  africa: {
    id: "africa",
    name: "All-Africa Continental Superpower ($145.0T Peak)",
    badge: "THE 54-NATION SUPERCONTINENT • BIGGEST ECONOMY THAT WILL EVER EXIST",
    headline: "Why $75B Can Grow Africa Into the Biggest Economy to Ever Exist—And That Will Ever Exist",
    intro: "Why is Africa uniquely destined to become not just the largest economy on Earth, but the largest economy that will EVER exist in human history? Because economics is ultimately governed by two ceilings: Demographics (Working-Age Brains) and Physics (Energy, Land & Minerals). Every other major bloc on Earth (China, Europe, East Asia, North America) has crossed peak population and is aging rapidly. By 2060–2075, Africa will be home to 3+ billion people—over 40% of humanity and more than 50% of the world's young engineers, builders, and innovators—sitting atop 60% of the planet's uncultivated arable land, the world's richest mineral reserves, and the cheapest continuous hydro, geothermal, and solar power on Earth. Using Bjørn Lomborg's $75B Benefit-Cost Ratio (BCR) triage to unlock the biological, caloric, and institutional bottlenecks triggers a $145+ Trillion continental economy that can never be surpassed.",
    endowments: [
      {
        metric: "3.0+ Billion",
        label: "The Ultimate Demographic Monopoly",
        detail: "While Europe, China, and East Asia shrink and age, Africa's working-age population will exceed 1.8 billion—more young talent than the rest of the world combined.",
        bottleneck: "Unlocked by Lomborg Phase I: Eradicating childhood stunting and malaria adds +30% lifetime cognitive productivity across 1.5B+ youth."
      },
      {
        metric: "600M Hectares",
        label: "60% of Earth's Uncultivated Arable Land",
        detail: "Anchored by the DRC's 80M rain-fed hectares, the Nile/Great Lakes basins, and vast underground aquifers capable of feeding 9 billion people.",
        bottleneck: "Unlocked by Lomborg Phase II: Tropical & ASAL crop R&D (#6) + solar boreholes (#15) flips Africa from a $70B food importer to the world's #1 food exporter."
      },
      {
        metric: "150+ GW Baseload",
        label: "Cheapest Clean Energy on Earth",
        detail: "DRC's 40+ GW Grand Inga & modular hydro + Kenya's 10+ GW Rift Valley Geothermal + 40% of global solar capacity creates an unbeatable $0.02/kWh clean grid.",
        bottleneck: "Unlocked by Lomborg Phase IV: Modular hydro/geothermal SEZs (#15) + Continental Power Pool interconnectors."
      },
      {
        metric: "$50T+ Minerals",
        label: "Monopoly on Future Industrial Inputs",
        detail: "70%+ of cobalt (DRC), 60%+ of manganese & platinum, massive copper (DRC/Zambia), lithium, bauxite, iron ore, and rare earths across 54 AfCFTA nations.",
        bottleneck: "Unlocked by Lomborg Phase III & IV: STEM workforce + digital property titles + paperless AfCFTA customs keeps 100% of value-chain processing onshore."
      }
    ],
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: "Phase I: Continental Biological & Cognitive Liberation",
        phaseSubtitle: "Lomborg Priorities #1, #2, #3, #4, #5 & #9 — Upgrading 1.5 Billion Brains & Bodies",
        budgetBillions: 27.8,
        avgBcr: 42.5,
        directEconomicBenefitBillions: 1181,
        gdpMultiplierEffect: "Permanently raises continental IQ by 6–10 points & adds +32% lifetime workforce output",
        description: "The #1 reason Africa's demographic boom hasn't yet translated into a $100T+ economy is the hidden 'biological tax': ~30% of African children suffer from chronic stunting (42% in the DRC, 18–26% in rural Kenya), which permanently limits brain development, while malaria and parasites drain hundreds of millions of workdays. Deploying the first $27.8B into Lomborg's top biological interventions yields $1.18 Trillion in immediate human capital.",
        interventions: [
          {
            title: "Continental Micronutrient Bundle & First-1,000-Days Anti-Stunting Blitz",
            lomborgRef: "Priority #1 • $12.0B Cost",
            costB: 12.0,
            bcr: 48,
            benefitB: 576,
            outcome: "Eliminates nutritional stunting from the Congo Basin to the Horn of Africa and the Sahel—creating the largest surge in human cognitive capacity in history."
          },
          {
            title: "Pan-African Malaria Eradication (ACTs), Universal Deworming (Busia Model), Immunization & TB Control",
            lomborgRef: "Priorities #2, #3, #4, #5 & #9 • $15.8B Cost",
            costB: 15.8,
            bcr: 38.3,
            benefitB: 605,
            outcome: "Scales Kenya's 60:1 Busia school deworming across all 54 nations, crushes malaria in the DRC/Lake Victoria/West Africa, and protects prime working-age adults from TB."
          }
        ]
      },
      {
        phaseNumber: 2,
        phaseTitle: "Phase II: The Continental Caloric & Agricultural Superpower",
        phaseSubtitle: "Lomborg Priorities #6 & #15 — Ending Food Imports & Dropping Urban Living Costs by 40%",
        budgetBillions: 15.0,
        avgBcr: 22.0,
        directEconomicBenefitBillions: 330,
        gdpMultiplierEffect: "Saves $70B/yr in foreign exchange & feeds 3B people with abundant cheap calories",
        description: "Britain, the US, Japan, and China all industrialized only AFTER achieving a massive domestic agricultural surplus. Instead of spending $70B every year importing wheat, rice, and cooking oil, $15B in Lomborg's high-BCR agricultural R&D and rural water infrastructure turns the DRC's 80M hectares and Kenya's irrigated ASAL lands into a global food colossus.",
        interventions: [
          {
            title: "Pan-African Tropical & ASAL Crop R&D + Geothermal/Hydro Green Fertilizer",
            lomborgRef: "Priority #6 • $9.0B Cost",
            costB: 9.0,
            bcr: 26,
            benefitB: 234,
            outcome: "Triples smallholder cassava, maize, rice, soy, and horticultural yields across Africa without clearing primary rainforest."
          },
          {
            title: "Rural Solar Boreholes, Aquifer Micro-Irrigation & Solar Cold-Chain Silos",
            lomborgRef: "Priority #15 • $6.0B Cost",
            costB: 6.0,
            bcr: 16,
            benefitB: 96,
            outcome: "Slashes post-harvest crop spoilage from 38% to <5% and saves rural African women 2+ hours every day."
          }
        ]
      },
      {
        phaseNumber: 3,
        phaseTitle: "Phase III: The 500-Million-Strong STEM, TVET & Biomedical Workforce",
        phaseSubtitle: "Lomborg Priorities #8, #10, #11, #13 & #14 — Forging the World's #1 Talent Pool",
        budgetBillions: 20.2,
        avgBcr: 18.2,
        directEconomicBenefitBillions: 368,
        gdpMultiplierEffect: "Supplies >50% of the world's new software, metallurgical & biotech engineers by 2050",
        description: "Once African children arrive in classrooms well-nourished, malaria-free, and dewormed, every education dollar produces 5x the cognitive mastery. Phase III uses mobile-money (M-Pesa) conditional cash transfers to keep tens of millions of youth in STEM and vocational tracks while protecting adult professionals with district surgical and cardiovascular care.",
        interventions: [
          {
            title: "M-Pesa / Mobile-Wallet Conditional Cash Transfers for Secondary, Girls' & STEM/TVET Education",
            lomborgRef: "Priority #13 • $8.0B Cost",
            costB: 8.0,
            bcr: 17,
            benefitB: 136,
            outcome: "Transitions tens of millions of African youth from subsistence labor into certified electrical, AI, metallurgical, and mechatronics careers."
          },
          {
            title: "District Surgical Capacity, Low-Cost Cardiac Meds, Hypertension Prevention & KEMRI/INRB Vaccine R&D",
            lomborgRef: "Priorities #8, #10, #11, #14 & #16 • $12.2B Cost",
            costB: 12.2,
            bcr: 19,
            benefitB: 232,
            outcome: "Protects working-age African engineers, entrepreneurs, and mothers while building onshore vaccine and pharmaceutical self-sufficiency."
          }
        ]
      },
      {
        phaseNumber: 4,
        phaseTitle: "Phase IV: AfCFTA Single Market, Digital Property Rights & Baseload Clean Power",
        phaseSubtitle: "Lomborg Priorities #7, #12 & Trade/Institutional Reform — Igniting the $145T Flywheel",
        budgetBillions: 12.0,
        avgBcr: 38.6,
        directEconomicBenefitBillions: 463,
        gdpMultiplierEffect: "Unlocks $8T+ in domestic bankable collateral & makes Grand Inga / Trans-African Rail 100% self-financing",
        description: "Here is the secret of Lomborg's economic triage: digitizing property titles, eliminating cross-border customs delays, and de-risking modular hydro/geothermal cost only $12B in public catalyst capital—yet generate $463B in direct benefit and unlock trillions in private investment across all 54 AfCFTA nations.",
        interventions: [
          {
            title: "Continental Digital Land & Mining Cadastre (ArdhiSasa Model) + AfCFTA Paperless Customs",
            lomborgRef: "Trade & Institutional Priority • $4.0B Cost",
            costB: 4.0,
            bcr: 52,
            benefitB: 208,
            outcome: "Turns $4T+ of informal African land and SME assets into bankable collateral and cuts intra-African border transit times by 85%."
          },
          {
            title: "Modular Congo Hydro & Rift Valley Geothermal SEZs ($0.02–$0.04/kWh) + Climate Early Warning",
            lomborgRef: "Priorities #7 & #12 • $8.0B Cost",
            costB: 8.0,
            bcr: 31.9,
            benefitB: 255,
            outcome: "Powers onshore battery refining, green steel, fertilizer, and AI data centers—generating the tax base that self-finances the full 40+ GW Grand Inga and continental high-speed rail."
          }
        ]
      }
    ],
    trajectories: {
      maxAxisT: 150.0,
      lomborg: {
        name: "Lomborg BCR-Sequenced All-Africa Superpower ($145.0T Peak)",
        color: "#0D9488",
        points: [
          { year: "Year 0 (2026)", gdpT: 3.10, note: "Initial $75B deployed across 16 high-BCR biological, agricultural, STEM, and AfCFTA institutional catalysts." },
          { year: "Year 10 (2036)", gdpT: 9.80, note: "Stunting & malaria crushed; Africa achieves 100% food sovereignty; DRC hydro & Kenya geothermal power onshore SEZs." },
          { year: "Year 20 (2046)", gdpT: 28.50, note: "First non-stunted STEM generation enters workforce; domestic tax base self-finances 40+ GW Grand Inga & Trans-African SGR." },
          { year: "Year 30 (2056)", gdpT: 62.00, note: "Global battery, green steel, automotive, biotech, and AI compute industries relocate to Africa for $0.02/kWh clean power & talent." },
          { year: "Year 40 (2066)", gdpT: 102.40, note: "AfCFTA single market of 2.8B high-income consumers surpasses the combined GDP of legacy aging continents." },
          { year: "Year 50 (2076)", gdpT: 145.00, note: "$145.0 Trillion economy—the largest economic civilization that has ever existed and will ever exist." }
        ]
      },
      megaproject: {
        name: "Unsequenced 'Debt & Concrete First' Trap ($16.5T Stall)",
        color: "#D97706",
        points: [
          { year: "Year 0 (2026)", gdpT: 3.10, note: "Pouring borrowed billions into unsequenced megaprojects while stunting, malaria, and border tariffs remain unsolved." },
          { year: "Year 10 (2036)", gdpT: 4.50, note: "External debt service and cost overruns crowd out health, agriculture, and SME credit." },
          { year: "Year 20 (2046)", gdpT: 6.80, note: "Continued $100B+/yr food import bill drains foreign exchange; industrial power remains expensive." },
          { year: "Year 30 (2056)", gdpT: 9.60, note: "Fragmented national markets fail to achieve continental scale." },
          { year: "Year 40 (2066)", gdpT: 12.90, note: "Demographic dividend partially wasted in informal survival employment." },
          { year: "Year 50 (2076)", gdpT: 16.50, note: "Stalls at just 11% of Africa's true Lomborg-sequenced superpower potential." }
        ]
      },
      statusQuo: {
        name: "Raw Resource Extraction Status Quo ($8.2T Stagnation)",
        color: "#6B7280",
        points: [
          { year: "Year 0 (2026)", gdpT: 3.10, note: "Exporting raw minerals, crude oil, and unroasted bulk crops while importing finished goods." },
          { year: "Year 10 (2036)", gdpT: 3.85, note: "Population grows, but stunting and disease keep per-capita output flat." },
          { year: "Year 20 (2046)", gdpT: 4.75, note: "Brain drain of top African engineers and doctors to aging foreign economies." },
          { year: "Year 30 (2056)", gdpT: 5.80, note: "Vulnerability to global commodity cycles and food inflation." },
          { year: "Year 40 (2066)", gdpT: 6.95, note: "95% of African mineral and agricultural value-add continues to be captured abroad." },
          { year: "Year 50 (2076)", gdpT: 8.20, note: "Leaves over $136 Trillion in human and industrial wealth unrealized." }
        ]
      }
    },
    valueChains: [
      {
        sector: "Onshore EV Batteries, Cathodes & Green Mobility (DRC + Zambia + Kenya + Morocco)",
        rawExportValueB: 32,
        onshoreProcessedValueB: 2400,
        multiplier: "75x Value Capture",
        explanation: "Instead of exporting raw cobalt, copper, lithium, and manganese ore for $32B/yr, Africa uses $0.02/kWh Congo hydro and Rift Valley geothermal to refine precursors, battery cells, and electric vehicles onshore for 3B domestic and global consumers."
      },
      {
        sector: "Hyperscale Clean AI Compute, Silicon & FinTech (Kenya + DRC + Nigeria + SA)",
        rawExportValueB: 6,
        onshoreProcessedValueB: 2850,
        multiplier: "475x Value Capture",
        explanation: "With 150+ GW of continuous zero-carbon hydro and geothermal baseload + subsea fiber cables at Mombasa, Lagos, and Cape Town + 50M STEM graduates, Africa becomes the world's lowest-cost AI training and cloud compute continent."
      },
      {
        sector: "Continental Agro-Processing, Green Ammonia & Branded Foods",
        rawExportValueB: 18,
        onshoreProcessedValueB: 1950,
        multiplier: "108x Value Capture",
        explanation: "Ends the $70B food import bill and converts 600M arable hectares + local green hydro/geothermal fertilizer into nearly $2 Trillion/yr of refined foods, proteins, cocoa/coffee brands, and cold-chain exports."
      },
      {
        sector: "Green Steel, Metallurgy & KEMRI/INRB Pharmaceuticals",
        rawExportValueB: 14,
        onshoreProcessedValueB: 2100,
        multiplier: "150x Value Capture",
        explanation: "Zero-carbon Congo River hydro smelts African iron ore, bauxite, and titanium into green steel and aerospace alloys, while African biotech hubs manufacture 100% of the continent's vaccines and medicines."
      }
    ]
  },

  // ==========================================================================
  // 2. DRC & CONGO BASIN BLUEPRINT ($54.8T INDUSTRIAL HEARTLAND)
  // ==========================================================================
  drc: {
    id: "drc",
    name: "DRC & Congo Basin ($54.8T Industrial Heartland)",
    badge: "THE GEOGRAPHIC, MINERAL & HYDROPOWER HEART OF AFRICA",
    headline: "How $75B Turns the Democratic Republic of the Congo into a $54.8 Trillion Engine",
    intro: "The DRC sits on the richest single piece of real estate on Earth ($24T+ in critical minerals, 80M arable hectares, 40+ GW Grand Inga hydro, and 9 bordering nations at the center of AfCFTA)—yet conventional plans fail when they attempt $80B megaprojects while 42% of children suffer from cognitive stunting and malaria drains 80M+ workdays/year. Applying Lomborg's strict Benefit-Cost Ratio sequencing unlocks a self-financing $54.8 Trillion industrial superpower.",
    endowments: [
      {
        metric: "$24+ Trillion",
        label: "Untapped Critical Minerals",
        detail: "70%+ of global cobalt, world's richest high-grade copper belt (Katanga), lithium (Manono), coltan, tin, and industrial gold.",
        bottleneck: "Currently exported as raw dirt (<5% value retained) due to lack of cheap local power and healthy technical workforce."
      },
      {
        metric: "80M Hectares",
        label: "Prime Arable Farmland",
        detail: "Combined with 52% of Africa's surface fresh water and year-round tropical sunlight—capable of feeding 2 billion people.",
        bottleneck: "Less than 12% cultivated; yields held back by lack of tropical crop R&D, soil micronutrients, and rural feeder roads."
      },
      {
        metric: "40+ GW (Inga)",
        label: "Continuous Baseload Hydro",
        detail: "The Congo River's natural drop at Inga plus hundreds of modular run-of-river sites can generate the cheapest green power on Earth (<$0.02/kWh).",
        bottleneck: "Mega-dams stall when attempted before solving institutional risk, property titles, and modular industrial demand."
      },
      {
        metric: "9 Border Nations",
        label: "The Geographic Heart of AfCFTA",
        detail: "Borders Angola, Zambia, Tanzania, Burundi, Rwanda, Uganda, South Sudan, CAR, and Congo-Brazzaville—linking Atlantic to Indian Ocean.",
        bottleneck: "Customs delays and unpaved corridors currently turn Africa's natural central clearinghouse into a trade barrier."
      }
    ],
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: "Phase I: Biological & Cognitive Liberation",
        phaseSubtitle: "Lomborg Priorities #1, #2, #3, #4 & #5 — Fixing the Human Engine First",
        budgetBillions: 22.0,
        avgBcr: 41,
        directEconomicBenefitBillions: 902,
        gdpMultiplierEffect: "+32% lifetime workforce cognitive & physical productivity",
        description: "You cannot build a $50 trillion industrial superpower when 42% of children suffer from chronic stunting and malaria steals 80+ million workdays a year. Following Lomborg's strict BCR law, the first $22B eliminates the biological tax on the Congolese people.",
        interventions: [
          {
            title: "Congo Basin Micronutrient & Anti-Stunting Blitz",
            lomborgRef: "Book Priority #1 (Horton et al.)",
            costB: 12.0,
            bcr: 45,
            benefitB: 540,
            outcome: "Eliminates childhood stunting across the DRC; raises average population IQ by 6–9 points and adult wage potential by 30%+."
          },
          {
            title: "Malaria Eradication (ACT Subsidies, Bed Nets) & School Deworming",
            lomborgRef: "Book Priorities #2, #3, #4 & #5 (Laxminarayan, Jamison et al.)",
            costB: 10.0,
            bcr: 36.2,
            benefitB: 362,
            outcome: "Crushes the DRC's 12% share of global malaria plus TB and hookworm. Makes the Congo Basin interior fully habitable for dense engineering universities and industrial supply chains."
          }
        ]
      },
      {
        phaseNumber: 2,
        phaseTitle: "Phase II: The Caloric & Agricultural Superpower",
        phaseSubtitle: "Lomborg Priorities #6 & #15 — Creating the Industrial Food Surplus",
        budgetBillions: 16.0,
        avgBcr: 19,
        directEconomicBenefitBillions: 304,
        gdpMultiplierEffect: "-40% continental food costs; frees labor for manufacturing",
        description: "Every economic superpower in history began with an agricultural revolution that made domestic calories abundant and cheap. Instead of importing food, $16B turns the DRC's 80 million arable hectares into the breadbasket of 2.5 billion people.",
        interventions: [
          {
            title: "Tropical Crop R&D (Disease-Resistant Cassava, Maize, Rice, Soy) & Soil Fertility",
            lomborgRef: "Book Priority #6 (Rosegrant et al.)",
            costB: 10.0,
            bcr: 22,
            benefitB: 220,
            outcome: "Triples smallholder crop yields across Katanga, Kasai, and Kivu without encroaching on primary rainforest."
          },
          {
            title: "Rural Solar Boreholes, Clean Water & Post-Harvest Cold Storage",
            lomborgRef: "Book Priority #15 (Whittington et al.)",
            costB: 6.0,
            bcr: 14,
            benefitB: 84,
            outcome: "Saves women 2+ hours/day hauling water and cuts post-harvest crop rot from 38% down to under 8%."
          }
        ]
      },
      {
        phaseNumber: 3,
        phaseTitle: "Phase III: High-ROI Human Capital & Adult Health Resilience",
        phaseSubtitle: "Lomborg Priorities #8, #10 & #13 — Building the Technical Workforce",
        budgetBillions: 12.0,
        avgBcr: 16,
        directEconomicBenefitBillions: 192,
        gdpMultiplierEffect: "45M+ STEM, vocational & engineering graduates entering the workforce",
        description: "With children now surviving and arriving at school well-nourished and parasite-free, Phase III ensures they stay in school through secondary and technical training—and protects adult engineers and managers from premature death.",
        interventions: [
          {
            title: "Conditional Cash Transfers for Secondary, Girls' & Vocational STEM Schooling",
            lomborgRef: "Book Priority #13 (Pritchett, Orazem et al.)",
            costB: 7.0,
            bcr: 16,
            benefitB: 112,
            outcome: "Replaces child artisanal mining and subsistence farm labor with verified attendance in electrical, metallurgical, and agronomic training."
          },
          {
            title: "District Surgical Capacity, Maternal Safety & Low-Cost Cardiac/Trauma Care",
            lomborgRef: "Book Priorities #8 & #10 (Gawande, Gaziano et al.)",
            costB: 5.0,
            bcr: 16,
            benefitB: 80,
            outcome: "Protects prime working-age adults (20–55) so skilled Congolese technicians and entrepreneurs compound their experience over 35+ year careers."
          }
        ]
      },
      {
        phaseNumber: 4,
        phaseTitle: "Phase IV: Institutional, Trade & Modular Hydro Catalyst",
        phaseSubtitle: "Lomborg Priorities #7, #12 & Trade Reform — Igniting the $54.8T Flywheel",
        budgetBillions: 25.0,
        avgBcr: 24,
        directEconomicBenefitBillions: 600,
        gdpMultiplierEffect: "Unlocks $5T+ in private capital & onshore mineral beneficiation",
        description: "Lowering trade barriers and securing property titles have massive Benefit-Cost Ratios because they unlock trillions in private investment. Combined with modular run-of-river hydro, this collapses the DRC's sovereign risk premium and forces global battery, green steel, and AI compute industries to relocate directly to the Congo Basin.",
        interventions: [
          {
            title: "Digitized Land Cadastre, Mining Titles & Property Rights",
            lomborgRef: "Institutional Reform / De Soto & Lomborg Trade Matrix",
            costB: 4.0,
            bcr: 50,
            benefitB: 200,
            outcome: "Converts $3T+ of informal Congolese land and artisanal claims from 'dead capital' into legally bankable collateral for domestic SMEs."
          },
          {
            title: "Modular Run-of-River Hydro (100–1,000 MW) & 9-Border Paved Logistics Corridors",
            lomborgRef: "Book Priority #12 (Green Energy R&D & Modular Infrastructure)",
            costB: 16.0,
            bcr: 17,
            benefitB: 272,
            outcome: "Delivers immediate $0.02/kWh clean power to Katanga/Kivu industrial zones and connects the Lobito (Atlantic) & Northern/Mombasa (Indian Ocean) corridors."
          },
          {
            title: "AfCFTA 9-Border Digital Customs Elimination & Disaster Early Warning",
            lomborgRef: "Book Priority #7 & Trade Liberalization",
            costB: 5.0,
            bcr: 25.6,
            benefitB: 128,
            outcome: "Slashes border transit times from 14 days to 4 hours, making the DRC the duty-free industrial clearinghouse for 2.5 billion African consumers."
          }
        ]
      }
    ],
    trajectories: {
      maxAxisT: 60.0,
      lomborg: {
        name: "Lomborg BCR-Sequenced DRC Superpower ($54.8T Peak)",
        color: "#0D9488",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.18, note: "Initial $75B deployed into 30:1–50:1 biological, caloric, and institutional foundations." },
          { year: "Year 10 (2036)", gdpT: 1.45, note: "Malaria & stunting crushed; agricultural yields triple; modular hydro powers onshore copper/cobalt refining." },
          { year: "Year 20 (2046)", gdpT: 6.80, note: "Non-stunted STEM youth enter workforce; domestic tax base self-finances full 40+ GW Grand Inga hydro grid." },
          { year: "Year 30 (2056)", gdpT: 19.50, note: "Global battery precursors, green steel, aluminum, and AI hyperscale data centers relocate to Congo Basin." },
          { year: "Year 40 (2066)", gdpT: 36.20, note: "DRC acts as the central manufacturing core of a 2.8-billion-person single African market (AfCFTA)." },
          { year: "Year 50 (2076)", gdpT: 54.80, note: "Surpasses legacy aging economies to become the largest national industrial economy in history." }
        ]
      },
      megaproject: {
        name: "The 'Megaproject-First' Trap ($4.1T Stall)",
        color: "#D97706",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.18, note: "$75B sunk into flagship mega-infrastructure before fixing health, agricultural, or institutional bottlenecks." },
          { year: "Year 10 (2036)", gdpT: 0.42, note: "Cost overruns eat 60% of capital; workforce remains burdened by malaria and high imported food costs." },
          { year: "Year 20 (2046)", gdpT: 0.95, note: "Enclave power exports electricity abroad while local SMEs lack property collateral or skilled technicians." },
          { year: "Year 30 (2056)", gdpT: 1.75, note: "Debt service on underutilized megaprojects crowds out public health and education." },
          { year: "Year 40 (2066)", gdpT: 2.80, note: "Slow incremental growth; misses the demographic dividend window." },
          { year: "Year 50 (2076)", gdpT: 4.10, note: "Remains a middle-income enclave economy (<8% of its true potential)." }
        ]
      },
      statusQuo: {
        name: "Raw Ore Extraction Status Quo ($1.55T Stagnation)",
        color: "#6B7280",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.18, note: "Raw mineral extraction with 95% of value-chain profits captured overseas." },
          { year: "Year 10 (2036)", gdpT: 0.29, note: "Population grows, but stunting and malaria keep per-capita productivity flat." },
          { year: "Year 20 (2046)", gdpT: 0.48, note: "Continued food import dependency drains foreign exchange reserves." },
          { year: "Year 30 (2056)", gdpT: 0.75, note: "Vulnerability to commodity price swings and external supply chains." },
          { year: "Year 40 (2066)", gdpT: 1.10, note: "Resource depletion in older mines without domestic industrial transition." },
          { year: "Year 50 (2076)", gdpT: 1.55, note: "Classic 'Resource Curse' stagnation despite sitting on $24T+ in natural wealth." }
        ]
      }
    },
    valueChains: [
      {
        sector: "Cobalt, Copper & Lithium Battery Chain",
        rawExportValueB: 18,
        onshoreProcessedValueB: 840,
        multiplier: "46x Value Capture",
        explanation: "Exporting raw cobalt hydroxide and copper concentrate captures <3% of EV/grid battery value. With Phase 1–3 skilled metallurgists and Phase 4 $0.02/kWh hydro power, the DRC manufactures cathode precursors and battery cells domestically."
      },
      {
        sector: "Congo Basin Agro-Processing & Fertilizer",
        rawExportValueB: 4,
        onshoreProcessedValueB: 620,
        multiplier: "155x Value Capture",
        explanation: "Instead of importing $3B+ in food, Phase 2 tropical crop R&D + green ammonia fertilizer turns 80M arable hectares into refined food, soy protein, cocoa, and cold-chain exports for 2.5B Africans."
      },
      {
        sector: "Green Steel, Aluminum & Titanium Smelting",
        rawExportValueB: 6,
        onshoreProcessedValueB: 780,
        multiplier: "130x Value Capture",
        explanation: "Smelting iron ore, bauxite, and titanium is 40–60% electricity cost. Zero-carbon Congo River hydro makes the DRC the most cost-competitive green metallurgy hub on Earth."
      },
      {
        sector: "Hyperscale AI Compute & Clean Cloud",
        rawExportValueB: 1,
        onshoreProcessedValueB: 950,
        multiplier: "950x Value Capture",
        explanation: "The #1 bottleneck for global AI data centers is continuous gigawatt-scale carbon-free baseload electricity. Grand Inga (40+ GW) paired with trans-African fiber turns the Congo Basin into a global compute powerhouse."
      }
    ]
  },

  // ==========================================================================
  // 3. KENYA BLUEPRINT ("THE SILICON SAVANNAH, GEOTHERMAL & INDIAN OCEAN HUB")
  // ==========================================================================
  kenya: {
    id: "kenya",
    name: "Kenya ($18.6T Silicon Savannah & Indian Ocean Superhub)",
    badge: "FINTECH, GEOTHERMAL & INDO-AFRICAN GATEWAY",
    headline: "Applying Lomborg’s Playbook to Turn Kenya into the 'Singapore + California' of Africa",
    intro: "Kenya is East Africa's economic, financial, and technological pacemaker—and notably the real-world proving ground for Lomborg's #4 global priority (the famous Busia, Kenya school deworming trials) as well as the Copenhagen Consensus 'Kenya Priorities' project. By sequencing high-BCR nutrition, ASAL climate-smart irrigation, digitized property titles, and 10+ GW Rift Valley geothermal industrial tariffs, Kenya transforms into an $18.6 Trillion Indo-African tech, biotech, and manufacturing titan.",
    endowments: [
      {
        metric: "10+ GW Geothermal",
        label: "Rift Valley Baseload Green Steam",
        detail: "Olkaria, Menengai, Suswa, and Paka sit on one of the world's richest volcanic geothermal rifts, paired with Lake Turkana wind and year-round solar (90%+ renewable grid).",
        bottleneck: "High retail/industrial tariffs ($0.16–$0.22/kWh) and grid transmission losses currently deter energy-intensive manufacturing."
      },
      {
        metric: "Mombasa & Lamu",
        label: "Indian Ocean Deepwater Gateway",
        detail: "Port of Mombasa + Lamu (LAPSSET) and the Standard Gauge Railway (SGR) form the maritime front door for 300M+ people across Kenya, Uganda, Rwanda, South Sudan, Ethiopia, and Eastern DRC.",
        bottleneck: "Customs friction, weighbridges, and missing last-mile SGR rail links to Malaba/Kisumu/DRC keep freight costs 2.5x above Asian benchmarks."
      },
      {
        metric: "Silicon Savannah",
        label: "FinTech, M-Pesa & STEM Talent Hub",
        detail: "Global pioneer in mobile money (M-Pesa), high youth literacy, vibrant startup ecosystem in Nairobi/Konza, and KEMRI biomedical research leadership.",
        bottleneck: "18–26% childhood stunting in rural/ASAL counties and SME credit crowding-out prevent millions of youth from reaching high-tech productivity."
      },
      {
        metric: "83% ASAL Landmass",
        label: "Untapped Irrigated Agro-Export Frontier",
        detail: "While only 17% of Kenya is high-rainfall land, massive underground aquifers (Turkana/Lotikipi) and the Tana/Galana basins can support year-round precision irrigation.",
        bottleneck: "Reliance on rain-fed smallholder maize leaves Kenya vulnerable to recurring droughts and 35% post-harvest crop loss."
      }
    ],
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: "Phase I: Full Cognitive & Health Liberation Across All 47 Counties",
        phaseSubtitle: "Lomborg Priorities #1, #2, #4 & #5 + Kenya Priorities — Zero Stunting & Zero Malaria",
        budgetBillions: 14.0,
        avgBcr: 44,
        directEconomicBenefitBillions: 616,
        gdpMultiplierEffect: "Raises national cognitive capital & eliminates the rural/ASAL stunting gap",
        description: "Even with Nairobi's dynamism, ~18% of Kenyan children nationally (and up to 30%+ in Kilifi, West Pokot, Turkana, and Samburu) suffer from chronic stunting, while malaria burdens the Lake Victoria and Coastal basins. Scaling Kenya's own Busia deworming triumph alongside bundled micronutrients delivers a 44:1 return.",
        interventions: [
          {
            title: "47-County Micronutrient Fortification & First-1,000-Days Nutrition Blitz",
            lomborgRef: "Book Priority #1 & Kenya Priorities (Horton et al.)",
            costB: 7.5,
            bcr: 48,
            benefitB: 360,
            outcome: "Drives childhood stunting below 3% nationwide, adding 7–10 IQ points and +35% lifetime earnings for rural and pastoralist youth."
          },
          {
            title: "National School Deworming (Busia Model), Lake/Coast Malaria Eradication & TB/HIV Control",
            lomborgRef: "Book Priorities #2, #4 & #5 (Kremer, Miguel, Laxminarayan)",
            costB: 6.5,
            bcr: 39.4,
            benefitB: 256,
            outcome: "Eradicates malaria in Kisumu/Mombasa endemic belts and scales TB/HIV treatment—unlocking tens of millions of healthy labor days."
          }
        ]
      },
      {
        phaseNumber: 2,
        phaseTitle: "Phase II: The ASAL Irrigation, Cold-Chain & Agro-Tech Revolution",
        phaseSubtitle: "Lomborg Priorities #6, #7 & #15 — Turning 83% Arid Lands into an Export Engine",
        budgetBillions: 18.0,
        avgBcr: 21,
        directEconomicBenefitBillions: 378,
        gdpMultiplierEffect: "3.5x agricultural output; ends drought food-inflation spikes permanently",
        description: "In Kenya, food inflation is the #1 driver of high interest rates and industrial wage pressure. Investing $18B into drought-tolerant KALRO crop R&D, solar drip-irrigation across ASAL counties, and farm-to-port cold chains permanently drought-proofs the republic.",
        interventions: [
          {
            title: "KALRO Drought-Tolerant Crop R&D, Soil Micronutrients & Precision Extension",
            lomborgRef: "Book Priority #6 (Rosegrant et al.)",
            costB: 10.0,
            bcr: 24,
            benefitB: 240,
            outcome: "Triples smallholder maize, sorghum, potato, tea, coffee, and avocado yields while slashing fertilizer import waste via soil-specific blending."
          },
          {
            title: "ASAL Solar Boreholes, Micro-Irrigation & Solar Cold-Chain Packhouses",
            lomborgRef: "Book Priorities #7 & #15 (Whittington, Buhaug et al.)",
            costB: 8.0,
            bcr: 17.25,
            benefitB: 138,
            outcome: "Cuts post-harvest horticultural loss from 35% to <5% and turns Turkana, Garissa, Tana River, and Kitui into irrigated food-export hubs."
          }
        ]
      },
      {
        phaseNumber: 3,
        phaseTitle: "Phase III: Silicon Savannah STEM, TVET & Universal Health Resilience",
        phaseSubtitle: "Lomborg Priorities #8, #10, #11 & #13 — Building a World-Class Engineering Workforce",
        budgetBillions: 15.0,
        avgBcr: 18,
        directEconomicBenefitBillions: 270,
        gdpMultiplierEffect: "15M+ software, semiconductor, biotech & precision-manufacturing engineers",
        description: "With 1 million young Kenyans entering the job market every year, Phase III uses M-Pesa conditional cash transfers and industry-linked TVET/university labs to turn Kenya into the world's premier English-speaking engineering and biotech hub—while county surgical and cardiac care protects experienced talent.",
        interventions: [
          {
            title: "M-Pesa Conditional STEM/TVET Scholarships & Konza/University Lab Scaling",
            lomborgRef: "Book Priority #13 (Pritchett et al.)",
            costB: 9.0,
            bcr: 18,
            benefitB: 162,
            outcome: "Transitions youth from informal 'jua kali' survival gigs into certified electrical, AI, biomedical, and mechatronics careers."
          },
          {
            title: "47-County Surgical Theatres, Maternal Safety & Low-Cost Hypertension/Cardiac Care",
            lomborgRef: "Book Priorities #8, #10 & #11 (Gawande, Gaziano et al.)",
            costB: 6.0,
            bcr: 18,
            benefitB: 108,
            outcome: "Slashes road-trauma disability and premature cardiovascular deaths among Kenya's prime 30–60-year-old professionals."
          }
        ]
      },
      {
        phaseNumber: 4,
        phaseTitle: "Phase IV: 10GW Geothermal SEZs, ArdhiSasa Land Titles & Northern Corridor",
        phaseSubtitle: "Lomborg Priority #12 & Institutional/Trade Reform — Igniting the $18.6T Flywheel",
        budgetBillions: 28.0,
        avgBcr: 29,
        directEconomicBenefitBillions: 812,
        gdpMultiplierEffect: "Drops industrial power to $0.04/kWh & unlocks $1.5T+ in SME bankable collateral",
        description: "Copenhagen Consensus research for Kenya proved that digitizing land registries and cutting port/corridor delays yield 40:1 to 60:1 returns. Paired with dedicated $0.04/kWh geothermal industrial parks in Naivasha/Olkaria/Menengai and seamless rail/road links into the DRC, Kenya becomes the undisputed Singapore of the Indian Ocean.",
        interventions: [
          {
            title: "Full 47-County Digital Land Cadastre (ArdhiSasa) & Automated SME Collateral Registry",
            lomborgRef: "Copenhagen Consensus Kenya Priorities — Governance & Property Rights",
            costB: 4.0,
            bcr: 55,
            benefitB: 220,
            outcome: "Eliminates land title fraud and court backlogs, turning $400B+ of Kenyan land and SME assets into instant, low-interest bankable capital."
          },
          {
            title: "Rift Valley Geothermal Baseload Scaling (Olkaria/Menengai) & Direct $0.04/kWh Industrial Tariffs",
            lomborgRef: "Book Priority #12 (Green Energy R&D & Baseload Deployment)",
            costB: 15.0,
            bcr: 24,
            benefitB: 360,
            outcome: "Eliminates expensive thermal power plants and powers 24/7 green data centers, green fertilizer, EV assembly, and semiconductor packaging in Naivasha/Konza."
          },
          {
            title: "Mombasa–Lamu–Nairobi–Malaba–Kisumu SGR/Corridor Completion & Paperless EAC-DRC Customs",
            lomborgRef: "Trade Liberalization & Corridor Bottleneck Removal",
            costB: 9.0,
            bcr: 25.8,
            benefitB: 232,
            outcome: "Cuts Mombasa-to-Kigali/Goma/Kisumu freight time by 70%, making Kenya the financial and maritime clearinghouse for East & Central Africa."
          }
        ]
      }
    ],
    trajectories: {
      maxAxisT: 20.0,
      lomborg: {
        name: "Lomborg BCR-Sequenced Kenya Superhub ($18.6T Peak)",
        color: "#0D9488",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.38, note: "Initial catalytic capital deployed into county nutrition, Busia-model deworming, ASAL irrigation, and ArdhiSasa land digitization." },
          { year: "Year 10 (2036)", gdpT: 1.35, note: "Kenya achieves 100% food sovereignty; industrial geothermal tariffs drop to $0.04/kWh in Naivasha/Menengai SEZs." },
          { year: "Year 20 (2046)", gdpT: 3.90, note: "Nairobi & Konza become the #1 global hub for English-speaking AI engineering, FinTech, and KEMRI pharmaceutical manufacturing." },
          { year: "Year 30 (2056)", gdpT: 8.20, note: "Mombasa & Lamu ports clear $2T+/yr in automated Indo-African trade linking India/Asia to the Congo Basin." },
          { year: "Year 40 (2066)", gdpT: 13.40, note: "High-income innovation economy matching Singapore and California in per-capita R&D and financial services." },
          { year: "Year 50 (2076)", gdpT: 18.60, note: "An $18.6 Trillion Indo-African technological, financial, and clean-industrial superpower." }
        ]
      },
      megaproject: {
        name: "Debt-Heavy Unsequenced Infrastructure ($2.4T Stall)",
        color: "#D97706",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.38, note: "Borrowing high-interest commercial debt for unsequenced concrete projects while industrial power remains $0.18/kWh." },
          { year: "Year 10 (2036)", gdpT: 0.62, note: "Debt service consumes 55%+ of tax revenue, crowding out county health, agricultural R&D, and SME credit." },
          { year: "Year 20 (2046)", gdpT: 0.98, note: "Recurring droughts still trigger food inflation spikes; railways carry imports one-way but return empty." },
          { year: "Year 30 (2056)", gdpT: 1.40, note: "Brain drain of top Kenyan STEM graduates abroad due to high domestic tax burden and expensive electricity." },
          { year: "Year 40 (2066)", gdpT: 1.85, note: "Slow service-led growth without deep industrial manufacturing base." },
          { year: "Year 50 (2076)", gdpT: 2.40, note: "Stalls at <13% of its true Lomborg-sequenced potential." }
        ]
      },
      statusQuo: {
        name: "Rain-Fed & Raw Commodity Status Quo ($1.15T Stagnation)",
        color: "#6B7280",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.38, note: "Exporting unroasted coffee/bulk tea while importing refined fuels, fertilizer, and wheat." },
          { year: "Year 10 (2036)", gdpT: 0.50, note: "High urban youth unemployment in informal sector; ASAL counties remain aid-dependent." },
          { year: "Year 20 (2046)", gdpT: 0.65, note: "Rising burden of untreated urban hypertension and chronic disease strains household savings." },
          { year: "Year 30 (2056)", gdpT: 0.80, note: "Trade corridors lose competitiveness to rival ports." },
          { year: "Year 40 (2066)", gdpT: 0.96, note: "Demographic window closes without industrial transition." },
          { year: "Year 50 (2076)", gdpT: 1.15, note: "Persistent balance-of-payments vulnerability." }
        ]
      }
    },
    valueChains: [
      {
        sector: "Geothermal AI Data Centers, Silicon & BPO",
        rawExportValueB: 3,
        onshoreProcessedValueB: 420,
        multiplier: "140x Value Capture",
        explanation: "By co-locating hyperscale data centers and chip packaging directly atop Olkaria/Menengai geothermal steam ($0.04/kWh) and pairing them with 5 subsea fiber cables at Mombasa + Kenyan AI engineers, Kenya exports high-margin global compute and software."
      },
      {
        sector: "Branded Specialty Agro-Processing & Nutraceuticals",
        rawExportValueB: 6,
        onshoreProcessedValueB: 310,
        multiplier: "51x Value Capture",
        explanation: "Instead of auctioning bulk unblended tea and raw green coffee beans (capturing <10% of retail shelf price), Phase 2 cold-chains + cheap geothermal steam allow Kenya to export freeze-dried specialty coffee, packaged tea, avocado oils, and pharmaceuticals."
      },
      {
        sector: "KEMRI Biotech, Vaccines & Medical Devices",
        rawExportValueB: 1,
        onshoreProcessedValueB: 260,
        multiplier: "260x Value Capture",
        explanation: "Africa currently imports 95%+ of its vaccines and medicines. Building on KEMRI and Nairobi's clinical research ecosystem, Kenya becomes the continental manufacturer of mRNA vaccines, generic cardiac polypills (#10), and surgical supplies."
      },
      {
        sector: "Indo-African Financial Clearing & Green Logistics",
        rawExportValueB: 5,
        onshoreProcessedValueB: 490,
        multiplier: "98x Value Capture",
        explanation: "With ArdhiSasa digital property rights, M-Pesa pan-African payment rails, and a frictionless Mombasa–Nairobi–Goma–Kinshasa corridor, Nairobi becomes the Wall Street and maritime insurer for a $70T+ East-Central African bloc."
      }
    ]
  },

  // ==========================================================================
  // 4. THE KENYA + DRC TWIN-ENGINE SUPERPOWER AXIS ($73.4T COMBINED MEGACORRIDOR)
  // ==========================================================================
  twinAxis: {
    id: "twinAxis",
    name: "Kenya + DRC Twin-Engine Axis ($73.4T Combined Megacorridor)",
    badge: "THE ULTIMATE EAST-CENTRAL AFRICAN SYNERGY",
    headline: "Why Kenya + DRC Together Form the Most Powerful Economic Axis in Human History",
    intro: "Look at a map of Africa through an economist's eyes: the DRC possesses the world's largest industrial resource, freshwater, and hydropower heartland ($24T minerals, 80M arable hectares, 40+ GW hydro), while Kenya possesses the Indian Ocean deepwater ports (Mombasa & Lamu), the Silicon Savannah FinTech/M-Pesa rails, 10+ GW Rift Valley geothermal, and East Africa's deepest capital & STEM market. Since the DRC joined the East African Community (EAC), applying Lomborg's $75B playbook across the Mombasa–Nairobi–Kisumu–Kampala–Kigali–Goma–Kinshasa–Katanga axis fuses them into a single $73.4 Trillion economic colossus.",
    endowments: [
      {
        metric: "350M → 650M+",
        label: "Combined Youthful Talent Pool",
        detail: "Fuses Kenya's English-speaking FinTech, software, and commercial ecosystem with the DRC's massive engineering, metallurgical, and agronomic scale.",
        bottleneck: "Unlocked by Phase 1: Joint eradication of childhood stunting, malaria, and parasitic load across the entire Lake Victoria-to-Congo River belt."
      },
      {
        metric: "50+ GW Clean Baseload",
        label: "The Geothermal + Hydro Power Grid",
        detail: "Kenya's 10+ GW Rift Valley Geothermal + DRC's 40+ GW Grand Inga & modular hydro creates the largest 100% renewable, 24/7 baseload electricity pool on Earth.",
        bottleneck: "East African Power Pool (EAPP) interconnectors allow volcanic geothermal and Congo River hydro to balance each other seamlessly."
      },
      {
        metric: "Dual-Ocean Bridge",
        label: "Mombasa/Lamu (Indian) ↔ Banana/Lobito (Atlantic)",
        detail: "Links the fastest-growing Asian markets (India, ASEAN, Gulf) via Kenya's Mombasa/Lamu ports directly into the heart of the DRC and out to the Atlantic.",
        bottleneck: "Digitizing EAC-AfCFTA customs turns a 21-day border ordeal into a 48-hour high-speed rail and fiber-optic superhighway."
      },
      {
        metric: "Minerals + Silicon",
        label: "End-to-End Tech & EV Supply Chain",
        detail: "DRC refines the copper, cobalt, lithium, and green steel; Kenyan & Congolese engineers design the software, battery management systems, and financial rails.",
        bottleneck: "Zero raw dirt leaves the corridor—100% of value-add stays onshore within the East-Central African bloc."
      }
    ],
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: "Phase I: Corridor-Wide Biological & Cognitive Eradication Blitz",
        phaseSubtitle: "Lomborg Priorities #1–#5 — From Mombasa to Matadi: Zero Stunting, Zero Malaria",
        budgetBillions: 20.0,
        avgBcr: 43,
        directEconomicBenefitBillions: 860,
        gdpMultiplierEffect: "Synchronized +30% human capital surge across 300M+ East & Central Africans",
        description: "Disease and malnutrition do not respect borders. Phase I coordinates a single cross-border public health and micronutrient blitz from the Kenyan Coast and Lake Victoria Basin through Uganda/Rwanda/Burundi into the Congo Basin.",
        interventions: [
          {
            title: "Joint EAC-DRC Micronutrient Fortification & Busia-Model Deworming Scale-Up",
            lomborgRef: "Book Priorities #1 & #4 (Horton, Kremer, Miguel)",
            costB: 10.0,
            bcr: 48,
            benefitB: 480,
            outcome: "Applies Kenya's proven Busia deworming and food fortification infrastructure across every school and maternity clinic from Nairobi to Kinshasa."
          },
          {
            title: "Cross-Border Malaria Vector Eradication, ACT Subsidy & KEMRI Vaccine Deployment",
            lomborgRef: "Book Priorities #2, #3 & #5 (Laxminarayan, Resch)",
            costB: 10.0,
            bcr: 38,
            benefitB: 380,
            outcome: "Uses KEMRI (Kenya) & INRB (DRC) biomedical networks to eliminate malaria and TB along the entire Northern and Central transport corridors."
          }
        ]
      },
      {
        phaseNumber: 2,
        phaseTitle: "Phase II: Continental Food Sovereignty & Green Fertilizer Loops",
        phaseSubtitle: "Lomborg Priorities #6 & #15 — Kenya Green Ammonia + DRC 80M Arable Hectares",
        budgetBillions: 16.0,
        avgBcr: 22,
        directEconomicBenefitBillions: 352,
        gdpMultiplierEffect: "Turns East-Central Africa into the #1 net food exporter on Earth",
        description: "Kenya uses its Olkaria geothermal power to manufacture zero-carbon green ammonia fertilizer, which travels west by rail to fertilize DRC's 80M rain-fed hectares and Kenya's irrigated ASAL farms—while Congolese grain and soy travel east to lower food costs across Kenyan cities.",
        interventions: [
          {
            title: "Joint KALRO–INERA Tropical & ASAL Crop R&D + Geothermal Green Fertilizer",
            lomborgRef: "Book Priority #6 (Rosegrant et al.)",
            costB: 10.0,
            bcr: 25,
            benefitB: 250,
            outcome: "Replaces expensive imported fertilizer with local geothermal/hydro green ammonia and triples cassava, maize, soy, tea, and horticulture yields."
          },
          {
            title: "Corridor Cold-Chain Logistics, Solar Boreholes & Post-Harvest Silos",
            lomborgRef: "Book Priority #15 (Whittington et al.)",
            costB: 6.0,
            bcr: 17,
            benefitB: 102,
            outcome: "Links Kivu and Katanga breadbaskets to Nairobi and Mombasa export terminals with zero post-harvest spoilage."
          }
        ]
      },
      {
        phaseNumber: 3,
        phaseTitle: "Phase III: Integrated FinTech, STEM & Biomedical Workforce",
        phaseSubtitle: "Lomborg Priorities #8, #10 & #13 — Fusing Silicon Savannah with Congo Engineering",
        budgetBillions: 14.0,
        avgBcr: 19,
        directEconomicBenefitBillions: 266,
        gdpMultiplierEffect: "60M+ bilingual (English/French/Swahili) engineers, coders & clinicians",
        description: "Swahili already unites Kenya and Eastern/Southern DRC culturally and commercially. Phase III scales mobile-money conditional scholarships, joint technical universities, and regional surgical/cardiac centers of excellence.",
        interventions: [
          {
            title: "M-Pesa Cross-Border Conditional STEM/TVET Stipends & Joint Engineering Institutes",
            lomborgRef: "Book Priority #13 (Pritchett et al.)",
            costB: 8.0,
            bcr: 19,
            benefitB: 152,
            outcome: "Trains a unified workforce fluent in Swahili, English, and French across metallurgy, geothermal/hydro grid engineering, and AI."
          },
          {
            title: "Regional Referral Surgical & Cardiovascular Network (Nairobi–Kisumu–Goma–Lubumbashi–Kinshasa)",
            lomborgRef: "Book Priorities #8 & #10 (Gawande, Gaziano)",
            costB: 6.0,
            bcr: 19,
            benefitB: 114,
            outcome: "Ensures world-class trauma, maternal, and cardiac care along the entire 3,500 km trans-African industrial belt."
          }
        ]
      },
      {
        phaseNumber: 4,
        phaseTitle: "Phase IV: The Trans-African SGR, Power Pool & Single Digital Market",
        phaseSubtitle: "Lomborg Priority #12 & Trade Reform — The $73.4 Trillion Megacorridor",
        budgetBillions: 25.0,
        avgBcr: 32,
        directEconomicBenefitBillions: 800,
        gdpMultiplierEffect: "Fuses Indian & Atlantic Oceans into a single duty-free industrial zone",
        description: "When Kenyan capital markets, M-Pesa digital rails, and Mombasa/Lamu ports connect seamlessly to DRC's $24T minerals and 40+ GW hydropower with zero customs friction and digitized land/mining titles, the Twin Axis outcompetes every manufacturing zone on Earth.",
        interventions: [
          {
            title: "Unified Blockchain/Digital Land & Mining Cadastre + Nairobi-Kinshasa Capital Market Link",
            lomborgRef: "Institutional & Property Rights Reform (50:1+ BCR)",
            costB: 4.0,
            bcr: 55,
            benefitB: 220,
            outcome: "Allows Congolese and Kenyan entrepreneurs to raise instant capital on the Nairobi Securities Exchange & Kinshasa banking rails using verified titles."
          },
          {
            title: "50+ GW Geothermal-Hydro Power Pool & Electric Freight Corridor (Mombasa–Nairobi–Goma–Kinshasa)",
            lomborgRef: "Book Priority #12 & Trade Corridor Integration",
            costB: 16.0,
            bcr: 26,
            benefitB: 416,
            outcome: "Connects Rift Valley geothermal and Congo River hydro to power electrified rail freight and Special Economic Zones from the Indian Ocean to the Atlantic."
          },
          {
            title: "One-Stop EAC-AfCFTA Paperless Customs & Disaster Early Warning Grid",
            lomborgRef: "Book Priority #7 & Doha/AfCFTA Trade Matrix",
            costB: 5.0,
            bcr: 32.8,
            benefitB: 164,
            outcome: "Eliminates internal border tariffs and weighbridge corruption—allowing goods from Goma or Lubumbashi to reach Mombasa ships in under 36 hours."
          }
        ]
      }
    ],
    trajectories: {
      maxAxisT: 75.0,
      lomborg: {
        name: "Lomborg-Sequenced Kenya + DRC Twin Superpower ($73.4T Combined)",
        color: "#0D9488",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.56, note: "Combined starting GDP (~$380B Kenya + ~$180B DRC PPP) launches coordinated $75B BCR-sequenced foundation." },
          { year: "Year 10 (2036)", gdpT: 2.80, note: "Zero stunting/malaria belt achieved; Kenyan green ammonia + DRC arable land ends regional food imports." },
          { year: "Year 20 (2046)", gdpT: 10.70, note: "Electrified Mombasa–Nairobi–Goma–Kinshasa–Lobito corridor links Indian & Atlantic Oceans; 50+ GW clean power pool online." },
          { year: "Year 30 (2056)", gdpT: 27.70, note: "DRC refines batteries & green metals; Kenya leads FinTech, AI compute, biotech & Indo-Pacific maritime trade." },
          { year: "Year 40 (2066)", gdpT: 49.60, note: "The Swahili-speaking East-Central African Megacorridor becomes the primary engine of global GDP growth." },
          { year: "Year 50 (2076)", gdpT: 73.40, note: "$73.4 Trillion combined economy ($54.8T DRC + $18.6T Kenya)—the largest regional economic axis in history." }
        ]
      },
      megaproject: {
        name: "Fragmented & Unsequenced Megaprojects ($6.5T Stall)",
        color: "#D97706",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.56, note: "Uncoordinated debt-funded projects with customs barriers still blocking Kenya-DRC trade." },
          { year: "Year 10 (2036)", gdpT: 1.04, note: "High electricity tariffs in Kenya and grid deficits in DRC keep factories from scaling." },
          { year: "Year 20 (2046)", gdpT: 1.93, note: "Both nations export raw commodities and import finished manufactured goods." },
          { year: "Year 30 (2056)", gdpT: 3.15, note: "Debt service and non-tariff barriers choke regional SME supply chains." },
          { year: "Year 40 (2066)", gdpT: 4.65, note: "Sub-optimal growth; misses the continental integration multiplier." },
          { year: "Year 50 (2076)", gdpT: 6.50, note: "Reaches less than 9% of the integrated Lomborg Twin-Engine potential." }
        ]
      },
      statusQuo: {
        name: "Siloed Status Quo ($2.70T Stagnation)",
        color: "#6B7280",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.56, note: "DRC exports raw ore; Kenya faces high power costs and rain-fed drought cycles." },
          { year: "Year 10 (2036)", gdpT: 0.79, note: "Slow per-capita income growth across both countries." },
          { year: "Year 20 (2046)", gdpT: 1.13, note: "Continued reliance on external food and pharmaceutical imports." },
          { year: "Year 30 (2056)", gdpT: 1.55, note: "Trade between Mombasa and Congo Basin remains bottlenecked." },
          { year: "Year 40 (2066)", gdpT: 2.06, note: "Aging demographic transition without industrial wealth accumulation." },
          { year: "Year 50 (2076)", gdpT: 2.70, note: "Leaves over $70 Trillion in human and industrial potential on the table." }
        ]
      }
    },
    valueChains: [
      {
        sector: "Trans-African EV, Battery & Green Mobility Ecosystem",
        rawExportValueB: 19,
        onshoreProcessedValueB: 1150,
        multiplier: "60x Value Capture",
        explanation: "DRC mines and refines the battery-grade cobalt, copper, and lithium using $0.02/kWh hydro; Kenyan & Congolese SEZs assemble the electric buses, 2-wheelers, grid packs, and embedded software exported out of Mombasa and Banana ports."
      },
      {
        sector: "Indo-African AI Compute, FinTech & Cloud Corridor",
        rawExportValueB: 4,
        onshoreProcessedValueB: 1370,
        multiplier: "342x Value Capture",
        explanation: "Mombasa's subsea cables + Olkaria Geothermal + Grand Inga Hydro create a 50+ GW zero-carbon compute corridor stretching from the Indian Ocean to the Atlantic, managed by Silicon Savannah and Kinshasa engineers."
      },
      {
        sector: "Continental Food, Cold-Chain & Fertilizer Self-Sufficiency",
        rawExportValueB: 10,
        onshoreProcessedValueB: 930,
        multiplier: "93x Value Capture",
        explanation: "Kenyan geothermal green ammonia fertilizes DRC's 80M arable hectares and Kenya's ASAL irrigated farms, feeding 2.5B Africans and exporting branded specialty foods worldwide."
      },
      {
        sector: "KEMRI–INRB Pharmaceuticals, Vaccines & Green Metallurgy",
        rawExportValueB: 7,
        onshoreProcessedValueB: 1040,
        multiplier: "148x Value Capture",
        explanation: "Combines DRC's green steel, titanium, and copper refining with Kenya's biomedical, vaccine, and precision device manufacturing—ending Africa's dependency on imported medicines and machinery."
      }
    ]
  }
};
