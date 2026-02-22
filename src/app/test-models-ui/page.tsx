'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Brain, Search, FileText, Image, FileImage } from 'lucide-react';

const MODELS = [
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', provider: 'Groq', category: 'general' },
  { id: 'llama-3.1-8b-instruct-hf', name: 'Llama 3.1 8B Instruct', provider: 'HuggingFace', category: 'general' },
  { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', provider: 'HuggingFace', category: 'coding' },
  { id: 'rnj-1-instruct', name: 'RNJ-1 Instruct', provider: 'HuggingFace', category: 'conversation' },
  { id: 'gpt-oss-20b', name: 'GPT-OSS 20B', provider: 'HuggingFace', category: 'general' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', category: 'multimodal' },
  { id: 'gemini-flash-latest', name: 'Gemini Flash Latest', provider: 'Google', category: 'general' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', provider: 'Google', category: 'conversation' },
  { id: 'auto', name: 'Auto (Smart Routing)', provider: 'System', category: 'auto' }
];

const SERVICES = [
  { id: 'solve', name: 'Problem Solver', icon: Brain, endpoint: '/api/ai/solve' },
  { id: 'search', name: 'Search', icon: Search, endpoint: '/api/ai/search' },
  { id: 'summarize', name: 'Summarizer', icon: FileText, endpoint: '/api/ai/summarize' },
  { id: 'image-solver', name: 'Image Solver', icon: Image, endpoint: '/api/ai/image-solver' },
  { id: 'pdf-analyzer', name: 'PDF Analyzer', icon: FileImage, endpoint: '/api/ai/pdf-analyzer' }
];

const TEST_PROMPTS = {
  solve: [
    'What is 25 + 37?',
    'Write a Python function to reverse a string',
    'Explain quantum computing in simple terms'
  ],
  search: [
    'What is the latest version of React?',
    'Current weather in Tokyo',
    'Best practices for TypeScript'
  ],
  summarize: [
    'Artificial Intelligence (AI) is revolutionizing industries worldwide. From healthcare to finance, AI technologies are enabling unprecedented automation and insights. Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions with remarkable accuracy.',
    'React is a popular JavaScript library for building user interfaces. It was created by Facebook and is now maintained by Meta and the open-source community. React uses a component-based architecture and virtual DOM for efficient rendering.',
  ],
  'image-solver': ['Upload an image to test'],
  'pdf-analyzer': ['Upload a PDF to test']
};

export default function TestModelsUI() {
  const [selectedService, setSelectedService] = useState('solve');
  const [selectedModel, setSelectedModel] = useState('auto');
  const [input, setInput] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const startTime = Date.now();

    try {
      let requestBody: any = {
        preferredModel: selectedModel === 'auto' ? undefined : selectedModel
      };

      // Prepare request based on service
      switch (selectedService) {
        case 'solve':
          requestBody.problem = input;
          requestBody.tone = 'helpful';
          requestBody.technicalLevel = 'intermediate';
          break;
        case 'search':
          requestBody.query = input;
          break;
        case 'summarize':
          requestBody.text = input;
          requestBody.style = 'brief';
          break;
        case 'image-solver':
          // For demo, we'll use a placeholder
          requestBody.imageDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60kYPhfDQVR42mNlEAfFcSJAAAADUAAAABCAYAAAAAAEAAANSUhEUgARw0KGgoA';
          requestBody.problemType = 'general';
          break;
        case 'pdf-analyzer':
          // For demo, we'll use a minimal PDF
          requestBody.pdfDataUri = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPJ4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCAxMjAgMTIwXQo+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmCjAwMDAwMDAwMTAgMDAwMDAgbgowMDAwMDAwMDUzIDAwMDAwIG4KMDAwMDAwMDEyNSAwMDAwMCBuCnRyYWlsZXIKPDwKL1NpemUgNAovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMTg0CiUlRU9G';
          requestBody.question = input;
          break;
      }

      const service = SERVICES.find(s => s.id === selectedService);
      const response = await fetch(service!.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const result = {
        id: Date.now(),
        service: selectedService,
        model: selectedModel,
        modelUsed: data.modelUsed || 'Unknown',
        input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
        output: data.solution || data.answer || data.summary || data.recognizedContent || 'Response received',
        responseTime,
        success: true,
        timestamp: new Date().toLocaleTimeString()
      };

      setResults(prev => [result, ...prev]);
    } catch (error) {
      const result = {
        id: Date.now(),
        service: selectedService,
        model: selectedModel,
        modelUsed: 'Error',
        input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
        output: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
        success: false,
        timestamp: new Date().toLocaleTimeString()
      };

      setResults(prev => [result, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => setResults([]);

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'Groq': return 'bg-blue-100 text-blue-800';
      case 'HuggingFace': return 'bg-yellow-100 text-yellow-800';
      case 'Google': return 'bg-green-100 text-green-800';
      case 'System': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Models Testing Interface</h1>
        <p className="text-gray-600">Test all AI models directly in the app interface</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Configure your test parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">AI Service</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map(service => {
                    const Icon = service.icon;
                    return (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {service.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Model Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">AI Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getProviderColor(model.provider)}>
                          {model.provider}
                        </Badge>
                        {model.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Test Input</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Enter your ${selectedService} request...`}
                rows={4}
              />
              {/* Quick prompts */}
              <div className="mt-2 flex flex-wrap gap-2">
                {TEST_PROMPTS[selectedService as keyof typeof TEST_PROMPTS]?.map((prompt, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(prompt)}
                  >
                    {prompt.substring(0, 20)}...
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                onClick={handleTest} 
                disabled={loading || !input.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Model'
                )}
              </Button>
              <Button variant="outline" onClick={clearResults}>
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              {results.length} tests completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tests run yet</p>
              ) : (
                results.map(result => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <Badge variant="outline">
                          {result.service}
                        </Badge>
                        <Badge className={getProviderColor(
                          MODELS.find(m => m.id === result.modelUsed)?.provider || 'Unknown'
                        )}>
                          {result.modelUsed}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {result.responseTime}ms • {result.timestamp}
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium mb-1">Input:</div>
                      <div className="text-gray-600 mb-2">{result.input}</div>
                      <div className="font-medium mb-1">Output:</div>
                      <div className={result.success ? 'text-gray-800' : 'text-red-600'}>
                        {result.output.substring(0, 200)}
                        {result.output.length > 200 && '...'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}