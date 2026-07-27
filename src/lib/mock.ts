// Realistic mock data for FIRMA Studio (internal admin platform for firma.farm)

export type Status = "draft" | "in_review" | "approved" | "scheduled" | "published" | "archived";
export type Language = "en" | "fr" | "es" | "ar";

export const LANGS: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "fr", label: "Français", flag: "FR" },
  { code: "es", label: "Español", flag: "ES" },
  { code: "ar", label: "العربية", flag: "AR" },
];

export const AUTHORS = [
  { id: "a1", name: "Amina Fassi", role: "Head of Content", initials: "AF" },
  { id: "a2", name: "Julien Marchand", role: "Editor", initials: "JM" },
  { id: "a3", name: "Sofia Reyes", role: "Agronomy Writer", initials: "SR" },
  { id: "a4", name: "Karim Belkacem", role: "Product Marketing", initials: "KB" },
  { id: "a5", name: "Nora El Idrissi", role: "SEO Lead", initials: "NE" },
];

export const CATEGORIES = [
  "Indoor Farming",
  "Hydroponics",
  "Microgreens",
  "Vertical Farming",
  "Greenhouses",
  "Farm Management",
  "Food Safety",
  "Wholesale",
  "Product Updates",
];

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  language: Language;
  status: Status;
  seoScore: number;
  updatedAt: string;
  publishAt?: string;
  views?: number;
  cover: string;
};

const cover = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=400&q=60`;

export const ARTICLES: Article[] = [
  {
    id: "art_01",
    title: "The economics of running a microgreens operation at 40 m²",
    slug: "microgreens-economics-40sqm",
    excerpt:
      "A grounded look at revenue, run costs and turnover for small indoor microgreens farms.",
    author: "a3",
    category: "Microgreens",
    tags: ["unit-economics", "microgreens", "case-study"],
    language: "en",
    status: "published",
    seoScore: 86,
    updatedAt: "2026-07-22T09:14:00Z",
    publishAt: "2026-07-19T10:00:00Z",
    views: 4210,
    cover: cover("1585320806297-9794b3e4eeae"),
  },
  {
    id: "art_02",
    title: "NFT versus DWC: choosing a hydroponic system for leafy greens",
    slug: "nft-vs-dwc-leafy-greens",
    excerpt: "System selection, yield trade-offs and maintenance overhead compared side by side.",
    author: "a3",
    category: "Hydroponics",
    tags: ["nft", "dwc", "systems"],
    language: "en",
    status: "in_review",
    seoScore: 74,
    updatedAt: "2026-07-25T14:02:00Z",
    cover: cover("1592982537447-6d3f2a0a4e42"),
  },
  {
    id: "art_03",
    title: "Comment planifier vos rotations en agriculture urbaine",
    slug: "planifier-rotations-agriculture-urbaine",
    excerpt: "Un cadre pratique pour organiser la production sur 12 semaines.",
    author: "a2",
    category: "Farm Management",
    tags: ["planification", "rotation"],
    language: "fr",
    status: "scheduled",
    seoScore: 81,
    updatedAt: "2026-07-24T16:30:00Z",
    publishAt: "2026-07-30T08:00:00Z",
    cover: cover("1523348837708-15d4a09cfac2"),
  },
  {
    id: "art_04",
    title: "Food safety essentials for direct-to-restaurant sales",
    slug: "food-safety-restaurant-sales",
    excerpt: "The paperwork, testing cadence and cold chain you actually need in place.",
    author: "a1",
    category: "Food Safety",
    tags: ["haccp", "compliance"],
    language: "en",
    status: "draft",
    seoScore: 42,
    updatedAt: "2026-07-26T11:47:00Z",
    cover: cover("1518977676601-b53f82aba655"),
  },
  {
    id: "art_05",
    title: "Vertical farming energy costs: what the honest math looks like",
    slug: "vertical-farming-energy-costs",
    excerpt: "kWh, PPFD and yield per m² — the numbers behind sustainable vertical farms.",
    author: "a4",
    category: "Vertical Farming",
    tags: ["energy", "opex", "ppfd"],
    language: "en",
    status: "published",
    seoScore: 92,
    updatedAt: "2026-07-15T08:00:00Z",
    publishAt: "2026-07-10T09:00:00Z",
    views: 12840,
    cover: cover("1560493676-04071c5f467b"),
  },
  {
    id: "art_06",
    title: "Cómo estructurar un catálogo mayorista de hierbas frescas",
    slug: "catalogo-mayorista-hierbas",
    excerpt: "Guía práctica para vender a chefs y distribuidores.",
    author: "a2",
    category: "Wholesale",
    tags: ["ventas", "mayorista"],
    language: "es",
    status: "draft",
    seoScore: 55,
    updatedAt: "2026-07-23T13:20:00Z",
    cover: cover("1502741338009-cac2772e18bc"),
  },
  {
    id: "art_07",
    title: "Greenhouse climate control for shoulder-season production",
    slug: "greenhouse-shoulder-season",
    excerpt: "Managing humidity, VPD and ventilation as temperatures swing.",
    author: "a3",
    category: "Greenhouses",
    tags: ["vpd", "climate"],
    language: "en",
    status: "approved",
    seoScore: 78,
    updatedAt: "2026-07-25T09:00:00Z",
    cover: cover("1416879595882-3373a0480b5b"),
  },
  {
    id: "art_08",
    title: "Introducing FIRMA Planner 2.0",
    slug: "firma-planner-2-0",
    excerpt: "Weekly production planning, harvest windows and crop rotations in one board.",
    author: "a4",
    category: "Product Updates",
    tags: ["release", "planner"],
    language: "en",
    status: "published",
    seoScore: 88,
    updatedAt: "2026-07-05T09:00:00Z",
    publishAt: "2026-07-02T09:00:00Z",
    views: 8710,
    cover: cover("1521737604893-d14cc237f11d"),
  },
  {
    id: "art_09",
    title: "أساسيات الزراعة المائية للمزارع الصغيرة",
    slug: "hydroponics-basics-ar",
    excerpt: "دليل مبسّط لبدء مشروع زراعة مائية صغير.",
    author: "a1",
    category: "Hydroponics",
    tags: ["hydroponics", "starter"],
    language: "ar",
    status: "draft",
    seoScore: 38,
    updatedAt: "2026-07-20T10:00:00Z",
    cover: cover("1416879595882-3373a0480b5b"),
  },
  {
    id: "art_10",
    title: "Reducing shrink on leafy greens with better cold chain",
    slug: "reduce-shrink-cold-chain",
    excerpt: "Practical steps for holding 34–38°F from harvest to delivery.",
    author: "a3",
    category: "Farm Management",
    tags: ["shrink", "logistics"],
    language: "en",
    status: "archived",
    seoScore: 71,
    updatedAt: "2026-06-10T09:00:00Z",
    publishAt: "2026-06-01T09:00:00Z",
    views: 2140,
    cover: cover("1523348837708-15d4a09cfac2"),
  },
];

export type PageRow = {
  name: string;
  path: string;
  status: Status;
  language: Language;
  seo: "ok" | "warn" | "issue";
  lastUpdated: string;
  lastPublished?: string;
  author: string;
};

export const WEBSITE_PAGES: PageRow[] = [
  { name: "Homepage", path: "/", status: "published", language: "en", seo: "ok", lastUpdated: "2026-07-24", lastPublished: "2026-07-24", author: "a1" },
  { name: "Pricing", path: "/pricing", status: "published", language: "en", seo: "warn", lastUpdated: "2026-07-19", lastPublished: "2026-07-19", author: "a4" },
  { name: "Product", path: "/product", status: "published", language: "en", seo: "ok", lastUpdated: "2026-07-22", lastPublished: "2026-07-22", author: "a4" },
  { name: "Intelligence", path: "/intelligence", status: "published", language: "en", seo: "ok", lastUpdated: "2026-07-18", lastPublished: "2026-07-18", author: "a4" },
  { name: "Marketplace", path: "/marketplace", status: "draft", language: "en", seo: "issue", lastUpdated: "2026-07-26", author: "a4" },
  { name: "Founding Farms", path: "/founding-farms", status: "scheduled", language: "en", seo: "warn", lastUpdated: "2026-07-25", author: "a1" },
  { name: "About", path: "/about", status: "published", language: "en", seo: "ok", lastUpdated: "2026-06-12", lastPublished: "2026-06-12", author: "a1" },
  { name: "Contact", path: "/contact", status: "published", language: "en", seo: "ok", lastUpdated: "2026-05-30", lastPublished: "2026-05-30", author: "a1" },
  { name: "Careers", path: "/careers", status: "published", language: "en", seo: "warn", lastUpdated: "2026-07-10", lastPublished: "2026-07-10", author: "a2" },
  { name: "Privacy", path: "/privacy", status: "published", language: "en", seo: "ok", lastUpdated: "2026-04-01", lastPublished: "2026-04-01", author: "a1" },
  { name: "Terms", path: "/terms", status: "published", language: "en", seo: "ok", lastUpdated: "2026-04-01", lastPublished: "2026-04-01", author: "a1" },
  { name: "Cookies", path: "/cookies", status: "published", language: "en", seo: "ok", lastUpdated: "2026-04-01", lastPublished: "2026-04-01", author: "a1" },
];

export type LandingPage = {
  name: string;
  path: string;
  campaign: string;
  status: Status;
  language: Language;
  seo: "ok" | "warn" | "issue";
  conversion: number; // 0-100
  updatedAt: string;
};

export const LANDING_PAGES: LandingPage[] = [
  { name: "Microgreens Starter Kit", path: "/lp/microgreens-starter", campaign: "Q3 Microgreens", status: "published", language: "en", seo: "ok", conversion: 4.2, updatedAt: "2026-07-24" },
  { name: "FIRMA for Vertical Farms", path: "/lp/vertical", campaign: "Vertical 2026", status: "published", language: "en", seo: "warn", conversion: 2.9, updatedAt: "2026-07-20" },
  { name: "Book a Demo — Restaurants", path: "/lp/demo-restaurants", campaign: "Wholesale Push", status: "scheduled", language: "en", seo: "ok", conversion: 0, updatedAt: "2026-07-25" },
  { name: "Ramadan Sourcing", path: "/lp/ramadan", campaign: "MENA 2026", status: "draft", language: "ar", seo: "issue", conversion: 0, updatedAt: "2026-07-26" },
  { name: "Hydroponie — Guide gratuit", path: "/lp/hydroponie-guide", campaign: "FR Lead Magnet", status: "published", language: "fr", seo: "ok", conversion: 6.1, updatedAt: "2026-07-18" },
  { name: "Greenhouses — Winter Prep", path: "/lp/greenhouse-winter", campaign: "Winter Prep", status: "archived", language: "en", seo: "warn", conversion: 1.8, updatedAt: "2026-05-11" },
];

export type SeoIssue = {
  id: string;
  severity: "critical" | "warn" | "info";
  issue: string;
  page: string;
  type: string;
  detected: string;
  state: "open" | "fixed" | "ignored";
  action: string;
};

export const SEO_ISSUES: SeoIssue[] = [
  { id: "s1", severity: "critical", issue: "Missing meta description", page: "/marketplace", type: "Metadata", detected: "2026-07-25", state: "open", action: "Add meta description under 160 chars." },
  { id: "s2", severity: "critical", issue: "Broken outbound link", page: "/blog/vertical-farming-energy-costs", type: "Links", detected: "2026-07-24", state: "open", action: "Replace or remove the 404 link." },
  { id: "s3", severity: "warn", issue: "Missing alt text (3 images)", page: "/blog/microgreens-economics-40sqm", type: "Accessibility", detected: "2026-07-23", state: "open", action: "Provide descriptive alt text." },
  { id: "s4", severity: "warn", issue: "Duplicate H1", page: "/pricing", type: "Headings", detected: "2026-07-22", state: "open", action: "Ensure a single H1 per page." },
  { id: "s5", severity: "warn", issue: "Meta title over 60 chars", page: "/founding-farms", type: "Metadata", detected: "2026-07-25", state: "open", action: "Shorten the meta title." },
  { id: "s6", severity: "info", issue: "Canonical points to redirect", page: "/lp/vertical", type: "Canonical", detected: "2026-07-19", state: "open", action: "Update canonical to the final URL." },
  { id: "s7", severity: "info", issue: "Sitemap missing 2 published URLs", page: "/sitemap.xml", type: "Sitemap", detected: "2026-07-20", state: "open", action: "Regenerate sitemap." },
  { id: "s8", severity: "warn", issue: "FAQ schema not detected", page: "/product", type: "Schema", detected: "2026-07-14", state: "open", action: "Add FAQPage JSON-LD." },
  { id: "s9", severity: "critical", issue: "Page blocked by robots.txt", page: "/lp/demo-restaurants", type: "Robots", detected: "2026-07-25", state: "open", action: "Remove Disallow rule." },
  { id: "s10", severity: "info", issue: "Image over 500KB", page: "/blog/firma-planner-2-0", type: "Performance", detected: "2026-07-12", state: "fixed", action: "Compress hero image." },
];

export type Redirect = {
  id: string;
  source: string;
  destination: string;
  type: 301 | 302;
  active: boolean;
  createdAt: string;
  hits: number;
  notes?: string;
};

export const REDIRECTS: Redirect[] = [
  { id: "r1", source: "/old-blog/microgreens", destination: "/blog/microgreens-economics-40sqm", type: 301, active: true, createdAt: "2026-06-04", hits: 1240, notes: "Migration from old CMS" },
  { id: "r2", source: "/pricing-2024", destination: "/pricing", type: 301, active: true, createdAt: "2026-01-08", hits: 812, notes: "Legacy pricing URL" },
  { id: "r3", source: "/demo", destination: "/lp/demo-restaurants", type: 302, active: true, createdAt: "2026-07-01", hits: 96 },
  { id: "r4", source: "/hydroponie", destination: "/fr/hydroponie", type: 301, active: true, createdAt: "2026-05-22", hits: 231 },
  { id: "r5", source: "/team", destination: "/about", type: 301, active: false, createdAt: "2026-03-15", hits: 44, notes: "Disabled after About refresh" },
  { id: "r6", source: "/blog/energy", destination: "/blog/vertical-farming-energy-costs", type: 301, active: true, createdAt: "2026-07-06", hits: 512 },
];

export type MediaItem = {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  url: string;
  size: string;
  dimensions?: string;
  uploadedAt: string;
  uploader: string;
  folder: string;
};

export const MEDIA: MediaItem[] = [
  { id: "m1", name: "microgreens-hero.jpg", type: "image", url: cover("1585320806297-9794b3e4eeae"), size: "412 KB", dimensions: "2400×1600", uploadedAt: "2026-07-24", uploader: "a1", folder: "Blog" },
  { id: "m2", name: "vertical-farm-lights.jpg", type: "image", url: cover("1560493676-04071c5f467b"), size: "628 KB", dimensions: "2000×1333", uploadedAt: "2026-07-15", uploader: "a3", folder: "Blog" },
  { id: "m3", name: "greenhouse-morning.jpg", type: "image", url: cover("1416879595882-3373a0480b5b"), size: "391 KB", dimensions: "2400×1600", uploadedAt: "2026-07-11", uploader: "a3", folder: "Landing" },
  { id: "m4", name: "planner-2-cover.jpg", type: "image", url: cover("1521737604893-d14cc237f11d"), size: "245 KB", dimensions: "1920×1080", uploadedAt: "2026-07-02", uploader: "a4", folder: "Product" },
  { id: "m5", name: "harvest-tray.jpg", type: "image", url: cover("1523348837708-15d4a09cfac2"), size: "512 KB", dimensions: "2000×1333", uploadedAt: "2026-07-08", uploader: "a2", folder: "Blog" },
  { id: "m6", name: "nft-system.jpg", type: "image", url: cover("1592982537447-6d3f2a0a4e42"), size: "302 KB", dimensions: "1600×1067", uploadedAt: "2026-07-22", uploader: "a3", folder: "Blog" },
  { id: "m7", name: "farmers-market.jpg", type: "image", url: cover("1502741338009-cac2772e18bc"), size: "489 KB", dimensions: "2400×1600", uploadedAt: "2026-07-19", uploader: "a2", folder: "Landing" },
  { id: "m8", name: "seedlings-tray.jpg", type: "image", url: cover("1518977676601-b53f82aba655"), size: "356 KB", dimensions: "2000×1333", uploadedAt: "2026-07-06", uploader: "a1", folder: "Resources" },
];

export const CHANGELOG = [
  { version: "2.4.0", date: "2026-07-24", title: "Weekly Planner v2 and harvest windows", tag: "Feature", body: "Rebuilt the weekly planner around harvest windows with clearer crop rotations and a redesigned calendar." },
  { version: "2.3.2", date: "2026-07-11", title: "Order splitting for wholesale routes", tag: "Improvement", body: "Split large orders across delivery routes with per-stop packing lists." },
  { version: "2.3.1", date: "2026-07-02", title: "Faster inventory search", tag: "Improvement", body: "Inventory search results now stream in under 120ms on average." },
  { version: "2.3.0", date: "2026-06-18", title: "Intelligence briefings", tag: "Feature", body: "Weekly AI briefings summarising sales, waste and production KPIs." },
  { version: "2.2.4", date: "2026-05-30", title: "Bug fixes and stability", tag: "Fix", body: "Resolved a race condition in order status updates." },
];

export const CLUSTERS = [
  { name: "Microgreens", pillar: "/blog/microgreens-economics-40sqm", supporting: 6, missing: 2, langs: 3 },
  { name: "Hydroponics", pillar: "/blog/nft-vs-dwc-leafy-greens", supporting: 8, missing: 3, langs: 2 },
  { name: "Vertical Farming", pillar: "/blog/vertical-farming-energy-costs", supporting: 5, missing: 4, langs: 2 },
  { name: "Farm Management", pillar: "/resources/farm-management-playbook", supporting: 11, missing: 1, langs: 4 },
  { name: "Food Safety", pillar: "/resources/food-safety-essentials", supporting: 4, missing: 5, langs: 1 },
];

export const TOP_QUERIES = [
  { q: "microgreens business plan", clicks: 1820, impressions: 21400, ctr: 8.5, position: 3.2 },
  { q: "vertical farming energy cost", clicks: 1104, impressions: 15200, ctr: 7.3, position: 4.1 },
  { q: "hydroponic nft vs dwc", clicks: 892, impressions: 11800, ctr: 7.6, position: 4.6 },
  { q: "farm management software", clicks: 812, impressions: 24600, ctr: 3.3, position: 6.2 },
  { q: "how to grow microgreens indoor", clicks: 654, impressions: 9800, ctr: 6.7, position: 5.1 },
  { q: "greenhouse vpd chart", clicks: 512, impressions: 6300, ctr: 8.1, position: 3.9 },
];

export const TOP_PAGES = [
  { path: "/blog/vertical-farming-energy-costs", views: 12840, avgTime: "4:20", bounce: 38 },
  { path: "/blog/firma-planner-2-0", views: 8710, avgTime: "3:12", bounce: 44 },
  { path: "/blog/microgreens-economics-40sqm", views: 4210, avgTime: "5:02", bounce: 32 },
  { path: "/pricing", views: 3920, avgTime: "2:14", bounce: 51 },
  { path: "/product", views: 3184, avgTime: "3:48", bounce: 40 },
];

export const ACTIVITY = [
  { who: "a1", what: "published", target: "The economics of running a microgreens operation", when: "2h ago" },
  { who: "a3", what: "commented on", target: "NFT versus DWC: choosing a hydroponic system", when: "3h ago" },
  { who: "a2", what: "scheduled", target: "Comment planifier vos rotations en agriculture urbaine", when: "5h ago" },
  { who: "a4", what: "updated SEO on", target: "/pricing", when: "yesterday" },
  { who: "a5", what: "created redirect", target: "/blog/energy → /blog/vertical-farming-energy-costs", when: "2 days ago" },
  { who: "a1", what: "uploaded 12 assets to", target: "Media / Blog", when: "3 days ago" },
];

export function authorById(id: string) {
  return AUTHORS.find((a) => a.id === id) ?? AUTHORS[0];
}

export function statusLabel(s: Status): string {
  switch (s) {
    case "in_review": return "In Review";
    case "draft": return "Draft";
    case "approved": return "Approved";
    case "scheduled": return "Scheduled";
    case "published": return "Published";
    case "archived": return "Archived";
  }
}
