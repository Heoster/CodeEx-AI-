/**
 * Intent Detection Brain
 * Intelligently detects user intent for search, image generation, video generation, etc.
 * Similar to SOHAM pipeline but for intent classification
 */

export type IntentType = 
  | 'WEB_SEARCH'
  | 'IMAGE_GENERATION'
  | 'VIDEO_GENERATION'
  | 'CHAT'
  | 'CODE_GENERATION'
  | 'EXPLANATION';

export interface IntentResult {
  intent: IntentType;
  confidence: number;
  extractedQuery: string;
  reasoning: string;
}

/**
 * Intent Detector Service
 * Uses pattern matching and keyword analysis to detect user intent
 */
export class IntentDetector {
  /**
   * Detect intent from user message
   */
  detect(message: string): IntentResult {
    const lowerMessage = message.toLowerCase().trim();

    // Check for web search intent
    const searchResult = this.detectWebSearch(lowerMessage, message);
    if (searchResult.confidence > 0.7) {
      return searchResult;
    }

    // Check for image generation intent
    const imageResult = this.detectImageGeneration(lowerMessage, message);
    if (imageResult.confidence > 0.7) {
      return imageResult;
    }

    // Check for video generation intent
    const videoResult = this.detectVideoGeneration(lowerMessage, message);
    if (videoResult.confidence > 0.7) {
      return videoResult;
    }

    // Check for code generation intent
    const codeResult = this.detectCodeGeneration(lowerMessage, message);
    if (codeResult.confidence > 0.6) {
      return codeResult;
    }

    // Check for explanation intent
    const explainResult = this.detectExplanation(lowerMessage, message);
    if (explainResult.confidence > 0.6) {
      return explainResult;
    }

    // Default to chat
    return {
      intent: 'CHAT',
      confidence: 1.0,
      extractedQuery: message,
      reasoning: 'General conversation',
    };
  }

  /**
   * Detect web search intent
   */
  private detectWebSearch(lowerMessage: string, originalMessage: string): IntentResult {
    const patterns = [
      // Direct search commands
      { regex: /^(search|google|bing|find|lookup|look up)\s+(for|about|on)?\s*(.+)/i, weight: 1.0 },
      { regex: /^web\s+search\s+(.+)/i, weight: 1.0 },
      
      // Information seeking
      { regex: /^(what|who|where|when|why|how)\s+(is|are|was|were|did|does|do)\s+(.+)/i, weight: 0.8 },
      { regex: /^(tell me|show me|find me)\s+(about|information on|info about|details on)\s+(.+)/i, weight: 0.9 },
      
      // Current/latest information
      { regex: /(latest|current|recent|newest|today'?s?|this week'?s?)\s+(news|updates?|information|data|stats?|trends?)/i, weight: 0.95 },
      { regex: /what'?s?\s+(new|happening|trending|going on)\s+(with|in|about|on)/i, weight: 0.9 },
      
      // Specific domains
      { regex: /(news|article|blog|post|report|study|research|paper)\s+(about|on|regarding)/i, weight: 0.85 },
      { regex: /(price|cost|review|comparison|vs|versus)\s+of/i, weight: 0.8 },
      
      // Question patterns
      { regex: /^(can you|could you|please)\s+(search|find|look up|get|fetch)/i, weight: 0.9 },
      { regex: /^(i need|i want|i'm looking for)\s+(information|details|data|facts)\s+(about|on)/i, weight: 0.85 },
      
      // Time-sensitive queries
      { regex: /(today|yesterday|this week|this month|this year|now|currently)/i, weight: 0.7 },
      { regex: /(breaking|live|real-time|up-to-date)/i, weight: 0.85 },
    ];

    let maxConfidence = 0;
    let extractedQuery = originalMessage;
    let matchedPattern = '';

    for (const pattern of patterns) {
      const match = originalMessage.match(pattern.regex);
      if (match) {
        const confidence = pattern.weight;
        if (confidence > maxConfidence) {
          maxConfidence = confidence;
          matchedPattern = pattern.regex.source;
          
          // Extract the actual query
          if (match[3]) {
            extractedQuery = match[3].trim();
          } else if (match[1]) {
            extractedQuery = match[1].trim();
          } else {
            extractedQuery = originalMessage
              .replace(/^(search|google|find|lookup|look up|web search|tell me|show me)\s+(for|about|on)?\s*/i, '')
              .trim();
          }
        }
      }
    }

    return {
      intent: 'WEB_SEARCH',
      confidence: maxConfidence,
      extractedQuery,
      reasoning: maxConfidence > 0 ? `Matched search pattern: ${matchedPattern}` : 'No search pattern matched',
    };
  }

  /**
   * Detect image generation intent
   */
  private detectImageGeneration(lowerMessage: string, originalMessage: string): IntentResult {
    const patterns = [
      // Direct generation commands
      { regex: /^(generate|create|make|draw|paint|design|produce)\s+(an?|the)?\s*(image|picture|photo|illustration|artwork|graphic)\s+(of|showing|depicting|with)?\s*(.+)/i, weight: 1.0 },
      { regex: /^(image|picture|photo|illustration)\s+(of|showing|depicting)\s+(.+)/i, weight: 0.95 },
      
      // Art style requests
      { regex: /(realistic|artistic|anime|sketch|cartoon|3d|photorealistic|abstract|minimalist|vintage)\s+(image|picture|photo|art)\s+(of|showing)/i, weight: 0.95 },
      
      // Visualization requests
      { regex: /^(visualize|show me|i want to see|can you show)\s+(an?|the)?\s*(image|picture|visualization)\s+(of|showing)/i, weight: 0.9 },
      
      // Descriptive requests
      { regex: /^(a|an)\s+.*(landscape|portrait|scene|view|sunset|sunrise|mountain|ocean|city|forest|space|galaxy)/i, weight: 0.8 },
      
      // Art commands
      { regex: /^(paint|draw|sketch|illustrate|render)\s+(.+)/i, weight: 0.85 },
    ];

    let maxConfidence = 0;
    let extractedQuery = originalMessage;
    let matchedPattern = '';

    for (const pattern of patterns) {
      const match = originalMessage.match(pattern.regex);
      if (match) {
        const confidence = pattern.weight;
        if (confidence > maxConfidence) {
          maxConfidence = confidence;
          matchedPattern = pattern.regex.source;
          
          // Extract the actual prompt
          if (match[5]) {
            extractedQuery = match[5].trim();
          } else if (match[3]) {
            extractedQuery = match[3].trim();
          } else if (match[2]) {
            extractedQuery = match[2].trim();
          } else {
            extractedQuery = originalMessage
              .replace(/^(generate|create|make|draw|paint|design|produce|image|picture|photo)\s+(an?|the|of)?\s*(image|picture|photo)?\s+(of|showing)?\s*/i, '')
              .trim();
          }
        }
      }
    }

    return {
      intent: 'IMAGE_GENERATION',
      confidence: maxConfidence,
      extractedQuery,
      reasoning: maxConfidence > 0 ? `Matched image generation pattern: ${matchedPattern}` : 'No image generation pattern matched',
    };
  }

  /**
   * Detect video generation intent
   */
  private detectVideoGeneration(lowerMessage: string, originalMessage: string): IntentResult {
    const patterns = [
      // Direct video commands
      { regex: /^(generate|create|make|produce)\s+(a|an|the)?\s*(video|animation|clip|movie)\s+(of|showing|depicting|with)?\s*(.+)/i, weight: 1.0 },
      { regex: /^(video|animation|clip)\s+(of|showing|depicting)\s+(.+)/i, weight: 0.95 },
      
      // Animation requests
      { regex: /(animate|animated|animation)\s+(.+)/i, weight: 0.85 },
      
      // Motion requests
      { regex: /(moving|motion|dynamic|flowing)\s+(video|animation|scene)/i, weight: 0.8 },
    ];

    let maxConfidence = 0;
    let extractedQuery = originalMessage;
    let matchedPattern = '';

    for (const pattern of patterns) {
      const match = originalMessage.match(pattern.regex);
      if (match) {
        const confidence = pattern.weight;
        if (confidence > maxConfidence) {
          maxConfidence = confidence;
          matchedPattern = pattern.regex.source;
          
          // Extract the actual prompt
          if (match[5]) {
            extractedQuery = match[5].trim();
          } else if (match[3]) {
            extractedQuery = match[3].trim();
          } else if (match[2]) {
            extractedQuery = match[2].trim();
          }
        }
      }
    }

    return {
      intent: 'VIDEO_GENERATION',
      confidence: maxConfidence,
      extractedQuery,
      reasoning: maxConfidence > 0 ? `Matched video generation pattern: ${matchedPattern}` : 'No video generation pattern matched',
    };
  }

  /**
   * Detect code generation intent
   */
  private detectCodeGeneration(lowerMessage: string, originalMessage: string): IntentResult {
    const patterns = [
      { regex: /^(write|create|generate|make|build)\s+(a|an|the)?\s*(function|class|component|script|program|code|api|endpoint)/i, weight: 0.9 },
      { regex: /^(code|implement|develop)\s+(a|an|the)?\s*(.+)/i, weight: 0.8 },
      { regex: /(python|javascript|typescript|react|node|java|c\+\+|rust|go)\s+(code|function|class|script)/i, weight: 0.85 },
    ];

    let maxConfidence = 0;
    let extractedQuery = originalMessage;

    for (const pattern of patterns) {
      if (pattern.regex.test(originalMessage)) {
        maxConfidence = Math.max(maxConfidence, pattern.weight);
      }
    }

    return {
      intent: 'CODE_GENERATION',
      confidence: maxConfidence,
      extractedQuery,
      reasoning: maxConfidence > 0 ? 'Detected code generation request' : 'No code generation pattern matched',
    };
  }

  /**
   * Detect explanation intent
   */
  private detectExplanation(lowerMessage: string, originalMessage: string): IntentResult {
    const patterns = [
      { regex: /^(explain|describe|what is|what are|define|clarify)\s+(.+)/i, weight: 0.8 },
      { regex: /^(how does|how do|why does|why do)\s+(.+)\s+(work|function|operate)/i, weight: 0.85 },
      { regex: /^(tell me about|teach me|help me understand)\s+(.+)/i, weight: 0.8 },
    ];

    let maxConfidence = 0;
    let extractedQuery = originalMessage;

    for (const pattern of patterns) {
      if (pattern.regex.test(originalMessage)) {
        maxConfidence = Math.max(maxConfidence, pattern.weight);
      }
    }

    return {
      intent: 'EXPLANATION',
      confidence: maxConfidence,
      extractedQuery,
      reasoning: maxConfidence > 0 ? 'Detected explanation request' : 'No explanation pattern matched',
    };
  }
}

// Export singleton
let intentDetector: IntentDetector | null = null;

export function getIntentDetector(): IntentDetector {
  if (!intentDetector) {
    intentDetector = new IntentDetector();
  }
  return intentDetector;
}
