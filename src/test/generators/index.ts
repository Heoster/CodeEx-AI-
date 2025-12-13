/**
 * Test generators for model configurations
 * Simple mock generators for testing without external dependencies
 */

import type { ModelConfig, ModelParams, ProviderConfig, ModelCategory, ProviderType } from '@/lib/model-config';

// Simple mock generators
export const getRandomModelCategory = (): ModelCategory => {
  const categories: ModelCategory[] = ['general', 'coding', 'math', 'conversation', 'multimodal'];
  return categories[Math.floor(Math.random() * categories.length)];
};

export const getRandomProviderType = (): ProviderType => {
  const providers: ProviderType[] = ['groq'];
  return providers[Math.floor(Math.random() * providers.length)];
};

export const getMockModelParams = (): ModelParams => ({
  temperature: Math.random() * 2,
  topP: Math.random(),
  topK: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 1 : undefined,
  maxOutputTokens: Math.floor(Math.random() * 8192) + 1,
});

export const getMockModelConfig = (): ModelConfig => ({
  id: `model-${Math.random().toString(36).substring(2, 11)}`,
  name: `Test Model ${Math.random().toString(36).substring(2, 7)}`,
  provider: getRandomProviderType(),
  modelId: `test-model-${Math.random().toString(36).substring(2, 11)}`,
  category: getRandomModelCategory(),
  description: 'Test model description',
  contextWindow: Math.floor(Math.random() * 127000) + 1024,
  supportsStreaming: Math.random() > 0.5,
  defaultParams: getMockModelParams(),
  enabled: Math.random() > 0.5,
});

export const getMockProviderConfig = (): ProviderConfig => ({
  type: getRandomProviderType(),
  apiKeyEnvVar: `TEST_API_KEY_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
  baseUrl: Math.random() > 0.5 ? 'https://api.example.com' : undefined,
  enabled: Math.random() > 0.5,
});

// Query generators
export const getCodingQuery = (): string => {
  const queries = [
    'How do I write a function in Python?',
    'Debug this JavaScript code',
    'Explain async/await in TypeScript',
    'Write code to sort an array',
    'function test() { return true; }',
  ];
  return queries[Math.floor(Math.random() * queries.length)];
};

export const getMathQuery = (): string => {
  const queries = [
    'Solve x^2 + 5x - 6 = 0',
    'Calculate the derivative of sin(x)',
    'What is the integral of e^x?',
    `What is ${Math.floor(Math.random() * 100)} * ${Math.floor(Math.random() * 100)}?`,
    'Calculate the area of a circle',
  ];
  return queries[Math.floor(Math.random() * queries.length)];
};

export const getGeneralQuery = (): string => {
  const queries = [
    'What is the weather like today?',
    'Tell me about machine learning',
    'How does photosynthesis work?',
    'Explain quantum physics',
    'What is artificial intelligence?',
  ];
  return queries[Math.floor(Math.random() * queries.length)];
};

export const getQueryWithSpecialChars = (): string => {
  const queries = [
    'search for C++ tutorials',
    'what is 2+2?',
    'find results for "machine learning"',
    'test & more',
    'query?param=test',
  ];
  return queries[Math.floor(Math.random() * queries.length)];
};

export const getValidModelId = (): string => {
  const modelIds = [
    'microsoft-dialoGPT-medium',
    'google-flan-t5-base',
    'distilbert-base-cased',
    'facebook-blenderbot-small',
    'bigscience-bloom-560m',
  ];
  return modelIds[Math.floor(Math.random() * modelIds.length)];
};

// Legacy exports for backward compatibility
export const modelCategoryArb = getRandomModelCategory;
export const providerTypeArb = getRandomProviderType;
export const modelParamsArb = getMockModelParams;
export const modelConfigArb = getMockModelConfig;
export const providerConfigArb = getMockProviderConfig;
export const codingQueryArb = getCodingQuery;
export const mathQueryArb = getMathQuery;
export const generalQueryArb = getGeneralQuery;
export const queryWithSpecialCharsArb = getQueryWithSpecialChars;
export const modelIdArb = getValidModelId;
