// ============================================================================
// DATA: "HOW TO SPEND $75 BILLION TO MAKE THE WORLD A BETTER PLACE"
// Bjørn Lomborg (Copenhagen Consensus) + DRC & Africa Superpower Blueprint
// ============================================================================

const GLOBAL_INTERVENTIONS = [
  // --- THE NOBEL PANEL'S OPTIMAL $75B PORTFOLIO (16 WINNERS) ---
  {
    id: "micronutrients",
    rank: 1,
    isWinner: true,
    title: "Bundled Micronutrient Interventions to Fight Hunger",
    shortTitle: "Micronutrient Bundle",
    category: "Nutrition & Hunger",
    costBillions: 12.0,
    bcr3pct: 45,
    bcr5pct: 30,
    dalyMultiplierHigh: 1.8,
    authors: "Sue Horton, Harold Alderman & Juan A. Rivera",
    livesSavedOrImpacted: "100M+ children protected from cognitive stunting",
    summary: "Providing Vitamin A capsules, therapeutic zinc supplements for diarrhea, iodized salt, and iron/folic acid fortification to undernourished mothers and young children.",
    whyItWins: "Chronic malnutrition during the first 1,000 days permanently stunts brain and physical development. For pennies per child, micronutrients permanently raise adult cognitive capacity and lifetime earnings by 20–40%.",
    drcRelevance: "Foundation of Phase 1 in the DRC: Eradicating the 42% childhood stunting rate across the Congo Basin to unlock the cognitive potential of 100M+ youth."
  },
  {
    id: "malaria-act",
    rank: 2,
    isWinner: true,
    title: "Expanding the Subsidy for Malaria Combination Treatment",
    shortTitle: "Malaria ACT Subsidy",
    category: "Disease Control",
    costBillions: 1.2,
    bcr3pct: 38,
    bcr5pct: 35,
    dalyMultiplierHigh: 2.1,
    authors: "Ramanan Laxminarayan, Mead Over & David L. Smith",
    livesSavedOrImpacted: "300,000+ deaths averted annually",
    summary: "Global subsidy for Artemisinin-based Combination Therapies (ACTs) so effective frontline malaria medicine is cheaper than older, failing chloroquine drugs.",
    whyItWins: "Not only does ACT save hundreds of thousands of lives every year for under $1.50 per course, it also delays artemisinin resistance—preserving humanity's best defense against malaria.",
    drcRelevance: "The DRC accounts for ~12% of all global malaria cases. Crushing malaria unlocks tens of millions of productive labor years in the interior basin."
  },
  {
    id: "childhood-immunization",
    rank: 3,
    isWinner: true,
    title: "Expanded Childhood Immunization Coverage",
    shortTitle: "Childhood Immunization",
    category: "Disease Control",
    costBillions: 4.0,
    bcr3pct: 25,
    bcr5pct: 20,
    dalyMultiplierHigh: 2.2,
    authors: "Stephen C. Resch,ead & Till Bärnighausen",
    livesSavedOrImpacted: "1M+ childhood deaths prevented per year",
    summary: "Scaling coverage of routine childhood vaccines (measles, DTP, tetanus, Hib, pneumococcal, and rotavirus) to reach the hardest-to-reach 20% of children.",
    whyItWins: "Vaccines require no ongoing daily compliance once administered and trigger a demographic transition: when parents know children will survive, families invest far more in each child's education.",
    drcRelevance: "Stabilizes child survival across rural DRC provinces, accelerating the demographic dividend."
  },
  {
    id: "deworming",
    rank: 4,
    isWinner: true,
    title: "Deworming Schoolchildren",
    shortTitle: "School Deworming",
    category: "Education & Health",
    costBillions: 1.2,
    bcr3pct: 60,
    bcr5pct: 34,
    dalyMultiplierHigh: 1.6,
    authors: "Stéphane Verguet, Charlesham & Dean Jamison",
    livesSavedOrImpacted: "300M+ schoolchildren treated annually",
    summary: "Administering ultra-low-cost deworming tablets (albendazole/praziquantel) through existing primary schools at ~$0.50 per child per year.",
    whyItWins: "Intestinal worms sap iron and energy, keeping kids out of class. Deworming reduces school absenteeism by 25% and increases adult earnings by ~20% decades later.",
    drcRelevance: "Essential multiplier for Congolese primary schools—turning classroom attendance into actual cognitive retention."
  },
  {
    id: "tuberculosis",
    rank: 5,
    isWinner: true,
    title: "Expanding Tuberculosis Treatment (DOTS & MDR-TB)",
    shortTitle: "Tuberculosis Treatment",
    category: "Disease Control",
    costBillions: 6.0,
    bcr3pct: 32,
    bcr5pct: 22,
    dalyMultiplierHigh: 2.0,
    authors: "Stéphane Verguet, Ramanan Laxminarayan & Christopher Dye",
    livesSavedOrImpacted: "1M+ prime working-age lives saved annually",
    summary: "Scaling infectious TB diagnosis and Directly Observed Treatment, Short-course (DOTS) alongside targeted Multi-Drug Resistant TB containment.",
    whyItWins: "Unlike diseases that strike only the very young or very old, TB disproportionately kills prime working-age adults (ages 20–50), devastating household income and industrial productivity.",
    drcRelevance: "Protects the core industrial and mining workforce in high-density urban hubs like Kinshasa and Lubumbashi."
  },
  {
    id: "agricultural-rd",
    rank: 6,
    isWinner: true,
    title: "R&D to Increase Yield Enhancements in Agriculture",
    shortTitle: "Agricultural Yield R&D",
    category: "Nutrition & Hunger",
    costBillions: 8.0,
    bcr3pct: 22,
    bcr5pct: 16,
    dalyMultiplierHigh: 1.4,
    authors: " Mark W. Rosegrant, Claudia Ringler & Tingju Zhu",
    livesSavedOrImpacted: "150M+ people lifted out of hunger; global food prices lowered",
    summary: "Doubling public R&D into high-yield, drought-tolerant, pest-resistant tropical crop varieties and soil management.",
    whyItWins: "Higher crop yields lower food prices for every poor household on Earth while sparing forests from slash-and-burn clearing. It is the prerequisite to industrialization.",
    drcRelevance: "Turns the DRC's 80 million hectares of arable land from subsistence plots into the breadbasket of 2 billion people."
  },
  {
    id: "early-warning",
    rank: 7,
    isWinner: true,
    title: "Investing in Effective Early Warning Systems for Disasters",
    shortTitle: "Disaster Early Warning",
    category: "Climate & Resilience",
    costBillions: 4.0,
    bcr3pct: 35,
    bcr5pct: 20,
    dalyMultiplierHigh: 1.5,
    authors: "Halvard Buhaug &igh-impact Weather Panel",
    livesSavedOrImpacted: "Tens of thousands of lives & $30B+ in infrastructure saved/yr",
    summary: "Modern weather radar, hydrological monitoring, and mobile alert networks across developing nations.",
    whyItWins: "You cannot stop a flood, cyclone, or volcanic event, but 48 hours of advance warning lets farmers move livestock, operators shut down grids safely, and families evacuate.",
    drcRelevance: "Protects Congo River hydro infrastructure, Lake Kivu/Goma corridors, and tropical agricultural harvests."
  },
  {
    id: "surgical-capacity",
    rank: 8,
    isWinner: true,
    title: "Strengthening Surgical Capacity in Developing Nations",
    shortTitle: "District Surgical Capacity",
    category: "Health Systems",
    costBillions: 12.0,
    bcr3pct: 18,
    bcr5pct: 14,
    dalyMultiplierHigh: 1.9,
    authors: "Dean Jamison, Thomas G. Weiser & Atul Gawande",
    livesSavedOrImpacted: "2M+ deaths/disabilities averted from trauma & obstructed labor",
    summary: "Equipping district hospitals with basic surgical theatres, trained clinical officers, anesthesia, and safe C-section/trauma capabilities.",
    whyItWins: "Road accidents, industrial injuries, hernia, and obstructed childbirth account for a massive share of preventable disability among young workers and mothers.",
    drcRelevance: "Keeps skilled technicians, engineers, and mothers alive and healthy across growing Congolese cities."
  },
  {
    id: "hepatitis-b",
    rank: 9,
    isWinner: true,
    title: "Hepatitis B Immunization Expansion",
    shortTitle: "Hepatitis B Vaccine",
    category: "Disease Control",
    costBillions: 0.6,
    bcr3pct: 22,
    bcr5pct: 15,
    dalyMultiplierHigh: 1.8,
    authors: "Stephen C. Resch & Harvard School of Public Health",
    livesSavedOrImpacted: "Hundreds of thousands of liver cancer deaths prevented",
    summary: "Adding low-cost monovalent birth-dose and infant Hepatitis B vaccination across high-prevalence regions.",
    whyItWins: "At just pennies per dose, it prevents chronic liver disease and fatal hepatocellular carcinoma during peak adult working years.",
    drcRelevance: "High prevalence in Central Africa makes birth-dose Hep B an effortless human capital win."
  },
  {
    id: "heart-drugs",
    rank: 10,
    isWinner: true,
    title: "Using Low-Cost Drugs in Case of Acute Heart Attacks",
    shortTitle: "Low-Cost Cardiac Meds",
    category: "Health Systems",
    costBillions: 0.8,
    bcr3pct: 25,
    bcr5pct: 19,
    dalyMultiplierHigh: 2.0,
    authors: "Thomas A. Gaziano, Rachel Nugent & Dariush Mozaffarian",
    livesSavedOrImpacted: "300,000+ adult lives saved per year",
    summary: "Providing generic aspirin, beta-blockers, ACE inhibitors, and statins ('polypill' protocols) for acute myocardial infarction and high-risk patients.",
    whyItWins: "Cardiovascular disease is already a leading killer of experienced 40-to-65-year-old managers, teachers, and engineers in developing nations.",
    drcRelevance: "Preserves senior managerial, academic, and technical talent in rapidly urbanizing African cities."
  },
  {
    id: "salt-reduction",
    rank: 11,
    isWinner: true,
    title: "Salt Reduction Campaigns to Combat Chronic Disease",
    shortTitle: "Salt Reduction Policy",
    category: "Health Systems",
    costBillions: 1.2,
    bcr3pct: 20,
    bcr5pct: 14,
    dalyMultiplierHigh: 1.7,
    authors: "Thomas A. Gaziano & Chronic Disease Panel",
    livesSavedOrImpacted: "Millions of strokes & hypertensive events prevented",
    summary: "Public health regulation and industry reformulation to reduce excess dietary sodium by 15–30%.",
    whyItWins: "Requires negligible ongoing clinical expense while slashing stroke and hypertension rates across entire urban populations.",
    drcRelevance: "Prevents a wave of urban hypertension as Kinshasa grows toward a 25-million-person megacity."
  },
  {
    id: "geoengineering-rd",
    rank: 12,
    isWinner: true,
    title: "Research & Development in Green Energy & Climate Engineering",
    shortTitle: "Green Energy & Climate R&D",
    category: "Climate & Resilience",
    costBillions: 4.0,
    bcr3pct: 25,
    bcr5pct: 15,
    dalyMultiplierHigh: 1.3,
    authors: "J. Eric Bickel, Lee Lane & Isabel Galiana",
    livesSavedOrImpacted: "Trillions in long-term climate damage avoided",
    summary: "Investing in R&D to make clean energy (hydro, solar, next-gen nuclear, grid storage) cheaper than fossil fuels, plus stratospheric aerosol/climate safety research.",
    whyItWins: "Forcing poor nations to pay more for energy today slows poverty eradication. Making clean energy genuinely cheaper than coal/diesel solves climate change permanently through market adoption.",
    drcRelevance: "Directly aligns with the DRC's Grand Inga & modular hydro dominance + cobalt/lithium battery R&D."
  },
  {
    id: "conditional-cash-education",
    rank: 13,
    isWinner: true,
    title: "Conditional Cash Transfers for School Attendance",
    shortTitle: "Conditional Cash Transfers",
    category: "Education & Health",
    costBillions: 8.0,
    bcr3pct: 14,
    bcr5pct: 10,
    dalyMultiplierHigh: 1.5,
    authors: "Lant Pritchett, Elizabeth M. King & Peter F. Orazem",
    livesSavedOrImpacted: "Tens of millions of girls & boys completing secondary school",
    summary: "Direct stipends paid to low-income families conditional on verified school attendance and preventative health checkups.",
    whyItWins: "Overcomes the immediate opportunity cost that forces poor families to pull bright children out of school for subsistence farm labor.",
    drcRelevance: "Crucial for transitioning Congolese youth from artisanal mining/subsistence farming into STEM and vocational tracks."
  },
  {
    id: "hiv-vaccine-rd",
    rank: 14,
    isWinner: true,
    title: "Accelerated HIV/AIDS Vaccine Research & Prevention",
    shortTitle: "HIV Vaccine R&D",
    category: "Disease Control",
    costBillions: 4.0,
    bcr3pct: 16,
    bcr5pct: 11,
    dalyMultiplierHigh: 1.7,
    authors: "Ramanan Laxminarayan, Robert Hecht & Carel Pretorius",
    livesSavedOrImpacted: "Millions of future infections & lifelong ART costs averted",
    summary: "Targeted R&D for an effective HIV vaccine combined with high-efficiency prevention hotspots.",
    whyItWins: "Even a partially effective vaccine saves tens of billions in lifelong antiretroviral therapy obligations across Sub-Saharan Africa.",
    drcRelevance: "Protects regional trade corridors across Southern and East-Central Africa."
  },
  {
    id: "boreholes-water",
    rank: 15,
    isWinner: true,
    title: "Rural Boreholes, Public Hand Pumps & Sanitation",
    shortTitle: "Clean Water Boreholes",
    category: "Nutrition & Hunger",
    costBillions: 6.0,
    bcr3pct: 12,
    bcr5pct: 9,
    dalyMultiplierHigh: 1.6,
    authors: "Dale Whittington, W. Michael Hanemann & Marc Jeuland",
    livesSavedOrImpacted: "150M+ rural citizens gaining clean water & time savings",
    summary: "Community-maintained boreholes, hand pumps, and point-of-use water chlorination in rural villages.",
    whyItWins: "Slashes diarrheal disease (which flushes nutrients from children's bodies) and saves women and girls 2+ hours every day previously spent hauling water.",
    drcRelevance: "Paradoxically, despite having 50% of Africa's fresh water, rural DRC lacks clean village boreholes—making this a massive time and health liberator."
  },
  {
    id: "chronic-disease-bundle",
    rank: 16,
    isWinner: true,
    title: "Tobacco Taxation & Chronic Disease Prevention Bundle",
    shortTitle: "Chronic Disease Prevention",
    category: "Health Systems",
    costBillions: 2.0,
    bcr3pct: 17,
    bcr5pct: 12,
    dalyMultiplierHigh: 1.8,
    authors: "Prabhat Jha, Rachel Nugent & Thomas Gaziano",
    livesSavedOrImpacted: "Millions of premature adult deaths averted",
    summary: "Excise taxes on tobacco, hepatitis/HPV screening, and low-cost secondary prevention in developing economies.",
    whyItWins: "Generates fiscal revenue for governments while preventing a costly epidemic of non-communicable diseases as nations industrialize.",
    drcRelevance: "Keeps healthcare budgets solvent as the DRC urbanizes."
  },

  // --- LOWER-RANKED / DECOY PROPOSALS FROM THE BOOK (FOR SIMULATOR COMPARISON) ---
  {
    id: "blanket-carbon-cuts",
    rank: 17,
    isWinner: false,
    title: "Immediate Unilateral Carbon Taxes Without Cheap Tech R&D",
    shortTitle: "Immediate Carbon Cut Mandates",
    category: "Climate & Resilience",
    costBillions: 25.0,
    bcr3pct: 0.9,
    bcr5pct: 0.4,
    dalyMultiplierHigh: 1.1,
    authors: "Richard S.J. Tol & Climate Economics Panel",
    livesSavedOrImpacted: "Negligible near-term temperature change (<0.01°C by 2050)",
    summary: "Spending $25B on immediate Kyoto-style fossil fuel restrictions before green energy R&D makes clean power cheaper.",
    whyItWins: "RANKED POOR BY NOBEL PANEL: Expensive energy slows poverty eradication today while barely nudging global temperatures. Investing in Green Energy R&D (#12) yields 25x more climate benefit per dollar.",
    drcRelevance: "In the DRC, starving people of cheap power forces them to burn charcoal—destroying the Congo rainforest. Cheap hydro is the real climate solution."
  },
  {
    id: "megaproject-prestige",
    rank: 18,
    isWinner: false,
    title: "Unsequenced Prestige Mega-Infrastructure (Before Health/Skills)",
    shortTitle: "Unsequenced Mega-Projects",
    category: "Climate & Resilience",
    costBillions: 30.0,
    bcr3pct: 1.8,
    bcr5pct: 1.1,
    dalyMultiplierHigh: 1.0,
    authors: "Development Infrastructure Review",
    livesSavedOrImpacted: "High risk of 'white elephant' underutilization",
    summary: "Pouring $30B into giant centralized megaprojects before addressing workforce malaria, stunting, property rights, and regional trade bottlenecks.",
    whyItWins: "RANKED FAIR/POOR WHEN UNSEQUENCED: Without a healthy, skilled workforce and secure property rights, megaprojects suffer 300% cost overruns and fail to connect to local SMEs.",
    drcRelevance: "The classic 'Inga III on Day 1' trap: trying to build an $80B dam before fixing local grid distribution, property titles, and biological human capital."
  },
  {
    id: "untargeted-school-spending",
    rank: 19,
    isWinner: false,
    title: "Untargeted Brick-and-Mortar School Construction Only",
    shortTitle: "Brick-and-Mortar Schools Only",
    category: "Education & Health",
    costBillions: 15.0,
    bcr3pct: 2.4,
    bcr5pct: 1.6,
    dalyMultiplierHigh: 1.2,
    authors: "Lant Pritchett & Education Panel",
    livesSavedOrImpacted: "Buildings built, but low learning outcomes if children are stunted/sick",
    summary: "Spending billions purely on school buildings without deworming, micronutrients, or attendance incentives.",
    whyItWins: "RANKED LOW BY NOBEL PANEL: Lant Pritchett showed that building classrooms for children suffering from hookworm, malaria, and iron deficiency produces near-zero cognitive gain compared to nutrition + deworming + cash incentives.",
    drcRelevance: "Demonstrates why Phase 1 (Nutrition & Malaria) must precede massive physical university construction."
  },
  {
    id: "piped-water-mega",
    rank: 20,
    isWinner: false,
    title: "Universal Urban-Style Piped Water Grid to Remote Villages",
    shortTitle: "Full Rural Piped Water Grids",
    category: "Nutrition & Hunger",
    costBillions: 20.0,
    bcr3pct: 2.1,
    bcr5pct: 1.3,
    dalyMultiplierHigh: 1.3,
    authors: "Dale Whittington & Water Panel",
    livesSavedOrImpacted: "High capital cost per household reached; reaches 10x fewer people",
    summary: "Building European-style pressurized underground municipal water grids to dispersed rural hamlets instead of boreholes and point-of-use treatment.",
    whyItWins: "RANKED LOW ON INITIAL TRIAGE: Costs 10x more per villager than community boreholes (#15) and point-of-use chlorination, leaving 90% of villages with nothing when budgets are capped.",
    drcRelevance: "In rural DRC, boreholes and solar micro-pumps deliver clean water immediately at 1/10th the capital cost."
  }
];

// ============================================================================
// DATA: THE DRC & AFRICA $50+ TRILLION ECONOMIC SUPERPOWER BLUEPRINT
// Applying Lomborg's $75B Benefit-Cost Sequencing to the Congo Basin & Africa
// ============================================================================

const DRC_ENDOWMENTS = [
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
];

const DRC_PHASES = [
  {
    phaseNumber: 1,
    phaseTitle: "Phase I: Biological & Cognitive Liberation",
    phaseSubtitle: "Lomborg Priorities #1, #2, #3, #4 & #5 — Fixing the Human Engine First",
    budgetBillions: 22.0,
    avgBcr: 41,
    directEconomicBenefitBillions: 902,
    gdpMultiplierEffect: "+32% lifetime workforce cognitive & physical productivity",
    accentColor: "#0D9488",
    description: "You cannot build a $50 trillion industrial and technological superpower when 42% of children suffer from chronic stunting (permanently reducing brain development) and malaria steals 80+ million workdays a year. Following Lomborg's strict BCR law, the first $22B eliminates the biological tax on the Congolese and African people.",
    interventions: [
      {
        title: "Congo Basin Micronutrient & Anti-Stunting Blitz",
        lomborgRef: "Book Priority #1 (Horton et al.)",
        costB: 12.0,
        bcr: 45,
        benefitB: 540,
        outcome: "Eliminates childhood stunting across the DRC & bordering corridors; raises average population IQ by 6–9 points and adult wage potential by 30%+."
      },
      {
        title: "Malaria Eradication (ACT Subsidies, Bed Nets) & School Deworming",
        lomborgRef: "Book Priorities #2, #3, #4 & #5 (Laxminarayan, Jamison et al.)",
        costB: 10.0,
        bcr: 36,
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
    accentColor: "#D97706",
    description: "Every economic superpower in history (Britain, the US, Japan, China) began with an agricultural revolution that made domestic calories abundant and cheap. Instead of importing food, $16B turns the DRC's 80 million arable hectares into the breadbasket of a 2.5-billion-person continent.",
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
    accentColor: "#2563EB",
    description: "With children now surviving and arriving at school well-nourished and parasite-free, Phase III ensures they stay in school through secondary and technical training—and protects adult engineers, miners, and managers from premature death.",
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
    phaseSubtitle: "Lomborg Priorities #7, #12 & Trade Reform — Igniting the $50T+ Flywheel",
    budgetBillions: 25.0,
    avgBcr: 24,
    directEconomicBenefitBillions: 600,
    gdpMultiplierEffect: "Unlocks $5T+ in private capital & onshore mineral beneficiation",
    accentColor: "#E3120B",
    description: "In the Copenhagen Consensus framework, lowering trade barriers and securing property titles have massive Benefit-Cost Ratios because they unlock trillions in private investment. Combined with modular run-of-river hydro, this collapses the DRC's sovereign risk premium and forces global battery, green steel, and AI compute industries to relocate directly to the Congo Basin.",
    interventions: [
      {
        title: "Digitized Land Cadastre, Mining Titles & Property Rights",
        lomborgRef: "Institutional Reform / Hernando de Soto & Lomborg Trade Matrix",
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
        outcome: "Delivers immediate $0.02/kWh clean power to Katanga/Kivu industrial zones and connects the Lobito (Atlantic) & Dar es Salaam (Indian Ocean) corridors."
      },
      {
        title: "AfCFTA 9-Border Digital Customs Elimination & Disaster Early Warning",
        lomborgRef: "Book Priority #7 & Doha/AfCFTA Trade Liberalization",
        costB: 5.0,
        bcr: 25.6,
        benefitB: 128,
        outcome: "Slashes border transit times from 14 days to 4 hours, making the DRC the duty-free industrial clearinghouse for 2.5 billion African consumers."
      }
    ]
  }
];

// 50-Year Economic Trajectory Comparison (GDP in $ Trillions, Real PPP-Adjusted Continental Catalyst)
const DRC_TRAJECTORY_SCENARIOS = {
  lomborg: {
    id: "lomborg",
    name: "Lomborg BCR-Sequenced Superpower ($75B Optimal)",
    tagline: "Biology & Brains (45:1) → Calories (20:1) → Property Rights & Modular Hydro (24:1) → Self-Financed Grand Inga & Onshore Battery/Steel/AI Ecosystem",
    color: "#0D9488",
    points: [
      { year: "Year 0 (2026)", gdpT: 0.18, note: "Initial $75B deployed into 30:1–50:1 biological, caloric, and institutional foundations." },
      { year: "Year 10 (2036)", gdpT: 1.45, note: "Malaria & stunting crushed; agricultural yields triple; DRC becomes net food exporter; modular hydro powers onshore copper/cobalt refining." },
      { year: "Year 20 (2046)", gdpT: 6.80, note: "First generation of non-stunted, STEM-trained youth enters workforce; domestic tax base self-finances full 40+ GW Grand Inga hydro grid." },
      { year: "Year 30 (2056)", gdpT: 19.50, note: "Global battery precursors, green steel, aluminum, fertilizer, and AI hyperscale data centers relocate to Congo Basin for $0.015/kWh clean baseload power." },
      { year: "Year 40 (2066)", gdpT: 36.20, note: "DRC acts as the central manufacturing, financial, and logistics core of a 2.8-billion-person single African market (AfCFTA)." },
      { year: "Year 50 (2076)", gdpT: 54.80, note: "Surpasses legacy aging economies to become the largest integrated industrial & knowledge economy in human history." }
    ]
  },
  megaproject: {
    id: "megaproject",
    name: "The 'Megaproject-First' Trap (Unsequenced $75B)",
    tagline: "Spending $75B on giant dams & state factories on Day 1 while ignoring malaria, stunting, food imports, and insecure land titles",
    color: "#D97706",
    points: [
      { year: "Year 0 (2026)", gdpT: 0.18, note: "$75B sunk into flagship mega-infrastructure before fixing health, agricultural, or institutional bottlenecks." },
      { year: "Year 10 (2036)", gdpT: 0.42, note: "Cost overruns & grid theft eat 60% of capital; workforce remains burdened by malaria and high imported food costs." },
      { year: "Year 20 (2046)", gdpT: 0.95, note: "Enclave power exports electricity abroad while local SMEs lack property collateral or skilled technicians." },
      { year: "Year 30 (2056)", gdpT: 1.75, note: "Debt service on underutilized megaprojects crowds out public health and education." },
      { year: "Year 40 (2066)", gdpT: 2.80, note: "Slow incremental growth; misses the demographic dividend window." },
      { year: "Year 50 (2076)", gdpT: 4.10, note: "Remains a middle-income enclave economy (<8% of its true potential)." }
    ]
  },
  statusQuo: {
    id: "statusQuo",
    name: "Raw Ore Extraction Status Quo",
    tagline: "Exporting unrefined cobalt & copper dirt (<5% value capture) while importing food and relying on fragmented emergency aid",
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
};

// Value-Chain Multiplier Data for DRC Industrialization (Once Phases 1–4 Unlock Cheap Power + Healthy Workforce)
const DRC_VALUE_CHAINS = [
  {
    sector: "Cobalt, Copper & Lithium Battery Chain",
    rawExportValueB: 18,
    onshoreProcessedValueB: 840,
    multiplier: "46x Value Capture",
    explanation: "Exporting raw cobalt hydroxide and copper concentrate captures less than 3% of the final EV/grid battery pack value. With Phase 1–3 skilled metallurgists and Phase 4 $0.02/kWh hydro power, the DRC refines battery-grade cathode precursors, LFP/NMC cells, and grid storage domestically."
  },
  {
    sector: "Congo Basin Agro-Processing & Fertilizer",
    rawExportValueB: 4,
    onshoreProcessedValueB: 620,
    multiplier: "155x Value Capture",
    explanation: "Instead of importing $3B+ in food, Phase 2 tropical crop R&D + green ammonia fertilizer (produced via Congo hydro electrolysis) turns 80M arable hectares into refined food, soy protein, cocoa, palm derivatives, and cold-chain exports for 2.5B Africans."
  },
  {
    sector: "Green Steel, Aluminum & Titanium Smelting",
    rawExportValueB: 6,
    onshoreProcessedValueB: 780,
    multiplier: "130x Value Capture",
    explanation: "Smelting iron ore, bauxite, and titanium is 40–60% electricity cost. As global carbon border taxes penalize coal-smelted steel, zero-carbon Congo River hydro makes the DRC the most cost-competitive green metallurgy hub on Earth."
  },
  {
    sector: "Hyperscale AI Compute & Continental FinTech",
    rawExportValueB: 1,
    onshoreProcessedValueB: 950,
    multiplier: "950x Value Capture",
    explanation: "By the 2030s–2050s, the #1 bottleneck for global AI data centers is continuous gigawatt-scale carbon-free baseload electricity. Grand Inga (40+ GW) paired with fiber corridors along the Lobito and Indian Ocean rails turns the DRC into the clean compute engine of the Global South."
  }
];
