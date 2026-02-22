/**
 * Page-Specific SEO Component
 * Provides dynamic SEO optimization for individual pages
 */

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageSEO } from '@/lib/seo-config';
import { trackPageView } from '@/lib/analytics';

interface PageSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noindex?: boolean;
  canonical?: string;
}

export function PageSEO({
  title,
  description,
  keywords = [],
  image,
  noindex = false,
  canonical
}: PageSEOProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Update document title dynamically
    if (title) {
      document.title = `${title} | CODEEX AI`;
    }

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    // Update keywords
    if (keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }

    // Update Open Graph tags
    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', title);
    }

    if (description) {
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', description);
    }

    if (image) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', image);
    }

    // Update canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

    // Update robots meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', noindex ? 'noindex,nofollow' : 'index,follow');

    // Track page view for analytics
    if (pathname) {
      trackPageView(pathname, title);
    }
  }, [title, description, keywords, image, noindex, canonical, pathname]);

  return null; // This component doesn't render anything
}

// Hook for getting page-specific SEO data
export function usePageSEO(page: keyof typeof pageSEO) {
  const seoData = pageSEO[page];
  
  return {
    title: seoData?.title,
    description: seoData?.description,
    keywords: seoData?.keywords || [],
  };
}

// Component for automatic SEO based on route
export function AutoPageSEO() {
  const pathname = usePathname();
  
  // Map pathname to SEO config
  const getPageSEO = (path: string | null) => {
    if (!path) return null;
    if (path === '/') return pageSEO.home;
    if (path === '/chat') return pageSEO.chat;
    if (path === '/features') return pageSEO.features;
    if (path === '/docs') return pageSEO.documentation;
    if (path === '/contact') return pageSEO.contact;
    if (path === '/privacy') return pageSEO.privacy;
    return null;
  };

  const seoData = getPageSEO(pathname);

  if (!seoData) return null;

  return (
    <PageSEO
      title={seoData?.title ? String(seoData.title) : undefined}
      description={seoData?.description ? String(seoData.description) : undefined}
      keywords={Array.isArray(seoData?.keywords) ? seoData.keywords : undefined}
    />
  );
}