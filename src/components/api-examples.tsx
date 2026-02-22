'use client';

/**
 * API Usage Examples Component
 * Demonstrates how to use all CODEEX AI API endpoints
 */

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function ApiExamples() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  // Summarize Example
  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Your long text here...',
          style: 'bullets'
        })
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Solve Example
  const handleSolve = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: 'Solve: 2x + 5 = 15',
          technicalLevel: 'beginner'
        })
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Search Example
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'What is the latest news about AI?'
        })
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Image Solver Example
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setResult('Error: File size exceeds 5MB limit');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const response = await fetch('/api/ai/image-solver', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageDataUri: event.target?.result,
            problemType: 'math'
          })
        });
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } catch (error) {
        setResult(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // PDF Analyzer Example
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setResult('Error: File size exceeds 5MB limit');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const response = await fetch('/api/ai/pdf-analyzer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pdfDataUri: event.target?.result,
            question: 'What is the main topic of this document?'
          })
        });
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } catch (error) {
        setResult(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>API Examples</CardTitle>
          <CardDescription>Test all CODEEX AI API endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSummarize} disabled={loading}>
              Test Summarize
            </Button>
            <Button onClick={handleSolve} disabled={loading}>
              Test Solve
            </Button>
            <Button onClick={handleSearch} disabled={loading}>
              Test Search
            </Button>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
                className="max-w-xs"
              />
            </div>
            <div>
              <Input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                disabled={loading}
                className="max-w-xs"
              />
            </div>
          </div>

          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

          {result && (
            <Textarea
              value={result}
              readOnly
              className="min-h-[300px] font-mono text-xs"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
