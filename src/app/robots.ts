import {MetadataRoute} from 'next';

const BASE = 'https://soham-ai.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // All crawlers — allow everything except private/internal paths
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/account',
          '/account-settings',
          '/user-management',
          '/login',
          '/test-',
          '/debug',
        ],
      },
      {
        // Give Googlebot explicit permission on key pages
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/chat',
          '/ai-services',
          '/visual-math',
          '/pdf-analyzer',
          '/features',
          '/models',
          '/about',
          '/documentation',
          '/documentation/',
          '/pricing',
          '/blog',
          '/contact',
          '/support',
          '/privacy',
          '/terms',
        ],
        disallow: ['/api/', '/_next/', '/account', '/account-settings', '/login'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
