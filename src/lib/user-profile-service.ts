import { UserProfile, UserMemory } from './types';

/**
 * User Profile Service
 * Manages user profiles and memories (in-memory for now, can be extended to Firestore)
 */

// In-memory storage (replace with Firestore in production)
const profileStore = new Map<string, UserProfile>();

export class UserProfileService {
  /**
   * Get user profile by ID
   */
  static async getProfile(userId: string): Promise<UserProfile | null> {
    return profileStore.get(userId) || null;
  }

  /**
   * Create or update user profile
   */
  static async upsertProfile(profile: UserProfile): Promise<UserProfile> {
    profile.updatedAt = new Date().toISOString();
    
    if (!profile.createdAt) {
      profile.createdAt = profile.updatedAt;
    }

    profileStore.set(profile.userId, profile);
    return profile;
  }

  /**
   * Add memory to user profile
   */
  static async addMemory(userId: string, memory: UserMemory): Promise<void> {
    const profile = await this.getProfile(userId);
    
    if (!profile) {
      // Create new profile with memory
      await this.upsertProfile({
        userId,
        memories: [memory],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    // Add memory to existing profile
    if (!profile.memories) {
      profile.memories = [];
    }

    profile.memories.push(memory);

    // Keep only the most recent 50 memories
    if (profile.memories.length > 50) {
      profile.memories = profile.memories
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 50);
    }

    await this.upsertProfile(profile);
  }

  /**
   * Update user's communication style
   */
  static async updateCommunicationStyle(
    userId: string,
    style: 'direct' | 'detailed' | 'casual' | 'technical'
  ): Promise<void> {
    const profile = await this.getProfile(userId);
    
    if (!profile) {
      await this.upsertProfile({
        userId,
        communicationStyle: style,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    profile.communicationStyle = style;
    await this.upsertProfile(profile);
  }

  /**
   * Get relevant memories for current context
   */
  static async getRelevantMemories(
    userId: string,
    currentMessage: string,
    limit: number = 5
  ): Promise<UserMemory[]> {
    const profile = await this.getProfile(userId);
    
    if (!profile || !profile.memories || profile.memories.length === 0) {
      return [];
    }

    // Simple relevance scoring based on keyword matching
    const keywords = currentMessage.toLowerCase().split(/\s+/);
    
    const scoredMemories = profile.memories.map(memory => {
      const memoryWords = memory.content.toLowerCase().split(/\s+/);
      const matchCount = keywords.filter(kw => 
        memoryWords.some(mw => mw.includes(kw) || kw.includes(mw))
      ).length;
      
      return {
        ...memory,
        score: matchCount / keywords.length,
      };
    });

    return scoredMemories
      .filter(m => m.score > 0.1 || m.relevance > 0.7)
      .sort((a, b) => (b.score + b.relevance) - (a.score + a.relevance))
      .slice(0, limit);
  }

  /**
   * Clear all memories for a user
   */
  static async clearMemories(userId: string): Promise<void> {
    const profile = await this.getProfile(userId);
    
    if (profile) {
      profile.memories = [];
      await this.upsertProfile(profile);
    }
  }

  /**
   * Delete user profile
   */
  static async deleteProfile(userId: string): Promise<void> {
    profileStore.delete(userId);
  }
}
