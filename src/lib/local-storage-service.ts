/**
 * Local Storage Service
 * Handles image/video/audio uploads to local server storage
 * Replaces Firebase Storage for better security and control
 */

import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  contentType: string;
}

export interface UploadOptions {
  userId: string;
  type: 'user-image' | 'generated-image' | 'generated-video' | 'audio';
  autoDelete?: boolean;
  deleteAfterMs?: number;
}

/**
 * Local Storage Service for SOHAM
 * Stores files in public/uploads directory
 */
export class LocalStorageService {
  private uploadsDir: string;
  private baseUrl: string;

  constructor() {
    // Store in public/uploads for Next.js static serving
    this.uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Ensure uploads directory exists
    this.ensureUploadsDirExists();
  }

  /**
   * Ensure uploads directory structure exists
   */
  private async ensureUploadsDirExists(): Promise<void> {
    try {
      const dirs = [
        this.uploadsDir,
        path.join(this.uploadsDir, 'user-image'),
        path.join(this.uploadsDir, 'generated-image'),
        path.join(this.uploadsDir, 'generated-video'),
        path.join(this.uploadsDir, 'audio'),
      ];

      for (const dir of dirs) {
        try {
          await fs.access(dir);
        } catch {
          await fs.mkdir(dir, { recursive: true });
        }
      }
    } catch (error) {
      console.error('Failed to create uploads directory:', error);
    }
  }

  /**
   * Upload file to local storage
   */
  async uploadFile(
    file: Buffer | Blob,
    options: UploadOptions
  ): Promise<UploadResult> {
    const { userId, type, autoDelete = false, deleteAfterMs = 3600000 } = options;
    
    // Ensure directory exists
    await this.ensureUploadsDirExists();
    
    // Generate unique filename
    const timestamp = Date.now();
    const uniqueId = uuidv4().split('-')[0]; // Short UUID
    const extension = this.getExtension(type);
    const filename = `${userId}_${timestamp}_${uniqueId}${extension}`;
    
    // Create file path
    const typeDir = path.join(this.uploadsDir, type);
    const filePath = path.join(typeDir, filename);
    
    // Convert Blob to Buffer if needed
    let buffer: Buffer;
    if (file instanceof Blob) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = file;
    }
    
    // Write file to disk
    await fs.writeFile(filePath, new Uint8Array(buffer));
    
    // Get file stats
    const stats = await fs.stat(filePath);
    
    // Generate public URL
    const url = `${this.baseUrl}/uploads/${type}/${filename}`;
    
    // Schedule auto-deletion if enabled
    if (autoDelete) {
      setTimeout(() => {
        this.deleteFile(`${type}/${filename}`).catch(err => 
          console.error('Auto-delete failed:', err)
        );
      }, deleteAfterMs);
    }
    
    return {
      url,
      path: `${type}/${filename}`,
      size: stats.size,
      contentType: this.getContentType(type),
    };
  }

  /**
   * Delete file from local storage
   */
  async deleteFile(relativePath: string): Promise<void> {
    const filePath = path.join(this.uploadsDir, relativePath);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, ignore error
      console.warn('Failed to delete file:', relativePath);
    }
  }

  /**
   * Get file extension based on type
   */
  private getExtension(type: string): string {
    switch (type) {
      case 'user-image':
      case 'generated-image':
        return '.png';
      case 'generated-video':
        return '.mp4';
      case 'audio':
        return '.mp3';
      default:
        return '.bin';
    }
  }

  /**
   * Get content type based on file type
   */
  private getContentType(type: string): string {
    switch (type) {
      case 'user-image':
      case 'generated-image':
        return 'image/png';
      case 'generated-video':
        return 'video/mp4';
      case 'audio':
        return 'audio/mpeg';
      default:
        return 'application/octet-stream';
    }
  }

  /**
   * Clean up old files (run periodically)
   */
  async cleanupOldFiles(maxAgeMs: number = 86400000): Promise<number> {
    let deletedCount = 0;
    const now = Date.now();

    try {
      const types = ['user-image', 'generated-image', 'generated-video', 'audio'];
      
      for (const type of types) {
        const typeDir = path.join(this.uploadsDir, type);
        
        try {
          const files = await fs.readdir(typeDir);
          
          for (const file of files) {
            const filePath = path.join(typeDir, file);
            const stats = await fs.stat(filePath);
            const age = now - stats.mtimeMs;
            
            if (age > maxAgeMs) {
              await fs.unlink(filePath);
              deletedCount++;
            }
          }
        } catch (error) {
          // Directory might not exist, continue
        }
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }

    return deletedCount;
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    byType: Record<string, { files: number; size: number }>;
  }> {
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      byType: {} as Record<string, { files: number; size: number }>,
    };

    try {
      const types = ['user-image', 'generated-image', 'generated-video', 'audio'];
      
      for (const type of types) {
        const typeDir = path.join(this.uploadsDir, type);
        stats.byType[type] = { files: 0, size: 0 };
        
        try {
          const files = await fs.readdir(typeDir);
          
          for (const file of files) {
            const filePath = path.join(typeDir, file);
            const fileStats = await fs.stat(filePath);
            
            stats.byType[type].files++;
            stats.byType[type].size += fileStats.size;
            stats.totalFiles++;
            stats.totalSize += fileStats.size;
          }
        } catch (error) {
          // Directory might not exist, continue
        }
      }
    } catch (error) {
      console.error('Failed to get stats:', error);
    }

    return stats;
  }
}

// Export singleton
let storageService: LocalStorageService | null = null;

export function getStorageService(): LocalStorageService {
  if (!storageService) {
    storageService = new LocalStorageService();
  }
  return storageService;
}
