export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  modelUsed?: string;
  modelCategory?: 'general' | 'coding' | 'math' | 'conversation' | 'multimodal';
  autoRouted?: boolean;
};

export type Chat = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

// All available model IDs (tested and working)
export type ModelId =
  // Groq models (tested and working)
  | 'llama-3.1-8b-instant'
  // Hugging Face models (tested and working via Router API)
  | 'llama-3.1-8b-instruct-hf'
  | 'deepseek-v3.2'
  | 'rnj-1-instruct'
  | 'gpt-oss-20b'
  // Google models (tested and working)
  | 'gemini-2.5-flash'
  | 'gemini-flash-latest'
  | 'gemini-2.5-flash-lite';

// Alias for backward compatibility
export type Model = ModelId;

export type Voice = 'Algenib' | 'Enceladus' | 'Achernar' | 'Heka';

// Model category type
export type ModelCategory = 'general' | 'coding' | 'math' | 'conversation' | 'multimodal';

export type Settings = {
  model: 'auto' | ModelId;
  preferredCategory?: ModelCategory;
  tone: 'helpful' | 'formal' | 'casual';
  technicalLevel: 'beginner' | 'intermediate' | 'expert';
  enableSpeech: boolean;
  voice: Voice;
};

// User profile for personality feature
export type UserProfile = {
  userId: string;
  communicationStyle?: 'direct' | 'detailed' | 'casual' | 'technical';
  preferences?: {
    responseLength?: 'concise' | 'balanced' | 'detailed';
    codeExamples?: boolean;
    explanationStyle?: 'simple' | 'moderate' | 'advanced';
  };
  memories?: UserMemory[];
  createdAt: string;
  updatedAt: string;
};

export type UserMemory = {
  id: string;
  content: string;
  category: 'preference' | 'fact' | 'context' | 'skill';
  timestamp: string;
  relevance: number; // 0-1 score for memory importance
};

// Types for Genkit flows
export interface ProcessUserMessageInput {
  message: string;
  // Use a simpler history type that only includes what the AI needs.
  // This prevents schema validation errors from extra fields like id or createdAt.
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  settings: Settings;
  userId?: string; // Optional user ID for memory system integration
}

export interface TextToSpeechInput {
  text: string;
  voice: Voice;
}

export interface TextToSpeechOutput {
  audio: string;
}

export interface SolveImageEquationInput {
  photoDataUri: string;
}

export interface SolveImageEquationOutput {
  recognizedEquation: string;
  solutionSteps: string;
  isSolvable: boolean;
}

export interface AnalyzePdfInput {
  pdfDataUri: string;
  question: string;
}

export interface AnalyzePdfOutput {
  answer: string;
}
