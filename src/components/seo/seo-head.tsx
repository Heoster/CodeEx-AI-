/**
 * Advanced SEO Head Component
 * Generates comprehensive meta tags for search engines and social media
 */

import Head from 'next/head';
import { type SEOConfig, defaultSEO } from '@/lib/seo-config';

interface SEOHeadProps extends Partial<SEOConfig> {
  templateTitle?: string;
  isBlogPost?: boolean;
  image?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function SEOHead({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  locale = 'en_US',
  alternateLocales = [],
  templateTitle,
  isBlogPost = false,
  image,
  noindex = false,
  nofollow = false
}: SEOHeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codeex-ai.netlify.app';
  
  // Merge with defaults
  const seoTitle = templateTitle 
    ? `${templateTitle} | ${typeof defaultSEO.title === 'string' ? defaultSEO.title : 'CodeEx AI'}`
    : title || (typeof defaultSEO.title === 'string' ? defaultSEO.title : 'CodeEx AI');
  
  const seoDescription = description || (typeof defaultSEO.description === 'string' ? defaultSEO.description : '');
  const defaultKeywords = Array.isArray(defaultSEO.keywords) ? defaultSEO.keywords : [];
  const seoKeywords = [...defaultKeywords, ...keywords];
  const seoImage = image || ogImage || '/ai-hero.png';
  const fullImageUrl = seoImage?.startsWith('http') 
    ? seoImage 
    : `${siteUrl}${seoImage}`;
  
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const authorName = author || 'CodeEx AI Team';

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{String(seoTitle)}</title>
      <meta name="description" content={String(seoDescription)} />
      <meta name="keywords" content={seoKeywords.join(', ')} />
      <meta name="author" content={authorName} />
      
      {/* Robots */}
      <meta 
        name="robots" 
        content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'},max-snippet:-1,max-image-preview:large,max-video-preview:-1`} 
      />
      <meta name="googlebot" content="index,follow" />
      <meta name="bingbot" content="index,follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content={locale.replace('_', '-')} />
      <meta name="language" content={locale.replace('_', '-')} />
      
      {/* Alternate Languages */}
      {alternateLocales.map(altLocale => (
        <link
          key={altLocale}
          rel="alternate"
          hrefLang={altLocale.replace('_', '-')}
          href={`${siteUrl}/${altLocale.split('_')[0]}`}
        />
      ))}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={String(seoTitle)} />
      <meta property="og:description" content={String(seoDescription)} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={String(seoTitle)} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="CODEEX AI" />
      <meta property="og:locale" content={locale} />
      
      {/* Article specific (for blog posts) */}
      {isBlogPost && (
        <>
          <meta property="article:author" content={authorName} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={String(seoTitle)} />
      <meta name="twitter:description" content={String(seoDescription)} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={String(seoTitle)} />
      <meta name="twitter:site" content="@codeexai" />
      <meta name="twitter:creator" content="@codeexai" />
      
      {/* Additional Meta Tags for AI/Tech */}
      <meta name="application-name" content="CODEEX AI" />
      <meta name="apple-mobile-web-app-title" content="CODEEX AI" />
      <meta name="theme-color" content="#020817" />
      <meta name="msapplication-TileColor" content="#020817" />
      
      {/* Schema.org for Google */}
      <meta itemProp="name" content={String(seoTitle)} />
      <meta itemProp="description" content={String(seoDescription)} />
      <meta itemProp="image" content={fullImageUrl} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Preconnect handled in layout to avoid duplicate font includes */}
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://api.groq.com" />
      <link rel="dns-prefetch" href="https://generativelanguage.googleapis.com" />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Additional Performance Hints */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </Head>
  );
}