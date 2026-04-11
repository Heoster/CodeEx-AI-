import { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://soham-ai.vercel.app';
const NOW  = new Date().toISOString();

type Freq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

function url(
  path: string,
  priority: number,
  changeFrequency: Freq = 'weekly',
  lastModified = NOW,
): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, lastModified, changeFrequency, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Core app ────────────────────────────────────────────────────────────
    url('/',              1.0,  'weekly'),
    url('/chat',          0.95, 'daily'),
    url('/ai-services',   0.92, 'weekly'),
    url('/visual-math',   0.90, 'weekly'),
    url('/pdf-analyzer',  0.90, 'weekly'),

    // ── Marketing / info ────────────────────────────────────────────────────
    url('/features',      0.88, 'weekly'),
    url('/about',         0.80, 'monthly'),
    url('/soham',         0.80, 'monthly'),
    url('/models',        0.85, 'weekly'),
    url('/pricing',       0.75, 'monthly'),
    url('/blog',          0.70, 'weekly'),

    // ── Support / legal ─────────────────────────────────────────────────────
    url('/contact',       0.65, 'monthly'),
    url('/support',       0.65, 'weekly'),
    url('/privacy',       0.50, 'monthly'),
    url('/terms',         0.50, 'monthly'),

    // ── Documentation index ─────────────────────────────────────────────────
    url('/documentation', 0.90, 'weekly'),

    // ── Getting Started ─────────────────────────────────────────────────────
    url('/documentation/quick-start',   0.85, 'weekly'),
    url('/documentation/installation',  0.85, 'weekly'),
    url('/documentation/pwa',           0.85, 'weekly'),   // ← new

    // ── Features ────────────────────────────────────────────────────────────
    url('/documentation/chat',              0.80, 'weekly'),
    url('/documentation/ai-models',         0.80, 'weekly'),
    url('/documentation/commands',          0.78, 'weekly'),
    url('/documentation/image-generation',  0.78, 'weekly'),
    url('/documentation/math-solver',       0.75, 'weekly'),
    url('/documentation/pdf-analysis',      0.75, 'weekly'),
    url('/documentation/web-search',        0.75, 'weekly'),
    url('/documentation/smart-routing',     0.75, 'weekly'),
    url('/documentation/jarvis-mode',       0.72, 'weekly'),
    url('/documentation/smart-notes',       0.70, 'weekly'),
    url('/documentation/code-analysis',     0.70, 'weekly'),

    // ── Configuration ───────────────────────────────────────────────────────
    url('/documentation/settings',          0.72, 'weekly'),
    url('/documentation/personalization',   0.70, 'weekly'),
    url('/documentation/security',          0.68, 'monthly'),

    // ── Reference ───────────────────────────────────────────────────────────
    url('/documentation/api-reference',     0.75, 'weekly'),
    url('/documentation/api',               0.70, 'weekly'),
    url('/documentation/faq',               0.72, 'weekly'),
  ];
}
