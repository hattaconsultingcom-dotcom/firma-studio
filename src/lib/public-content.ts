// Mock content for the public FIRMA Journal sections.
// Each section has its own list + detail records.

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/* -------------------------- ARTICLES -------------------------- */
export type Article = {
  slug: string;
  title: string;
  dek: string;
  section: string;
  author: { name: string; role: string; initials: string };
  publishedAt: string;
  readingMinutes: number;
  cover: string;
  body: { heading?: string; paragraph: string }[];
};

const A_AUTHORS = {
  sofia: { name: "Sofia Reyes", role: "Agronomy Editor", initials: "SR" },
  amina: { name: "Amina Fassi", role: "Editor in Chief", initials: "AF" },
  julien: { name: "Julien Marchand", role: "Contributing Writer", initials: "JM" },
  nora:  { name: "Nora El Idrissi", role: "Field Correspondent", initials: "NE" },
};

export const ARTICLE_SECTIONS = ["All", "Field Report", "Analysis", "Interviews", "Opinion", "Long Read"];

export const ARTICLES: Article[] = [
  {
    slug: "the-quiet-industrialisation-of-indoor-farming",
    title: "The quiet industrialisation of indoor farming",
    dek: "How a decade of falling LED costs and rising labour costs is rewriting what a farm looks like.",
    section: "Long Read",
    author: A_AUTHORS.amina,
    publishedAt: "2026-07-22",
    readingMinutes: 14,
    cover: img("1523348837708-15d4a09cfac2"),
    body: [
      { paragraph: "In a warehouse outside Rotterdam, twenty thousand basil plants grow under a spectrum tuned within a nanometre. The operator is a former logistics manager. Nothing about this scene would have been legible five years ago." },
      { heading: "A slow-motion transition", paragraph: "The story of indoor farming in the 2020s is not one of hype cycles. It is a slow-motion transition, driven by the mundane arithmetic of energy and labour." },
      { heading: "What operators are actually doing", paragraph: "Operators are quietly rebuilding their production stacks around software: batch planning, traceability, and margin analysis running side by side." },
      { paragraph: "The industrial farm is here. It just doesn't look like the render." },
    ],
  },
  {
    slug: "field-report-a-week-inside-a-vertical-basil-facility",
    title: "Field report: a week inside a vertical basil facility",
    dek: "Seven days, three shifts, one climate incident, and a lot of pruning.",
    section: "Field Report",
    author: A_AUTHORS.nora,
    publishedAt: "2026-07-18",
    readingMinutes: 11,
    cover: img("1500937386664-56d1dfef3854"),
    body: [
      { paragraph: "The first shift starts at 05:30. The lights have been on for two hours. A humidifier fault the night before pushed VPD into a bad corridor and the crop shows it." },
      { heading: "Rhythm of the floor", paragraph: "Everything runs on a rhythm: seeding on Mondays, transplant on Thursdays, harvest twice a week. Deviation from the rhythm is the enemy." },
      { paragraph: "By Friday the tunnel is back in spec. The team debriefs for thirty minutes and closes the week." },
    ],
  },
  {
    slug: "why-yield-per-square-metre-is-the-wrong-metric",
    title: "Why yield per square metre is the wrong metric",
    dek: "A provocation for anyone still benchmarking farms with a single number.",
    section: "Opinion",
    author: A_AUTHORS.julien,
    publishedAt: "2026-07-11",
    readingMinutes: 7,
    cover: img("1592982537447-6f2a6a0c8b1a"),
    body: [
      { paragraph: "Yield per square metre is the vanity metric of controlled-environment agriculture." },
      { heading: "Contribution margin is the real number", paragraph: "A farm exists to convert electricity, labour and seed into a positive contribution margin per unit of production." },
      { paragraph: "Track that, and the correct capex conversations start to happen on their own." },
    ],
  },
  {
    slug: "interview-what-a-buyer-actually-wants-from-a-local-farm",
    title: "Interview: what a buyer actually wants from a local farm",
    dek: "A head of procurement at a European retail group on consistency, packaging and paperwork.",
    section: "Interviews",
    author: A_AUTHORS.sofia,
    publishedAt: "2026-07-04",
    readingMinutes: 9,
    cover: img("1466692476868-aef1dfb1e735"),
    body: [
      { paragraph: "\"We do not need heroic yields. We need a truck that arrives on Tuesday with the same product it delivered last Tuesday.\"" },
      { heading: "Consistency over novelty", paragraph: "The buyer is unambiguous: consistency, not novelty, wins the shelf." },
      { paragraph: "Paperwork is the second theme. Everything is a document. Every document is a decision." },
    ],
  },
  {
    slug: "analysis-the-real-energy-bill-of-a-vertical-farm",
    title: "Analysis: the real energy bill of a vertical farm",
    dek: "We rebuilt a fictional 800 m² facility line by line to see where the kilowatt-hours actually go.",
    section: "Analysis",
    author: A_AUTHORS.julien,
    publishedAt: "2026-06-27",
    readingMinutes: 13,
    cover: img("1497436072909-60f360e1d4b1"),
    body: [
      { paragraph: "Lighting is the headline number, but it is far from the whole story." },
      { heading: "The unseen 30%", paragraph: "Dehumidification, HVAC, and the water loop routinely take a third of the total draw." },
      { paragraph: "Design decisions that reduce latent load pay back faster than any panel upgrade." },
    ],
  },
  {
    slug: "long-read-the-return-of-the-glasshouse",
    title: "Long read: the return of the glasshouse",
    dek: "The most exciting facility in European CEA today is not vertical. It is glass, and it is enormous.",
    section: "Long Read",
    author: A_AUTHORS.amina,
    publishedAt: "2026-06-20",
    readingMinutes: 16,
    cover: img("1416879595882-3373a0480b5b"),
    body: [
      { paragraph: "For a decade, the future of farming was vertical. In 2026 the future has grown a roof made of glass." },
      { paragraph: "Semi-closed glasshouses with active dehumidification are quietly setting new benchmarks for tomato yield per euro of capex." },
    ],
  },
];

/* -------------------------- RESOURCES -------------------------- */
export type Resource = {
  slug: string;
  title: string;
  summary: string;
  type: "Guide" | "Playbook" | "Template" | "Report" | "Toolkit";
  category: string;
  minutes: number;
  updated: string;
  cover: string;
  chapters: { title: string; body: string }[];
};

export const RESOURCE_TYPES = ["All", "Guide", "Playbook", "Template", "Report", "Toolkit"];
export const RESOURCE_CATEGORIES = ["Operations", "Commerce", "Finance", "Compliance", "People"];

export const RESOURCES: Resource[] = [
  {
    slug: "starting-a-microgreens-business",
    title: "Starting a microgreens business",
    summary: "A 42-page guide covering site selection, seed sourcing, unit economics and go-to-market for a professional microgreens operation.",
    type: "Guide",
    category: "Operations",
    minutes: 45,
    updated: "2026-07-14",
    cover: img("1585320806297-9794b3e4eeae"),
    chapters: [
      { title: "1. Choosing the right facility", body: "Ceiling height, floor drainage, three-phase power, and access for a small truck are the four things that matter most." },
      { title: "2. Seed sourcing and storage", body: "Buy from three suppliers minimum, rotate stock every 6 months, and store cool and dry." },
      { title: "3. Unit economics", body: "Model contribution margin per tray, not per gram. Everything else follows." },
      { title: "4. Wholesale go-to-market", body: "Two chefs a week for eight weeks builds a route." },
    ],
  },
  {
    slug: "production-planning-playbook",
    title: "Production planning playbook",
    summary: "Templates and workflows for weekly and quarterly production planning in indoor farms.",
    type: "Playbook",
    category: "Operations",
    minutes: 30,
    updated: "2026-07-05",
    cover: img("1500382017468-9049fed747ef"),
    chapters: [
      { title: "The weekly cycle", body: "A rolling 12-week plan reviewed every Monday." },
      { title: "Handling variance", body: "Buffer stock, not heroics." },
    ],
  },
  {
    slug: "wholesale-pricing-template",
    title: "Wholesale pricing template",
    summary: "A spreadsheet + written framework for building defensible wholesale price lists.",
    type: "Template",
    category: "Commerce",
    minutes: 15,
    updated: "2026-06-28",
    cover: img("1524594152303-9fd13543fe6e"),
    chapters: [
      { title: "The three-tier model", body: "Distributor, direct, retail — priced from cost, not from feel." },
      { title: "Discount discipline", body: "Set the ceiling before the first call." },
    ],
  },
  {
    slug: "state-of-indoor-farming-2026",
    title: "State of Indoor Farming 2026",
    summary: "An annual report on capacity, capex, energy and labour trends across European CEA operators.",
    type: "Report",
    category: "Finance",
    minutes: 25,
    updated: "2026-06-15",
    cover: img("1466692476868-aef1dfb1e735"),
    chapters: [
      { title: "Executive summary", body: "Growth slowed, margins improved, the industry got serious." },
      { title: "Data appendix", body: "Sample of 84 operators, self-reported and normalised." },
    ],
  },
  {
    slug: "food-safety-audit-toolkit",
    title: "Food safety audit toolkit",
    summary: "Checklists, SOP templates and audit prep material for GLOBALG.A.P. and equivalent schemes.",
    type: "Toolkit",
    category: "Compliance",
    minutes: 40,
    updated: "2026-06-01",
    cover: img("1416879595882-3373a0480b5b"),
    chapters: [
      { title: "The pre-audit walk", body: "Do it two weeks out, then again the day before." },
      { title: "Documenting the invisible", body: "If it is not written, it did not happen." },
    ],
  },
  {
    slug: "hiring-a-head-grower",
    title: "Hiring a head grower",
    summary: "Job description, interview scorecard and 90-day plan for your first agronomy hire.",
    type: "Playbook",
    category: "People",
    minutes: 20,
    updated: "2026-05-22",
    cover: img("1500937386664-56d1dfef3854"),
    chapters: [
      { title: "What to look for", body: "Curiosity over pedigree, calm over charisma." },
      { title: "The trial week", body: "Pay for it. Watch the debrief." },
    ],
  },
];

/* -------------------------- ACADEMY -------------------------- */
export type Course = {
  slug: string;
  title: string;
  tagline: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  track: string;
  hours: number;
  lessons: number;
  instructor: { name: string; role: string; initials: string };
  cover: string;
  outline: { module: string; lessons: string[] }[];
};

export const ACADEMY_TRACKS = ["All", "Foundations", "Operations", "Commerce", "Leadership"];
export const ACADEMY_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export const COURSES: Course[] = [
  {
    slug: "foundations-of-indoor-farming",
    title: "Foundations of Indoor Farming",
    tagline: "A structured introduction for professionals entering the industry.",
    level: "Beginner",
    track: "Foundations",
    hours: 6,
    lessons: 24,
    instructor: { name: "Amina Fassi", role: "Editor in Chief", initials: "AF" },
    cover: img("1523348837708-15d4a09cfac2"),
    outline: [
      { module: "Module 1 — The industry", lessons: ["Why now", "Segments and business models", "Regulatory landscape"] },
      { module: "Module 2 — Plant science essentials", lessons: ["Photosynthesis for operators", "VPD, transpiration, nutrients", "Common pathologies"] },
      { module: "Module 3 — Facility fundamentals", lessons: ["Layout", "Environmental control", "Water and nutrients"] },
    ],
  },
  {
    slug: "production-planning-mastery",
    title: "Production Planning Mastery",
    tagline: "From the weekly plan to the annual capacity model.",
    level: "Intermediate",
    track: "Operations",
    hours: 8,
    lessons: 28,
    instructor: { name: "Julien Marchand", role: "Head of Curriculum", initials: "JM" },
    cover: img("1500382017468-9049fed747ef"),
    outline: [
      { module: "Module 1 — The plan of record", lessons: ["Cycles and cadence", "Batching", "Buffers"] },
      { module: "Module 2 — Handling reality", lessons: ["Variance", "Rework", "Escalations"] },
    ],
  },
  {
    slug: "commerce-for-farm-operators",
    title: "Commerce for Farm Operators",
    tagline: "Pricing, channels, contracts and margin defence.",
    level: "Intermediate",
    track: "Commerce",
    hours: 5,
    lessons: 20,
    instructor: { name: "Sofia Reyes", role: "Commerce Faculty", initials: "SR" },
    cover: img("1524594152303-9fd13543fe6e"),
    outline: [
      { module: "Module 1 — Pricing", lessons: ["Cost-plus", "Value-based", "Discount discipline"] },
      { module: "Module 2 — Channels", lessons: ["Wholesale", "Direct", "Retail"] },
    ],
  },
  {
    slug: "leading-a-growing-farm",
    title: "Leading a Growing Farm",
    tagline: "Team, cadence, and personal operating system for founders past the first year.",
    level: "Advanced",
    track: "Leadership",
    hours: 7,
    lessons: 22,
    instructor: { name: "Nora El Idrissi", role: "Leadership Faculty", initials: "NE" },
    cover: img("1497436072909-60f360e1d4b1"),
    outline: [
      { module: "Module 1 — People", lessons: ["Hiring", "Firing", "Growing"] },
      { module: "Module 2 — Cadence", lessons: ["Weekly", "Monthly", "Quarterly"] },
    ],
  },
  {
    slug: "advanced-hydroponic-systems",
    title: "Advanced Hydroponic Systems",
    tagline: "NFT, DWC and drip at commercial scale — design and operate for reliability.",
    level: "Advanced",
    track: "Operations",
    hours: 9,
    lessons: 30,
    instructor: { name: "Julien Marchand", role: "Head of Curriculum", initials: "JM" },
    cover: img("1466692476868-aef1dfb1e735"),
    outline: [
      { module: "Module 1 — Systems", lessons: ["NFT", "DWC", "Drip"] },
      { module: "Module 2 — Nutrients", lessons: ["Recipes", "Monitoring", "Correction"] },
    ],
  },
];

/* -------------------------- CASE STUDIES -------------------------- */
export type CaseStudy = {
  slug: string;
  company: string;
  headline: string;
  summary: string;
  industry: string;
  region: string;
  size: string;
  logoLetters: string;
  cover: string;
  metrics: { label: string; value: string }[];
  quote: { text: string; author: string; role: string };
  story: { heading: string; body: string }[];
};

export const CASE_INDUSTRIES = ["All", "Vertical Farming", "Greenhouse", "Microgreens", "Distribution"];

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "verdeo-cutting-planning-time-by-70",
    company: "Verdeo",
    headline: "How Verdeo cut planning time by 70% across three facilities",
    summary: "A pan-European vertical farming operator consolidated planning, inventory and orders on FIRMA.",
    industry: "Vertical Farming",
    region: "Netherlands · France · Spain",
    size: "120 employees",
    logoLetters: "VE",
    cover: img("1523348837708-15d4a09cfac2"),
    metrics: [
      { label: "Planning time saved", value: "-70%" },
      { label: "Order accuracy", value: "99.4%" },
      { label: "Facilities on one platform", value: "3" },
    ],
    quote: { text: "For the first time our three sites are running on one plan.", author: "Ines de Vries", role: "COO, Verdeo" },
    story: [
      { heading: "The context", body: "Three facilities, three spreadsheets, three definitions of the truth." },
      { heading: "The rollout", body: "Six weeks from kickoff to first live weekly plan on FIRMA." },
      { heading: "The result", body: "Planning meetings shrank from 90 minutes to 25. Order errors fell to under one percent." },
    ],
  },
  {
    slug: "hortus-glass-margin-transparency",
    company: "Hortus Glass",
    headline: "Hortus Glass gets to real-time contribution margin",
    summary: "A semi-closed glasshouse group replaces a monthly finance close with live per-SKU margin.",
    industry: "Greenhouse",
    region: "Belgium",
    size: "260 employees",
    logoLetters: "HG",
    cover: img("1416879595882-3373a0480b5b"),
    metrics: [
      { label: "Time to margin visibility", value: "Live" },
      { label: "SKUs tracked", value: "142" },
      { label: "Manual reports removed", value: "17" },
    ],
    quote: { text: "The finance team stopped chasing numbers and started using them.", author: "Peter Janssens", role: "CFO, Hortus Glass" },
    story: [
      { heading: "The context", body: "Monthly close, quarterly insight, annual regret." },
      { heading: "The change", body: "Cost and revenue in one place, per batch." },
      { heading: "The result", body: "Loss-making SKUs identified in weeks, not quarters." },
    ],
  },
  {
    slug: "petit-jardin-scaling-microgreens",
    company: "Petit Jardin",
    headline: "Petit Jardin scales from 40 to 300 restaurants",
    summary: "A microgreens operator uses FIRMA to add customers without adding chaos.",
    industry: "Microgreens",
    region: "Paris",
    size: "18 employees",
    logoLetters: "PJ",
    cover: img("1585320806297-9794b3e4eeae"),
    metrics: [
      { label: "Restaurants served", value: "300+" },
      { label: "On-time delivery", value: "98.7%" },
      { label: "Ops headcount added", value: "+2" },
    ],
    quote: { text: "We seven-x'd our route with two extra people.", author: "Camille Roche", role: "Founder, Petit Jardin" },
    story: [
      { heading: "The context", body: "A hand-drawn delivery map on a whiteboard." },
      { heading: "The change", body: "A single source of truth for orders, routes and stock." },
      { heading: "The result", body: "A calm office at 5pm on a Friday." },
    ],
  },
  {
    slug: "greenline-distribution-tightening-the-cold-chain",
    company: "Greenline",
    headline: "Greenline tightens the cold chain",
    summary: "A regional distributor unifies grower onboarding, orders and traceability.",
    industry: "Distribution",
    region: "Germany",
    size: "80 employees",
    logoLetters: "GL",
    cover: img("1500937386664-56d1dfef3854"),
    metrics: [
      { label: "Growers onboarded", value: "62" },
      { label: "Traceability latency", value: "< 2 min" },
      { label: "Complaint rate", value: "-41%" },
    ],
    quote: { text: "Every crate is now traceable to a specific tray.", author: "Lena Roth", role: "Head of Ops, Greenline" },
    story: [
      { heading: "The context", body: "Sixty growers, sixty ways of doing things." },
      { heading: "The change", body: "One onboarding flow, one order form, one report." },
      { heading: "The result", body: "The retail buyer stopped calling with questions." },
    ],
  },
];

/* -------------------------- HELP CENTER -------------------------- */
export type HelpArticle = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  updated: string;
  body: { heading?: string; paragraph: string }[];
};

export const HELP_CATEGORIES = [
  { slug: "getting-started", name: "Getting started", description: "Set up your workspace and invite your team.", icon: "🚀" },
  { slug: "production", name: "Production planning", description: "Cycles, batches, transplants and harvests.", icon: "🌱" },
  { slug: "orders", name: "Orders & customers", description: "Manage wholesale, direct and retail orders.", icon: "📦" },
  { slug: "inventory", name: "Inventory", description: "Track stock, waste and movements.", icon: "🧺" },
  { slug: "billing", name: "Billing & plans", description: "Subscriptions, invoices and seats.", icon: "💳" },
  { slug: "integrations", name: "Integrations", description: "Connect FIRMA to your other tools.", icon: "🔌" },
];

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "creating-your-first-production-plan",
    title: "Creating your first production plan",
    summary: "Set up a weekly plan in under 10 minutes.",
    category: "production",
    updated: "2026-07-20",
    body: [
      { heading: "Open the planner", paragraph: "From the sidebar, choose Production → Plans and click New plan." },
      { heading: "Pick a template", paragraph: "Start from an existing template to save time. You can edit every field afterwards." },
      { heading: "Publish", paragraph: "Publishing locks the plan and notifies the team." },
    ],
  },
  {
    slug: "inviting-your-team",
    title: "Inviting your team",
    summary: "Add teammates with the right role.",
    category: "getting-started",
    updated: "2026-07-18",
    body: [
      { paragraph: "Go to Settings → Team and click Invite." },
      { heading: "Roles", paragraph: "Owner, Admin, Operator and Viewer. Assign the lowest role that lets someone do their job." },
    ],
  },
  {
    slug: "receiving-and-fulfilling-a-wholesale-order",
    title: "Receiving and fulfilling a wholesale order",
    summary: "From incoming order to signed delivery note.",
    category: "orders",
    updated: "2026-07-15",
    body: [
      { paragraph: "Wholesale orders show up in the Orders inbox with a Pending status." },
      { heading: "Fulfilment", paragraph: "Assign a picker, print the pick list, and mark the order as Ready to ship." },
    ],
  },
  {
    slug: "counting-inventory-weekly",
    title: "Counting inventory weekly",
    summary: "A repeatable process for accurate stock.",
    category: "inventory",
    updated: "2026-07-10",
    body: [
      { paragraph: "Use the Cycle count screen every Friday afternoon." },
      { heading: "Reconciliation", paragraph: "Investigate any variance above 3%." },
    ],
  },
  {
    slug: "updating-billing-details",
    title: "Updating billing details",
    summary: "Change your payment method or billing address.",
    category: "billing",
    updated: "2026-07-08",
    body: [{ paragraph: "Settings → Billing → Payment method. Changes take effect on the next invoice." }],
  },
  {
    slug: "connecting-firma-to-quickbooks",
    title: "Connecting FIRMA to QuickBooks",
    summary: "Sync invoices and customers automatically.",
    category: "integrations",
    updated: "2026-07-02",
    body: [{ paragraph: "Settings → Integrations → QuickBooks. Authorize the connection and pick a sync direction." }],
  },
  {
    slug: "understanding-batches-vs-cycles",
    title: "Understanding batches vs cycles",
    summary: "Two concepts that trip up new operators.",
    category: "production",
    updated: "2026-06-28",
    body: [{ paragraph: "A batch is what you sell. A cycle is how you produce it. One cycle can generate many batches." }],
  },
  {
    slug: "adding-a-new-customer",
    title: "Adding a new customer",
    summary: "Set up billing terms and delivery preferences.",
    category: "orders",
    updated: "2026-06-24",
    body: [{ paragraph: "Customers → New. Payment terms default to Net 14, override per customer as needed." }],
  },
];

/* -------------------------- CHANGELOG -------------------------- */
export type Release = {
  slug: string;
  version: string;
  title: string;
  publishedAt: string;
  category: "New" | "Improved" | "Fixed";
  summary: string;
  highlights: { title: string; body: string }[];
};

export const RELEASES: Release[] = [
  {
    slug: "2026-07-25-plan-of-record",
    version: "v3.14",
    title: "Plan of record and shared weekly view",
    publishedAt: "2026-07-25",
    category: "New",
    summary: "A single source of truth for the current week, visible to the whole team.",
    highlights: [
      { title: "Plan of record", body: "Publish a plan once and lock it. Changes require an explicit revision." },
      { title: "Shared weekly view", body: "The Monday screen for every team on your floor." },
      { title: "Slack notifications", body: "Publish, revise, and completion events flow into any channel." },
    ],
  },
  {
    slug: "2026-07-11-margin-per-sku",
    version: "v3.13",
    title: "Live margin per SKU",
    publishedAt: "2026-07-11",
    category: "New",
    summary: "Contribution margin computed continuously from cost and revenue events.",
    highlights: [
      { title: "Live margin", body: "No more monthly close to see per-SKU margin." },
      { title: "Cost sources", body: "Labour, energy, and consumables allocated per batch." },
    ],
  },
  {
    slug: "2026-06-27-inventory-2",
    version: "v3.12",
    title: "Inventory 2.0",
    publishedAt: "2026-06-27",
    category: "Improved",
    summary: "A rebuilt inventory experience with faster counts and better reconciliation.",
    highlights: [
      { title: "Faster counts", body: "Keyboard-first count screen." },
      { title: "Variance panel", body: "See and explain variance in the same view." },
    ],
  },
  {
    slug: "2026-06-13-order-inbox-fixes",
    version: "v3.11.4",
    title: "Order inbox reliability",
    publishedAt: "2026-06-13",
    category: "Fixed",
    summary: "Bug fixes and stability improvements for the Orders inbox.",
    highlights: [
      { title: "Duplicate lines", body: "Fixed a rare case where a line item could appear twice." },
      { title: "Sort persistence", body: "Sort order now persists across sessions." },
    ],
  },
  {
    slug: "2026-05-30-quickbooks-connector",
    version: "v3.11",
    title: "QuickBooks connector",
    publishedAt: "2026-05-30",
    category: "New",
    summary: "Sync invoices and customers with QuickBooks Online.",
    highlights: [
      { title: "Two-way sync", body: "Customers and invoices flow in both directions." },
      { title: "Field mapping", body: "Configure how FIRMA fields map to QuickBooks fields." },
    ],
  },
  {
    slug: "2026-05-16-mobile-picker",
    version: "v3.10",
    title: "Mobile picker",
    publishedAt: "2026-05-16",
    category: "New",
    summary: "A tablet-first interface for the pick and pack team.",
    highlights: [
      { title: "One screen per order", body: "Optimised for gloves and cold rooms." },
      { title: "Offline tolerant", body: "Sync when the tablet reconnects." },
    ],
  },
];

export const getArticle = (s: string) => ARTICLES.find(a => a.slug === s);
export const getResource = (s: string) => RESOURCES.find(a => a.slug === s);
export const getCourse = (s: string) => COURSES.find(a => a.slug === s);
export const getCaseStudy = (s: string) => CASE_STUDIES.find(a => a.slug === s);
export const getHelpArticle = (s: string) => HELP_ARTICLES.find(a => a.slug === s);
export const getRelease = (s: string) => RELEASES.find(a => a.slug === s);
