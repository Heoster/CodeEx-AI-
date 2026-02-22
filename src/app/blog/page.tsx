
import { ArrowLeft, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';

const blogPosts = [
  {
    title: 'The Future of Conversational AI: Trends to Watch',
    description: 'Generative AI is evolving at an unprecedented pace. In this post, we explore the key trends that will shape the future of conversational AI, from hyper-personalization to multi-modal interactions.',
    imageSrc: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWl8ZW58MHx8MHx8fDA%3D',
    imageHint: 'abstract AI',
    author: 'Jane Doe',
    date: 'July 5, 2025',
    tags: ['AI', 'Trends', 'Technology'],
  },
  {
    title: 'Building Scalable AI Applications with Next.js and Genkit',
    description: 'Discover how we leverage the power of Next.js for our frontend and Genkit for our backend to build a responsive, scalable, and intelligent application. A deep dive into our architecture.',
    imageSrc: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageHint: 'code on screen',
    author: 'John Smith',
    date: 'June 28, 2025',
    tags: ['Next.js', 'Genkit', 'Web Dev'],
  },
  {
    title: 'A Guide to Prompt Engineering for Better AI Responses',
    description: 'The quality of your AI\'s output is directly related to the quality of your input. Learn the art and science of prompt engineering to get more accurate and relevant responses from your AI assistant.',
    imageSrc: 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageHint: 'person coding',
    author: 'Alex Ray',
    date: 'June 15, 2025',
    tags: ['Prompt Engineering', 'Tutorial'],
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader 
        backLink="/" 
        backText="Back to Home" 
        title="From the Blog"
      />
      <main className="container mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Insights & Updates</h2>
            <p className="text-lg text-muted-foreground">
              Explore articles, tutorials, and news from the CODEEX AI team.
            </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-1">
          {blogPosts.map((post, index) => (
            <Card key={index} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg md:flex-row">
              <div className="relative h-48 w-full md:h-auto md:w-2/5">
                <Image
                  src={post.imageSrc}
                  alt={post.title}
                  fill
                  className="object-cover"
                  data-ai-hint={post.imageHint}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <CardTitle className="mb-2 text-xl font-bold">
                    <Link href="#" className="hover:underline">{post.title}</Link>
                  </CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </div>
                <CardFooter className="mt-4 flex items-center justify-between p-0">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <Button asChild variant="ghost">
                    <Link href="#">Read More &rarr;</Link>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
