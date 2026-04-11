import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { pageSEO } from '@/lib/seo-config';
import {
  ArrowRight,
  Award,
  Briefcase,
  Code2,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { DEVELOPER_INFO } from '@/lib/developer-info';

export const metadata: Metadata = {
  title: pageSEO.about.title,
  description: pageSEO.about.description,
  keywords: pageSEO.about.keywords,
  alternates: { canonical: 'https://soham-ai.vercel.app/about' },
  openGraph: {
    title: pageSEO.about.title,
    description: pageSEO.about.description,
    url: 'https://soham-ai.vercel.app/about',
    type: 'profile',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/harsh.png', width: 1200, height: 630, alt: 'Heoster, founder of CODEEX-AI and creator of SOHAM' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageSEO.about.title,
    description: pageSEO.about.description,
    images: ['https://soham-ai.vercel.app/harsh.png'],
  },
};

const companyFacts = [
  { label: 'Company', value: DEVELOPER_INFO.company.name },
  { label: 'Role', value: DEVELOPER_INFO.company.role },
  { label: 'Founded', value: DEVELOPER_INFO.company.founded },
  { label: 'Location', value: `${DEVELOPER_INFO.location.city}, ${DEVELOPER_INFO.location.state}` },
];

const profileStats = [
  { label: 'Age', value: String(DEVELOPER_INFO.age) },
  { label: 'Models Integrated', value: `${DEVELOPER_INFO.projectStats.modelsIntegrated}+` },
  { label: 'Lines of Code', value: DEVELOPER_INFO.projectStats.linesOfCode },
  { label: 'Daily Users', value: DEVELOPER_INFO.projectStats.dailyUsers },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader backLink="/" backText="Back to Home" title="About Heoster" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Person',
                name: DEVELOPER_INFO.name,
                alternateName: DEVELOPER_INFO.realName,
                jobTitle: DEVELOPER_INFO.company.role,
                worksFor: {
                  '@type': 'Organization',
                  name: DEVELOPER_INFO.company.name,
                },
                alumniOf: {
                  '@type': 'EducationalOrganization',
                  name: DEVELOPER_INFO.education.school,
                },
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: DEVELOPER_INFO.location.city,
                  addressRegion: DEVELOPER_INFO.location.state,
                  addressCountry: DEVELOPER_INFO.location.country,
                },
                email: DEVELOPER_INFO.contact.email,
                url: 'https://soham-ai.vercel.app/about',
                image: 'https://soham-ai.vercel.app/harsh.png',
                description: `${DEVELOPER_INFO.name} is the founder of CODEEX-AI and creator of SOHAM.`,
                sameAs: [
                  DEVELOPER_INFO.contact.github,
                  DEVELOPER_INFO.contact.linkedin,
                  DEVELOPER_INFO.contact.twitter,
                ],
              },
              {
                '@type': 'Organization',
                name: DEVELOPER_INFO.company.name,
                founder: {
                  '@type': 'Person',
                  name: DEVELOPER_INFO.name,
                },
                url: 'https://soham-ai.vercel.app',
                logo: 'https://soham-ai.vercel.app/FINALSOHAM.png',
                description: 'CODEEX-AI is the company behind SOHAM, a multi-model AI product for chat, PDF analysis, and image math solving.',
              },
            ],
          }),
        }}
      />

      <main className="container mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="relative overflow-hidden rounded-[2rem] border bg-card p-6 shadow-sm md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.14),transparent_34%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                Founder story and company profile
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                  I am HEOSTER.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                  <strong className="text-foreground">{DEVELOPER_INFO.name}</strong> (also known as {DEVELOPER_INFO.realName}) is a {DEVELOPER_INFO.age}-year-old founder from{' '}
                  {DEVELOPER_INFO.location.city}, India. He founded <strong className="text-foreground">CODEEX-AI</strong>{' '}
                  and created <strong className="text-foreground">SOHAM</strong> to make advanced AI tools accessible,
                  practical, and free for everyone.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/soham">
                    Explore SOHAM
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/chat">Open Chat</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border bg-background/80 p-6 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-3xl border">
                  <Image
                    src="/harsh.png"
                    alt="Heoster, founder of CODEEX-AI"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-semibold">{DEVELOPER_INFO.name}</p>
                  <p className="text-sm text-muted-foreground">{DEVELOPER_INFO.realName}</p>
                  <p className="text-sm font-medium text-primary">{DEVELOPER_INFO.company.role}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {profileStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border bg-card px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6 rounded-[2rem] border bg-card p-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Briefcase className="h-5 w-5 text-primary" />
              CODEEX-AI
            </div>
            <div className="grid gap-3">
              {companyFacts.map((fact) => (
                <div key={fact.label} className="rounded-2xl border bg-background px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{fact.label}</p>
                  <p className="mt-1 font-medium">{fact.value}</p>
                </div>
              ))}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              CODEEX-AI is the parent company. SOHAM is the flagship product. The split matters for SEO, branding,
              and product architecture because the company identity and product identity serve different user intents.
            </p>
          </div>

          <div className="space-y-6 rounded-[2rem] border bg-card p-6">
            <h2 className="text-2xl font-semibold">Background</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border bg-background p-5">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Education
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {DEVELOPER_INFO.education.class} {DEVELOPER_INFO.education.stream} at {DEVELOPER_INFO.education.school}.
                </p>
              </div>
              <div className="rounded-2xl border bg-background p-5">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <MapPin className="h-4 w-4 text-primary" />
                  Location
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {DEVELOPER_INFO.location.city}, {DEVELOPER_INFO.location.state}, {DEVELOPER_INFO.location.country}.
                </p>
              </div>
              <div className="rounded-2xl border bg-background p-5">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Code2 className="h-4 w-4 text-primary" />
                  Build Focus
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Multi-model AI systems, routing, developer tooling, product UX, and mobile-first delivery.
                </p>
              </div>
              <div className="rounded-2xl border bg-background p-5">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Globe className="h-4 w-4 text-primary" />
                  Reach
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {DEVELOPER_INFO.projectStats.countriesReached} countries and {DEVELOPER_INFO.projectStats.dailyUsers} daily users.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border bg-card p-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Award className="h-5 w-5 text-primary" />
              Achievements
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              {DEVELOPER_INFO.achievements.slice(0, 6).map((achievement) => (
                <li key={achievement} className="rounded-2xl border bg-background px-4 py-3">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border bg-card p-6">
            <h2 className="text-xl font-semibold">Mission and next step</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              The company mission is clear: “{DEVELOPER_INFO.mission}” That mission shows up in SOHAM through free access,
              tool-driven workflows, and production-focused AI features instead of shallow demos.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              If you want the product story, open <Link href="/soham" className="font-medium text-foreground hover:underline">the SOHAM page</Link>.
              If you want to use it immediately, go to <Link href="/chat" className="font-medium text-foreground hover:underline">AI chat</Link>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`mailto:${DEVELOPER_INFO.contact.email}`}>
                <Button className="gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              </Link>
              <Link href={DEVELOPER_INFO.contact.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </Link>
              <Link href={DEVELOPER_INFO.contact.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Button>
              </Link>
              <Link href={DEVELOPER_INFO.contact.twitter} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Twitter className="h-4 w-4" />
                  X
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
