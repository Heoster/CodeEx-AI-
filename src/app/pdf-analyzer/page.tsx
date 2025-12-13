'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { ArrowLeft, Upload, Wand2, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import { analyzeDocumentFromPdf } from '@/app/actions';
import { Label } from '@/components/ui/label';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PdfAnalyzerPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('Summarize this document in 5 key points.');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setAnalysis(null);
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
      setPdfFile(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file first.');
      return;
    }
    if (!question.trim()) {
      setError('Please enter a question about the document.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const reader = new FileReader();
    reader.readAsDataURL(pdfFile);
    reader.onload = async () => {
      const pdfDataUri = reader.result as string;
      const result = await analyzeDocumentFromPdf({ pdfDataUri, question });
      
      if (!result) {
        setError('Failed to analyze the PDF. Please try again.');
      } else if ('error' in result) {
        setError(result.error);
      } else {
        setAnalysis(result.answer);
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setError('Failed to read the PDF file.');
      setIsLoading(false);
    };
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader 
        backLink="/chat" 
        backText="Back to Chat" 
        title="PDF Document Analyzer"
      />

      <main className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload /> Upload & Ask
              </CardTitle>
              <CardDescription>Upload a PDF and ask a question about its content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted/50 p-4 text-center transition-colors hover:border-primary hover:bg-muted"
                onClick={triggerFileSelect}
              >
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                {pdfFile ? (
                    <p className="mt-2 font-medium">{pdfFile.name}</p>
                ) : (
                    <>
                        <p className="mt-2">Click to upload a PDF</p>
                        <p className="text-xs text-muted-foreground">Max 20MB</p>
                    </>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., Summarize this document..."
                    rows={3}
                />
              </div>

              <Button onClick={handleAnalyzeClick} disabled={isLoading || !pdfFile} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Analyzing...' : 'Analyze with AI'}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[26.5rem] space-y-4">
              {isLoading && (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {analysis && (
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 rounded-md bg-muted p-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {analysis}
                  </ReactMarkdown>
                </div>
              )}
              {!isLoading && !analysis && !error && (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                  <p>Upload a PDF and ask a question to see the analysis here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
