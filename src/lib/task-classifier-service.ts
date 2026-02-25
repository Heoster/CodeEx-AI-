/**
 * Task Classifier Service
 * CODEEX V3.3 Multi-Model AI Router
 * 
 * Intelligent classification of user requests into 11 task categories using Groq Llama 3.2 3B.
 * Provides confidence scoring, reasoning explanation, complexity estimation, and multimodal detection.
 * 
 * Requirements: 3.1-3.10
 */

import type { TaskCategory } from './model-registry-v3';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Task complexity levels
 */
export type TaskComplexity = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Message format for conversation history
 */
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Attachment information for multimodal detection
 */
export interface Attachment {
  type: 'image' | 'audio' | 'video' | 'document';
  mimeType?: string;
  size?: number;
}

/**
 * Classification request input
 */
export interface ClassificationRequest {
  userMessage: string;
  conversationHistory?: Message[];
  attachments?: Attachment[];
}

/**
 * Classification result output
 */
export interface ClassificationResult {
  category: TaskCategory;
  confidence: number;              // 0-1 score
  reasoning: string;               // Explanation of classification decision
  estimatedComplexity: TaskComplexity;
  estimatedTokens: number;
  requiresMultimodal: boolean;
  detectedLanguage?: string;
  classifiedAt: string;            // ISO 8601 timestamp
  classifierModelUsed: string;
}

// ============================================================================
// Classification Prompt Templates
// ============================================================================

const CLASSIFICATION_SYSTEM_PROMPT = `You are an expert AI task classifier. Your job is to analyze user requests and classify them into one of 11 task categories.

**Task Categories:**

1. **SIMPLE** - Basic queries, greetings, simple facts, quick questions
   Examples: "Hello", "What's the weather?", "Define photosynthesis"

2. **MEDIUM** - General knowledge, explanations, summaries, moderate complexity
   Examples: "Explain quantum computing", "Summarize this article", "Compare X and Y"

3. **COMPLEX** - Multi-step reasoning, deep analysis, strategic planning, research
   Examples: "Analyze market trends and predict...", "Design a system architecture for..."

4. **CODING** - Code generation, debugging, code review, programming questions
   Examples: "Write a function to...", "Debug this code", "Review my implementation"

5. **REASONING** - Logic puzzles, math problems, strategic thinking, problem-solving
   Examples: "Solve this equation", "What's the optimal strategy for...", "Logic puzzle"

6. **VISION_IN** - Image understanding, OCR, visual Q&A, image analysis
   Examples: "What's in this image?", "Read text from this photo", "Analyze this chart"

7. **IMAGE_GEN** - Image generation, image creation requests
   Examples: "Generate an image of...", "Create a picture showing...", "Draw..."

8. **VIDEO_GEN** - Video generation, video creation requests
   Examples: "Generate a video of...", "Create an animation showing..."

9. **MULTILINGUAL** - Non-English requests, translation tasks, multilingual content
   Examples: "Translate to Spanish", "¿Cómo estás?", "中文翻译"

10. **AGENTIC** - Computer use, tool calling, automation, multi-step actions
    Examples: "Search the web and summarize...", "Book a flight", "Automate this task"

11. **LONG_CONTEXT** - Requests requiring >100K tokens context (large documents, books)
    Examples: "Analyze this entire book", "Summarize these 50 documents"

**Your Response Format:**
Respond with a JSON object containing:
{
  "category": "CATEGORY_NAME",
  "confidence": 0.95,
  "reasoning": "Brief explanation of why this category was chosen",
  "complexity": "LOW|MEDIUM|HIGH",
  "estimatedTokens": 1000,
  "detectedLanguage": "en"
}

**Guidelines:**
- Choose the MOST SPECIFIC category that fits
- If multiple categories apply, choose the PRIMARY intent
- Confidence should reflect certainty (0.0 to 1.0)
- Complexity considers both input and expected output
- estimatedTokens includes prompt + expected response
- detectedLanguage is ISO 639-1 code (en, es, fr, etc.)`;

// ============================================================================
// Task Classifier Service
// ============================================================================

export class TaskClassifierService {
  private readonly groqApiKey: string;
  private readonly classifierModelId = 'llama-3.1-8b-instant'; // Using Llama 3.1 8B as 3.2 3B was decommissioned
  private readonly groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private classificationHistory: Map<string, ClassificationResult[]> = new Map();

  constructor(groqApiKey?: string) {
    this.groqApiKey = groqApiKey || process.env.GROQ_API_KEY || '';
    
    if (!this.groqApiKey) {
      console.warn('TaskClassifierService: GROQ_API_KEY not configured');
    }
  }

  /**
   * Classify a user request into a task category
   * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8
   */
  async classify(request: ClassificationRequest): Promise<ClassificationResult> {
    // Check for multimodal requirements first
    const requiresMultimodal = this.detectMultimodalRequirements(request);
    
    // If attachments indicate specific category, use that
    if (request.attachments && request.attachments.length > 0) {
      const attachmentCategory = this.classifyByAttachments(request.attachments);
      if (attachmentCategory) {
        return this.createQuickClassification(
          attachmentCategory,
          request,
          requiresMultimodal,
          'Classification based on attachment type'
        );
      }
    }

    // Build classification prompt
    const prompt = this.buildClassificationPrompt(request);

    try {
      // Call Groq Llama 3.2 3B for classification
      const response = await this.callGroqClassifier(prompt, request.conversationHistory);
      
      // Parse and validate response
      const result = this.parseClassificationResponse(response, request, requiresMultimodal);
      
      // Store in history (if userId available in future)
      // this.storeClassificationHistory(userId, result);
      
      return result;
    } catch (error) {
      console.error('TaskClassifierService: Classification failed:', error);
      
      // Fallback to rule-based classification
      return this.fallbackClassification(request, requiresMultimodal);
    }
  }

  /**
   * Reclassify a request with additional context
   * Requirements: 3.9
   */
  async reclassify(
    request: ClassificationRequest,
    previousCategory: TaskCategory,
    additionalContext?: string
  ): Promise<ClassificationResult> {
    // Add context about previous classification
    const enhancedRequest: ClassificationRequest = {
      ...request,
      userMessage: `${request.userMessage}\n\n[Previous classification: ${previousCategory}. ${additionalContext || 'Please reclassify with more context.'}]`,
    };

    return this.classify(enhancedRequest);
  }

  /**
   * Get classification history for a user
   * Requirements: 3.10
   */
  getClassificationHistory(userId: string): ClassificationResult[] {
    return this.classificationHistory.get(userId) || [];
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Detect if multimodal capabilities are required
   * Requirements: 3.7
   */
  private detectMultimodalRequirements(request: ClassificationRequest): boolean {
    // Check for attachments
    if (request.attachments && request.attachments.length > 0) {
      return true;
    }

    // Check for multimodal keywords in message
    const message = request.userMessage.toLowerCase();
    const multimodalKeywords = [
      'image', 'picture', 'photo', 'screenshot', 'diagram',
      'video', 'clip', 'animation',
      'audio', 'voice', 'sound', 'recording',
      'generate image', 'create picture', 'draw',
      'generate video', 'create animation'
    ];

    return multimodalKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Classify based on attachment types
   */
  private classifyByAttachments(attachments: Attachment[]): TaskCategory | null {
    const types = attachments.map(a => a.type);

    if (types.includes('image')) {
      return 'VISION_IN';
    }
    if (types.includes('audio')) {
      return 'VISION_IN'; // Audio transcription uses multimodal
    }
    if (types.includes('video')) {
      return 'VISION_IN'; // Video analysis
    }

    return null;
  }

  /**
   * Build classification prompt with context
   */
  private buildClassificationPrompt(request: ClassificationRequest): string {
    let prompt = `Classify this user request:\n\n"${request.userMessage}"`;

    // Add conversation context if available
    if (request.conversationHistory && request.conversationHistory.length > 0) {
      const recentHistory = request.conversationHistory.slice(-3); // Last 3 messages
      prompt += '\n\nRecent conversation context:\n';
      for (const msg of recentHistory) {
        prompt += `${msg.role}: ${msg.content.substring(0, 100)}...\n`;
      }
    }

    // Add attachment info
    if (request.attachments && request.attachments.length > 0) {
      prompt += `\n\nAttachments: ${request.attachments.map(a => a.type).join(', ')}`;
    }

    return prompt;
  }

  /**
   * Call Groq API for classification
   */
  private async callGroqClassifier(
    prompt: string,
    history?: Message[]
  ): Promise<string> {
    if (!this.groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const messages = [
      { role: 'system', content: CLASSIFICATION_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(this.groqApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.classifierModelId,
          messages,
          temperature: 0.3, // Low temperature for consistent classification
          max_tokens: 500,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No response from classifier');
      }

      return content;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Parse classification response from Groq
   */
  private parseClassificationResponse(
    response: string,
    request: ClassificationRequest,
    requiresMultimodal: boolean
  ): ClassificationResult {
    try {
      const parsed = JSON.parse(response);

      // Validate category
      const validCategories: TaskCategory[] = [
        'SIMPLE', 'MEDIUM', 'COMPLEX', 'CODING', 'REASONING',
        'VISION_IN', 'IMAGE_GEN', 'VIDEO_GEN', 'MULTILINGUAL',
        'AGENTIC', 'LONG_CONTEXT'
      ];

      const category = parsed.category as TaskCategory;
      if (!validCategories.includes(category)) {
        throw new Error(`Invalid category: ${category}`);
      }

      // Validate and normalize confidence (0-1 range)
      let confidence = parseFloat(parsed.confidence);
      if (isNaN(confidence) || confidence < 0 || confidence > 1) {
        confidence = 0.8; // Default confidence
      }

      // Validate complexity
      const validComplexities: TaskComplexity[] = ['LOW', 'MEDIUM', 'HIGH'];
      let complexity = parsed.complexity as TaskComplexity;
      if (!validComplexities.includes(complexity)) {
        complexity = 'MEDIUM'; // Default complexity
      }

      // Validate estimated tokens
      let estimatedTokens = parseInt(parsed.estimatedTokens);
      if (isNaN(estimatedTokens) || estimatedTokens < 0) {
        estimatedTokens = this.estimateTokenCount(request);
      }

      return {
        category,
        confidence,
        reasoning: parsed.reasoning || 'Classification based on content analysis',
        estimatedComplexity: complexity,
        estimatedTokens,
        requiresMultimodal,
        detectedLanguage: parsed.detectedLanguage || 'en',
        classifiedAt: new Date().toISOString(),
        classifierModelUsed: this.classifierModelId,
      };
    } catch (error) {
      console.error('Failed to parse classification response:', error);
      throw error;
    }
  }

  /**
   * Create quick classification for obvious cases
   */
  private createQuickClassification(
    category: TaskCategory,
    request: ClassificationRequest,
    requiresMultimodal: boolean,
    reasoning: string
  ): ClassificationResult {
    return {
      category,
      confidence: 0.95,
      reasoning,
      estimatedComplexity: this.estimateComplexity(request),
      estimatedTokens: this.estimateTokenCount(request),
      requiresMultimodal,
      detectedLanguage: this.detectLanguage(request.userMessage),
      classifiedAt: new Date().toISOString(),
      classifierModelUsed: this.classifierModelId,
    };
  }

  /**
   * Fallback classification using rule-based approach
   */
  private fallbackClassification(
    request: ClassificationRequest,
    requiresMultimodal: boolean
  ): ClassificationResult {
    const message = request.userMessage.toLowerCase();
    let category: TaskCategory = 'MEDIUM'; // Default
    let reasoning = 'Fallback rule-based classification';

    // Rule-based classification (order matters - most specific first)
    
    // Check for coding keywords first
    if (message.includes('code') || message.includes('function') || message.includes('debug') ||
        message.includes('write a') || message.includes('implement') || message.includes('program')) {
      category = 'CODING';
      reasoning = 'Contains coding-related keywords';
    }
    // Check for image generation
    else if ((message.includes('generate') || message.includes('create') || message.includes('draw')) &&
             (message.includes('image') || message.includes('picture') || message.includes('photo'))) {
      category = 'IMAGE_GEN';
      reasoning = 'Image generation request detected';
    }
    // Check for video generation
    else if ((message.includes('generate') || message.includes('create')) && message.includes('video')) {
      category = 'VIDEO_GEN';
      reasoning = 'Video generation request detected';
    }
    // Check for image analysis
    else if (message.includes('image') || message.includes('picture') || message.includes('photo')) {
      category = 'VISION_IN';
      reasoning = 'Image analysis request detected';
    }
    // Check for translation
    else if (message.includes('translate') || this.detectLanguage(message) !== 'en') {
      category = 'MULTILINGUAL';
      reasoning = 'Translation or non-English content detected';
    }
    // Check for complex analysis
    else if (message.length > 200 || message.includes('analyze') || message.includes('complex')) {
      category = 'COMPLEX';
      reasoning = 'Long or complex request detected';
    }
    // Check for simple messages
    else if (message.length < 50 && !message.includes('?')) {
      category = 'SIMPLE';
      reasoning = 'Short message without complex query';
    }

    return {
      category,
      confidence: 0.7, // Lower confidence for fallback
      reasoning,
      estimatedComplexity: this.estimateComplexity(request),
      estimatedTokens: this.estimateTokenCount(request),
      requiresMultimodal,
      detectedLanguage: this.detectLanguage(request.userMessage),
      classifiedAt: new Date().toISOString(),
      classifierModelUsed: 'fallback-rules',
    };
  }

  /**
   * Estimate task complexity
   * Requirements: 3.5
   */
  private estimateComplexity(request: ClassificationRequest): TaskComplexity {
    const message = request.userMessage;
    const historyLength = request.conversationHistory?.length || 0;

    // Simple heuristics
    if (message.length < 60 && historyLength < 3) {
      return 'LOW';
    } else if (message.length > 300 || historyLength > 10) {
      return 'HIGH';
    } else {
      return 'MEDIUM';
    }
  }

  /**
   * Estimate token count for request
   * Requirements: 3.6
   * 
   * Rough estimation: ~4 characters per token for English text
   */
  private estimateTokenCount(request: ClassificationRequest): number {
    let totalChars = request.userMessage.length;

    // Add history
    if (request.conversationHistory) {
      for (const msg of request.conversationHistory) {
        totalChars += msg.content.length;
      }
    }

    // Rough token estimate (4 chars per token)
    const estimatedInputTokens = Math.ceil(totalChars / 4);

    // Estimate output tokens based on complexity
    const complexity = this.estimateComplexity(request);
    const estimatedOutputTokens = complexity === 'LOW' ? 200 : complexity === 'MEDIUM' ? 500 : 1000;

    return estimatedInputTokens + estimatedOutputTokens;
  }

  /**
   * Detect language of text
   * Simple heuristic-based detection
   */
  private detectLanguage(text: string): string {
    // Check for common non-English patterns
    if (/[\u4e00-\u9fa5]/.test(text)) return 'zh'; // Chinese
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja'; // Japanese
    if (/[\u0600-\u06ff]/.test(text)) return 'ar'; // Arabic
    if (/[\u0400-\u04ff]/.test(text)) return 'ru'; // Russian
    if (/[àâäéèêëïîôùûüÿæœç]/i.test(text)) return 'fr'; // French
    if (/[áéíóúñü¿¡]/i.test(text)) return 'es'; // Spanish
    if (/[äöüß]/i.test(text)) return 'de'; // German

    return 'en'; // Default to English
  }

  /**
   * Store classification in history
   */
  private storeClassificationHistory(userId: string, result: ClassificationResult): void {
    const history = this.classificationHistory.get(userId) || [];
    history.push(result);

    // Keep only last 100 classifications
    if (history.length > 100) {
      history.shift();
    }

    this.classificationHistory.set(userId, history);
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let classifierInstance: TaskClassifierService | null = null;

/**
 * Get the singleton TaskClassifierService instance
 */
export function getTaskClassifierService(): TaskClassifierService {
  if (!classifierInstance) {
    classifierInstance = new TaskClassifierService();
  }
  return classifierInstance;
}

/**
 * Initialize the classifier with custom API key
 */
export function initializeTaskClassifierService(groqApiKey: string): TaskClassifierService {
  classifierInstance = new TaskClassifierService(groqApiKey);
  return classifierInstance;
}

/**
 * Reset the classifier (useful for testing)
 */
export function resetTaskClassifierService(): void {
  classifierInstance = null;
}
