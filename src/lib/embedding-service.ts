/**
 * Embedding Service
 * Generate embeddings using Google Gemini embedding-001
 */

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  dimensions: number;
}

/**
 * Embedding Service for SOHAM Memory System
 */
export class EmbeddingService {
  private readonly model = 'text-embedding-004';

  /**
   * Generate embedding for text
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:embedContent?key=${process.env.GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: {
              parts: [{ text }]
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const embedding = data.embedding.values;

      return {
        embedding,
        model: this.model,
        dimensions: embedding.length,
      };
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts (batch)
   */
  async generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    const promises = texts.map(text => this.generateEmbedding(text));
    return Promise.all(promises);
  }
}

// Export singleton
let embeddingService: EmbeddingService | null = null;

export function getEmbeddingService(): EmbeddingService {
  if (!embeddingService) {
    embeddingService = new EmbeddingService();
  }
  return embeddingService;
}
