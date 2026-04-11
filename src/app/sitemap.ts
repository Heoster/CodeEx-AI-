import {MetadataRoute} from 'next';

const BASE = 'https://soham-ai.vercel.app';

// Dates — use real deploy/update dates so Google sees meaningful lastmod values
const D = {
  today:   new Date().toISOString(),
  week:    new Date(Date.now() - 7  * 86400_000).toISOString(),
  month:   new Date(Date.now() - 30 * 86400_000).toISOString(),
  quarter: new Date(Date.now() - 90 * 86400_000).toISOString(),
};

type Freq = MetadataRoute.Sitemap[number]['changeFrequency'];

function entry(
  path: string,
  priority: number,
  changeFrequency: Freq,
  lastModified: string,
): MetadataRoute.Sitemap[number] {
  return {url: `${BASE}${path}`, lastModified, changeFrequency, priority};
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Tier 1 — Core product pages (crawl daily) ──────────────────────────
    entry('/',             1.00, 'daily',   D.today),
    entry('/chat',         0.95, 'daily',   D.today),
    entry('/ai-services',  0.92, 'daily',   D.today),
    entry('/visual-math',  0.90, 'weekly',  D.week),
    entry('/pdf-analyzer', 0.90, 'weekly',  D.week),

    // ── Tier 2 — Marketing & discovery ────────────────────────────────────
    entry('/features',     0.88, 'weekly',  D.week),
    entry('/models',       0.85, 'weekly',  D.week),
    entry('/about',        0.80, 'monthly', D.month),
    entry('/soham',        0.80, 'monthly', D.month),
    entry('/pricing',      0.75, 'monthly', D.month),
    entry('/blog',         0.70, 'weekly',  D.week),

    // ── Tier 3 — Support & legal ───────────────────────────────────────────
    entry('/contact',      0.65, 'monthly', D.month),
    entry('/support',      0.65, 'monthly', D.month),
    entry('/privacy',      0.50, 'yearly',  D.quarter),
    entry('/terms',        0.50, 'yearly',  D.quarter),

    // ── Documentation — index ─────────────────────────────────────────────
    entry('/documentation',                    0.90, 'weekly', D.week),

    // ── Documentation — Getting Started ───────────────────────────────────
    entry('/documentation/quick-start',        0.85, 'weekly', D.week),
    entry('/documentation/installation',       0.85, 'weekly', D.week),
    entry('/documentation/pwa',                0.82, 'weekly', D.week),

    // ── Documentation — Features ──────────────────────────────────────────
    entry('/documentation/chat',               0.80, 'weekly', D.week),
    entry('/documentation/ai-models',          0.80, 'weekly', D.week),
    entry('/documentation/commands',           0.78, 'weekly', D.week),
    entry('/documentation/image-generation',   0.78, 'weekly', D.week),
    entry('/documentation/web-search',         0.76, 'weekly', D.week),
    entry('/documentation/math-solver',        0.75, 'weekly', D.week),
    entry('/documentation/pdf-analysis',       0.75, 'weekly', D.week),
    entry('/documentation/smart-routing',      0.73, 'weekly', D.week),
    entry('/documentation/jarvis-mode',        0.70, 'monthly', D.month),
    entry('/documentation/smart-notes',        0.70, 'monthly', D.month),
    entry('/documentation/code-analysis',      0.70, 'monthly', D.month),

    // ── Documentation — Configuration ─────────────────────────────────────
    entry('/documentation/settings',           0.72, 'weekly', D.week),
    entry('/documentation/personalization',    0.70, 'monthly', D.month),
    entry('/documentation/security',           0.68, 'monthly', D.month),

    // ── Documentation — Reference ─────────────────────────────────────────
    entry('/documentation/api-reference',      0.75, 'weekly', D.week),
    entry('/documentation/api',                0.72, 'weekly', D.week),
    entry('/documentation/faq',                0.75, 'weekly', D.week),
  ];
}
