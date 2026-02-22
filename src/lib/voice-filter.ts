/**
 * Voice Filter System
 * Prevents repetition and makes TTS output more natural
 */

export interface VoiceFilterOptions {
  removeRepetition?: boolean;
  normalizeText?: boolean;
  addPauses?: boolean;
  fixPronunciation?: boolean;
}

export class VoiceFilter {
  /**
   * Apply all filters to make text more natural for TTS
   */
  static filterForTTS(text: string, options: VoiceFilterOptions = {}): string {
    const {
      removeRepetition = true,
      normalizeText = true,
      addPauses = true,
      fixPronunciation = true,
    } = options;

    let filtered = text;

    // Step 0: Check if text should be skipped (code blocks, tables, etc.)
    if (this.shouldSkipTTS(filtered)) {
      console.log('[Voice Filter] Text contains code/table markers, skipping TTS');
      return ''; // Return empty string to skip TTS
    }

    // Step 1: Clean markdown and formatting
    filtered = this.cleanMarkdown(filtered);

    // Step 2: Remove repetitive phrases
    if (removeRepetition) {
      filtered = this.removeRepetition(filtered);
    }

    // Step 3: Normalize text for natural speech
    if (normalizeText) {
      filtered = this.normalizeText(filtered);
    }

    // Step 4: Add natural pauses
    if (addPauses) {
      filtered = this.addNaturalPauses(filtered);
    }

    // Step 5: Fix pronunciation issues
    if (fixPronunciation) {
      filtered = this.fixPronunciation(filtered);
    }

    // Step 6: Final cleanup
    filtered = this.finalCleanup(filtered);

    return filtered;
  }

  /**
   * Check if text should skip TTS (contains code blocks, tables, etc.)
   */
  private static shouldSkipTTS(text: string): boolean {
    // Check for 3 or more consecutive equals signs (markdown tables, separators)
    if (/={3,}/.test(text)) {
      return true;
    }

    // Check for 3 or more consecutive hyphens (markdown tables, separators)
    if (/-{3,}/.test(text)) {
      return true;
    }

    // Check for 3 or more consecutive underscores
    if (/_{3,}/.test(text)) {
      return true;
    }

    // Check for 3 or more consecutive asterisks
    if (/\*{3,}/.test(text)) {
      return true;
    }

    // Check for pipe tables (|---|---|)
    if (/\|[\s-]+\|/.test(text)) {
      return true;
    }

    // Check for code fence markers
    if (/```/.test(text)) {
      return true;
    }

    // Check if text is mostly code (high ratio of special characters)
    const specialChars = (text.match(/[{}[\]();,<>]/g) || []).length;
    const totalChars = text.length;
    if (totalChars > 0 && specialChars / totalChars > 0.3) {
      return true;
    }

    // Check for ASCII art or box drawing (multiple special chars in sequence)
    if (/[─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬]{2,}/.test(text)) {
      return true;
    }

    return false;
  }

  /**
   * Clean markdown formatting
   */
  private static cleanMarkdown(text: string): string {
    return text
      // Remove equals sign separators (===, ====, etc.)
      .replace(/^={3,}$/gm, '')
      // Remove hyphen separators (---, ----, etc.)
      .replace(/^-{3,}$/gm, '')
      // Remove underscore separators (___, ____, etc.)
      .replace(/^_{3,}$/gm, '')
      // Remove asterisk separators (***, ****, etc.)
      .replace(/^\*{3,}$/gm, '')
      // Remove headers
      .replace(/#{1,6}\s+/g, '')
      // Remove bold
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Remove italic
      .replace(/\*(.*?)\*/g, '$1')
      // Remove inline code
      .replace(/`(.*?)`/g, '$1')
      // Replace code blocks with description
      .replace(/```[\s\S]*?```/g, '[code block]')
      // Remove links but keep text
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      // Remove other markdown symbols
      .replace(/[_~]/g, '')
      // Remove horizontal rules
      .replace(/^[-*_]{3,}$/gm, '')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove table pipes
      .replace(/\|/g, ' ')
      // Remove excessive punctuation
      .replace(/[!?]{3,}/g, '!')
      .replace(/\.{4,}/g, '...');
  }

  /**
   * Remove repetitive phrases and words
   */
  private static removeRepetition(text: string): string {
    // Split into sentences
    const sentences = text.split(/([.!?]+\s+)/);
    const uniqueSentences: string[] = [];
    const seenSentences = new Set<string>();

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      
      // Skip empty or very short sentences
      if (sentence.length < 3) {
        if (sentence.match(/[.!?]/)) {
          uniqueSentences.push(sentence);
        }
        continue;
      }

      // Normalize for comparison (lowercase, remove punctuation)
      const normalized = sentence.toLowerCase().replace(/[^\w\s]/g, '');
      
      // Check if we've seen this sentence before
      if (!seenSentences.has(normalized)) {
        seenSentences.add(normalized);
        uniqueSentences.push(sentence);
      }
    }

    let result = uniqueSentences.join(' ');

    // Remove repeated words (e.g., "the the" -> "the")
    result = result.replace(/\b(\w+)\s+\1\b/gi, '$1');

    // Remove repeated phrases (e.g., "I think I think" -> "I think")
    result = result.replace(/\b(\w+\s+\w+)\s+\1\b/gi, '$1');

    return result;
  }

  /**
   * Normalize text for natural speech
   */
  private static normalizeText(text: string): string {
    return text
      // First, replace symbols with spoken words
      .replace(/&/g, ' and ')
      .replace(/@/g, ' at ')
      .replace(/#/g, ' hash ')
      .replace(/\$/g, ' dollar ')
      .replace(/%/g, ' percent ')
      .replace(/\^/g, ' caret ')
      .replace(/\*/g, ' ')
      .replace(/\+/g, ' plus ')
      .replace(/=/g, ' equals ')
      .replace(/</g, ' less than ')
      .replace(/>/g, ' greater than ')
      .replace(/\|/g, ' ')
      .replace(/\\/g, ' ')
      .replace(/\//g, ' slash ')
      .replace(/~/g, ' ')
      .replace(/`/g, ' ')
      
      // Remove brackets and parentheses (usually code-related)
      .replace(/[{}[\]()]/g, ' ')
      
      // Replace multiple symbols with space
      .replace(/[!?]{2,}/g, '!')
      .replace(/\.{3,}/g, '.')
      
      // Expand common abbreviations
      .replace(/\bDr\./gi, 'Doctor')
      .replace(/\bMr\./gi, 'Mister')
      .replace(/\bMrs\./gi, 'Missus')
      .replace(/\bMs\./gi, 'Miss')
      .replace(/\bProf\./gi, 'Professor')
      .replace(/\betc\./gi, 'etcetera')
      .replace(/\be\.g\./gi, 'for example')
      .replace(/\bi\.e\./gi, 'that is')
      .replace(/\bvs\./gi, 'versus')
      
      // Expand technical abbreviations
      .replace(/\bAPI\b/g, 'A P I')
      .replace(/\bURL\b/g, 'U R L')
      .replace(/\bHTML\b/g, 'H T M L')
      .replace(/\bCSS\b/g, 'C S S')
      .replace(/\bJSON\b/g, 'J SON')
      .replace(/\bXML\b/g, 'X M L')
      .replace(/\bSQL\b/g, 'S Q L')
      .replace(/\bHTTP\b/g, 'H T T P')
      .replace(/\bHTTPS\b/g, 'H T T P S')
      .replace(/\bUI\b/g, 'U I')
      .replace(/\bUX\b/g, 'U X')
      .replace(/\bAI\b/g, 'A I')
      .replace(/\bML\b/g, 'M L')
      .replace(/\bNLP\b/g, 'N L P')
      
      // Convert numbers with symbols to words
      .replace(/\b(\d+)%/g, '$1 percent')
      .replace(/\$(\d+)/g, '$1 dollars')
      .replace(/\b(\d+)km\b/g, '$1 kilometers')
      .replace(/\b(\d+)m\b/g, '$1 meters')
      .replace(/\b(\d+)kg\b/g, '$1 kilograms')
      .replace(/\b(\d+)g\b/g, '$1 grams')
      
      // Fix common speech issues
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
      .trim();
  }

  /**
   * Add natural pauses for better speech flow
   */
  private static addNaturalPauses(text: string): string {
    return text
      // Add pause after sentences
      .replace(/([.!?])\s+/g, '$1 ')
      // Add pause after commas
      .replace(/,\s+/g, ', ')
      // Add pause after colons
      .replace(/:\s+/g, ': ')
      // Add pause after semicolons
      .replace(/;\s+/g, '; ')
      // Add pause between paragraphs
      .replace(/\n\n+/g, '. ');
  }

  /**
   * Fix common pronunciation issues
   */
  private static fixPronunciation(text: string): string {
    return text
      // Programming terms
      .replace(/\bJavaScript\b/g, 'Java Script')
      .replace(/\bTypeScript\b/g, 'Type Script')
      .replace(/\bReact\b/g, 'React')
      .replace(/\bNode\.js\b/g, 'Node J S')
      .replace(/\bNext\.js\b/g, 'Next J S')
      
      // Common tech terms
      .replace(/\bGitHub\b/g, 'Git Hub')
      .replace(/\bStackOverflow\b/g, 'Stack Overflow')
      .replace(/\bLinkedIn\b/g, 'Linked In')
      .replace(/\bYouTube\b/g, 'You Tube')
      
      // File extensions
      .replace(/\.js\b/g, ' dot J S')
      .replace(/\.ts\b/g, ' dot T S')
      .replace(/\.tsx\b/g, ' dot T S X')
      .replace(/\.jsx\b/g, ' dot J S X')
      .replace(/\.json\b/g, ' dot JSON')
      .replace(/\.html\b/g, ' dot H T M L')
      .replace(/\.css\b/g, ' dot C S S')
      
      // Version numbers
      .replace(/v(\d+)\.(\d+)\.(\d+)/g, 'version $1 point $2 point $3')
      .replace(/v(\d+)\.(\d+)/g, 'version $1 point $2');
  }

  /**
   * Final cleanup
   */
  private static finalCleanup(text: string): string {
    return text
      // Remove multiple spaces
      .replace(/\s{2,}/g, ' ')
      // Remove spaces before punctuation
      .replace(/\s+([.,!?;:])/g, '$1')
      // Ensure space after punctuation
      .replace(/([.,!?;:])(\w)/g, '$1 $2')
      // Remove leading/trailing whitespace
      .trim()
      // Limit length for TTS (max 5000 chars)
      .substring(0, 5000);
  }

  /**
   * Check if text has repetitive content
   */
  static hasRepetition(text: string): boolean {
    // Check for repeated words
    if (/\b(\w+)\s+\1\b/i.test(text)) {
      return true;
    }

    // Check for repeated phrases
    if (/\b(\w+\s+\w+)\s+\1\b/i.test(text)) {
      return true;
    }

    // Check for repeated sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const uniqueSentences = new Set(sentences.map(s => s.toLowerCase().trim()));
    
    return sentences.length !== uniqueSentences.size;
  }

  /**
   * Get text statistics
   */
  static getStats(text: string): {
    originalLength: number;
    filteredLength: number;
    sentenceCount: number;
    wordCount: number;
    hasRepetition: boolean;
  } {
    const filtered = this.filterForTTS(text);
    const sentences = filtered.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = filtered.split(/\s+/).filter(w => w.length > 0);

    return {
      originalLength: text.length,
      filteredLength: filtered.length,
      sentenceCount: sentences.length,
      wordCount: words.length,
      hasRepetition: this.hasRepetition(text),
    };
  }
}
