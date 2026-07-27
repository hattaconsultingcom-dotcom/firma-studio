// Realistic mock content for the public FIRMA Journal
export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: { name: string; role: string; initials: string };
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  cover: string;
  featured?: boolean;
};

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const TOPICS = [
  "All",
  "Indoor Farming",
  "Microgreens",
  "Hydroponics",
  "Vertical Farming",
  "Greenhouses",
  "Farm Operations",
  "Production Planning",
  "Business & Economics",
];

export const AUTHORS = {
  sofia: { name: "Sofia Reyes", role: "Agronomy Writer", initials: "SR" },
  amina: { name: "Amina Fassi", role: "Head of Content", initials: "AF" },
  julien: { name: "Julien Marchand", role: "Editor", initials: "JM" },
  karim: { name: "Karim Belkacem", role: "Product Marketing", initials: "KB" },
  nora: { name: "Nora El Idrissi", role: "SEO Lead", initials: "NE" },
};

export const POSTS: JournalPost[] = [
  {
    slug: "microgreens-operation-economics-40sqm",
    title: "The economics of running a microgreens operation at 40 m²",
    excerpt:
      "A practical breakdown of production capacity, recurring costs, labor, pricing and margins for a professional microgreens facility.",
    category: "Microgreens",
    author: AUTHORS.sofia,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-22",
    readingMinutes: 12,
    cover: img("1585320806297-9794b3e4eeae"),
    featured: true,
  },
  {
    slug: "vertical-farming-energy-costs-honest-math",
    title: "Vertical farming energy costs: what the honest math looks like",
    excerpt: "Real kWh, PPFD and yield per square metre — a grounded look behind the numbers.",
    category: "Vertical Farming",
    author: AUTHORS.karim,
    publishedAt: "2026-07-10",
    updatedAt: "2026-07-15",
    readingMinutes: 9,
    cover: img("1560493676-04071c5f467b"),
  },
  {
    slug: "nft-vs-dwc-hydroponic-system-leafy-greens",
    title: "NFT vs DWC: choosing a hydroponic system for leafy greens",
    excerpt: "System selection, yield trade-offs and maintenance overhead compared side by side.",
    category: "Hydroponics",
    author: AUTHORS.sofia,
    publishedAt: "2026-07-06",
    updatedAt: "2026-07-08",
    readingMinutes: 8,
    cover: img("1592982537447-6d3f2a0a4e42"),
  },
  {
    slug: "reliable-microgreens-production-schedule",
    title: "How to build a reliable microgreens production schedule",
    excerpt: "A repeatable weekly cadence for seeding, harvesting and delivery — without spreadsheets.",
    category: "Production Planning",
    author: AUTHORS.julien,
    publishedAt: "2026-07-02",
    updatedAt: "2026-07-03",
    readingMinutes: 7,
    cover: img("1523348837708-15d4a09cfac2"),
  },
  {
    slug: "wholesale-pricing-indoor-farms-framework",
    title: "Wholesale pricing for indoor farms: a practical framework",
    excerpt: "How to price for chefs and distributors without eroding your margins.",
    category: "Business & Economics",
    author: AUTHORS.karim,
    publishedAt: "2026-06-28",
    updatedAt: "2026-06-29",
    readingMinutes: 10,
    cover: img("1502741338009-cac2772e18bc"),
  },
  {
    slug: "hidden-cost-poor-inventory-planning",
    title: "The hidden cost of poor inventory planning",
    excerpt: "Why shrink, mis-picks and overproduction quietly consume 8–15% of farm revenue.",
    category: "Farm Operations",
    author: AUTHORS.amina,
    publishedAt: "2026-06-22",
    updatedAt: "2026-06-24",
    readingMinutes: 6,
    cover: img("1518977676601-b53f82aba655"),
  },
  {
    slug: "food-safety-direct-to-restaurant-sales",
    title: "Food safety essentials for direct-to-restaurant sales",
    excerpt: "The paperwork, testing cadence and cold chain you actually need in place.",
    category: "Farm Operations",
    author: AUTHORS.amina,
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-14",
    readingMinutes: 8,
    cover: img("1416879595882-3373a0480b5b"),
  },
  {
    slug: "crop-planning-without-spreadsheets",
    title: "Crop planning without spreadsheets",
    excerpt: "A calmer approach to planning weekly rotations, harvest windows and successions.",
    category: "Production Planning",
    author: AUTHORS.julien,
    publishedAt: "2026-06-08",
    updatedAt: "2026-06-08",
    readingMinutes: 7,
    cover: img("1521737604893-d14cc237f11d"),
  },
  {
    slug: "when-should-a-farm-add-another-grow-room",
    title: "When should a farm add another grow room?",
    excerpt: "A capacity and demand framework for deciding whether to expand or optimise first.",
    category: "Indoor Farming",
    author: AUTHORS.sofia,
    publishedAt: "2026-05-30",
    updatedAt: "2026-05-31",
    readingMinutes: 9,
    cover: img("1560493676-04071c5f467b"),
  },
];

export const CLUSTERS = [
  { slug: "microgreens", name: "Microgreens", description: "Trays, cycles, unit economics and quality control.", count: 14 },
  { slug: "hydroponics", name: "Hydroponics", description: "Nutrient management, systems and operational care.", count: 18 },
  { slug: "vertical-farming", name: "Vertical Farming", description: "Lighting, energy, yield per m² and capex.", count: 11 },
  { slug: "cea", name: "Controlled Environment Agriculture", description: "Climate, VPD and integrated environment control.", count: 9 },
  { slug: "operations", name: "Farm Operations", description: "People, workflow, food safety and delivery.", count: 22 },
  { slug: "business", name: "Farm Business", description: "Pricing, wholesale, DTC and financial planning.", count: 13 },
];

export const GUIDES = [
  { slug: "complete-guide-microgreens-farm", title: "The complete guide to starting a microgreens farm", minutes: 22 },
  { slug: "hydroponic-production-planning-fundamentals", title: "Hydroponic production planning fundamentals", minutes: 18 },
  { slug: "how-indoor-farms-manage-inventory", title: "How indoor farms manage inventory", minutes: 14 },
  { slug: "building-wholesale-customer-pipeline", title: "Building a wholesale customer pipeline", minutes: 16 },
  { slug: "choosing-farm-management-software", title: "Choosing farm management software", minutes: 12 },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function relatedPosts(slug: string, category: string, n = 3) {
  return POSTS.filter((p) => p.slug !== slug && p.category === category)
    .concat(POSTS.filter((p) => p.slug !== slug && p.category !== category))
    .slice(0, n);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
