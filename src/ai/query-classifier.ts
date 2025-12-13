/**
 * Query Classifier
 * Analyzes user queries to determine the most appropriate model category
 */

import type { ModelCategory } from '@/lib/model-config';

/**
 * Classification result with category and confidence
 */
export interface QueryClassification {
  category: ModelCategory;
  confidence: number;
  reasoning: string;
}

// Keyword patterns for each category
const CODING_PATTERNS = [
  /\b(code|coding|program|programming|function|class|method|variable|debug|error|bug|fix|implement|algorithm|api|database|sql|html|css|javascript|typescript|python|java|c\+\+|rust|go|ruby|php|swift|kotlin)\b/i,
  /\b(import|export|const|let|var|async|await|promise|callback|loop|array|object|string|number|boolean|null|undefined)\b/i,
  /\b(git|github|npm|yarn|package|module|library|framework|react|vue|angular|node|express|django|flask|spring)\b/i,
  /```[\s\S]*```/,  // Code blocks
  /\b(syntax|compile|runtime|exception|stack trace)\b/i,
];

const MATH_PATTERNS = [
  /\b(calculate|compute|solve|equation|formula|math|mathematics|algebra|calculus|geometry|trigonometry|statistics)\b/i,
  /\b(derivative|integral|limit|sum|product|factorial|logarithm|exponential|polynomial|matrix|vector)\b/i,
  /\b(add|subtract|multiply|divide|plus|minus|times|divided by)\b/i,
  /[+\-*/^=].*\d+/,  // Mathematical expressions
  /\d+\s*[+\-*/^]\s*\d+/,  // Simple arithmetic
  /\b(x|y|z)\s*[=+\-*/^]/i,  // Variables in equations
  /\b(sin|cos|tan|log|ln|sqrt|abs)\s*\(/i,  // Math functions
  /\b(percentage|percent|ratio|proportion|fraction)\b/i,
];

const CONVERSATION_PATTERNS = [
  /\b(hello|hi|hey|good morning|good afternoon|good evening|how are you|what's up|thanks|thank you|please|sorry)\b/i,
  /\b(tell me about yourself|who are you|what can you do|help me)\b/i,
  /\b(chat|talk|conversation|discuss|opinion|think|feel|believe)\b/i,
  /^(hi|hello|hey)[\s!?.]*$/i,  // Simple greetings
];

const MULTIMODAL_PATTERNS = [
  /\b(image|picture|photo|screenshot|diagram|chart|graph|visual|see|look at|analyze this image)\b/i,
  /\b(describe|identify|recognize|detect|ocr|read text from)\b/i,
  /\b(upload|attached|this file|this document)\b/i,
];

/**
 * Calculate match score for a set of patterns
 */
function calculatePatternScore(query: string, patterns: RegExp[]): number {
  let matches = 0;
  for (const pattern of patterns) {
    if (pattern.test(query)) {
      matches++;
    }
  }
  return matches / patterns.length;
}

/**
 * Detect if query contains code patterns
 */
export function containsCode(query: string): boolean {
  // Check for code blocks
  if (/```[\s\S]*```/.test(query)) return true;
  
  // Check for common code patterns
  const codeIndicators = [
    /\bfunction\s+\w+\s*\(/,
    /\bconst\s+\w+\s*=/,
    /\blet\s+\w+\s*=/,
    /\bvar\s+\w+\s*=/,
    /\bclass\s+\w+/,
    /\bdef\s+\w+\s*\(/,
    /\bimport\s+[\w{},\s]+from/,
    /\brequire\s*\(/,
    /=>\s*{/,
    /\bif\s*\(.*\)\s*{/,
    /\bfor\s*\(.*\)\s*{/,
    /\bwhile\s*\(.*\)\s*{/,
  ];
  
  return codeIndicators.some(pattern => pattern.test(query));
}

/**
 * Classify a query into a model category
 */
export function classifyQuery(query: string): QueryClassification {
  if (!query || query.trim().length === 0) {
    return {
      category: 'general',
      confidence: 1.0,
      reasoning: 'Empty query defaults to general category',
    };
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // Calculate scores for each category
  const scores: Record<ModelCategory, number> = {
    coding: calculatePatternScore(normalizedQuery, CODING_PATTERNS),
    math: calculatePatternScore(normalizedQuery, MATH_PATTERNS),
    conversation: calculatePatternScore(normalizedQuery, CONVERSATION_PATTERNS),
    multimodal: calculatePatternScore(normalizedQuery, MULTIMODAL_PATTERNS),
    general: 0.1, // Base score for general
  };
  
  // Boost coding score if actual code is detected
  if (containsCode(query)) {
    scores.coding = Math.max(scores.coding, 0.8);
  }
  
  // Find the highest scoring category
  let maxCategory: ModelCategory = 'general';
  let maxScore = scores.general;
  
  for (const [category, score] of Object.entries(scores) as [ModelCategory, number][]) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category;
    }
  }
  
  // If no strong match, default to general
  if (maxScore < 0.15) {
    return {
      category: 'general',
      confidence: 0.6,
      reasoning: 'No strong category match, using general-purpose model',
    };
  }
  
  // Generate reasoning
  const reasoning = generateReasoning(maxCategory, maxScore);
  
  return {
    category: maxCategory,
    confidence: Math.min(maxScore + 0.3, 1.0), // Boost confidence slightly
    reasoning,
  };
}

/**
 * Generate human-readable reasoning for the classification
 */
function generateReasoning(category: ModelCategory, score: number): string {
  const confidenceLevel = score > 0.5 ? 'high' : score > 0.3 ? 'moderate' : 'low';
  
  switch (category) {
    case 'coding':
      return `Detected programming-related content with ${confidenceLevel} confidence. Using coding-optimized model.`;
    case 'math':
      return `Detected mathematical content with ${confidenceLevel} confidence. Using math-optimized model.`;
    case 'conversation':
      return `Detected conversational content with ${confidenceLevel} confidence. Using conversation-optimized model.`;
    case 'multimodal':
      return `Detected visual/multimodal content with ${confidenceLevel} confidence. Using multimodal model.`;
    default:
      return `Using general-purpose model for broad topic coverage.`;
  }
}

/**
 * QueryClassifier class for stateful classification
 */
export class QueryClassifier {
  classify(query: string): QueryClassification {
    return classifyQuery(query);
  }
  
  containsCode(query: string): boolean {
    return containsCode(query);
  }
}

// Singleton instance
let classifierInstance: QueryClassifier | null = null;

export function getQueryClassifier(): QueryClassifier {
  if (!classifierInstance) {
    classifierInstance = new QueryClassifier();
  }
  return classifierInstance;
}
