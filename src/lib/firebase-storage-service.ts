/**
 * Firebase Storage Service
 * Handles image/video uploads, downloads, and deletions
 */

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getServerApp } from './firebase-server';

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
 * Firebase Storage Service for SOHAM
 */
export class FirebaseStorageService {
  private storage;

  constructor() {
    this.storage = getStorage(getServerApp());
  }

  /**
   * Upload file to Firebase Storage
   */
  async uploadFile(
    file: Buffer | Blob,
    options: UploadOptions
  ): Promise<UploadResult> {
    const { userId, type, autoDelete = false, deleteAfterMs = 3600000 } = options;
    
    // Generate unique filename
    const timestamp = Date.now();
    const extension = this.getExtension(type);
    const path = `${type}/${userId}/${timestamp}${extension}`;
    
    // Create storage reference
    const storageRef = ref(this.storage, path);
    
    // Determine content type
    const contentType = this.getContentType(type);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file, {
      contentType,
      customMetadata: {
        userId,
        uploadedAt: new Date().toISOString(),
        autoDelete: autoDelete.toString(),
      }
    });
    
    // Get download URL
    const url = await getDownloadURL(snapshot.ref);
    
    // Schedule auto-deletion if enabled
    if (autoDelete) {
      setTimeout(() => {
        this.deleteFile(path).catch(err => 
          console.error('Auto-delete failed:', err)
        );
      }, deleteAfterMs);
    }
    
    return {
      url,
      path,
      size: snapshot.metadata.size,
      contentType: snapshot.metadata.contentType || contentType,
    };
  }

  /**
   * Delete file from Firebase Storage
   */
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
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
}

// Export singleton
let storageService: FirebaseStorageService | null = null;

export function getStorageService(): FirebaseStorageService {
  if (!storageService) {
    storageService = new FirebaseStorageService();
  }
  return storageService;
}
