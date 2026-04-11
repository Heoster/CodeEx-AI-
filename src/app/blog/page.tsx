import type { Metadata } from 'next';
import { User, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';

export const metadata: Metadata = {
  title: 'Blog | SOHAM - AI Tips, Tutorials & Updates',
  description: 'Read SOHAM blog for AI tutorials, tips on using free AI models, prompt engineering guides, and updates from the CODEEX-AI team.',
  keywords: ['AI blog', 'free AI tutorial', 'prompt engineering', 'Groq Llama tutorial', 'AI for students', 'SOHAM blog', 'CODEEX-AI blog'],
  alternates: { canonical: 'https://soham-ai.vercel.app/blog' },
  openGraph: {
    title: 'Blog | SOHAM - AI Tips, Tutorials & Updates',
    description: 'Read SOHAM blog for AI tutorials, tips on using free AI models, and prompt engineering guides.',
    url: 'https://soham-ai.vercel.app/blog',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/Multi-Chat.png', width: 1200, height: 630, alt: 'SOHAM Blog' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | SOHAM - AI Tips, Tutorials & Updates',
    description: 'AI tutorials, free model guides, and prompt engineering tips from SOHAM.',
    images: ['https://soham-ai.vercel.app/Multi-Chat.png'],
  },
};

const blogPosts = [
  {
    slug: 'free-ai-chat-no-signup',
    title: 'How to Use Free AI Chat Without Signup in 2025',
    description: 'Most AI platforms require an account, credit card, or paid plan. SOHAM gives you access to 35+ models including Groq Llama 3.3 70B, Google Gemini 2.5, and Cerebras Qwen 3 235B — completely free, no signup needed. Here\'s how to get started in under 60 seconds.',
    author: 'Heoster',
    date: 'July 10, 2025',
    readTime: '4 min read',
    tags: ['Free AI', 'No Signup', 'Getting Started'],
    featured: true,
  },
  {
    slug: 'groq-llama-3-3-70b-free',
    title: 'Groq Llama 3.3 70B: The Fastest Free AI Model Available Right Now',
    description: 'Groq\'s inference engine runs Llama 3.3 70B at speeds that make other providers look slow. We benchmarked response times, tested coding tasks, math problems, and reasoning — here\'s everything you need to know about using it free on SOHAM.',
    author: 'Heoster',
    date: 'July 5, 2025',
    readTime: '6 min read',
    tags: ['Groq', 'Llama 3.3', 'AI Models'],
    featured: false,
  },
  {
    slug: 'ai-math-solver-from-image',
    title: 'Solve Math Problems from Photos: SOHAM\'s Image Math Solver Explained',
    description: 'Take a photo of any handwritten equation, upload it to SOHAM, and get a step-by-step solution in seconds. This guide covers how the image math solver works, what types of problems it handles, and tips for getting the best results.',
    author: 'Heoster',
    date: 'June 28, 2025',
    readTime: '5 min read',
    tags: ['Math Solver', 'Image AI', 'Students'],
    featured: false,
  },
  {
    slug: 'pdf-analyzer-ai-free',
    title: 'Analyze Any PDF with AI for Free — No Paid Tools Needed',
    description: 'Upload a PDF up to 5MB and ask SOHAM anything about it. Summarize research papers, extract key points from contracts, or quiz yourself on textbook chapters. This post walks through real examples and shows what the AI can and can\'t do.',
    author: 'Heoster',
    date: 'June 20, 2025',
    readTime: '5 min read',
    tags: ['PDF Analysis', 'Free AI', 'Productivity'],
    featured: false,
  },
  {
    slug: 'prompt-engineering-beginners',
    title: 'Prompt Engineering for Beginners: Get Better AI Answers Every Time',
    description: 'The difference between a vague AI response and a precise, useful one is almost always the prompt. This beginner guide covers the core techniques — role prompting, chain-of-thought, few-shot examples — with real examples you can try on SOHAM right now.',
    author: 'Heoster',
    date: 'June 12, 2025',
    readTime: '7 min read',
    tags: ['Prompt Engineering', 'Tutorial', 'Beginners'],
    featured: false,
  },
  {
    slug: 'cerebras-qwen-3-235b-free',
    title: 'Qwen 3 235B on Cerebras: The Largest Free AI Model You Can Use Today',
    description: 'Cerebras runs Qwen 3 235B Instruct — one of the largest open models available — at ultra-fast speeds. We tested it on coding, reasoning, and multilingual tasks. Here\'s how it compares to GPT-4 and Claude, and how to access it free on SOHAM.',
    author: 'Heoster',
    date: 'June 5, 2025',
    readTime: '6 min read',
    tags: ['Cerebras', 'Qwen 3', 'AI Models'],
    featured: false,
  },
];

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'SOHAM Blog',
  description: 'AI tutorials, free model guides, and product updates from SOHAM by CODEEX-AI',
  url: 'https://soham-ai.vercel.app/blog',
  publisher: {
    '@type': 'Organization',
    name: 'CODEEX-AI',
    logo: { '@type': 'ImageObject', url: 'https://soham-ai.vercel.app/FINALSOHAM.png' },
  },
  blogPost: blogPosts.map(post => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.date,
    url: `https://soham-ai.vercel.app/blog/${post.slug}`,
  })),
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <PageHeader backLink="/" backText="Back to Home" title="Blog" />

      <main className="container mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-10 space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Insights & Tutorials</h1>
          <p className="text-lg text-muted-foreground">
            AI guides, free model comparisons, and tips from the{' '}
            <Link href="/about" className="font-medium text-foreground hover:underline">SOHAM team</Link>.
          </p>
        </div>

        {/* Featured post */}
        <Card className="mb-10 border-primary/40 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="default">Featured</Badge>
              {featured.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">
              <Link href={`/blog/${featured.slug}`} className="hover:underline">{featured.title}</Link>
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">{featured.description}</p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><User size={14} />{featured.author}</span>
                <span className="flex items-center gap-1"><Calendar size={14} />{featured.date}</span>
                <span>{featured.readTime}</span>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/blog/${featured.slug}`}>Read Article <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Rest of posts */}
        <div className="grid gap-6 md:grid-cols-2">
          {rest.map((post) => (
            <Card key={post.slug} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="mb-2 flex flex-wrap gap-1">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <CardTitle className="text-lg leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">{post.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex items-center justify-between pt-0">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1"><User size={12} />{post.author}</div>
                  <div className="flex items-center gap-1"><Calendar size={12} />{post.date} · {post.readTime}</div>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/blog/${post.slug}`}>Read <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Internal links CTA */}
        <div className="mt-12 rounded-xl border bg-muted/40 p-6 text-center space-y-3">
          <p className="font-semibold text-lg">Ready to try it yourself?</p>
          <p className="text-muted-foreground text-sm">
            Explore <Link href="/models" className="font-medium text-foreground hover:underline">all 35+ AI models</Link>,
            try the <Link href="/visual-math" className="font-medium text-foreground hover:underline">image math solver</Link>,
            or <Link href="/chat" className="font-medium text-foreground hover:underline">start chatting for free</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
