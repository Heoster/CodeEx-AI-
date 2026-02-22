/**
 * Structured Data Component for Rich Snippets
 * Implements JSON-LD structured data for better search engine understanding
 */

import { structuredData } from '@/lib/seo-config';

interface StructuredDataProps {
  type: 'organization' | 'person' | 'softwareApplication' | 'website' | 'faq' | 'breadcrumb' | 'article';
  data?: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let jsonLd;

  switch (type) {
    case 'organization':
      jsonLd = structuredData.organization;
      break;
    case 'person':
      jsonLd = structuredData.person;
      break;
    case 'softwareApplication':
      jsonLd = structuredData.softwareApplication;
      break;
    case 'website':
      jsonLd = structuredData.website;
      break;
    case 'faq':
      jsonLd = structuredData.faq;
      break;
    case 'breadcrumb':
      jsonLd = data?.items ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      } : structuredData.breadcrumb;
      break;
    case 'article':
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data?.title,
        description: data?.description,
        image: data?.image,
        author: {
          '@type': 'Organization',
          name: data?.author || 'CODEEX AI Team'
        },
        publisher: {
          '@type': 'Organization',
          name: 'CODEEX AI',
          logo: {
            '@type': 'ImageObject',
            url: 'https://codeex-ai.netlify.app/images/logo.png'
          }
        },
        datePublished: data?.publishedTime,
        dateModified: data?.modifiedTime || data?.publishedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data?.url
        }
      };
      break;
    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Breadcrumb component for navigation
interface BreadcrumbProps {
  items: Array<{ name: string; url: string }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <>
      <StructuredData type="breadcrumb" data={{ items }} />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === items.length - 1 ? (
                <span className="font-medium text-foreground">{item.name}</span>
              ) : (
                <a
                  href={item.url}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// FAQ structured data component
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQItem[];
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}

// Product/Software structured data
interface SoftwareStructuredDataProps {
  name: string;
  description: string;
  version: string;
  price?: string;
  currency?: string;
  rating?: number;
  ratingCount?: number;
  features?: string[];
  screenshots?: string[];
}

export function SoftwareStructuredData({
  name,
  description,
  version,
  price = '0',
  currency = 'USD',
  rating = 4.8,
  ratingCount = 1250,
  features = [],
  screenshots = []
}: SoftwareStructuredDataProps) {
  const softwareData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    version,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web Browser, iOS, Android, Windows, macOS, Linux',
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      ratingCount: ratingCount.toString(),
      bestRating: '5',
      worstRating: '1'
    },
    featureList: features,
    screenshot: screenshots,
    author: {
      '@type': 'Organization',
      name: 'CODEEX AI Team'
    },
    datePublished: '2024-01-01',
    dateModified: '2026-12-23'
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareData) }}
    />
  );
}