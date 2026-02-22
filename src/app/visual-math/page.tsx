'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { ArrowLeft, Upload, Wand2, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BlockMath } from 'react-katex';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageHeader } from '@/components/page-header';
import { solveEquationFromImage } from '@/app/actions';

type SolutionState = {
  recognizedEquation: string;
  solutionSteps: string;
  isSolvable: boolean;
} | null;

export default function VisualMathPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [solution, setSolution] = useState<SolutionState>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setSolution(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!imagePreview) {
      setError('Please select an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSolution(null);

    const result = await solveEquationFromImage({ photoDataUri: imagePreview });
    if (!result) {
      setError('Failed to process the image. Please try again.');
    } else if ('error' in result) {
      setError(result.error);
    } else {
      setSolution(result);
    }
    setIsLoading(false);
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader 
        backLink="/chat" 
        backText="Back to Chat" 
        title="Visual Math Solver"
      />

      <main className="container mx-auto max-w-4xl px-4 py-6 md:py-8 lg:py-12 md:px-6">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon /> Upload Equation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="relative flex h-48 md:h-64 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted/50 transition-colors hover:border-primary hover:bg-muted"
                onClick={triggerFileSelect}
              >
                {imagePreview ? (
                  <Image src={imagePreview} alt="Equation preview" fill className="rounded-lg object-contain" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="mx-auto h-10 w-10 md:h-12 md:w-12" />
                    <p className="text-sm md:text-base">Click to upload an image</p>
                    <p className="text-xs">PNG, JPG, etc.</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button onClick={handleAnalyzeClick} disabled={isLoading || !imagePreview} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Analyzing...' : 'Solve with AI'}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>Solution</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[16rem] md:min-h-[20.5rem] space-y-4">
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
              {solution && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 font-semibold">Recognized Equation:</h3>
                    {solution.isSolvable ? (
                        /**
                         * The `BlockMath` component from `react-katex` is used to render mathematical equations.
                         * It takes a string of LaTeX as input and displays it as a formatted math block.
                         * This is used to show the user the equation that was recognized from the image.
                         */
                        <BlockMath math={solution.recognizedEquation} />
                    ) : (
                        <p className="text-muted-foreground">Could not recognize a valid equation.</p>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Step-by-step Solution:</h3>
                    <div className="overflow-x-auto p-2 rounded-md bg-muted">
                        {/**
                         * The `BlockMath` component from `react-katex` is used to render mathematical equations.
                         * It takes a string of LaTeX as input and displays it as a formatted math block.
                         * This is used to show the user the step-by-step solution to the equation.
                         */}
                        <BlockMath math={solution.solutionSteps} />
                    </div>
                  </div>
                </div>
              )}
              {!isLoading && !solution && !error && (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                  <p>Upload an image of an equation and click &quot;Solve with AI&quot; to see the solution here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
