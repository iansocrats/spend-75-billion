// ============================================================================
// DATA: "HOW TO SPEND $75 BILLION TO MAKE THE WORLD A BETTER PLACE"
// Bjørn Lomborg (Copenhagen Consensus) + DRC, Kenya & Africa Superpower Blueprint
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
    drcRelevance: "DRC & Kenya Phase 1 Core: Eliminates DRC's 42% stunting rate and Kenya's 18–26% rural/ASAL stunting rate, permanently boosting IQ across 150M+ East & Central African youth."
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
    drcRelevance: "Crushes malaria across the Congo Basin (12% of global cases) as well as Kenya's Lake Victoria Basin and Coastal endemic zones."
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
    authors: "Stephen C. Resch & Till Bärnighausen",
    livesSavedOrImpacted: "1M+ childhood deaths prevented per year",
    summary: "Scaling coverage of routine childhood vaccines (measles, DTP, tetanus, Hib, pneumococcal, and rotavirus) to reach the hardest-to-reach 20% of children.",
    whyItWins: "Vaccines require no ongoing daily compliance once administered and trigger a demographic transition: when parents know children will survive, families invest far more in each child's education.",
    drcRelevance: "Stabilizes child survival across rural DRC provinces and Kenya's northern pastoralist counties, accelerating the demographic dividend."
  },
  {
    id: "deworming",
    rank: 4,
    isWinner: true,
    title: "Deworming Schoolchildren (Proven in Busia, Kenya)",
    shortTitle: "School Deworming",
    category: "Education & Health",
    costBillions: 1.2,
    bcr3pct: 60,
    bcr5pct: 34,
    dalyMultiplierHigh: 1.6,
    authors: "Stéphane Verguet, Michael Kremer, Edward Miguel & Dean Jamison",
    livesSavedOrImpacted: "300M+ schoolchildren treated annually",
    summary: "Administering ultra-low-cost deworming tablets (albendazole/praziquantel) through existing primary schools at ~$0.50 per child per year.",
    whyItWins: "Landmark randomized trials in Busia, Western Kenya proved deworming cuts school absenteeism by 25% and raises adult earnings by ~20% decades later—yielding up to a 60:1 return.",
    drcRelevance: "A homegrown Kenyan economic breakthrough (Busia trials) that scales across every school in Kenya and the DRC."
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
    drcRelevance: "Protects prime working-age adults in high-density hubs like Nairobi, Mombasa, Kinshasa, and Lubumbashi."
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
    authors: "Mark W. Rosegrant, Claudia Ringler & Tingju Zhu",
    livesSavedOrImpacted: "150M+ people lifted out of hunger; food prices lowered",
    summary: "Doubling public R&D into high-yield, drought-tolerant, pest-resistant tropical crop varieties and soil management.",
    whyItWins: "Higher crop yields lower food prices for every poor household on Earth while sparing forests from slash-and-burn clearing. It is the prerequisite to industrialization.",
    drcRelevance: "Unlocks DRC's 80M rain-fed arable hectares AND transforms Kenya's 83% Arid & Semi-Arid Lands (ASAL) with drought-tolerant maize, sorghum, and high-value horticulture."
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
    authors: "Halvard Buhaug & High-Impact Weather Panel",
    livesSavedOrImpacted: "Tens of thousands of lives & $30B+ in infrastructure saved/yr",
    summary: "Modern weather radar, hydrological monitoring, and mobile alert networks across developing nations.",
    whyItWins: "You cannot stop a flood, drought, or volcanic event, but advance warning lets farmers adjust planting, operators protect grids, and families evacuate.",
    drcRelevance: "Protects Kenya from Horn of Africa El Niño flood/drought swings and safeguards DRC's Congo River & Lake Kivu corridors."
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
    summary: "Equipping district and county hospitals with basic surgical theatres, trained clinical officers, anesthesia, and safe C-section/trauma capabilities.",
    whyItWins: "Road accidents, industrial injuries, hernia, and obstructed childbirth account for a massive share of preventable disability among young workers and mothers.",
    drcRelevance: "Strengthens Kenya's 47 County Referral Hospitals and DRC's district clinics along the Mombasa–Nairobi–Goma–Kinshasa highway."
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
    drcRelevance: "Universal birth-dose rollout across Kenyan county maternity wards and DRC health zones."
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
    drcRelevance: "Preserves senior engineering, financial, and academic leadership in Nairobi, Mombasa, and Kinshasa."
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
    drcRelevance: "Curbs the rapid rise of urban hypertension across Nairobi's 6M+ metro and Kinshasa's 17M+ metro."
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
    summary: "Investing in R&D to make clean energy (geothermal, hydro, solar, grid storage) cheaper than fossil fuels.",
    whyItWins: "Forcing poor nations to pay more for energy today slows poverty eradication. Making clean energy genuinely cheaper than diesel/coal solves climate change through market adoption.",
    drcRelevance: "Directly powers Kenya's 10+ GW Rift Valley Geothermal expansion (Olkaria/Menengai) and the DRC's 40+ GW Grand Inga & modular hydropower."
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
    whyItWins: "Overcomes the immediate opportunity cost that forces poor families to pull bright children out of school for subsistence labor.",
    drcRelevance: "Delivered instantly via M-Pesa in Kenya and mobile wallets in the DRC to keep youth in STEM, TVET, and secondary school."
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
    drcRelevance: "Builds on KEMRI (Kenya Medical Research Institute) vaccine trials to protect the entire Northern Corridor transport route."
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
    summary: "Community-maintained boreholes, solar micro-pumps, and point-of-use water chlorination in rural villages.",
    whyItWins: "Slashes diarrheal disease (which flushes nutrients from children's bodies) and saves women and girls 2+ hours every day previously spent hauling water.",
    drcRelevance: "Taps Kenya's vast Lotikipi/Turkana & Tana aquifers and brings clean village water to rural DRC."
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
    drcRelevance: "Keeps Kenya's SHA/UHC and DRC healthcare budgets solvent as urbanization accelerates."
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
    summary: "Spending $25B on immediate Kyoto-style energy restrictions before green energy R&D makes clean power cheaper.",
    whyItWins: "RANKED POOR BY NOBEL PANEL: Expensive energy slows poverty eradication today while barely nudging global temperatures. Investing in Green Energy R&D (#12) yields 25x more climate benefit per dollar.",
    drcRelevance: "High electricity tariffs in Kenya and DRC force households to burn wood and charcoal—destroying forests. Cheap geothermal & hydro is the real climate fix."
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
    livesSavedOrImpacted: "High risk of debt distress & underutilization",
    summary: "Pouring $30B into debt-heavy megaprojects before addressing workforce nutrition, malaria, SME property titles, and last-mile industrial power tariffs.",
    whyItWins: "RANKED FAIR/POOR WHEN UNSEQUENCED: Without low-cost industrial energy, healthy workers, and agro-surplus, prestige infrastructure struggles to service its external debt.",
    drcRelevance: "Demonstrates why Kenya's SGR/LAPSSET and DRC's Grand Inga require parallel high-BCR human capital, agro-processing, and SEZ tariff reforms to pay off."
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
    whyItWins: "RANKED LOW BY NOBEL PANEL: Building classrooms for children suffering from hookworm, malaria, and iron deficiency produces near-zero cognitive gain compared to nutrition + deworming + digital learning.",
    drcRelevance: "Why Kenya's Busia deworming model + micronutrient fortification must accompany every classroom built."
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
    summary: "Building European-style pressurized underground municipal water grids to dispersed rural hamlets instead of boreholes and solar micro-irrigation.",
    whyItWins: "RANKED LOW ON INITIAL TRIAGE: Costs 10x more per villager than community solar boreholes (#15) and point-of-use chlorination.",
    drcRelevance: "In Kenya's ASAL counties and rural DRC, solar boreholes deliver clean water and crop irrigation immediately at 1/10th the cost."
  }
];

// ============================================================================
// COUNTRY & CORRIDOR SUPERPOWER BLUEPRINTS (DRC, KENYA & TWIN-ENGINE AXIS)
// ============================================================================

const AFRICAN_BLUEPRINTS = {
  drc: {
    id: "drc",
    name: "DRC & Congo Basin ($54.8T Industrial Heartland)",
    badge: "RESOURCE, HYDRO & MANUFACTURING ENGINE",
    headline: "How $75B Turns the Democratic Republic of the Congo into History's Largest Economy",
    intro: "The DRC sits on the richest natural endowment on Earth ($24T+ in critical minerals, 80M arable hectares, 40+ GW Grand Inga hydro, and 9 bordering nations)—yet conventional plans fail when they attempt $80B megaprojects while 42% of children suffer from cognitive stunting and malaria drains 80M+ workdays/year. Applying Lomborg's strict Benefit-Cost Ratio sequencing unlocks a self-financing $54.8 Trillion industrial superpower.",
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
        phaseSubtitle: "Lomborg Priorities #7, #12 & Trade Reform — Igniting the $50T+ Flywheel",
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
          { year: "Year 50 (2076)", gdpT: 54.80, note: "Surpasses legacy aging economies to become the largest integrated industrial economy in history." }
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
  // KENYA BLUEPRINT ("THE SILICON SAVANNAH, GEOTHERMAL & INDIAN OCEAN HUB")
  // Informed by Lomborg's $75B Book + Copenhagen Consensus 'Kenya Priorities'
  // ==========================================================================
  kenya: {
    id: "kenya",
    name: "Kenya ($18.6T Silicon Savannah & Indian Ocean Superhub)",
    badge: "FINTECH, GEOTHERMAL & INDO-AFRICAN GATEWAY",
    headline: "Applying Lomborg’s Playbook to Turn Kenya into the 'Singapore + California' of Africa",
    intro: "Kenya is already East Africa's economic, financial, and technological pacemaker—and notably the real-world proving ground for Lomborg's #4 global priority (the famous Busia, Kenya school deworming trials) as well as the Copenhagen Consensus 'Kenya Priorities' project. By sequencing high-BCR nutrition, ASAL climate-smart irrigation, digitized property titles, and 10+ GW Rift Valley geothermal industrial tariffs, Kenya transforms from a debt-constrained service economy into an $18.6 Trillion Indo-African tech, biotech, and manufacturing titan.",
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
  // THE KENYA + DRC TWIN-ENGINE SUPERPOWER AXIS ($73.4T COMBINED MEGACORRIDOR)
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
          { year: "Year 50 (2076)", gdpT: 73.40, note: "$73.4 Trillion combined economy ($54.8T DRC + $18.6T Kenya)—the largest economic bloc in human history." }
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
