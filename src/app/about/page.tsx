import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { DEVELOPER_INFO } from '@/lib/developer-info';
import { Mail, Github, Linkedin, Twitter, MapPin, GraduationCap, Code2, Award, Users, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Heoster - 16-Year-Old Founder of CODEEX | Young Developer from India',
  description: `Meet Heoster (Harsh), 16-year-old founder and developer of CODEEX. Built a free AI platform with ${DEVELOPER_INFO.projectStats.modelsIntegrated}+ models from Khatauli, India. Class 11 student at Maples Academy. ${DEVELOPER_INFO.projectStats.linesOfCode} lines of code, ${DEVELOPER_INFO.projectStats.dailyUsers} daily users, ${DEVELOPER_INFO.projectStats.countriesReached} countries. Contact: codeex@email.com`,
  keywords: [
    'Heoster',
    'Heoster CODEEX',
    'Harsh developer',
    'Harsh Khatauli',
    '16 year old developer',
    'youngest AI founder',
    'Indian teen developer',
    'student developer India',
    'Khatauli developer',
    'Uttar Pradesh developer',
    'Maples Academy student',
    'Class 11 developer',
    'teenage AI entrepreneur',
    'young developer success story',
    'CODEEX founder',
    'AI platform founder India',
    'codeex@email.com',
    'Heoster GitHub',
    'Heoster LinkedIn',
  ],
  openGraph: {
    title: 'About Heoster - 16-Year-Old Founder of CODEEX',
    description: `Meet Heoster (Harsh), 16-year-old founder of CODEEX. Built free AI platform with ${DEVELOPER_INFO.projectStats.modelsIntegrated}+ models. From Khatauli, India. ${DEVELOPER_INFO.projectStats.linesOfCode} lines of code.`,
    type: 'profile',
    images: [
      {
        url: '/harsh.png',
        width: 400,
        height: 400,
        alt: 'Heoster - Founder of CODEEX',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'About Heoster - 16-Year-Old Founder of CODEEX',
    description: `16-year-old developer from India who built CODEEX - free AI platform with ${DEVELOPER_INFO.projectStats.modelsIntegrated}+ models`,
    images: ['/harsh.png'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader 
        backLink="/" 
        backText="Back to Home" 
        title="About Heoster"
      />
      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: DEVELOPER_INFO.name,
            alternateName: DEVELOPER_INFO.realName,
            givenName: DEVELOPER_INFO.realName,
            additionalName: DEVELOPER_INFO.alias,
            age: DEVELOPER_INFO.age,
            gender: 'Male',
            birthPlace: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: DEVELOPER_INFO.location.city,
                addressRegion: DEVELOPER_INFO.location.state,
                addressCountry: DEVELOPER_INFO.location.country,
              },
            },
            homeLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: DEVELOPER_INFO.location.city,
                addressRegion: DEVELOPER_INFO.location.state,
                addressCountry: DEVELOPER_INFO.location.country,
              },
            },
            jobTitle: DEVELOPER_INFO.company.role,
            worksFor: {
              '@type': 'Organization',
              name: 'CODEEX',
            },
            alumniOf: {
              '@type': 'EducationalOrganization',
              name: DEVELOPER_INFO.education.school,
            },
            email: DEVELOPER_INFO.contact.email,
            url: 'https://codeex-ai.netlify.app',
            image: '/harsh.png',
            description: `${DEVELOPER_INFO.name} is a ${DEVELOPER_INFO.age}-year-old developer and founder of CODEEX. Currently studying ${DEVELOPER_INFO.education.class} ${DEVELOPER_INFO.education.stream} at ${DEVELOPER_INFO.education.school}, he has built a free AI platform with ${DEVELOPER_INFO.projectStats.modelsIntegrated}+ models, reaching ${DEVELOPER_INFO.projectStats.countriesReached} countries with ${DEVELOPER_INFO.projectStats.dailyUsers} daily users.`,
            knowsAbout: DEVELOPER_INFO.skills.concat(DEVELOPER_INFO.aiTechnologies),
            knowsLanguage: ['English', 'Hindi'],
            sameAs: [
              DEVELOPER_INFO.contact.github,
              DEVELOPER_INFO.contact.linkedin,
              DEVELOPER_INFO.contact.twitter,
              `https://instagram.com/${DEVELOPER_INFO.social.instagram}`,
            ],
          }),
        }}
      />
      
      <main className="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-12">
          
          {/* Hero Section with Developer Photo */}
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-primary shadow-xl">
              <Image
                src="/harsh.png"
                width={160}
                height={160}
                alt="Heoster (Harsh) - Founder of CODEEX"
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {DEVELOPER_INFO.name}
              </h1>
              <p className="text-xl text-muted-foreground">
                {DEVELOPER_INFO.realName} • {DEVELOPER_INFO.alias}
              </p>
              <p className="text-lg font-semibold text-primary">
                {DEVELOPER_INFO.company.role} at {DEVELOPER_INFO.company.name}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border bg-card p-4 text-center">
              <div className="text-3xl font-bold text-primary">{DEVELOPER_INFO.age}</div>
              <div className="text-sm text-muted-foreground">Years Old</div>
            </div>
            <div className="rounded-lg border bg-card p-4 text-center">
              <div className="text-3xl font-bold text-primary">{DEVELOPER_INFO.projectStats.modelsIntegrated}+</div>
              <div className="text-sm text-muted-foreground">AI Models</div>
            </div>
            <div className="rounded-lg border bg-card p-4 text-center">
              <div className="text-3xl font-bold text-primary">{DEVELOPER_INFO.projectStats.dailyUsers}</div>
              <div className="text-sm text-muted-foreground">Daily Users</div>
            </div>
            <div className="rounded-lg border bg-card p-4 text-center">
              <div className="text-3xl font-bold text-primary">{DEVELOPER_INFO.projectStats.countriesReached}</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                Hi! I&apos;m <strong className="text-foreground">{DEVELOPER_INFO.name}</strong> (also known as <strong className="text-foreground">{DEVELOPER_INFO.realName}</strong>), 
                a {DEVELOPER_INFO.age}-year-old developer and founder of <strong className="text-foreground">CODEEX</strong> from {DEVELOPER_INFO.location.city}, {DEVELOPER_INFO.location.state}, India.
              </p>
              <p>
                I&apos;m currently studying <strong className="text-foreground">{DEVELOPER_INFO.education.class} {DEVELOPER_INFO.education.stream}</strong> at <strong className="text-foreground">{DEVELOPER_INFO.education.school}</strong>, 
                but my passion for technology and AI drives me to build products that make a difference.
              </p>
              <p>
                I founded <strong className="text-foreground">{DEVELOPER_INFO.company.name}</strong> in <strong className="text-foreground">{DEVELOPER_INFO.company.founded}</strong> with a simple mission: 
                <em className="text-foreground"> &quot;{DEVELOPER_INFO.mission}&quot;</em>
              </p>
            </div>
          </div>

          {/* Location & Education */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border bg-card p-6">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <MapPin className="h-5 w-5 text-primary" />
                Location
              </div>
              <div className="space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">{DEVELOPER_INFO.location.city}</strong>, {DEVELOPER_INFO.location.state}</p>
                <p>{DEVELOPER_INFO.location.country}</p>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border bg-card p-6">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <GraduationCap className="h-5 w-5 text-primary" />
                Education
              </div>
              <div className="space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">{DEVELOPER_INFO.education.class} {DEVELOPER_INFO.education.stream}</strong></p>
                <p>{DEVELOPER_INFO.education.school}</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Code2 className="h-6 w-6 text-primary" />
              Technical Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {DEVELOPER_INFO.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border bg-card px-4 py-2 text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* AI Technologies */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Globe className="h-6 w-6 text-primary" />
              AI Technologies
            </div>
            <div className="flex flex-wrap gap-2">
              {DEVELOPER_INFO.aiTechnologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Award className="h-6 w-6 text-primary" />
              Achievements
            </div>
            <ul className="space-y-3">
              {DEVELOPER_INFO.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-3 rounded-lg border bg-card p-4">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Stats */}
          <div className="space-y-4 rounded-lg border-2 border-primary bg-primary/5 p-6">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Users className="h-6 w-6 text-primary" />
              CODEEX Platform Stats
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Lines of Code</div>
                <div className="text-2xl font-bold text-primary">{DEVELOPER_INFO.projectStats.linesOfCode}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Components</div>
                <div className="text-2xl font-bold text-primary">{DEVELOPER_INFO.projectStats.components}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Uptime</div>
                <div className="text-2xl font-bold text-primary">{DEVELOPER_INFO.projectStats.uptime}</div>
              </div>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="space-y-6 rounded-lg border bg-card p-8">
            <div>
              <h3 className="mb-2 text-xl font-semibold">Vision</h3>
              <p className="text-lg italic text-muted-foreground">&quot;{DEVELOPER_INFO.vision}&quot;</p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">Mission</h3>
              <p className="text-lg italic text-muted-foreground">&quot;{DEVELOPER_INFO.mission}&quot;</p>
            </div>
          </div>

          {/* Friends & Testers */}
          <div className="space-y-6 rounded-lg border bg-card p-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold">Friends & Testers</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              A huge thanks to my amazing friends who help test CodeEx and provide valuable feedback from a non-technical user perspective. Their insights ensure the platform is accessible and user-friendly for everyone:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {['Vidhan', 'Avineet', 'Vansh', 'Aayush', 'Varun', 'Pankaj', 'Masum', 'Sachin', 'Pardhuman', 'Shivansh', 'Vaibhav', 'Kartik'].map((name) => (
                <div key={name} className="flex items-center gap-2 rounded-lg border bg-background/50 px-4 py-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">{name}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 italic">
              These friends represent real users without technical backgrounds, helping make CodeEx truly accessible to everyone.
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-6 rounded-lg border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Get in Touch</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Have questions, feedback, or want to collaborate? I&apos;d love to hear from you!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`mailto:${DEVELOPER_INFO.contact.email}`}>
                <Button variant="default" size="lg" className="gap-2">
                  <Mail className="h-5 w-5" />
                  Email Me
                </Button>
              </Link>
              
              <Link href={DEVELOPER_INFO.contact.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="gap-2">
                  <Github className="h-5 w-5" />
                  GitHub
                </Button>
              </Link>
              
              <Link href={DEVELOPER_INFO.contact.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="gap-2">
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </Button>
              </Link>
              
              <Link href={DEVELOPER_INFO.contact.twitter} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="gap-2">
                  <Twitter className="h-5 w-5" />
                  Twitter
                </Button>
              </Link>
            </div>

            <div className="pt-4 text-sm text-muted-foreground">
              <p>Email: <a href={`mailto:${DEVELOPER_INFO.contact.email}`} className="font-medium text-primary hover:underline">{DEVELOPER_INFO.contact.email}</a></p>
              <p className="mt-1">Instagram: <a href={`https://instagram.com/${DEVELOPER_INFO.social.instagram}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">@{DEVELOPER_INFO.social.instagram}</a></p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
