import { createFileRoute } from "@tanstack/react-router";
import { ContentList, type ContentItem } from "@/components/studio/ContentList";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies · FIRMA Studio" },
      { name: "description", content: "Customer success stories and case studies." },
    ],
  }),
  component: () => (
    <ContentList
      eyebrow="Publishing · Case Studies"
      title="Case studies & success stories"
      description="Real farms using FIRMA — surfaced on firma.farm/case-studies."
      ctaLabel="New case study"
      items={ITEMS}
    />
  ),
});

const cover = (s: string) => `https://images.unsplash.com/photo-${s}?auto=format&fit=crop&w=800&q=60`;

const ITEMS: ContentItem[] = [
  { id: "cs1", title: "How Terra Verde grew wholesale revenue 3.2× with FIRMA", meta: "Barcelona · Vertical farm · 220 m²", chips: ["Wholesale", "3.2× revenue"], status: "published", language: "en", cover: cover("1560493676-04071c5f467b"), updated: "5 days ago" },
  { id: "cs2", title: "Fresh Loop: cutting shrink from 14% to 4%", meta: "Paris · Microgreens · 60 m²", chips: ["Shrink", "Cold chain"], status: "published", language: "en", cover: cover("1585320806297-9794b3e4eeae"), updated: "2 weeks ago" },
  { id: "cs3", title: "Comment La Serre 21 double sa capacité sans embaucher", meta: "Lyon · Serres · 800 m²", chips: ["Planning", "Automation"], status: "in_review", language: "fr", cover: cover("1416879595882-3373a0480b5b"), updated: "yesterday" },
  { id: "cs4", title: "Vertigrow: from 3 restaurants to 47 in 18 months", meta: "London · Vertical farm · 400 m²", chips: ["Sales", "Scale"], status: "draft", language: "en", cover: cover("1502741338009-cac2772e18bc"), updated: "3 days ago" },
  { id: "cs5", title: "Green Rooftop Co: profitable at 45 m²", meta: "Amsterdam · Rooftop · 45 m²", chips: ["Unit economics"], status: "scheduled", language: "en", cover: cover("1518977676601-b53f82aba655"), updated: "yesterday" },
  { id: "cs6", title: "Ferme Nourrir: HACCP without the paperwork nightmare", meta: "Montréal · Diversified · 320 m²", chips: ["Compliance"], status: "published", language: "fr", cover: cover("1523348837708-15d4a09cfac2"), updated: "1 month ago" },
];
