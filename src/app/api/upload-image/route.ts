/**
 * Image Upload API
 * Handles image uploads from camera or file picker
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStorageService } from '@/lib/local-storage-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const autoDelete = formData.get('autoDelete') === 'true';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 20MB)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 20MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Local Storage
    try {
      const storageService = getStorageService();
      const result = await storageService.uploadFile(buffer, {
        userId,
        type: 'user-image',
        autoDelete,
        deleteAfterMs: 3600000, // 1 hour
      });

      return NextResponse.json({
        success: true,
        url: result.url,
        path: result.path,
        size: result.size,
      });
    } catch (storageError) {
      console.error('Local storage error:', storageError);
      
      // Check if it's a storage configuration issue
      if (storageError instanceof Error && storageError.message.includes('ENOENT')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Storage directory not accessible. Please check server configuration.' 
          },
          { status: 500 }
        );
      }
      
      throw storageError;
    }
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    );
  }
}
