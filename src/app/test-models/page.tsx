'use client';

/**
 * Test Models Page
 * A page to test and verify all models are working in the UI
 */

import { useState } from 'react';
import { ModelSelector } from '@/components/model-selector';
import { MobileModelSelector } from '@/components/mobile-model-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ModelId } from '@/lib/types';
import modelsConfigData from '@/lib/models-config.json';

export default function TestModelsPage() {
  const [selectedModel, setSelectedModel] = useState<'auto' | ModelId>('auto');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testModel = async () => {
    if (!selectedModel || selectedModel === 'auto') {
      setTestResult('Please select a specific model to test');
      return;
    }

    setIsLoading(true);
    setTestResult('Testing...');

    try {
      const response = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: `Hello! This is a test of the ${selectedModel} model. Please respond with "Model ${selectedModel} is working perfectly!" to confirm.`,
          preferredModel: selectedModel,
          tone: 'helpful',
          technicalLevel: 'intermediate'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        setTestResult(`❌ Error: ${data.error}`);
      } else if (data.solution) {
        setTestResult(`✅ Success!\n\nModel Used: ${data.modelUsed}\nResponse: ${data.solution}`);
      } else {
        setTestResult('❌ No response received');
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const models = modelsConfigData.models.filter(m => m.enabled);
  const modelsByProvider = models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, typeof models>);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Model Testing Dashboard</h1>
        <p className="text-muted-foreground">
          Test all available AI models and verify they're working correctly
        </p>
      </div>

      {/* Model Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{models.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{Object.keys(modelsByProvider).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {new Set(models.map(m => m.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Desktop Model Selector</CardTitle>
            <CardDescription>
              Standard dropdown selector for desktop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ModelSelector 
              value={selectedModel} 
              onValueChange={setSelectedModel}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile Model Selector</CardTitle>
            <CardDescription>
              Bottom sheet selector for mobile devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setMobileOpen(true)}
              variant="outline"
              className="w-full"
            >
              Open Mobile Selector
            </Button>
            <MobileModelSelector
              value={selectedModel}
              onValueChange={setSelectedModel}
              isOpen={mobileOpen}
              onClose={() => setMobileOpen(false)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Model Testing */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Model Testing</CardTitle>
          <CardDescription>
            Test the selected model to verify it's working
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Selected Model:</p>
              <Badge variant={selectedModel === 'auto' ? 'secondary' : 'default'}>
                {selectedModel === 'auto' ? 'Auto (Smart Routing)' : selectedModel}
              </Badge>
            </div>
            <Button 
              onClick={testModel}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? 'Testing...' : 'Test Model'}
            </Button>
          </div>
          
          {testResult && (
            <div className="p-4 bg-muted rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Models by Provider */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Available Models by Provider</h2>
        
        {Object.entries(modelsByProvider).map(([provider, providerModels]) => (
          <Card key={provider}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {provider === 'groq' && '⚡'} 
                {provider === 'huggingface' && '🤗'} 
                {provider === 'google' && '🔍'}
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
                <Badge variant="secondary">{providerModels.length} models</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providerModels.map((model) => (
                  <div key={model.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{model.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {model.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {model.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Context: {model.contextWindow.toLocaleString()}</span>
                      <span>•</span>
                      <span>Streaming: {model.supportsStreaming ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}