/**
 * Context Chunker Service Tests
 * Tests for chunk processing with parallel execution and fallback retry
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContextChunkerService } from './context-chunker-service';
import type { GenerateRequest, GenerateResponse } from '@/ai/adapters/types';
import type { ExtendedModelConfig, TaskCategory } from './model-registry-v3';

describe('ContextChunkerService - Chunk Processing', () => {
  let service: ContextChunkerService;

  beforeEach(() => {
    service = new ContextChunkerService();
  });

  describe('processChunks', () => {
    it('should process chunks in parallel when multiple chunks exist', async () => {
      // Create a mock request with content that will be chunked
      const mockRequest: GenerateRequest = {
        prompt: 'Test prompt',
        model: {
          id: 'test-model',
          name: 'Test Model',
          provider: 'groq'
        } as ExtendedModelConfig
      };

      // Create chunked request
      const chunkedRequest = {
        originalRequest: mockRequest,
        chunks: [
          {
            id: 'chunk-0',
            content: 'Chunk 1 content',
            tokenCount: 100,
            sequenceNumber: 0,
            metadata: {
              startPosition: 0,
              endPosition: 100,
              hasOverlap: false,
              relatedChunkIds: []
            }
          },
          {
            id: 'chunk-1',
            content: 'Chunk 2 content',
            tokenCount: 100,
            sequenceNumber: 1,
            metadata: {
              startPosition: 95,
              endPosition: 195,
              hasOverlap: true,
              relatedChunkIds: ['chunk-0']
            }
          }
        ],
        strategy: {
          type: 'SLIDING_WINDOW' as const,
          chunkSize: 100,
          overlapSize: 5
        },
        totalTokens: 195
      };

      // Mock execute function
      const mockExecute = vi.fn().mockResolvedValue({
        text: 'Mock response',
        model: 'test-model',
        modelUsed: 'test-model'
      } as GenerateResponse);

      // Mock fallback chain
      const mockFallbackChain: ExtendedModelConfig[] = [
        {
          id: 'test-model',
          name: 'Test Model',
          provider: 'groq',
          priority: 100
        } as ExtendedModelConfig
      ];

      const category: TaskCategory = 'SIMPLE';

      // Process chunks
      const result = await service.processChunks(
        chunkedRequest,
        mockExecute,
        mockFallbackChain,
        category
      );

      // Verify results
      expect(result.chunks).toHaveLength(2);
      expect(result.chunks[0].chunkId).toBe('chunk-0');
      expect(result.chunks[1].chunkId).toBe('chunk-1');
      expect(result.synthesizedResponse).toContain('Mock response');
      expect(result.totalProcessingTime).toBeGreaterThan(0);
      expect(mockExecute).toHaveBeenCalledTimes(2);
    });

    it('should retry with fallback models when chunk processing fails', async () => {
      const mockRequest: GenerateRequest = {
        prompt: 'Test prompt',
        model: {
          id: 'test-model',
          name: 'Test Model',
          provider: 'groq'
        } as ExtendedModelConfig
      };

      const chunkedRequest = {
        originalRequest: mockRequest,
        chunks: [
          {
            id: 'chunk-0',
            content: 'Chunk content',
            tokenCount: 100,
            sequenceNumber: 0,
            metadata: {
              startPosition: 0,
              endPosition: 100,
              hasOverlap: false,
              relatedChunkIds: []
            }
          }
        ],
        strategy: {
          type: 'SLIDING_WINDOW' as const,
          chunkSize: 100,
          overlapSize: 5
        },
        totalTokens: 100
      };

      // Mock execute function that fails first, then succeeds
      const mockExecute = vi.fn()
        .mockRejectedValueOnce(new Error('Rate limit exceeded'))
        .mockResolvedValueOnce({
          text: 'Success response',
          model: 'fallback-model',
          modelUsed: 'fallback-model'
        } as GenerateResponse);

      // Mock fallback chain with two models
      const mockFallbackChain: ExtendedModelConfig[] = [
        {
          id: 'primary-model',
          name: 'Primary Model',
          provider: 'groq',
          priority: 100
        } as ExtendedModelConfig,
        {
          id: 'fallback-model',
          name: 'Fallback Model',
          provider: 'cerebras',
          priority: 90
        } as ExtendedModelConfig
      ];

      const category: TaskCategory = 'SIMPLE';

      // Process chunks
      const result = await service.processChunks(
        chunkedRequest,
        mockExecute,
        mockFallbackChain,
        category
      );

      // Verify fallback was used
      expect(result.chunks).toHaveLength(1);
      expect(result.chunks[0].modelUsed).toBe('fallback-model');
      expect(result.chunks[0].response).toBe('Success response');
      expect(mockExecute).toHaveBeenCalledTimes(2); // Primary failed, fallback succeeded
    });

    it('should handle chunk failures gracefully and continue processing', async () => {
      const mockRequest: GenerateRequest = {
        prompt: 'Test prompt',
        model: {
          id: 'test-model',
          name: 'Test Model',
          provider: 'groq'
        } as ExtendedModelConfig
      };

      const chunkedRequest = {
        originalRequest: mockRequest,
        chunks: [
          {
            id: 'chunk-0',
            content: 'Chunk 1',
            tokenCount: 100,
            sequenceNumber: 0,
            metadata: {
              startPosition: 0,
              endPosition: 100,
              hasOverlap: false,
              relatedChunkIds: []
            }
          },
          {
            id: 'chunk-1',
            content: 'Chunk 2',
            tokenCount: 100,
            sequenceNumber: 1,
            metadata: {
              startPosition: 95,
              endPosition: 195,
              hasOverlap: true,
              relatedChunkIds: ['chunk-0']
            }
          }
        ],
        strategy: {
          type: 'SLIDING_WINDOW' as const,
          chunkSize: 100,
          overlapSize: 5
        },
        totalTokens: 195
      };

      // Mock execute function that fails for first chunk, succeeds for second
      const mockExecute = vi.fn()
        .mockRejectedValueOnce(new Error('Chunk 1 failed'))
        .mockResolvedValueOnce({
          text: 'Chunk 2 success',
          model: 'test-model',
          modelUsed: 'test-model'
        } as GenerateResponse);

      const mockFallbackChain: ExtendedModelConfig[] = [
        {
          id: 'test-model',
          name: 'Test Model',
          provider: 'groq',
          priority: 100
        } as ExtendedModelConfig
      ];

      const category: TaskCategory = 'SIMPLE';

      // Process chunks
      const result = await service.processChunks(
        chunkedRequest,
        mockExecute,
        mockFallbackChain,
        category
      );

      // Verify both chunks are in result, first with error
      expect(result.chunks).toHaveLength(2);
      expect(result.chunks[0].response).toContain('Error processing chunk');
      expect(result.chunks[1].response).toBe('Chunk 2 success');
    });

    it('should track total processing time across all chunks', async () => {
      const mockRequest: GenerateRequest = {
        prompt: 'Test prompt',
        model: {
          id: 'test-model',
          name: 'Test Model',
          provider: 'groq'
        } as ExtendedModelConfig
      };

      const chunkedRequest = {
        originalRequest: mockRequest,
        chunks: [
          {
            id: 'chunk-0',
            content: 'Chunk content',
            tokenCount: 100,
            sequenceNumber: 0,
            metadata: {
              startPosition: 0,
              endPosition: 100,
              hasOverlap: false,
              relatedChunkIds: []
            }
          }
        ],
        strategy: {
          type: 'SLIDING_WINDOW' as const,
          chunkSize: 100,
          overlapSize: 5
        },
        totalTokens: 100
      };

      // Mock execute with delay
      const mockExecute = vi.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return {
          text: 'Response',
          model: 'test-model',
          modelUsed: 'test-model'
        } as GenerateResponse;
      });

      const mockFallbackChain: ExtendedModelConfig[] = [
        {
          id: 'test-model',
          name: 'Test Model',
          provider: 'groq',
          priority: 100
        } as ExtendedModelConfig
      ];

      const category: TaskCategory = 'SIMPLE';

      // Process chunks
      const result = await service.processChunks(
        chunkedRequest,
        mockExecute,
        mockFallbackChain,
        category
      );

      // Verify timing
      expect(result.totalProcessingTime).toBeGreaterThanOrEqual(50);
      expect(result.chunks[0].processingTime).toBeGreaterThanOrEqual(50);
    });

    it('should implement exponential backoff between retry attempts', async () => {
      const mockRequest: GenerateRequest = {
        prompt: 'Test prompt',
        model: {
          id: 'test-model',
          name: 'Test Model',
          provider: 'groq'
        } as ExtendedModelConfig
      };

      const chunkedRequest = {
        originalRequest: mockRequest,
        chunks: [
          {
            id: 'chunk-0',
            content: 'Chunk content',
            tokenCount: 100,
            sequenceNumber: 0,
            metadata: {
              startPosition: 0,
              endPosition: 100,
              hasOverlap: false,
              relatedChunkIds: []
            }
          }
        ],
        strategy: {
          type: 'SLIDING_WINDOW' as const,
          chunkSize: 100,
          overlapSize: 5
        },
        totalTokens: 100
      };

      const callTimes: number[] = [];

      // Mock execute that fails twice then succeeds
      const mockExecute = vi.fn().mockImplementation(async () => {
        callTimes.push(Date.now());
        if (callTimes.length < 3) {
          throw new Error('Temporary failure');
        }
        return {
          text: 'Success',
          model: 'test-model',
          modelUsed: 'test-model'
        } as GenerateResponse;
      });

      const mockFallbackChain: ExtendedModelConfig[] = [
        { id: 'model-1', provider: 'groq', priority: 100 } as ExtendedModelConfig,
        { id: 'model-2', provider: 'cerebras', priority: 90 } as ExtendedModelConfig,
        { id: 'model-3', provider: 'google', priority: 80 } as ExtendedModelConfig
      ];

      const category: TaskCategory = 'SIMPLE';

      // Process chunks
      await service.processChunks(
        chunkedRequest,
        mockExecute,
        mockFallbackChain,
        category
      );

      // Verify exponential backoff (300ms, 600ms between attempts)
      expect(callTimes).toHaveLength(3);
      const delay1 = callTimes[1] - callTimes[0];
      const delay2 = callTimes[2] - callTimes[1];
      
      // Allow some tolerance for timing
      expect(delay1).toBeGreaterThanOrEqual(250); // ~300ms
      expect(delay2).toBeGreaterThanOrEqual(550); // ~600ms
    });
  });
});
