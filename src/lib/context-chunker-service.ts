/**
 * Context Chunker Service
 * Automatically chunks and processes requests exceeding 1M token context window
 * 
 * Features:
 * - Token counting using tiktoken
 * - Three chunking strategies: SLIDING_WINDOW, SEMANTIC, HIERARCHICAL
 * - Automatic strategy selection based on content type
 * - Parallel chunk processing
 * - Response synthesis
 */

import { encoding_for_model } from 'tiktoken';
import type { GenerateRequest, GenerateResponse } from '@/ai/adapters/types';
import type { ExtendedModelConfig, TaskCategory } from './model-registry-v3';

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Chunking strategy configuration
 */
export interface ChunkingStrategy {
  type: 'SLIDING_WINDOW' | 'SEMANTIC' | 'HIERARCHICAL';
  chunkSize: number;
  overlapSize: number;
}

/**
 * Chunked request with all chunks and metadata
 */
export interface ChunkedRequest {
  originalRequest: GenerateRequest;
  chunks: RequestChunk[];
  strategy: ChunkingStrategy;
  totalTokens: number;
}

/**
 * Individual chunk of a request
 */
export interface RequestChunk {
  id: string;
  content: string;
  tokenCount: number;
  sequenceNumber: number;
  metadata: ChunkMetadata;
}

/**
 * Metadata for a chunk
 */
export interface ChunkMetadata {
  startPosition: number;
  endPosition: number;
  hasOverlap: boolean;
  relatedChunkIds: string[];
}

/**
 * Result of processing chunks
 */
export interface ChunkingResult {
  chunks: ResponseChunk[];
  synthesizedResponse: string;
  totalProcessingTime: number;
}

/**
 * Response from processing a single chunk
 */
export interface ResponseChunk {
  chunkId: string;
  response: string;
  modelUsed: string;
  processingTime: number;
}

// ============================================================================
// Constants
// ============================================================================

const MAX_CONTEXT_TOKENS = 1_000_000; // 1M token threshold
const DEFAULT_CHUNK_SIZE = 100_000; // 100K tokens per chunk
const DEFAULT_OVERLAP_SIZE = 5_000; // 5K token overlap
const SEMANTIC_BOUNDARY_MARKERS = ['\n\n', '\n', '. ', '! ', '? '];

// ============================================================================
// Context Chunker Service
// ============================================================================

export class ContextChunkerService {
  private encoder: ReturnType<typeof encoding_for_model>;

  constructor() {
    // Initialize tiktoken encoder with GPT-4 encoding (cl100k_base)
    this.encoder = encoding_for_model('gpt-4');
  }

  /**
   * Check if a request should be chunked
   */
  shouldChunk(request: GenerateRequest): boolean {
    const totalTokens = this.estimateTokenCount(this.getFullContent(request));
    return totalTokens > MAX_CONTEXT_TOKENS;
  }

  /**
   * Estimate token count for text using tiktoken
   */
  estimateTokenCount(text: string): number {
    try {
      const tokens = this.encoder.encode(text);
      return tokens.length;
    } catch (error) {
      // Fallback to rough estimation if encoding fails
      // Approximate: 1 token ≈ 4 characters
      return Math.ceil(text.length / 4);
    }
  }

  /**
   * Select optimal chunking strategy based on content type
   */
  selectOptimalStrategy(request: GenerateRequest): ChunkingStrategy {
    const content = this.getFullContent(request);
    const totalTokens = this.estimateTokenCount(content);

    // Analyze content structure
    const hasStructuredSections = this.hasStructuredSections(content);
    const hasCodeBlocks = this.hasCodeBlocks(content);
    const averageParagraphLength = this.getAverageParagraphLength(content);

    // HIERARCHICAL: Best for structured documents with clear sections
    if (hasStructuredSections && totalTokens > 500_000) {
      return {
        type: 'HIERARCHICAL',
        chunkSize: 150_000,
        overlapSize: 10_000,
      };
    }

    // SEMANTIC: Best for natural language with clear paragraph boundaries
    if (!hasCodeBlocks && averageParagraphLength > 100 && averageParagraphLength < 1000) {
      return {
        type: 'SEMANTIC',
        chunkSize: DEFAULT_CHUNK_SIZE,
        overlapSize: DEFAULT_OVERLAP_SIZE,
      };
    }

    // SLIDING_WINDOW: Default fallback, works for all content types
    return {
      type: 'SLIDING_WINDOW',
      chunkSize: DEFAULT_CHUNK_SIZE,
      overlapSize: DEFAULT_OVERLAP_SIZE,
    };
  }

  /**
   * Chunk a request using the specified strategy
   */
  chunkRequest(request: GenerateRequest, strategy: ChunkingStrategy): ChunkedRequest {
    const content = this.getFullContent(request);
    const totalTokens = this.estimateTokenCount(content);

    let chunks: RequestChunk[];

    switch (strategy.type) {
      case 'SLIDING_WINDOW':
        chunks = this.chunkSlidingWindow(content, strategy);
        break;
      case 'SEMANTIC':
        chunks = this.chunkSemantic(content, strategy);
        break;
      case 'HIERARCHICAL':
        chunks = this.chunkHierarchical(content, strategy);
        break;
      default:
        chunks = this.chunkSlidingWindow(content, strategy);
    }

    return {
      originalRequest: request,
      chunks,
      strategy,
      totalTokens,
    };
  }

  /**
   * Process chunks (to be implemented with actual model execution)
   * This is a placeholder that would integrate with the router
   */
  /**
     * Process chunks with parallel execution and fallback retry
     * Requirements: 10.5, 10.6, 10.8, 10.9
     */
    async processChunks(
      chunkedRequest: ChunkedRequest,
      executeModel: (model: ExtendedModelConfig, req: GenerateRequest, timeoutMs?: number) => Promise<GenerateResponse>,
      fallbackChain: ExtendedModelConfig[],
      category: TaskCategory
    ): Promise<ChunkingResult> {
      const startTime = Date.now();
      const responseChunks: ResponseChunk[] = [];

      // Determine if we can process chunks in parallel
      // Parallel processing is possible when:
      // 1. We have multiple chunks
      // 2. Rate limits allow (we'll check this dynamically)
      const canProcessInParallel = chunkedRequest.chunks.length > 1;

      if (canProcessInParallel) {
        console.log(`[ContextChunker] Processing ${chunkedRequest.chunks.length} chunks in parallel`);

        // Process chunks in parallel with Promise.allSettled to handle individual failures
        const chunkPromises = chunkedRequest.chunks.map(chunk => 
          this.processChunkWithFallback(
            chunk,
            chunkedRequest.originalRequest,
            executeModel,
            fallbackChain,
            category
          )
        );

        const results = await Promise.allSettled(chunkPromises);

        // Collect successful results and handle failures
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          if (result.status === 'fulfilled') {
            responseChunks.push(result.value);
          } else {
            // Chunk failed even after fallback attempts
            console.error(`[ContextChunker] Chunk ${i} failed after all fallback attempts:`, result.reason);

            // Create error response chunk
            responseChunks.push({
              chunkId: chunkedRequest.chunks[i].id,
              response: `[Error processing chunk ${i + 1}: ${result.reason?.message || 'Unknown error'}]`,
              modelUsed: chunkedRequest.originalRequest.model.id,
              processingTime: 0
            });
          }
        }
      } else {
        // Process chunks sequentially
        console.log(`[ContextChunker] Processing ${chunkedRequest.chunks.length} chunks sequentially`);

        for (const chunk of chunkedRequest.chunks) {
          try {
            const responseChunk = await this.processChunkWithFallback(
              chunk,
              chunkedRequest.originalRequest,
              executeModel,
              fallbackChain,
              category
            );
            responseChunks.push(responseChunk);
          } catch (error) {
            console.error(`[ContextChunker] Chunk ${chunk.id} failed after all fallback attempts:`, error);

            // Create error response chunk
            responseChunks.push({
              chunkId: chunk.id,
              response: `[Error processing chunk ${chunk.sequenceNumber + 1}: ${(error as Error).message || 'Unknown error'}]`,
              modelUsed: chunkedRequest.originalRequest.model.id,
              processingTime: 0
            });
          }
        }
      }

      // Synthesize responses into coherent output
      const synthesizedResponse = this.synthesizeResponses(responseChunks);
      const totalProcessingTime = Date.now() - startTime;

      console.log(`[ContextChunker] Completed processing ${chunkedRequest.chunks.length} chunks in ${totalProcessingTime}ms`);

      return {
        chunks: responseChunks,
        synthesizedResponse,
        totalProcessingTime
      };
    }

    /**
     * Process a single chunk with fallback retry logic
     * Requirements: 10.8
     */
    private async processChunkWithFallback(
      chunk: RequestChunk,
      originalRequest: GenerateRequest,
      executeModel: (model: ExtendedModelConfig, req: GenerateRequest, timeoutMs?: number) => Promise<GenerateResponse>,
      fallbackChain: ExtendedModelConfig[],
      category: TaskCategory
    ): Promise<ResponseChunk> {
      const chunkStartTime = Date.now();

      // Create a modified request for this chunk
      const chunkRequest: GenerateRequest = {
        ...originalRequest,
        prompt: chunk.content,
      };

      let lastError: Error | undefined;
      let currentTimeout = 4000; // Default 4s timeout

      // Try each model in the fallback chain
      for (let i = 0; i < fallbackChain.length; i++) {
        const model = fallbackChain[i];
        const attemptNumber = i + 1;

        try {
          console.log(`[ContextChunker] Processing chunk ${chunk.id} with ${model.id} (attempt ${attemptNumber}/${fallbackChain.length})`);

          // Execute chunk with current model
          const response = await executeModel(model, chunkRequest, currentTimeout);

          const processingTime = Date.now() - chunkStartTime;

          // Success!
          return {
            chunkId: chunk.id,
            response: response.text || '',
            modelUsed: model.id,
            processingTime
          };

        } catch (error) {
          lastError = error as Error;
          console.error(`[ContextChunker] Chunk ${chunk.id} failed with ${model.id}:`, lastError.message);

          // Classify error type
          const errorType = this.classifyChunkError(error);

          // Increase timeout on timeout errors
          if (errorType === 'TIMEOUT' && i < fallbackChain.length - 1) {
            currentTimeout = Math.min(currentTimeout * 1.5, 10000); // Max 10s
            console.log(`[ContextChunker] Increased timeout to ${currentTimeout}ms for next attempt`);
          }

          // Implement exponential backoff between retries
          if (i < fallbackChain.length - 1) {
            const backoffDelay = this.calculateChunkBackoff(attemptNumber);
            console.log(`[ContextChunker] Waiting ${backoffDelay}ms before next attempt`);
            await this.sleep(backoffDelay);
          }
        }
      }

      // All models failed for this chunk
      throw new Error(
        `Failed to process chunk ${chunk.id} after ${fallbackChain.length} attempts. Last error: ${lastError?.message || 'Unknown error'}`
      );
    }

    /**
     * Classify chunk processing error
     */
    private classifyChunkError(error: any): string {
      const message = error?.message?.toLowerCase() || '';
      const status = error?.status || error?.statusCode || 0;

      if (status === 429 || message.includes('rate limit')) {
        return 'RATE_LIMIT';
      }
      if (status === 401 || status === 403) {
        return 'AUTH_ERROR';
      }
      if (status === 503 || status === 502 || status === 504) {
        return 'SERVICE_UNAVAILABLE';
      }
      if (message.includes('timeout')) {
        return 'TIMEOUT';
      }
      return 'UNKNOWN';
    }

    /**
     * Calculate exponential backoff for chunk retry
     */
    private calculateChunkBackoff(attemptNumber: number): number {
      const baseDelay = 300; // 300ms base (shorter than main fallback)
      const maxDelay = 3000; // 3s max
      return Math.min(baseDelay * Math.pow(2, attemptNumber - 1), maxDelay);
    }

    /**
     * Sleep utility for backoff
     */
    private sleep(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }


  /**
   * Synthesize chunk responses into a coherent final response
   */
  synthesizeResponses(chunks: ResponseChunk[]): string {
    // Sort chunks by ID to ensure correct order
    const sortedChunks = [...chunks].sort((a, b) => {
      const aNum = parseInt(a.chunkId.split('-')[1] || '0');
      const bNum = parseInt(b.chunkId.split('-')[1] || '0');
      return aNum - bNum;
    });

    // Join responses with appropriate separators
    const synthesized = sortedChunks
      .map(chunk => chunk.response.trim())
      .join('\n\n');

    return synthesized;
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Get full content from request (prompt + history)
   */
  private getFullContent(request: GenerateRequest): string {
    let content = request.prompt;

    if (request.systemPrompt) {
      content = request.systemPrompt + '\n\n' + content;
    }

    if (request.history && request.history.length > 0) {
      const historyText = request.history
        .map(msg => {
          const msgContent = typeof msg.content === 'string' 
            ? msg.content 
            : msg.content.map(c => c.text).join('');
          return `${msg.role}: ${msgContent}`;
        })
        .join('\n\n');
      content = historyText + '\n\n' + content;
    }

    return content;
  }

  /**
   * Check if content has structured sections (headers, etc.)
   */
  private hasStructuredSections(content: string): boolean {
    // Look for markdown headers or numbered sections
    const headerPattern = /^#{1,6}\s+.+$/gm;
    const numberedPattern = /^\d+\.\s+.+$/gm;
    
    const headers = content.match(headerPattern) || [];
    const numbered = content.match(numberedPattern) || [];
    
    return headers.length > 5 || numbered.length > 10;
  }

  /**
   * Check if content has code blocks
   */
  private hasCodeBlocks(content: string): boolean {
    const codeBlockPattern = /```[\s\S]*?```/g;
    const matches = content.match(codeBlockPattern) || [];
    return matches.length > 0;
  }

  /**
   * Get average paragraph length
   */
  private getAverageParagraphLength(content: string): number {
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
    if (paragraphs.length === 0) return 0;
    
    const totalLength = paragraphs.reduce((sum, p) => sum + p.length, 0);
    return totalLength / paragraphs.length;
  }

  /**
   * Chunk using sliding window strategy
   */
  private chunkSlidingWindow(content: string, strategy: ChunkingStrategy): RequestChunk[] {
    const chunks: RequestChunk[] = [];
    const tokens = this.encoder.encode(content);
    const { chunkSize, overlapSize } = strategy;

    let position = 0;
    let sequenceNumber = 0;

    while (position < tokens.length) {
      const endPosition = Math.min(position + chunkSize, tokens.length);
      const chunkTokens = tokens.slice(position, endPosition);
      const chunkContent = new TextDecoder().decode(this.encoder.decode(chunkTokens));

      const chunk: RequestChunk = {
        id: `chunk-${sequenceNumber}`,
        content: chunkContent,
        tokenCount: chunkTokens.length,
        sequenceNumber,
        metadata: {
          startPosition: position,
          endPosition,
          hasOverlap: position > 0,
          relatedChunkIds: [],
        },
      };

      // Link to previous chunk if there's overlap
      if (sequenceNumber > 0) {
        chunk.metadata.relatedChunkIds.push(`chunk-${sequenceNumber - 1}`);
      }

      chunks.push(chunk);

      // Move position forward, accounting for overlap
      position += chunkSize - overlapSize;
      sequenceNumber++;
    }

    return chunks;
  }

  /**
   * Chunk using semantic boundaries (paragraphs, sentences)
   */
  private chunkSemantic(content: string, strategy: ChunkingStrategy): RequestChunk[] {
    const chunks: RequestChunk[] = [];
    const { chunkSize, overlapSize } = strategy;
    
    let currentChunk = '';
    let currentTokens = 0;
    let sequenceNumber = 0;
    let startPosition = 0;

    // Split by paragraphs first
    const paragraphs = content.split(/\n\n+/);

    for (const paragraph of paragraphs) {
      const paragraphTokens = this.estimateTokenCount(paragraph);

      // If adding this paragraph exceeds chunk size, save current chunk
      if (currentTokens + paragraphTokens > chunkSize && currentChunk.length > 0) {
        chunks.push(this.createChunk(
          currentChunk,
          sequenceNumber,
          startPosition,
          currentTokens
        ));

        // Keep overlap from end of previous chunk
        const overlapText = this.getOverlapText(currentChunk, overlapSize);
        currentChunk = overlapText + '\n\n' + paragraph;
        currentTokens = this.estimateTokenCount(currentChunk);
        startPosition += currentTokens - this.estimateTokenCount(overlapText);
        sequenceNumber++;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
        currentTokens += paragraphTokens;
      }
    }

    // Add final chunk
    if (currentChunk.length > 0) {
      chunks.push(this.createChunk(
        currentChunk,
        sequenceNumber,
        startPosition,
        currentTokens
      ));
    }

    return chunks;
  }

  /**
   * Chunk using hierarchical structure (sections, subsections)
   */
  private chunkHierarchical(content: string, strategy: ChunkingStrategy): RequestChunk[] {
    const chunks: RequestChunk[] = [];
    const { chunkSize, overlapSize } = strategy;

    // Split by major sections (markdown headers or numbered sections)
    const sectionPattern = /^(#{1,3}\s+.+|^\d+\.\s+.+)$/gm;
    const sections = this.splitBySections(content, sectionPattern);

    let currentChunk = '';
    let currentTokens = 0;
    let sequenceNumber = 0;
    let startPosition = 0;

    for (const section of sections) {
      const sectionTokens = this.estimateTokenCount(section);

      // If section alone exceeds chunk size, split it further
      if (sectionTokens > chunkSize) {
        // Save current chunk if any
        if (currentChunk.length > 0) {
          chunks.push(this.createChunk(
            currentChunk,
            sequenceNumber,
            startPosition,
            currentTokens
          ));
          sequenceNumber++;
          startPosition += currentTokens;
          currentChunk = '';
          currentTokens = 0;
        }

        // Split large section using semantic chunking
        const subChunks = this.chunkSemantic(section, strategy);
        chunks.push(...subChunks.map((chunk, idx) => ({
          ...chunk,
          sequenceNumber: sequenceNumber + idx,
        })));
        sequenceNumber += subChunks.length;
        startPosition += sectionTokens;
      } else if (currentTokens + sectionTokens > chunkSize && currentChunk.length > 0) {
        // Save current chunk and start new one
        chunks.push(this.createChunk(
          currentChunk,
          sequenceNumber,
          startPosition,
          currentTokens
        ));

        const overlapText = this.getOverlapText(currentChunk, overlapSize);
        currentChunk = overlapText + '\n\n' + section;
        currentTokens = this.estimateTokenCount(currentChunk);
        startPosition += currentTokens - this.estimateTokenCount(overlapText);
        sequenceNumber++;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + section;
        currentTokens += sectionTokens;
      }
    }

    // Add final chunk
    if (currentChunk.length > 0) {
      chunks.push(this.createChunk(
        currentChunk,
        sequenceNumber,
        startPosition,
        currentTokens
      ));
    }

    return chunks;
  }

  /**
   * Create a chunk object
   */
  private createChunk(
    content: string,
    sequenceNumber: number,
    startPosition: number,
    tokenCount: number
  ): RequestChunk {
    return {
      id: `chunk-${sequenceNumber}`,
      content,
      tokenCount,
      sequenceNumber,
      metadata: {
        startPosition,
        endPosition: startPosition + tokenCount,
        hasOverlap: sequenceNumber > 0,
        relatedChunkIds: sequenceNumber > 0 ? [`chunk-${sequenceNumber - 1}`] : [],
      },
    };
  }

  /**
   * Get overlap text from end of chunk
   */
  private getOverlapText(text: string, overlapTokens: number): string {
    const tokens = this.encoder.encode(text);
    const startIdx = Math.max(0, tokens.length - overlapTokens);
    const overlapTokenSlice = tokens.slice(startIdx);
    const decoded = this.encoder.decode(overlapTokenSlice);
    return new TextDecoder().decode(decoded);
  }

  /**
   * Split content by sections
   */
  private splitBySections(content: string, pattern: RegExp): string[] {
    const sections: string[] = [];
    const lines = content.split('\n');
    let currentSection = '';

    for (const line of lines) {
      if (pattern.test(line) && currentSection.length > 0) {
        sections.push(currentSection.trim());
        currentSection = line;
      } else {
        currentSection += (currentSection ? '\n' : '') + line;
      }
    }

    if (currentSection.length > 0) {
      sections.push(currentSection.trim());
    }

    return sections;
  }

  /**
   * Clean up encoder resources
   */
  dispose(): void {
    try {
      this.encoder.free();
    } catch (error) {
      // Ignore errors during cleanup
      // This can happen if the encoder is already freed or borrowed
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let contextChunkerInstance: ContextChunkerService | null = null;

/**
 * Get singleton instance of Context Chunker Service
 */
export function getContextChunker(): ContextChunkerService {
  if (!contextChunkerInstance) {
    contextChunkerInstance = new ContextChunkerService();
  }
  return contextChunkerInstance;
}

/**
 * Dispose of the singleton instance
 */
export function disposeContextChunker(): void {
  if (contextChunkerInstance) {
    contextChunkerInstance.dispose();
    contextChunkerInstance = null;
  }
}
