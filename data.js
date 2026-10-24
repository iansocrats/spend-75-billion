// ============================================================================
// DATA: HOW $75 BILLION CAN GROW AFRICA INTO THE BIGGEST ECONOMY TO EVER EXIST
// Unifying Bjørn Lomborg's Two Landmark Books:
// 1. "How to Spend $75 Billion to Make the World a Better Place" (2012)
// 2. "Best Things First: The 12 Most Efficient Solutions for the World's Poorest" (2023)
// ============================================================================

const BEST_THINGS_FIRST_12 = [
  {
    num: 1,
    title: "Childhood Immunization Expansion (Gavi Vaccines)",
    bcr: "101 : 1",
    phase: "Phase I • Biology",
    globalCostYr: "$1.7B/yr",
    africaImpact: "Saves 500,000+ children/yr across DRC, Nigeria, Ethiopia & rural Africa; #1 highest health return.",
    bookSource: "Best Things First (2023) • Chapter: Child Health"
  },
  {
    num: 2,
    title: "Trade Facilitation & Paperless Customs (AfCFTA)",
    bcr: "95 : 1",
    phase: "Phase IV • Trade & Scale",
    globalCostYr: "Ultra-Low Cost",
    africaImpact: "Slashes port & border delays by 75% from Mombasa/Lamu to Goma, Kinshasa, Lagos & Lobito.",
    bookSource: "Best Things First (2023) • Chapter: Trade"
  },
  {
    num: 3,
    title: "Maternal & Newborn Basic Emergency Care + Family Planning",
    bcr: "87 : 1",
    phase: "Phase I • Demographic Dividend",
    globalCostYr: "$5.5B/yr",
    africaImpact: "Saves 166k mothers & 1.2M newborns/yr while igniting Africa's 2-to-1 working-age Demographic Dividend.",
    bookSource: "Best Things First (2023) • Chapter: Maternal & Newborn"
  },
  {
    num: 4,
    title: "Pedagogical EdTech: Adaptive Software & 'Teaching at the Right Level'",
    bcr: "65 : 1",
    phase: "Phase III • 500M STEM Brains",
    globalCostYr: "$9.8B/yr",
    africaImpact: "Pioneered in Kenya (Tusome & tablet learning): 1 hr/day of adaptive software triples learning speed.",
    bookSource: "Best Things First (2023) • Chapter: Education"
  },
  {
    num: 5,
    title: "Malaria Eradication: PBO Nets, ACTs & Chemoprevention",
    bcr: "48 : 1",
    phase: "Phase I • Biology",
    globalCostYr: "$1.1B/yr",
    africaImpact: "95% of malaria deaths are in Africa (12% in DRC alone). Frees 400M+ healthy labor days/yr.",
    bookSource: "Best Things First (2023) & Spend $75B (#2)"
  },
  {
    num: 6,
    title: "Tuberculosis (TB) Eradication (DOTS & MDR-TB)",
    bcr: "46 : 1",
    phase: "Phase I • Workforce Protection",
    globalCostYr: "$6.2B/yr",
    africaImpact: "Saves ~1M prime working-age adults (20–50) in African megacities and mining corridors.",
    bookSource: "Best Things First (2023) & Spend $75B (#5)"
  },
  {
    num: 7,
    title: "Skilled Talent Mobility & Cross-Border Engineering Visas",
    bcr: "45 : 1",
    phase: "Phase III • Talent Mobility",
    globalCostYr: "Policy Reform",
    africaImpact: "Visa-free AfCFTA movement lets Kenyan FinTech/AI coders & Congolese metallurgists deploy continent-wide.",
    bookSource: "Best Things First (2023) • Chapter: Migration"
  },
  {
    num: 8,
    title: "Maternal Multiple Micronutrients (MMS) & Anti-Stunting Bundle",
    bcr: "38 : 1",
    phase: "Phase I • Cognitive IQ Surge",
    globalCostYr: "$3.3B/yr",
    africaImpact: "Stops brain stunting in utero and in the first 1,000 days; raises adult wages by 30–40%.",
    bookSource: "Best Things First (2023) & Spend $75B (#1)"
  },
  {
    num: 9,
    title: "Government E-Procurement Systems (Anti-Corruption Digital Rails)",
    bcr: "38 : 1",
    phase: "Phase IV • Zero-Leakage Governance",
    globalCostYr: "$0.5B/yr",
    africaImpact: "Digitizing public tenders eliminates bid-rigging and cuts African road/dam/grid construction costs by 6–15%.",
    bookSource: "Best Things First (2023) • Chapter: Governance"
  },
  {
    num: 10,
    title: "Digitized Land & Mining Tenure Security (ArdhiSasa / Rwanda Model)",
    bcr: "35 : 1",
    phase: "Phase IV • Collateral Unlock",
    globalCostYr: "$1.6B/yr",
    africaImpact: "Verifiable digital titles unlock $4T+ in 'dead capital' so African SMEs & farmers can secure bank loans.",
    bookSource: "Best Things First (2023) • Chapter: Land Tenure"
  },
  {
    num: 11,
    title: "Agricultural R&D for High-Yield, Climate-Resilient Seeds",
    bcr: "33 : 1",
    phase: "Phase II • Caloric Superpower",
    globalCostYr: "$1.8B/yr",
    africaImpact: "KALRO (Kenya), INERA (DRC) & CGIAR high-yield seeds triple smallholder harvests across 600M arable hectares.",
    bookSource: "Best Things First (2023) & Spend $75B (#6)"
  },
  {
    num: 12,
    title: "Chronic Hypertension & Cardiovascular Management (Generic Pills)",
    bcr: "19 : 1",
    phase: "Phase III • Senior Talent Retention",
    globalCostYr: "$3.5B/yr",
    africaImpact: "Low-cost generic blood pressure & heart meds save 1.5M experienced managers, teachers & engineers/yr.",
    bookSource: "Best Things First (2023) & Spend $75B (#10)"
  }
];

const GLOBAL_INTERVENTIONS = [
  // --- THE 16 UNIFIED LOMBORG AFRICAN SUPERPOWER CATALYSTS ($75.0B TOTAL) ---
  // Combining "How to Spend $75B" (2012) + "Best Things First: 12 Solutions" (2023)
  {
    id: "childhood-immunization",
    rank: 1,
    isWinner: true,
    title: "100% African Childhood Immunization Expansion (Best Things First #1 Health ROI)",
    shortTitle: "Childhood Immunization (101:1)",
    category: "Biological & Cognitive Foundation",
    costBillions: 4.0,
    bcr3pct: 101,
    bcr5pct: 68,
    dalyMultiplierHigh: 1.5,
    authors: "Best Things First (2023) & Spend $75B (#3)",
    livesSavedOrImpacted: "500,000+ African children saved/yr • 101:1 ROI",
    summary: "Scaling Gavi rotavirus, pneumococcal, measles, DTP, and HPV immunization to reach every child across the DRC, Nigeria, Ethiopia, Kenya, and rural Africa.",
    whyItWins: "In Best Things First (2023), childhood immunization achieved a 101:1 Benefit-Cost Ratio—saving half a million lives annually while triggering parental confidence to invest heavily in each child's education.",
    drcRelevance: "Delivers $404B in human capital from a $4B outlay across rural DRC provinces and Kenyan pastoralist counties."
  },
  {
    id: "afcfta-trade-facilitation",
    rank: 2,
    isWinner: true,
    title: "AfCFTA Paperless Trade Facilitation & Port/Border Customs Digitization",
    shortTitle: "Paperless AfCFTA Customs (95:1)",
    category: "Trade, Rights & Clean Power",
    costBillions: 2.0,
    bcr3pct: 95,
    bcr5pct: 65,
    dalyMultiplierHigh: 1.2,
    authors: "Best Things First (2023) • Trade Facilitation Priority",
    livesSavedOrImpacted: "Cuts border transit times by 75% across 54 nations",
    summary: "Replacing paper customs, weighbridge bribery, and border queues with automated single-window digital clearing across Mombasa, Lamu, Dar es Salaam, Goma, Kinshasa, Lobito, and Lagos.",
    whyItWins: "Best Things First proved that digitizing trade facilitation yields a staggering 95:1 return—fusing 54 fragmented African markets into one frictionless superpower economy.",
    drcRelevance: "Turns the DRC's 9 borders and Kenya's Northern Corridor from a 14-day bottleneck into a 24-hour high-speed logistics bridge."
  },
  {
    id: "maternal-newborn-dividend",
    rank: 3,
    isWinner: true,
    title: "Maternal & Newborn Basic Emergency Care + Demographic Dividend Catalyst",
    shortTitle: "Maternal Care & Demographic Dividend (87:1)",
    category: "Biological & Cognitive Foundation",
    costBillions: 5.5,
    bcr3pct: 87,
    bcr5pct: 58,
    dalyMultiplierHigh: 1.6,
    authors: "Best Things First (2023) • Maternal & Family Planning Priority",
    livesSavedOrImpacted: "166k mothers & 1.2M newborns saved/yr • 87:1 ROI",
    summary: "Bundling basic emergency obstetric and newborn care (BEmONC) in district clinics with voluntary family planning across Sub-Saharan Africa.",
    whyItWins: "At 87:1 ROI in Best Things First, this is the engine of the 'Demographic Dividend': when mothers and babies survive and families choose birth spacing, working-age adults outnumber dependents 2-to-1—unlocking explosive GDP per capita growth.",
    drcRelevance: "Directly accelerates the demographic transition across the DRC (390M peak) and Kenya (115M peak)."
  },
  {
    id: "adaptive-edtech-tarl",
    rank: 4,
    isWinner: true,
    title: "Pedagogical EdTech: Adaptive Learning Software & 'Teaching at the Right Level'",
    shortTitle: "Adaptive EdTech & Pedagogy (65:1)",
    category: "Education & STEM Workforce",
    costBillions: 8.5,
    bcr3pct: 65,
    bcr5pct: 42,
    dalyMultiplierHigh: 1.4,
    authors: "Best Things First (2023) • Education Breakthrough (Proven in Kenya)",
    livesSavedOrImpacted: "Triples learning speed for 150M+ African students",
    summary: "1 hour/day of solar-charged tablet adaptive math/literacy software paired with structured teacher lesson plans grouped by student skill level rather than age.",
    whyItWins: "The breakout star of Best Things First (2023): pioneered and proven in Kenya (Tusome & structured pedagogy), it delivers 3 years of learning in 1 year at a 65:1 Benefit-Cost Ratio!",
    drcRelevance: "Scales Kenya's Silicon Savannah EdTech triumph into every school across the DRC and all 54 African nations."
  },
  {
    id: "deworming",
    rank: 5,
    isWinner: true,
    title: "Universal African School Deworming (The Busia, Kenya Model)",
    shortTitle: "Universal School Deworming (60:1)",
    category: "Education & STEM Workforce",
    costBillions: 1.5,
    bcr3pct: 60,
    bcr5pct: 36,
    dalyMultiplierHigh: 1.5,
    authors: "Spend $75B (#4) • Kremer, Miguel, Verguet & Jamison",
    livesSavedOrImpacted: "250M+ African schoolchildren treated every year",
    summary: "Scaling Kenya's Nobel-winning Busia primary school deworming model ($0.50/child/year) to every school from Kinshasa and Nairobi to Lagos and Addis Ababa.",
    whyItWins: "Cuts school absenteeism by 25% and increases adult earnings by ~20% decades later—ensuring students are healthy enough to master the 65:1 EdTech curriculum.",
    drcRelevance: "Pairs with Adaptive EdTech (#4) to create the world's highest-performing youth STEM pipeline."
  },
  {
    id: "malaria-act",
    rank: 6,
    isWinner: true,
    title: "Pan-African Malaria Eradication: Next-Gen PBO Nets, ACTs & Chemoprevention",
    shortTitle: "Malaria Eradication (48:1)",
    category: "Biological & Cognitive Foundation",
    costBillions: 5.0,
    bcr3pct: 48,
    bcr5pct: 36,
    dalyMultiplierHigh: 1.8,
    authors: "Best Things First (2023) & Spend $75B (#2)",
    livesSavedOrImpacted: "500,000+ African lives & 400M+ workdays saved/yr",
    summary: "Deploying pyrethroid-PBO long-lasting nets, subsidized Artemisinin Combination Therapies (ACTs), and seasonal malaria chemoprevention across the Congo Basin, Lake Victoria, and West Africa.",
    whyItWins: "Africa suffers 95% of global malaria deaths. At a 48:1 BCR in Best Things First, eradicating malaria makes the tropical interior of Africa fully habitable for dense industrial supply chains.",
    drcRelevance: "Eliminates the #1 cause of worker and student absenteeism in the DRC (12% of global cases) and Western/Coastal Kenya."
  },
  {
    id: "tuberculosis",
    rank: 7,
    isWinner: true,
    title: "Crushing Tuberculosis (DOTS & MDR-TB) Among Prime Working-Age Africans",
    shortTitle: "TB Eradication (46:1)",
    category: "Biological & Cognitive Foundation",
    costBillions: 5.5,
    bcr3pct: 46,
    bcr5pct: 32,
    dalyMultiplierHigh: 1.7,
    authors: "Best Things First (2023) & Spend $75B (#5)",
    livesSavedOrImpacted: "1M+ prime working-age adults saved annually • 46:1 ROI",
    summary: "Rapid molecular diagnostics, preventive therapy, and Directly Observed Treatment (DOTS) across African cities and mining belts.",
    whyItWins: "Ranked 46:1 in Best Things First: TB disproportionately strikes adults aged 20–50 at the peak of their industrial, engineering, and entrepreneurial output.",
    drcRelevance: "Protects the core industrial workforce in Kinshasa, Lubumbashi, Nairobi, Johannesburg, and Lagos."
  },
  {
    id: "micronutrients",
    rank: 8,
    isWinner: true,
    title: "Maternal Multiple Micronutrients (MMS) & First-1,000-Days Anti-Stunting Blitz",
    shortTitle: "Maternal & Child Micronutrients (45:1)",
    category: "Biological & Cognitive Foundation",
    costBillions: 10.0,
    bcr3pct: 45,
    bcr5pct: 31,
    dalyMultiplierHigh: 1.7,
    authors: "Best Things First (2023) & Spend $75B (#1) • Horton et al.",
    livesSavedOrImpacted: "120M+ African children protected from brain stunting",
    summary: "Upgrading prenatal iron/folate to 15-vitamin Multiple Micronutrient Supplements (MMS) plus infant Vitamin A, zinc, calcium, and iodized salt across Africa.",
    whyItWins: "Prevents irreversible brain stunting in utero and during the first 1,000 days—permanently raising continental IQ by 6–10 points and adult wages by 30–40%.",
    drcRelevance: "Eradicates the DRC's 42% stunting rate and Kenya's 18–26% rural/ASAL stunting rate."
  },
  {
    id: "skilled-talent-mobility",
    rank: 9,
    isWinner: true,
    title: "AfCFTA Skilled Talent Mobility & Mutual Engineering/Medical Licensing",
    shortTitle: "AfCFTA Skilled Mobility (45:1)",
    category: "Education & STEM Workforce",
    costBillions: 1.5,
    bcr3pct: 45,
    bcr5pct: 34,
    dalyMultiplierHigh: 1.3,
    authors: "Best Things First (2023) • Skilled Migration Priority",
    livesSavedOrImpacted: "Allows 50M+ African engineers & clinicians to deploy frictionlessly",
    summary: "Eliminating intra-African work-permit barriers and recognizing engineering, medical, and technical degrees across all 54 AfCFTA states.",
    whyItWins: "Best Things First showed that letting skilled workers move where their productivity is needed most generates massive immediate wage and GDP gains at near-zero fiscal cost.",
    drcRelevance: "Allows Kenyan FinTech/geothermal engineers and Congolese hydro/metallurgical specialists to build seamlessly across borders."
  },
  {
    id: "e-procurement-governance",
    rank: 10,
    isWinner: true,
    title: "Government E-Procurement Systems (Anti-Corruption Digital Rails)",
    shortTitle: "Anti-Corruption E-Procurement (38:1)",
    category: "Trade, Rights & Clean Power",
    costBillions: 1.5,
    bcr3pct: 38,
    bcr5pct: 28,
    dalyMultiplierHigh: 1.2,
    authors: "Best Things First (2023) • Governance & Anti-Corruption Priority",
    livesSavedOrImpacted: "Slashes African infrastructure procurement costs by 6%–15%",
    summary: "Mandating transparent, end-to-end digital e-procurement portals for all public infrastructure tenders, medicine purchases, and state contracts across all 54 African governments.",
    whyItWins: "At a 38:1 ROI in Best Things First, e-procurement crushes kickbacks and bid-rigging—saving tens of billions of dollars when Africa builds roads, hydro dams, and hospitals.",
    drcRelevance: "Eliminates the 'corruption risk premium' on DRC mining/hydro projects and Kenyan county infrastructure."
  },
  {
    id: "afcfta-property-rights",
    rank: 11,
    isWinner: true,
    title: "Digitized Land & Mining Tenure Security (ArdhiSasa & Rwanda Model)",
    shortTitle: "Digital Land & Mining Titles (52:1)",
    category: "Trade, Rights & Clean Power",
    costBillions: 3.5,
    bcr3pct: 52,
    bcr5pct: 35,
    dalyMultiplierHigh: 1.3,
    authors: "Best Things First (2023) • Land Tenure Security Priority",
    livesSavedOrImpacted: "Unlocks $4T+ in dead capital for African SMEs & farmers",
    summary: "Systematic satellite/drone parcel mapping and blockchain-verifiable digital land and mining titles across the DRC, Kenya (ArdhiSasa), Nigeria, and AfCFTA.",
    whyItWins: "Highlighted in Best Things First: secure property rights double long-term investment on land and convert informal holdings into bankable collateral for domestic entrepreneurs.",
    drcRelevance: "Turns informal Congolese and Kenyan plots into instant, low-interest SME business capital."
  },
  {
    id: "agricultural-rd",
    rank: 12,
    isWinner: true,
    title: "Climate-Resilient Agricultural R&D (CGIAR / KALRO / INERA High-Yield Seeds)",
    shortTitle: "Climate-Resilient Seed R&D (33:1)",
    category: "Caloric & Agricultural Surplus",
    costBillions: 8.0,
    bcr3pct: 33,
    bcr5pct: 24,
    dalyMultiplierHigh: 1.4,
    authors: "Best Things First (2023) & Spend $75B (#6)",
    livesSavedOrImpacted: "Triples yields across DRC's 80M ha & Kenya's ASAL lands • 33:1 ROI",
    summary: "Scaling public R&D into heat/drought-tolerant maize, sorghum, wheat, disease-resistant cassava, and soil micronutrient blending.",
    whyItWins: "Rated 33:1 in Best Things First: agricultural R&D is the prerequisite to industrialization—ending Africa's $70B/yr food import bill and cutting urban food costs by 40%.",
    drcRelevance: "Transforms the Congo Basin and East African rift into the caloric superpower of a 3-billion-person continent."
  },
  {
    id: "early-warning",
    rank: 13,
    isWinner: true,
    title: "Continental Weather Radar, Hydrological & Climate Early Warning",
    shortTitle: "Disaster Early Warning (35:1)",
    category: "Trade, Rights & Clean Power",
    costBillions: 3.0,
    bcr3pct: 35,
    bcr5pct: 21,
    dalyMultiplierHigh: 1.5,
    authors: "Spend $75B (#7) • Buhaug & Weather Resilience Panel",
    livesSavedOrImpacted: "$40B+/yr in African harvests, hydro dams & rails protected",
    summary: "Continent-wide Doppler radar, satellite soil-moisture tracking, and mobile alerts for farmers, hydropower operators, and port authorities.",
    whyItWins: "Gives Kenyan and Horn of Africa farmers weeks of lead time for El Niño/La Niña shifts and protects Congo River hydro and coastal port infrastructure.",
    drcRelevance: "Safeguards the Mombasa–Nairobi–Goma–Kinshasa–Lobito infrastructure spine."
  },
  {
    id: "geoengineering-rd",
    rank: 14,
    isWinner: true,
    title: "Modular Baseload Hydro (Congo) & Geothermal (Rift Valley) Clean Power",
    shortTitle: "Modular Hydro & Geothermal (30:1)",
    category: "Trade, Rights & Clean Power",
    costBillions: 6.0,
    bcr3pct: 30,
    bcr5pct: 19,
    dalyMultiplierHigh: 1.4,
    authors: "Spend $75B (#12) • Green Energy R&D & Baseload Deployment",
    livesSavedOrImpacted: "Unlocks $0.02–$0.04/kWh industrial power across DRC & Kenya",
    summary: "Deploying catalytic de-risking guarantees and R&D for modular Congo River run-of-river hydro (100–1,000 MW) and Kenya's Olkaria/Menengai geothermal steam SEZs.",
    whyItWins: "Making clean baseload electricity cheaper than coal and diesel ($0.02/kWh DRC hydro + $0.04/kWh Kenya geothermal) forces global battery, green steel, and AI industries to relocate to Africa.",
    drcRelevance: "Generates the industrial tax base that self-finances the full 40+ GW Grand Inga Dam."
  },
  {
    id: "boreholes-water",
    rank: 15,
    isWinner: true,
    title: "Solar Boreholes, Aquifer Micro-Irrigation & Cold-Chain Storage",
    shortTitle: "Solar Boreholes & Cold Chains (19:1)",
    category: "Caloric & Agricultural Surplus",
    costBillions: 5.5,
    bcr3pct: 19,
    bcr5pct: 13,
    dalyMultiplierHigh: 1.6,
    authors: "Spend $75B (#15) • Whittington, Hanemann & Jeuland",
    livesSavedOrImpacted: "180M+ rural Africans gaining clean water & crop storage",
    summary: "Tapping Africa's underground aquifers (Turkana/Lotikipi in Kenya and Congo Basin villages) with solar boreholes, drip irrigation, and solar cold-chain packhouses.",
    whyItWins: "Slashes post-harvest crop rot from 38% to <5%, eliminates waterborne diarrheal nutrient loss, and liberates 2+ hours/day for tens of millions of African women.",
    drcRelevance: "Drought-proofs Kenya's 83% ASAL landmass and brings clean village water to rural DRC."
  },
  {
    id: "chronic-surgical-bundle",
    rank: 16,
    isWinner: true,
    title: "Chronic Hypertension/Cardiac Generic Pills & District Surgical Theatres",
    shortTitle: "Hypertension & District Surgery (19:1)",
    category: "Health & Workforce Resilience",
    costBillions: 4.0,
    bcr3pct: 19,
    bcr5pct: 15,
    dalyMultiplierHigh: 1.9,
    authors: "Best Things First (2023) & Spend $75B (#8, #10, #11)",
    livesSavedOrImpacted: "1.5M+ senior African managers, engineers & mothers saved/yr",
    summary: "Combining generic hypertension/cardiac 'polypills' and salt reduction with county/district hospital trauma and obstetric surgical theatres.",
    whyItWins: "Rated 19:1 in Best Things First: protects Africa's prime 30–65-year-old engineers, executives, teachers, and technicians from premature stroke, heart attack, and trauma disability.",
    drcRelevance: "Preserves institutional knowledge across Nairobi, Kinshasa, Lagos, Cairo, and Johannesburg."
  },

  // --- 4 LOW-BCR AFRICAN DEVELOPMENT TRAPS (DECOYS FOR SIMULATOR COMPARISON) ---
  {
    id: "megaproject-prestige",
    rank: 17,
    isWinner: false,
    title: "Unsequenced $80B Mega-Dams & White-Elephant Projects Without E-Procurement",
    shortTitle: "Unsequenced Mega-Projects",
    category: "Trade, Rights & Clean Power",
    costBillions: 30.0,
    bcr3pct: 1.7,
    bcr5pct: 1.1,
    dalyMultiplierHigh: 1.0,
    authors: "LOW-BCR TRAP • Conventional 'Concrete-First' Fallacy",
    livesSavedOrImpacted: "High external debt service; low domestic SME spillover",
    summary: "Borrowing $30B in commercial debt for giant prestige infrastructure before implementing E-Procurement (#10), fixing stunting/malaria, or securing SME land titles.",
    whyItWins: "RANKED POOR WHEN UNSEQUENCED: Without digital e-procurement, healthy skilled workers, and local industrial off-takers, mega-projects suffer massive cost overruns. Sequence Phases 1–4 first so mega-infrastructure becomes self-financing!",
    drcRelevance: "Why DRC's Grand Inga and Kenya's SGR/LAPSSET must be preceded by Lomborg's 38:1–101:1 catalysts."
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
    authors: "LOW-BCR TRAP • Lomborg SDG & Climate Critique",
    livesSavedOrImpacted: "Chokes African manufacturing & forces charcoal deforestation",
    summary: "Penalizing African industrial energy use or maintaining $0.18–$0.22/kWh retail tariffs instead of scaling cheap baseload hydro and geothermal.",
    whyItWins: "RANKED POOR BY NOBEL PANEL: Starving Africa of cheap abundant electricity keeps billions poor and forces families to burn wood and charcoal—destroying the Congo Basin and Mau forests.",
    drcRelevance: "Abundant $0.02–$0.04/kWh hydro and geothermal is how Africa industrializes AND saves its forests."
  },
  {
    id: "untargeted-school-spending",
    rank: 19,
    isWinner: false,
    title: "Business-as-Usual School Spending Without Adaptive EdTech or Nutrition",
    shortTitle: "Schools Without EdTech/Nutrition",
    category: "Education & STEM Workforce",
    costBillions: 15.0,
    bcr3pct: 2.3,
    bcr5pct: 1.5,
    dalyMultiplierHigh: 1.2,
    authors: "LOW-BCR TRAP • Best Things First Education Comparison",
    livesSavedOrImpacted: "30x less effective than Adaptive EdTech (65:1) + Deworming (60:1)",
    summary: "Pouring $15B into untargeted brick-and-mortar inputs while students remain stunted, worm-burdened, and taught via rigid one-size-fits-all curricula.",
    whyItWins: "RANKED LOW IN BEST THINGS FIRST: Unfocused educational spending returns barely $2 per $1, whereas Adaptive EdTech at the Right Level (#4) returns $65 per $1!",
    drcRelevance: "Proves why Kenya's Tusome/Adaptive EdTech + Busia Deworming model is the gold standard."
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
// THE 4 AFRICAN SUPERPOWER BLUEPRINTS (UNIFIED 2012 + 2023 LOMBORG MODEL):
// 1. ALL-AFRICA CONTINENTAL COLOSSUS ($145.0T)
// 2. DRC & CONGO BASIN HEARTLAND ($54.8T)
// 3. KENYA SILICON SAVANNAH & INDIAN OCEAN HUB ($18.6T)
// 4. KENYA + DRC TWIN-ENGINE MEGACORRIDOR ($73.4T)
// ============================================================================

const AFRICAN_BLUEPRINTS = {
  africa: {
    id: "africa",
    name: "All-Africa Continental Superpower ($145.0T Peak)",
    badge: "THE 54-NATION SUPERCONTINENT • UNIFIED $75B + BEST THINGS FIRST MODEL",
    headline: "Why $75B—Deployed via 'Best Things First'—Grows Africa Into the Biggest Economy That Will Ever Exist",
    intro: "By combining Bjørn Lomborg's 'How to Spend $75 Billion' (2012) with his latest 'Best Things First: The 12 Most Efficient Solutions' (2023), the weighted Benefit-Cost Ratio of our $75B African Catalyst surges to 52.4 : 1—generating $3.93 Trillion in immediate economic surplus and saving 3.5+ million African lives every year. While every other continent is aging and shrinking, Africa's 3+ billion people, 600M arable hectares, $50T+ minerals, and 150+ GW baseload hydro/geothermal compound into an unbeatable $145.0 Trillion economy.",
    endowments: [
      {
        metric: "3.0+ Billion",
        label: "The Ultimate Demographic Monopoly",
        detail: "While Europe, China, and East Asia shrink and age, Africa's working-age population will exceed 1.8 billion—more young talent than the rest of the world combined.",
        bottleneck: "Unlocked by Phase I (101:1 Vaccines + 87:1 Maternal/Demographic Dividend + 45:1 MMS Micronutrients)."
      },
      {
        metric: "600M Hectares",
        label: "60% of Earth's Uncultivated Arable Land",
        detail: "Anchored by the DRC's 80M rain-fed hectares, the Nile/Great Lakes basins, and vast underground aquifers capable of feeding 9 billion people.",
        bottleneck: "Unlocked by Phase II: Best Things First Agricultural Seed R&D (33:1) + Solar Borehole Irrigation (19:1)."
      },
      {
        metric: "150+ GW Baseload",
        label: "Cheapest Clean Energy on Earth",
        detail: "DRC's 40+ GW Grand Inga & modular hydro + Kenya's 10+ GW Rift Valley Geothermal + 40% of global solar capacity creates an unbeatable $0.02/kWh clean grid.",
        bottleneck: "Unlocked by Phase IV: Modular hydro/geothermal SEZs (30:1) + E-Procurement (38:1) cutting build costs by 15%."
      },
      {
        metric: "$50T+ Minerals",
        label: "Monopoly on Future Industrial Inputs",
        detail: "70%+ of cobalt (DRC), 60%+ of manganese & platinum, massive copper (DRC/Zambia), lithium, bauxite, iron ore, and rare earths across 54 AfCFTA nations.",
        bottleneck: "Unlocked by Phase III & IV: 65:1 Adaptive EdTech + 95:1 Paperless AfCFTA Customs + 52:1 Digital Land Titles."
      }
    ],
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: "Phase I: Biological, Cognitive & Demographic Liberation",
        phaseSubtitle: "Best Things First #1, #3, #5, #6 & #8 — 101:1 Vaccines, 87:1 Maternal Care & Zero Stunting",
        budgetBillions: 30.0,
        avgBcr: 59.3,
        directEconomicBenefitBillions: 1780,
        gdpMultiplierEffect: "Saves 3M+ lives/yr, raises IQ by 6–10 pts & triggers the 2-to-1 Demographic Dividend",
        description: "Combining Best Things First (2023) with Spend $75B (2012) supercharges Phase I: Childhood Immunization delivers a 101:1 return, Basic Emergency Obstetric/Newborn Care + Family Planning delivers 87:1 (igniting the East-Asian-style Demographic Dividend), Malaria PBO Nets/ACTs deliver 48:1, TB DOTS delivers 46:1, and Maternal Multiple Micronutrients (MMS) deliver 45:1.",
        interventions: [
          {
            title: "Childhood Immunization (101:1) + Maternal/Newborn Care & Demographic Dividend (87:1)",
            lomborgRef: "Best Things First #1 & #3 • $9.5B Cost",
            costB: 9.5,
            bcr: 92.9,
            benefitB: 883,
            outcome: "Saves 500k children and 1.36M mothers/newborns annually while shifting Africa's dependency ratio to fuel rapid per-capita GDP compounding."
          },
          {
            title: "Maternal MMS Micronutrients (45:1), Malaria PBO Nets/ACTs (48:1) & TB Eradication (46:1)",
            lomborgRef: "Best Things First #5, #6 & #8 • $20.5B Cost",
            costB: 20.5,
            bcr: 43.8,
            benefitB: 897,
            outcome: "Stops brain stunting in utero across the DRC, Kenya, and Nigeria while eliminating malaria and working-age TB."
          }
        ]
      },
      {
        phaseNumber: 2,
        phaseTitle: "Phase II: The Continental Caloric & Agricultural Superpower",
        phaseSubtitle: "Best Things First #11 (33:1 Seed R&D) + Spend $75B #15 (Solar Boreholes & Cold Chains)",
        budgetBillions: 13.5,
        avgBcr: 27.3,
        directEconomicBenefitBillions: 369,
        gdpMultiplierEffect: "Ends the $70B/yr food import drain & drops urban food prices by 40%",
        description: "In Best Things First, agricultural R&D into high-yield, climate-resilient seeds rose to a 33:1 Benefit-Cost Ratio. Paired with solar aquifer boreholes and farm-to-port cold chains, Africa turns its 600M arable hectares into the planet's largest food surplus.",
        interventions: [
          {
            title: "CGIAR / KALRO / INERA Climate-Resilient High-Yield Seed R&D + Green Fertilizer",
            lomborgRef: "Best Things First #11 • $8.0B Cost",
            costB: 8.0,
            bcr: 33,
            benefitB: 264,
            outcome: "Triples smallholder cassava, maize, rice, soy, and horticultural yields across the DRC's 80M ha and Kenya's ASAL lands."
          },
          {
            title: "Rural Solar Boreholes, Aquifer Micro-Irrigation & Solar Cold-Chain Silos",
            lomborgRef: "Spend $75B #15 • $5.5B Cost",
            costB: 5.5,
            bcr: 19,
            benefitB: 105,
            outcome: "Slashes post-harvest crop spoilage from 38% to <5% and saves rural African women 2+ hours every day."
          }
        ]
      },
      {
        phaseNumber: 3,
        phaseTitle: "Phase III: 65:1 Adaptive EdTech, Deworming & Skilled Talent Mobility",
        phaseSubtitle: "Best Things First #4 (65:1 EdTech), #7 (45:1 Mobility) & #12 (19:1 Chronic/Surgical Care)",
        budgetBillions: 15.5,
        avgBcr: 50.7,
        directEconomicBenefitBillions: 786,
        gdpMultiplierEffect: "Triples STEM learning speed & unlocks visa-free engineering mobility across 54 nations",
        description: "The biggest leap from the 2012 book to Best Things First (2023) is in Education: 1 hour/day of adaptive tablet software + structured pedagogy ('Teaching at the Right Level', pioneered in Kenya!) delivers a 65:1 return. Combined with Busia-model school deworming (60:1), AfCFTA skilled talent mobility (45:1), and adult hypertension/surgical care (19:1), Africa builds the world's deepest engineering workforce.",
        interventions: [
          {
            title: "Kenya-Pioneered Adaptive EdTech & Structured Pedagogy (65:1) + Universal Deworming (60:1)",
            lomborgRef: "Best Things First #4 & Spend $75B #4 • $10.0B Cost",
            costB: 10.0,
            bcr: 64.3,
            benefitB: 643,
            outcome: "Triples math, science, and literacy mastery speed across 150M+ African students."
          },
          {
            title: "AfCFTA Skilled Talent Mobility (45:1) + Hypertension Generic Pills & District Surgery (19:1)",
            lomborgRef: "Best Things First #7 & #12 • $5.5B Cost",
            costB: 5.5,
            bcr: 26.0,
            benefitB: 143,
            outcome: "Lets African engineers deploy cross-border without visa friction while protecting senior professionals from premature cardiovascular death."
          }
        ]
      },
      {
        phaseNumber: 4,
        phaseTitle: "Phase IV: 95:1 Paperless AfCFTA, 38:1 E-Procurement, Digital Titles & $0.02 Power",
        phaseSubtitle: "Best Things First #2, #9 & #10 + Spend $75B #7 & #12 — Igniting the $145T Flywheel",
        budgetBillions: 16.0,
        avgBcr: 44.6,
        directEconomicBenefitBillions: 714,
        gdpMultiplierEffect: "Cuts infrastructure corruption by 15%, unlocks $4T collateral & self-finances Grand Inga",
        description: "Best Things First proved that three low-cost digital governance levers transform an economy: Paperless Trade Facilitation (95:1), Digital Land Tenure Security (52:1), and Government E-Procurement (38:1, which cuts infrastructure costs by 6–15%). Paired with modular Congo hydro and Rift Valley geothermal ($0.02–$0.04/kWh), Africa becomes the world's #1 manufacturing magnet.",
        interventions: [
          {
            title: "Paperless AfCFTA Customs (95:1) + Digital Land Titles (52:1) + Anti-Corruption E-Procurement (38:1)",
            lomborgRef: "Best Things First #2, #9 & #10 • $7.0B Cost",
            costB: 7.0,
            bcr: 61.3,
            benefitB: 429,
            outcome: "Eliminates tender corruption, unlocks $4T+ in SME property collateral, and slashes border transit times by 75%."
          },
          {
            title: "Modular Congo Hydro & Rift Valley Geothermal SEZs (30:1) + Weather Early Warning (35:1)",
            lomborgRef: "Spend $75B #7 & #12 • $9.0B Cost",
            costB: 9.0,
            bcr: 31.7,
            benefitB: 285,
            outcome: "Powers onshore battery refining, green steel, and AI data centers—generating the tax base that self-finances the full 40+ GW Grand Inga and Trans-African SGR."
          }
        ]
      }
    ],
    trajectories: {
      maxAxisT: 150.0,
      lomborg: {
        name: "Unified $75B + Best Things First Superpower ($145.0T Peak)",
        color: "#0D9488",
        points: [
          { year: "Year 0 (2026)", gdpT: 3.10, note: "Initial $75B deployed across the 16 unified Spend $75B + Best Things First (52:1 avg BCR) catalysts." },
          { year: "Year 10 (2036)", gdpT: 10.60, note: "101:1 vaccines & 87:1 maternal care ignite demographic dividend; 38:1 E-Procurement & 95:1 customs slash trade costs." },
          { year: "Year 20 (2046)", gdpT: 31.20, note: "First cohort trained on 65:1 Adaptive EdTech enters workforce; domestic tax base self-finances 40+ GW Grand Inga." },
          { year: "Year 30 (2056)", gdpT: 66.50, note: "Global battery, green steel, automotive, biotech, and AI compute industries relocate to Africa for $0.02/kWh clean power." },
          { year: "Year 40 (2066)", gdpT: 106.80, note: "AfCFTA single market of 2.8B high-income consumers surpasses the combined GDP of legacy aging continents." },
          { year: "Year 50 (2076)", gdpT: 145.00, note: "$145.0 Trillion economy—the largest economic civilization that has ever existed and will ever exist." }
        ]
      },
      megaproject: {
        name: "Unsequenced 'Debt & Concrete First' Trap ($16.5T Stall)",
        color: "#D97706",
        points: [
          { year: "Year 0 (2026)", gdpT: 3.10, note: "Pouring borrowed billions into unsequenced megaprojects without 38:1 E-Procurement or human capital foundations." },
          { year: "Year 10 (2036)", gdpT: 4.50, note: "External debt service and procurement leakage crowd out health, agriculture, and SME credit." },
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
        explanation: "With 150+ GW of continuous zero-carbon hydro and geothermal baseload + subsea fiber cables at Mombasa, Lagos, and Cape Town + 65:1 Adaptive EdTech STEM graduates, Africa becomes the world's lowest-cost AI training and cloud compute continent."
      },
      {
        sector: "Continental Agro-Processing, Green Ammonia & Branded Foods",
        rawExportValueB: 18,
        onshoreProcessedValueB: 1950,
        multiplier: "108x Value Capture",
        explanation: "Ends the $70B food import bill via 33:1 Seed R&D and converts 600M arable hectares + local green hydro/geothermal fertilizer into nearly $2 Trillion/yr of refined foods, proteins, cocoa/coffee brands, and cold-chain exports."
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
    headline: "How 'Best Things First' + $75B Turns the DRC into a $54.8 Trillion Engine",
    intro: "The DRC sits on the richest single piece of real estate on Earth ($24T+ in critical minerals, 80M arable hectares, 40+ GW Grand Inga hydro, and 9 bordering nations at the center of AfCFTA). By applying Best Things First—101:1 Immunization, 87:1 Maternal Care, 65:1 Adaptive EdTech, 38:1 Anti-Corruption E-Procurement, 52:1 Digital Mining/Land Titles, and 95:1 Paperless 9-Border Customs—the DRC crushes its governance and biological bottlenecks to become a $54.8 Trillion superpower.",
    endowments: [
      {
        metric: "$24+ Trillion",
        label: "Untapped Critical Minerals",
        detail: "70%+ of global cobalt, world's richest high-grade copper belt (Katanga), lithium (Manono), coltan, tin, and industrial gold.",
        bottleneck: "Unlocked by 38:1 E-Procurement, 52:1 Digital Mining Cadastre & $0.02/kWh Modular Congo Hydro."
      },
      {
        metric: "80M Hectares",
        label: "Prime Arable Farmland",
        detail: "Combined with 52% of Africa's surface fresh water and year-round tropical sunlight—capable of feeding 2 billion people.",
        bottleneck: "Unlocked by Best Things First 33:1 INERA Seed R&D + 19:1 Rural Solar Boreholes & Cold Chains."
      },
      {
        metric: "40+ GW (Inga)",
        label: "Continuous Baseload Hydro",
        detail: "The Congo River's natural drop at Inga plus hundreds of modular run-of-river sites can generate the cheapest green power on Earth (<$0.02/kWh).",
        bottleneck: "Unlocked by building modular 100–1,000 MW hydro first (30:1 BCR) under 38:1 transparent E-Procurement."
      },
      {
        metric: "9 Border Nations",
        label: "The Geographic Heart of AfCFTA",
        detail: "Borders Angola, Zambia, Tanzania, Burundi, Rwanda, Uganda, South Sudan, CAR, and Congo-Brazzaville—linking Atlantic to Indian Ocean.",
        bottleneck: "Unlocked by Best Things First 95:1 Paperless Customs across all 9 borders."
      }
    ],
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: "Phase I: Biological, Maternal & Cognitive Liberation in the Congo Basin",
        phaseSubtitle: "Best Things First #1 (101:1), #3 (87:1), #5 (48:1), #6 (46:1) & #8 (45:1)",
        budgetBillions: 22.0,
        avgBcr: 58,
        directEconomicBenefitBillions: 1276,
        gdpMultiplierEffect: "Crushes 42% stunting & 12% global malaria share; +35% lifetime workforce productivity",
        description: "Deploying the first $22B into Best Things First's top health and nutrition levers across the DRC's 26 provinces eliminates the biological tax on 110M+ (soon 390M) Congolese citizens.",
        interventions: [
          {
            title: "Universal Childhood Vaccines (101:1), Maternal/Newborn Care (87:1) & Maternal MMS Micronutrients (45:1)",
            lomborgRef: "Best Things First #1, #3 & #8",
            costB: 12.0,
            bcr: 68,
            benefitB: 816,
            outcome: "Eliminates the DRC's 42% childhood stunting rate, raises population IQ by 7–10 points, and triggers the Demographic Dividend."
          },
          {
            title: "Congo Basin Malaria Eradication (PBO Nets & ACTs, 48:1) + Working-Age TB Control (46:1)",
            lomborgRef: "Best Things First #5 & #6",
            costB: 10.0,
            bcr: 46,
            benefitB: 460,
            outcome: "Crushes the DRC's 12% share of global malaria plus TB. Makes the Congo Basin interior fully habitable for dense engineering universities and industrial supply chains."
          }
        ]
      },
      {
        phaseNumber: 2,
        phaseTitle: "Phase II: The Caloric & Agricultural Superpower",
        phaseSubtitle: "Best Things First #11 (33:1 Seed R&D) & Spend $75B #15 (19:1 Boreholes/Cold Storage)",
        budgetBillions: 16.0,
        avgBcr: 27.8,
        directEconomicBenefitBillions: 444,
        gdpMultiplierEffect: "-40% continental food costs; frees labor for manufacturing",
        description: "Instead of importing food, $16B turns the DRC's 80 million arable hectares into the breadbasket of 2.5 billion people using Best Things First's 33:1 agricultural R&D.",
        interventions: [
          {
            title: "INERA–CGIAR Tropical Crop R&D (Disease-Resistant Cassava, Maize, Rice, Soy) & Soil Fertility",
            lomborgRef: "Best Things First #11 (33:1 BCR)",
            costB: 10.0,
            bcr: 33,
            benefitB: 330,
            outcome: "Triples smallholder crop yields across Katanga, Kasai, and Kivu without encroaching on primary rainforest."
          },
          {
            title: "Rural Solar Boreholes, Clean Water & Post-Harvest Cold Storage",
            lomborgRef: "Spend $75B #15 (19:1 BCR)",
            costB: 6.0,
            bcr: 19,
            benefitB: 114,
            outcome: "Saves women 2+ hours/day hauling water and cuts post-harvest crop rot from 38% down to under 5%."
          }
        ]
      },
      {
        phaseNumber: 3,
        phaseTitle: "Phase III: 65:1 Adaptive EdTech, Deworming & Workforce Health",
        phaseSubtitle: "Best Things First #4 (65:1), #7 (45:1) & #12 (19:1) + Deworming (60:1)",
        budgetBillions: 12.0,
        avgBcr: 48.5,
        directEconomicBenefitBillions: 582,
        gdpMultiplierEffect: "45M+ STEM, metallurgical & hydro-engineering graduates entering the workforce",
        description: "With children arriving at school well-nourished and malaria-free, Phase III deploys 65:1 Adaptive EdTech tablets and structured lesson plans alongside school deworming and district surgical/hypertension care.",
        interventions: [
          {
            title: "Adaptive EdTech Software & Structured Pedagogy (65:1) + Universal School Deworming (60:1)",
            lomborgRef: "Best Things First #4 & Spend $75B #4",
            costB: 7.5,
            bcr: 63,
            benefitB: 473,
            outcome: "Triples math and technical learning speed across Congolese primary, secondary, and metallurgical TVET schools."
          },
          {
            title: "District Surgical Capacity, Hypertension Generic Meds (19:1) & EAC-AfCFTA Skilled Engineer Mobility (45:1)",
            lomborgRef: "Best Things First #7 & #12 + Spend $75B #8",
            costB: 4.5,
            bcr: 24.2,
            benefitB: 109,
            outcome: "Protects prime working-age adults (20–55) and brings top African engineering talent into Katanga and Kinshasa SEZs."
          }
        ]
      },
      {
        phaseNumber: 4,
        phaseTitle: "Phase IV: 38:1 E-Procurement, 52:1 Digital Titles, 95:1 Customs & Modular Hydro",
        phaseSubtitle: "Best Things First #2, #9 & #10 + Spend $75B #12 — Igniting the $54.8T Flywheel",
        budgetBillions: 25.0,
        avgBcr: 43.2,
        directEconomicBenefitBillions: 1080,
        gdpMultiplierEffect: "Slashes corruption by 15%, unlocks $3T collateral & forces global battery/AI industries onshore",
        description: "Best Things First's governance trio—E-Procurement (38:1), Digital Land/Mining Cadastre (52:1), and Paperless 9-Border Customs (95:1)—collapses the DRC's sovereign risk premium. Paired with modular run-of-river hydro ($0.02/kWh), global manufacturers relocate directly to the Congo Basin.",
        interventions: [
          {
            title: "Digital Land/Mining Cadastre (52:1) + Government E-Procurement (38:1)",
            lomborgRef: "Best Things First #9 & #10",
            costB: 5.0,
            bcr: 48,
            benefitB: 240,
            outcome: "Eliminates public tender corruption and converts $3T+ of informal Congolese land and artisanal claims into bankable SME collateral."
          },
          {
            title: "Modular Run-of-River Hydro (100–1,000 MW) & 9-Border Paved Logistics Corridors",
            lomborgRef: "Spend $75B #12 (30:1 BCR)",
            costB: 15.0,
            bcr: 30,
            benefitB: 450,
            outcome: "Delivers immediate $0.02/kWh clean power to Katanga/Kivu industrial zones and connects the Lobito (Atlantic) & Mombasa/Dar (Indian Ocean) corridors."
          },
          {
            title: "9-Border Paperless AfCFTA Customs (95:1) & Hydrological Early Warning (35:1)",
            lomborgRef: "Best Things First #2 & Spend $75B #7",
            costB: 5.0,
            bcr: 78,
            benefitB: 390,
            outcome: "Slashes border transit times from 14 days to 4 hours, making the DRC the duty-free industrial clearinghouse for 3 billion African consumers."
          }
        ]
      }
    ],
    trajectories: {
      maxAxisT: 60.0,
      lomborg: {
        name: "Unified $75B + Best Things First DRC Superpower ($54.8T Peak)",
        color: "#0D9488",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.18, note: "Initial $75B deployed into 101:1 vaccines, 87:1 maternal care, 65:1 EdTech, 38:1 E-Procurement & 95:1 customs." },
          { year: "Year 10 (2036)", gdpT: 1.45, note: "Malaria & stunting crushed; agricultural yields triple; modular hydro powers onshore copper/cobalt refining." },
          { year: "Year 20 (2046)", gdpT: 6.80, note: "Non-stunted, EdTech-trained STEM youth enter workforce; domestic tax base self-finances full 40+ GW Grand Inga hydro grid." },
          { year: "Year 30 (2056)", gdpT: 19.50, note: "Global battery precursors, green steel, aluminum, and AI hyperscale data centers relocate to Congo Basin." },
          { year: "Year 40 (2066)", gdpT: 36.20, note: "DRC acts as the central manufacturing core of a 2.8-billion-person single African market (AfCFTA)." },
          { year: "Year 50 (2076)", gdpT: 54.80, note: "Surpasses legacy aging economies to become the largest national industrial economy in history." }
        ]
      },
      megaproject: {
        name: "The 'Megaproject-First' Trap ($4.1T Stall)",
        color: "#D97706",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.18, note: "$75B sunk into flagship mega-infrastructure before fixing health, agricultural, or e-procurement bottlenecks." },
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
        explanation: "Instead of importing $3B+ in food, Phase 2 33:1 Seed R&D + green ammonia fertilizer turns 80M arable hectares into refined food, soy protein, cocoa, and cold-chain exports for 2.5B Africans."
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
    badge: "FINTECH, GEOTHERMAL, EDTECH PIONEER & INDO-AFRICAN GATEWAY",
    headline: "How Kenya's Homegrown 'Best Things First' Breakthroughs Build an $18.6T Superhub",
    intro: "Kenya is literally the global laboratory that proved Bjørn Lomborg's highest-ROI breakthroughs: Busia, Western Kenya proved School Deworming (60:1), Kenya's Tusome & structured pedagogy programs proved Adaptive Learning at the Right Level (65:1 in Best Things First!), and the Copenhagen Consensus 'Kenya Priorities' project mapped county-level ROI across the republic. Pairing these with 38:1 E-Procurement, 55:1 ArdhiSasa Digital Land Titles, 95:1 Paperless Mombasa–DRC Customs, and $0.04/kWh Rift Valley Geothermal turns Kenya into the 'Singapore + California' of Africa.",
    endowments: [
      {
        metric: "10+ GW Geothermal",
        label: "Rift Valley Baseload Green Steam",
        detail: "Olkaria, Menengai, Suswa, and Paka sit on one of the world's richest volcanic geothermal rifts, paired with Lake Turkana wind and year-round solar (90%+ renewable grid).",
        bottleneck: "Unlocked by Direct $0.04/kWh Geothermal Industrial Tariffs in Naivasha/Olkaria SEZs."
      },
      {
        metric: "Mombasa & Lamu",
        label: "Indian Ocean Deepwater Gateway",
        detail: "Port of Mombasa + Lamu (LAPSSET) and the Standard Gauge Railway (SGR) form the maritime front door for 300M+ people across Kenya, Uganda, Rwanda, South Sudan, Ethiopia, and Eastern DRC.",
        bottleneck: "Unlocked by Best Things First 95:1 Paperless Customs & SGR completion to Malaba/Kisumu/DRC."
      },
      {
        metric: "Silicon Savannah",
        label: "Global Pioneer of 65:1 EdTech & M-Pesa",
        detail: "World leader in mobile money (M-Pesa), birthplace of the Tusome/structured pedagogy model cited in Best Things First (65:1 ROI), and KEMRI biomedical hub.",
        bottleneck: "Unlocked by scaling 65:1 Adaptive EdTech + eradicating 18–26% rural/ASAL childhood stunting."
      },
      {
        metric: "83% ASAL Landmass",
        label: "Untapped Irrigated Agro-Export Frontier",
        detail: "While only 17% of Kenya is high-rainfall land, massive underground aquifers (Turkana/Lotikipi) and the Tana/Galana basins can support year-round precision irrigation.",
        bottleneck: "Unlocked by Best Things First 33:1 KALRO Seed R&D + 19:1 Solar Aquifer Irrigation & Cold Chains."
      }
    ],
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: "Phase I: Full Cognitive, Maternal & Health Liberation Across All 47 Counties",
        phaseSubtitle: "Best Things First #1 (101:1), #3 (87:1), #5 (48:1) & #8 (45:1) — Zero Stunting, Zero Malaria",
        budgetBillions: 14.0,
        avgBcr: 61,
        directEconomicBenefitBillions: 854,
        gdpMultiplierEffect: "Eliminates rural/ASAL stunting & ignites Kenya's high-skill Demographic Dividend",
        description: "Deploying $14B across all 47 counties into Best Things First's top biological levers—101:1 Childhood Vaccines, 87:1 Maternal/Newborn Care, 48:1 Lake/Coast Malaria Eradication, 46:1 TB Control, and 45:1 Maternal Multiple Micronutrients (MMS)—permanently closes the rural/pastoralist cognitive gap.",
        interventions: [
          {
            title: "47-County Immunization (101:1), Maternal/Newborn Emergency Care (87:1) & Maternal MMS Nutrition (45:1)",
            lomborgRef: "Best Things First #1, #3 & #8",
            costB: 7.5,
            bcr: 72,
            benefitB: 540,
            outcome: "Drives childhood stunting below 2% nationwide, adding 7–10 IQ points and +35% lifetime earnings for rural and ASAL youth."
          },
          {
            title: "Lake Victoria & Coastal Malaria Eradication (48:1) + Urban TB/HIV Control (46:1)",
            lomborgRef: "Best Things First #5 & #6",
            costB: 6.5,
            bcr: 48.3,
            benefitB: 314,
            outcome: "Eradicates malaria in Kisumu/Busia/Mombasa endemic belts and scales rapid molecular TB curing."
          }
        ]
      },
      {
        phaseNumber: 2,
        phaseTitle: "Phase II: The ASAL Irrigation, 33:1 KALRO Seed & Cold-Chain Revolution",
        phaseSubtitle: "Best Things First #11 (33:1 Seed R&D) & Spend $75B #15 (19:1 Solar Boreholes)",
        budgetBillions: 18.0,
        avgBcr: 26.8,
        directEconomicBenefitBillions: 482,
        gdpMultiplierEffect: "3.5x agricultural output; ends drought food-inflation spikes permanently",
        description: "In Kenya, food inflation is the #1 driver of high interest rates. Investing $18B into Best Things First's 33:1 KALRO drought-tolerant seed R&D, solar drip-irrigation across ASAL aquifers, and farm-to-port cold chains permanently drought-proofs the republic.",
        interventions: [
          {
            title: "KALRO Drought-Tolerant Seed R&D (33:1), Soil Micronutrients & Precision Extension",
            lomborgRef: "Best Things First #11 (33:1 BCR)",
            costB: 10.0,
            bcr: 33,
            benefitB: 330,
            outcome: "Triples smallholder maize, sorghum, potato, tea, coffee, and avocado yields while slashing fertilizer waste."
          },
          {
            title: "ASAL Solar Boreholes, Micro-Irrigation & Solar Cold-Chain Packhouses",
            lomborgRef: "Spend $75B #7 & #15 (19:1 BCR)",
            costB: 8.0,
            bcr: 19,
            benefitB: 152,
            outcome: "Cuts post-harvest horticultural loss from 35% to <5% and turns Turkana, Garissa, Tana River, and Kitui into irrigated food-export hubs."
          }
        ]
      },
      {
        phaseNumber: 3,
        phaseTitle: "Phase III: Scaling Kenya's 65:1 Adaptive EdTech, Deworming & Biotech Talent",
        phaseSubtitle: "Best Things First #4 (65:1 EdTech), #7 (45:1 Mobility) & #12 (19:1 Hypertension/Surgery)",
        budgetBillions: 15.0,
        avgBcr: 52.0,
        directEconomicBenefitBillions: 780,
        gdpMultiplierEffect: "15M+ software, semiconductor, biotech & precision-manufacturing engineers",
        description: "Best Things First explicitly cites Kenya's structured pedagogy (Tusome) and computer-assisted adaptive learning trials for their extraordinary 65:1 Benefit-Cost Ratio! Combined with Kenya's Busia deworming model (60:1) and county hypertension/surgical care (19:1), Kenya builds the highest-IQ English-speaking STEM workforce in the Global South.",
        interventions: [
          {
            title: "National Adaptive EdTech Tablet Software & Structured Pedagogy (65:1) + Busia School Deworming (60:1)",
            lomborgRef: "Best Things First #4 & Spend $75B #4",
            costB: 10.0,
            bcr: 64,
            benefitB: 640,
            outcome: "Triples math, coding, and science mastery speed across all 47 counties, feeding Konza Technopolis and industrial TVETs."
          },
          {
            title: "47-County Hypertension/Cardiac Care & Surgical Theatres (19:1) + Regional Talent Mobility (45:1)",
            lomborgRef: "Best Things First #7 & #12",
            costB: 5.0,
            bcr: 28,
            benefitB: 140,
            outcome: "Protects Kenya's prime 30–65-year-old engineers, clinicians, and entrepreneurs from premature cardiovascular death and trauma."
          }
        ]
      },
      {
        phaseNumber: 4,
        phaseTitle: "Phase IV: 95:1 Paperless Corridor, 55:1 ArdhiSasa Titles, 38:1 E-Procurement & 10GW Geothermal",
        phaseSubtitle: "Best Things First #2, #9 & #10 + Spend $75B #12 — Igniting the $18.6T Flywheel",
        budgetBillions: 28.0,
        avgBcr: 46.5,
        directEconomicBenefitBillions: 1302,
        gdpMultiplierEffect: "Drops industrial power to $0.04/kWh, cuts public graft by 15% & unlocks $1.5T+ SME collateral",
        description: "Deploying Best Things First's governance trio in Kenya—100% E-Procurement across national and county tenders (38:1), full 47-county ArdhiSasa digital land titling (55:1), and paperless Mombasa–Malaba–DRC trade facilitation (95:1)—alongside $0.04/kWh Rift Valley geothermal SEZs makes Kenya the undisputed Singapore of the Indian Ocean.",
        interventions: [
          {
            title: "Full 47-County ArdhiSasa Digital Land Titles (55:1) + Mandatory National/County E-Procurement (38:1)",
            lomborgRef: "Best Things First #9 & #10",
            costB: 5.0,
            bcr: 49,
            benefitB: 245,
            outcome: "Eliminates public tender inflation and land fraud, turning $400B+ of Kenyan land into instant, low-interest SME collateral."
          },
          {
            title: "Rift Valley Geothermal Baseload Scaling (Olkaria/Menengai) & Direct $0.04/kWh Industrial Tariffs",
            lomborgRef: "Spend $75B #12 (30:1 BCR)",
            costB: 15.0,
            bcr: 30,
            benefitB: 450,
            outcome: "Retires expensive thermal plants and powers 24/7 green AI data centers, green ammonia fertilizer, EV assembly, and chip packaging."
          },
          {
            title: "Mombasa–Lamu–Nairobi–Malaba–DRC Paperless Trade Facilitation (95:1) & SGR Completion",
            lomborgRef: "Best Things First #2 (95:1 BCR)",
            costB: 8.0,
            bcr: 75.9,
            benefitB: 607,
            outcome: "Cuts Mombasa-to-Kigali/Goma/Kisumu freight time by 70%, making Kenya the financial and maritime clearinghouse for East & Central Africa."
          }
        ]
      }
    ],
    trajectories: {
      maxAxisT: 20.0,
      lomborg: {
        name: "Unified $75B + Best Things First Kenya Superhub ($18.6T Peak)",
        color: "#0D9488",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.38, note: "Initial catalytic capital deployed into 101:1 vaccines, 65:1 Adaptive EdTech, 33:1 KALRO seeds, 38:1 E-Procurement & 55:1 ArdhiSasa." },
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
          { year: "Year 0 (2026)", gdpT: 0.38, note: "Borrowing high-interest commercial debt without 38:1 E-Procurement while industrial power remains $0.18/kWh." },
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
        explanation: "By co-locating hyperscale data centers and chip packaging directly atop Olkaria/Menengai geothermal steam ($0.04/kWh) and pairing them with 5 subsea fiber cables at Mombasa + Kenyan 65:1 EdTech AI engineers, Kenya exports high-margin global compute."
      },
      {
        sector: "Branded Specialty Agro-Processing & Nutraceuticals",
        rawExportValueB: 6,
        onshoreProcessedValueB: 310,
        multiplier: "51x Value Capture",
        explanation: "Instead of auctioning bulk unblended tea and raw green coffee beans (capturing <10% of retail shelf price), Phase 2 cold-chains + cheap geothermal steam allow Kenya to export freeze-dried specialty coffee, packaged tea, and avocado oils."
      },
      {
        sector: "KEMRI Biotech, Vaccines & Medical Devices",
        rawExportValueB: 1,
        onshoreProcessedValueB: 260,
        multiplier: "260x Value Capture",
        explanation: "Africa currently imports 95%+ of its vaccines and medicines. Building on KEMRI and Nairobi's clinical research ecosystem, Kenya becomes the continental manufacturer of vaccines, generic cardiac polypills (#12), and surgical supplies."
      },
      {
        sector: "Indo-African Financial Clearing & Green Logistics",
        rawExportValueB: 5,
        onshoreProcessedValueB: 490,
        multiplier: "98x Value Capture",
        explanation: "With ArdhiSasa digital property rights (55:1), 38:1 E-Procurement, M-Pesa payment rails, and a 95:1 paperless Mombasa–Nairobi–Goma–Kinshasa corridor, Nairobi becomes the Wall Street for a $73.4T East-Central African bloc."
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
    intro: "Look at a map of Africa through the lens of both Lomborg books: the DRC possesses the world's largest industrial resource, freshwater, and hydropower heartland ($24T minerals, 80M arable hectares, 40+ GW hydro), while Kenya possesses the Indian Ocean deepwater ports (Mombasa & Lamu), the Silicon Savannah FinTech/M-Pesa rails, 10+ GW Rift Valley geothermal, and the proven 65:1 Adaptive EdTech + 60:1 Busia Deworming models. Applying the 12 'Best Things First' solutions across the Mombasa–Nairobi–Kampala–Kigali–Goma–Kinshasa–Lobito corridor fuses them into a single $73.4 Trillion economic colossus.",
    endowments: [
      {
        metric: "350M → 650M+",
        label: "Combined Youthful Talent Pool",
        detail: "Fuses Kenya's English-speaking FinTech, 65:1 EdTech, and commercial ecosystem with the DRC's massive engineering, metallurgical, and agronomic scale.",
        bottleneck: "Unlocked by Phase I (101:1 Vaccines + 87:1 Maternal Care) & Phase III (65:1 Adaptive EdTech + 45:1 Skilled Mobility)."
      },
      {
        metric: "50+ GW Clean Baseload",
        label: "The Geothermal + Hydro Power Grid",
        detail: "Kenya's 10+ GW Rift Valley Geothermal + DRC's 40+ GW Grand Inga & modular hydro creates the largest 100% renewable, 24/7 baseload electricity pool on Earth.",
        bottleneck: "East African Power Pool (EAPP) interconnectors built under 38:1 transparent E-Procurement."
      },
      {
        metric: "Dual-Ocean Bridge",
        label: "Mombasa/Lamu (Indian) ↔ Banana/Lobito (Atlantic)",
        detail: "Links the fastest-growing Asian markets (India, ASEAN, Gulf) via Kenya's Mombasa/Lamu ports directly into the heart of the DRC and out to the Atlantic.",
        bottleneck: "Unlocked by Best Things First 95:1 Paperless EAC-AfCFTA Customs Elimination."
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
        phaseTitle: "Phase I: Corridor-Wide Biological, Maternal & Cognitive Blitz",
        phaseSubtitle: "Best Things First #1 (101:1), #3 (87:1), #5 (48:1), #6 (46:1) & #8 (45:1)",
        budgetBillions: 20.0,
        avgBcr: 59,
        directEconomicBenefitBillions: 1180,
        gdpMultiplierEffect: "Synchronized +35% human capital surge & Demographic Dividend across 300M+ citizens",
        description: "Coordinates a single cross-border public health, maternal care, and micronutrient blitz from the Kenyan Coast and Lake Victoria Basin through Uganda/Rwanda/Burundi into the Congo Basin.",
        interventions: [
          {
            title: "Corridor Immunization (101:1), Maternal/Newborn Care (87:1) & Maternal MMS Fortification (45:1)",
            lomborgRef: "Best Things First #1, #3 & #8",
            costB: 10.0,
            bcr: 70,
            benefitB: 700,
            outcome: "Eliminates stunting and maternal mortality from Mombasa to Matadi while igniting the Demographic Dividend."
          },
          {
            title: "Cross-Border Malaria Eradication (48:1) & Working-Age TB Control (46:1)",
            lomborgRef: "Best Things First #5 & #6",
            costB: 10.0,
            bcr: 48,
            benefitB: 480,
            outcome: "Uses KEMRI (Kenya) & INRB (DRC) biomedical networks to eliminate malaria and TB along the entire Northern and Central transport corridors."
          }
        ]
      },
      {
        phaseNumber: 2,
        phaseTitle: "Phase II: Continental Food Sovereignty & 33:1 Seed R&D Loops",
        phaseSubtitle: "Best Things First #11 (33:1 Seed R&D) + Geothermal Green Ammonia + DRC 80M Hectares",
        budgetBillions: 16.0,
        avgBcr: 27.8,
        directEconomicBenefitBillions: 444,
        gdpMultiplierEffect: "Turns East-Central Africa into the #1 net food exporter on Earth",
        description: "Kenya uses its Olkaria geothermal power to manufacture zero-carbon green ammonia fertilizer, which travels west by rail to fertilize DRC's 80M rain-fed hectares and Kenya's irrigated ASAL farms—while Congolese grain and soy travel east to lower food costs across Kenyan cities.",
        interventions: [
          {
            title: "Joint KALRO–INERA Climate-Resilient Seed R&D (33:1) + Geothermal/Hydro Green Fertilizer",
            lomborgRef: "Best Things First #11 (33:1 BCR)",
            costB: 10.0,
            bcr: 33,
            benefitB: 330,
            outcome: "Replaces expensive imported fertilizer with local geothermal/hydro green ammonia and triples cassava, maize, soy, tea, and horticulture yields."
          },
          {
            title: "Corridor Cold-Chain Logistics, Solar Boreholes & Post-Harvest Silos",
            lomborgRef: "Spend $75B #15 (19:1 BCR)",
            costB: 6.0,
            bcr: 19,
            benefitB: 114,
            outcome: "Links Kivu and Katanga breadbaskets to Nairobi and Mombasa export terminals with zero post-harvest spoilage."
          }
        ]
      },
      {
        phaseNumber: 3,
        phaseTitle: "Phase III: 65:1 Adaptive EdTech, 60:1 Deworming & 45:1 Skilled Mobility",
        phaseSubtitle: "Best Things First #4, #7 & #12 — Fusing Silicon Savannah with Congo Engineering",
        budgetBillions: 14.0,
        avgBcr: 51.5,
        directEconomicBenefitBillions: 721,
        gdpMultiplierEffect: "60M+ bilingual (Swahili/English/French) engineers, coders & clinicians",
        description: "Swahili already unites Kenya and Eastern/Southern DRC culturally and commercially. Phase III scales Kenya's proven 65:1 Adaptive EdTech and 60:1 Busia Deworming across the entire corridor while removing all work-permit barriers (45:1) for engineers and doctors.",
        interventions: [
          {
            title: "Corridor-Wide Adaptive EdTech Tablets & Structured Pedagogy (65:1) + Busia Deworming (60:1)",
            lomborgRef: "Best Things First #4 & Spend $75B #4",
            costB: 9.0,
            bcr: 64,
            benefitB: 576,
            outcome: "Trains a unified workforce fluent in Swahili, English, and French across metallurgy, geothermal/hydro grid engineering, and AI."
          },
          {
            title: "EAC-DRC Skilled Talent Mobility (45:1) + Regional Hypertension & Surgical Network (19:1)",
            lomborgRef: "Best Things First #7 & #12",
            costB: 5.0,
            bcr: 29,
            benefitB: 145,
            outcome: "Ensures frictionless engineering deployment and world-class trauma/cardiac care from Nairobi to Kinshasa."
          }
        ]
      },
      {
        phaseNumber: 4,
        phaseTitle: "Phase IV: 95:1 Paperless Corridor, 38:1 E-Procurement, 55:1 Titles & 50GW Power Pool",
        phaseSubtitle: "Best Things First #2, #9 & #10 + Spend $75B #12 — The $73.4 Trillion Megacorridor",
        budgetBillions: 25.0,
        avgBcr: 46.8,
        directEconomicBenefitBillions: 1170,
        gdpMultiplierEffect: "Fuses Indian & Atlantic Oceans into a single zero-corruption, duty-free industrial zone",
        description: "When Kenyan capital markets, M-Pesa digital rails, and Mombasa/Lamu ports connect seamlessly to DRC's $24T minerals and 40+ GW hydropower under 95:1 paperless customs, 38:1 e-procurement, and 55:1 digital land/mining titles, the Twin Axis outcompetes every manufacturing zone on Earth.",
        interventions: [
          {
            title: "Unified Digital Land & Mining Cadastre (55:1) + Corridor-Wide Mandatory E-Procurement (38:1)",
            lomborgRef: "Best Things First #9 & #10",
            costB: 5.0,
            bcr: 48,
            benefitB: 240,
            outcome: "Allows Congolese and Kenyan entrepreneurs to raise instant capital on Nairobi & Kinshasa banking rails while slashing infrastructure graft."
          },
          {
            title: "50+ GW Geothermal-Hydro Power Pool & Electric Freight Corridor (Mombasa–Nairobi–Goma–Kinshasa)",
            lomborgRef: "Spend $75B #12 (30:1 BCR)",
            costB: 15.0,
            bcr: 30,
            benefitB: 450,
            outcome: "Connects Rift Valley geothermal and Congo River hydro to power electrified rail freight and Special Economic Zones from the Indian Ocean to the Atlantic."
          },
          {
            title: "One-Stop EAC-AfCFTA Paperless Customs (95:1) & Disaster Early Warning Grid (35:1)",
            lomborgRef: "Best Things First #2 & Spend $75B #7",
            costB: 5.0,
            bcr: 96,
            benefitB: 480,
            outcome: "Eliminates internal border tariffs and weighbridge corruption—allowing goods from Goma or Lubumbashi to reach Mombasa ships in under 36 hours."
          }
        ]
      }
    ],
    trajectories: {
      maxAxisT: 75.0,
      lomborg: {
        name: "Unified $75B + Best Things First Twin Axis ($73.4T Combined)",
        color: "#0D9488",
        points: [
          { year: "Year 0 (2026)", gdpT: 0.56, note: "Combined starting GDP (~$380B Kenya + ~$180B DRC PPP) launches coordinated $75B + Best Things First foundation." },
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
          { year: "Year 0 (2026)", gdpT: 0.56, note: "Uncoordinated debt-funded projects without 38:1 E-Procurement or 95:1 customs reform." },
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
        explanation: "Kenyan geothermal green ammonia fertilizes DRC's 80M arable hectares and Kenya's ASAL irrigated farms via 33:1 Seed R&D, feeding 2.5B Africans and exporting branded specialty foods worldwide."
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

// ============================================================================
// DATA: THE GLOBAL SUPERPOWER OVERTAKE RACE (2026–2076)
// Africa (54-Nation AfCFTA) & Kenya-DRC Axis vs. US, China, India & EU
// ============================================================================

const OVERTAKE_RACE_BLOCS = [
  {
    id: "africa_lomborg",
    name: "All-Africa (54-Nation AfCFTA • Lomborg BCR Sequenced)",
    shortName: "All-Africa (Lomborg Model)",
    flag: "🌍",
    color: "#0D9488",
    isAfricaHero: true,
    workingAge2076: "1,850M (+118%)",
    medianAge2076: "29 yrs",
    powerCostKwh: "$0.02/kWh (Inga Hydro + Rift Geothermal)",
    // Key decadal GDP anchor points ($ Trillions, real 2026 terms)
    gdpByDecade: { 2026: 3.1, 2036: 10.6, 2046: 31.2, 2056: 66.5, 2066: 106.8, 2076: 145.0 }
  },
  {
    id: "kenya_drc_axis",
    name: "Kenya + DRC Twin-Engine Megacorridor (Standalone)",
    shortName: "Kenya + DRC Twin Axis",
    flag: "🇰🇪🇨🇩",
    color: "#1D4ED8",
    isAfricaHero: true,
    workingAge2076: "320M (+145%)",
    medianAge2076: "27 yrs",
    powerCostKwh: "$0.018/kWh (50GW Hydro-Geothermal Pool)",
    gdpByDecade: { 2026: 0.56, 2036: 2.8, 2046: 10.7, 2056: 27.7, 2066: 49.6, 2076: 73.4 }
  },
  {
    id: "usa",
    name: "United States",
    shortName: "United States",
    flag: "🇺🇸",
    color: "#3B82F6",
    isAfricaHero: false,
    workingAge2076: "215M (+2%)",
    medianAge2076: "44 yrs",
    powerCostKwh: "$0.11/kWh",
    gdpByDecade: { 2026: 29.2, 2036: 35.0, 2046: 42.0, 2056: 49.5, 2066: 56.8, 2076: 64.5 }
  },
  {
    id: "india",
    name: "India",
    shortName: "India",
    flag: "🇮🇳",
    color: "#F59E0B",
    isAfricaHero: false,
    workingAge2076: "980M (-8% post-2050)",
    medianAge2076: "45 yrs",
    powerCostKwh: "$0.08/kWh",
    gdpByDecade: { 2026: 4.3, 2036: 11.2, 2046: 24.5, 2056: 39.0, 2066: 50.2, 2076: 58.5 }
  },
  {
    id: "china",
    name: "China",
    shortName: "China",
    flag: "🇨🇳",
    color: "#EF4444",
    isAfricaHero: false,
    workingAge2076: "540M (-44% Demographic Shrink)",
    medianAge2076: "54 yrs",
    powerCostKwh: "$0.07/kWh",
    gdpByDecade: { 2026: 19.5, 2036: 28.5, 2046: 37.8, 2056: 44.8, 2066: 49.2, 2076: 52.0 }
  },
  {
    id: "eu",
    name: "European Union (27 Nations)",
    shortName: "European Union",
    flag: "🇪🇺",
    color: "#6366F1",
    isAfricaHero: false,
    workingAge2076: "210M (-26% Shrink)",
    medianAge2076: "50 yrs",
    powerCostKwh: "$0.16/kWh",
    gdpByDecade: { 2026: 19.4, 2036: 22.4, 2046: 25.6, 2056: 28.4, 2066: 30.8, 2076: 32.8 }
  },
  {
    id: "africa_status_quo",
    name: "Africa Under Raw-Ore Status Quo (Unsequenced / No Catalyst)",
    shortName: "Africa (Raw-Ore Status Quo Trap)",
    flag: "⚠️",
    color: "#6B7280",
    isAfricaHero: false,
    workingAge2076: "Stunted / Underemployed",
    medianAge2076: "29 yrs",
    powerCostKwh: "$0.20/kWh (Diesel / Grid Deficit)",
    gdpByDecade: { 2026: 3.1, 2036: 3.85, 2046: 4.75, 2056: 5.8, 2066: 6.95, 2076: 8.2 }
  }
];

// ============================================================================
// MILTON FRIEDMAN MONETARY ENGINE (M*V = P*Y) & $261T STOCK MARKET MODEL
// ============================================================================

const FRIEDMAN_CAPITAL_MARKETS_MODEL = {
  regimes: {
    sankoreFriedman: {
      id: "sankoreFriedman",
      name: "2076 Sankore + Lomborg + Friedman Rule (Output Boom ↑↑Y)",
      badge: "RECOMMENDED • HARDEST CURRENCY & #1 STOCK MARKET ON EARTH",
      mGrowthPct: 4.5,
      yGrowthPct: 7.6,
      buffettRatio: 1.80,
      discountRateR: 5.2,
      summary: "Following Milton Friedman's K-Percent Rule alongside Lomborg's 48.7:1 investments: Real Output (Y) surges 39.2x to $145.0T while Money Supply (M) is strictly disciplined. Result: Near-zero inflation, +265% real currency appreciation, AAA 2.6% bond yields, and a 1.80x Buffett Indicator yielding a $261.0 Trillion Pan-African Stock Exchange."
    },
    cairo1324: {
      id: "cairo1324",
      name: "1324 Cairo Gold Mistake (Unbacked Money Printing ↑↑M, Flat Y)",
      badge: "HISTORICAL WARNING • MANSA MUSA'S 1324 INFLATION TRAP",
      mGrowthPct: 21.0,
      yGrowthPct: 1.6,
      buffettRatio: 0.25,
      discountRateR: 15.5,
      summary: "As Milton Friedman proved in M·V = P·Y, injecting massive money/gold (M) without first building human capital, energy, and productive output (Y) simply explodes the price level (P). Inflation surges >19%/yr, the currency loses 75%+ of its purchasing power, and stock markets remain shallow and speculative."
    },
    statusQuo2026: {
      id: "statusQuo2026",
      name: "2026 Raw-Ore Status Quo (Fragmented Currencies & Dead Capital)",
      badge: "BASELINE • HIGH RISK PREMIUM & RAW RESOURCE DRAIN",
      mGrowthPct: 11.2,
      yGrowthPct: 2.6,
      buffettRatio: 0.30,
      discountRateR: 11.8,
      summary: "Africa's 2026 baseline: importing $110B/yr in food and $85B/yr in refined fuel drains foreign exchange reserves, forcing 11.8% sovereign borrowing costs and keeping fragmented stock exchanges stuck at ~30% of GDP ($1.1T today, $2.5T in 2076)."
    }
  },
  megacaps: [
    {
      ticker: "INGA-RIFT",
      name: "Inga–Rift Clean Grid & Sovereign AI Compute Corp",
      hq: "🇨🇩 Kinshasa & 🇰🇪 Naivasha",
      sector: "Zero-Carbon Baseload Power (55 GW) & Global AI Cloud",
      marketCap2026B: 12,
      baseCap2076T: 42.8,
      peRatio: "26.4x",
      divYield: "2.8%",
      catalyst: "40+ GW Grand Inga Hydro + 10+ GW Rift Valley Geothermal at $0.018/kWh powering global AI training clusters."
    },
    {
      ticker: "KATG-BATT",
      name: "Katanga–Turkana Solid-State Battery & Cathode Foundry",
      hq: "🇨🇩 Kolwezi & 🇰🇪 Nairobi",
      sector: "EV Cells, Grid Storage & Refined Critical Minerals",
      marketCap2026B: 18,
      baseCap2076T: 36.5,
      peRatio: "24.8x",
      divYield: "3.1%",
      catalyst: "Onshore refining of 70% of global cobalt & high-grade copper into $45,000/ton finished battery packs."
    },
    {
      ticker: "AFCFTA-PAY",
      name: "AfCFTA Digital Clearinghouse & M-Savannah Financial",
      hq: "🇰🇪 Nairobi & 🇳🇬 Lagos",
      sector: "Pan-African Instant Settlement, Sovereign Bonds & AI Banking",
      marketCap2026B: 24,
      baseCap2076T: 28.4,
      peRatio: "25.2x",
      divYield: "2.4%",
      catalyst: "Built on Kenya's M-Pesa rails + Lomborg's 95:1 Paperless Customs & 28:1 Digital Land Registry collateral."
    },
    {
      ticker: "SAHEL-H2",
      name: "Trans-Saharan Terawatt Solar, Green Hydrogen & Steel",
      hq: "🇲🇱 Bamako, 🇲🇷 Nouakchott & 🇪🇬 Cairo",
      sector: "Green Metallurgy, Ammonia Fertilizer & Clean Fuels",
      marketCap2026B: 14,
      baseCap2076T: 24.6,
      peRatio: "22.1x",
      divYield: "3.5%",
      catalyst: "Turns the Sahel & Sahara solar belt + iron ore deposits into the world's #1 zero-carbon steel exporter."
    },
    {
      ticker: "SANKORE-BIO",
      name: "Sankore Genomics, mRNA Vaccine & Tropical Biotech Labs",
      hq: "🇲🇱 Timbuktu, 🇷🇼 Kigali & 🇰🇪 KEMRI",
      sector: "Biopharmaceuticals, Longevity & Molecular Diagnostics",
      marketCap2026B: 6,
      baseCap2076T: 21.2,
      peRatio: "27.0x",
      divYield: "1.9%",
      catalyst: "Born from Best Things First 101:1 Immunization & 48:1 Malaria/TB R&D hubs across Africa."
    },
    {
      ticker: "NILE-AGRO",
      name: "Nile–Congo–Savannah Precision Agro-Biotech & Cold Chain",
      hq: "🇪🇹 Addis Ababa, 🇿🇲 Lusaka & 🇹🇿 Dar es Salaam",
      sector: "Climate-Resilient Seeds, Autonomous Irrigation & Food Exports",
      marketCap2026B: 9,
      baseCap2076T: 18.9,
      peRatio: "21.5x",
      divYield: "3.8%",
      catalyst: "Scales Lomborg's 33:1 Agro R&D across 600M hectares to feed 2.5B Africans and export $1.8T/yr in food."
    },
    {
      ticker: "BI-OCEANIC",
      name: "Lobito–Mombasa–Lamu Autonomous Rail & Deepwater Ports",
      hq: "🇰🇪 Mombasa, 🇦🇴 Lobito & 🇨🇩 Lubumbashi",
      sector: "Continental High-Speed Freight, Cold-Chain & Maritime Corridors",
      marketCap2026B: 11,
      baseCap2076T: 16.4,
      peRatio: "19.8x",
      divYield: "4.1%",
      catalyst: "Links the Atlantic and Indian Oceans with 100% electrified freight and 95:1 automated customs."
    },
    {
      ticker: "RAND-QUANT",
      name: "Witwatersrand–Ashanti Platinum, Titanium & Quantum Chips",
      hq: "🇿🇦 Johannesburg & 🇬🇭 Accra",
      sector: "Semiconductor Substrates, Aerospace Alloys & Fuel Cells",
      marketCap2026B: 45,
      baseCap2076T: 15.8,
      peRatio: "20.4x",
      divYield: "3.6%",
      catalyst: "Transforms 80% of global platinum-group metals & gold into quantum hardware and aerospace components."
    }
  ]
};

// ============================================================================
// GLOBAL STOCK MARKET & CURRENCY OVERTAKE RACE (2026–2076)
// ============================================================================

const STOCK_MARKET_RACE_BLOCS = [
  {
    id: "africa_bourse",
    name: "Pan-African Unified Stock Exchange (SANKORE-500)",
    shortName: "All-Africa Unified Bourse (Sankore + Friedman)",
    flag: "🌍",
    color: "#059669",
    isAfricaHero: true,
    buffett2026: "30% of GDP",
    buffett2076: "180% of GDP",
    currencyReer2026: 100,
    currencyReer2076: 365,
    capByDecade: { 2026: 1.11, 2036: 8.9, 2046: 39.4, 2056: 105.9, 2066: 180.6, 2076: 261.0 }
  },
  {
    id: "twin_axis_bourse",
    name: "Nairobi–Kinshasa Twin-Axis Bourse (Kenya + DRC)",
    shortName: "Kenya + DRC Twin-Axis Exchange",
    flag: "🇰🇪🇨🇩",
    color: "#1D4ED8",
    isAfricaHero: true,
    buffett2026: "15% of GDP",
    buffett2076: "180% of GDP",
    currencyReer2026: 100,
    currencyReer2076: 382,
    capByDecade: { 2026: 0.08, 2036: 2.5, 2046: 15.5, 2056: 47.1, 2066: 88.3, 2076: 132.1 }
  },
  {
    id: "us_bourse",
    name: "US Stock Exchanges (NYSE + NASDAQ)",
    shortName: "United States (NYSE + NASDAQ)",
    flag: "🇺🇸",
    color: "#3B82F6",
    isAfricaHero: false,
    buffett2026: "200% of GDP",
    buffett2076: "180% of GDP",
    currencyReer2026: 100,
    currencyReer2076: 84,
    capByDecade: { 2026: 58.4, 2036: 68.2, 2046: 79.8, 2056: 91.5, 2066: 103.9, 2076: 116.1 }
  },
  {
    id: "india_bourse",
    name: "India Stock Exchanges (NSE + BSE Mumbai)",
    shortName: "India (NSE + BSE)",
    flag: "🇮🇳",
    color: "#F59E0B",
    isAfricaHero: false,
    buffett2026: "120% of GDP",
    buffett2076: "150% of GDP",
    currencyReer2026: 100,
    currencyReer2076: 118,
    capByDecade: { 2026: 5.2, 2036: 14.6, 2046: 34.3, 2056: 56.5, 2066: 74.3, 2076: 87.8 }
  },
  {
    id: "china_bourse",
    name: "China Stock Exchanges (Shanghai + Shenzhen + HK)",
    shortName: "China (SSE + SZSE + HKEX)",
    flag: "🇨🇳",
    color: "#EF4444",
    isAfricaHero: false,
    buffett2026: "75% of GDP",
    buffett2076: "130% of GDP",
    currencyReer2026: 100,
    currencyReer2076: 76,
    capByDecade: { 2026: 14.5, 2036: 25.6, 2046: 39.7, 2056: 51.5, 2066: 61.0, 2076: 67.6 }
  },
  {
    id: "eu_bourse",
    name: "European Union Bourses (Euronext + Frankfurt)",
    shortName: "European Union (Euronext + Xetra)",
    flag: "🇪🇺",
    color: "#6366F1",
    isAfricaHero: false,
    buffett2026: "85% of GDP",
    buffett2076: "130% of GDP",
    currencyReer2026: 100,
    currencyReer2076: 79,
    capByDecade: { 2026: 16.5, 2036: 21.3, 2046: 26.9, 2056: 32.7, 2066: 37.9, 2076: 42.6 }
  },
  {
    id: "africa_sq_bourse",
    name: "Africa Fragmented Exchanges (Raw-Ore Status Quo Trap)",
    shortName: "Africa Status Quo (30% GDP Trap)",
    flag: "⚠️",
    color: "#6B7280",
    isAfricaHero: false,
    buffett2026: "30% of GDP",
    buffett2076: "30% of GDP",
    currencyReer2026: 100,
    currencyReer2076: 44,
    capByDecade: { 2026: 1.11, 2036: 1.25, 2046: 1.45, 2056: 1.74, 2066: 2.08, 2076: 2.46 }
  }
];



