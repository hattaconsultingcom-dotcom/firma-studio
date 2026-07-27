import { createFileRoute } from "@tanstack/react-router";
import { ContentList, type ContentItem } from "@/components/studio/ContentList";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources · FIRMA Studio" },
      { name: "description", content: "Guides, playbooks and whitepapers." },
    ],
  }),
  component: () => (
    <ContentList
      eyebrow="Publishing · Resources"
      title="Resources"
      description="Guides, playbooks and long-form pieces surfaced on firma.farm/resources."
      ctaLabel="New resource"
      items={ITEMS}
    />
  ),
});

const cover = (s: string) => `https://images.unsplash.com/photo-${s}?auto=format&fit=crop&w=800&q=60`;

const ITEMS: ContentItem[] = [
  { id: "r1", title: "The microgreens unit-economics playbook", meta: "Amina Fassi · 24 pages", chips: ["Playbook", "Microgreens"], status: "published", language: "en", cover: cover("1585320806297-9794b3e4eeae"), updated: "3 days ago" },
  { id: "r2", title: "Guide de démarrage — Hydroponie pour restaurateurs", meta: "Julien Marchand · 18 pages", chips: ["Guide"], status: "published", language: "fr", cover: cover("1592982537447-6d3f2a0a4e42"), updated: "1 week ago" },
  { id: "r3", title: "Food safety essentials for direct sales", meta: "Amina Fassi · Whitepaper", chips: ["Compliance"], status: "in_review", language: "en", cover: cover("1518977676601-b53f82aba655"), updated: "yesterday" },
  { id: "r4", title: "Vertical farming operations handbook", meta: "Karim Belkacem · Handbook", chips: ["Operations"], status: "draft", language: "en", cover: cover("1560493676-04071c5f467b"), updated: "2 days ago" },
  { id: "r5", title: "Wholesale pricing worksheet", meta: "Sofia Reyes · Spreadsheet + guide", chips: ["Wholesale", "Template"], status: "published", language: "en", cover: cover("1502741338009-cac2772e18bc"), updated: "2 weeks ago" },
  { id: "r6", title: "Greenhouse climate playbook", meta: "Sofia Reyes · 32 pages", chips: ["Greenhouses"], status: "scheduled", language: "en", cover: cover("1416879595882-3373a0480b5b"), updated: "yesterday" },
];
