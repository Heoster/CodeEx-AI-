/**
 * Storage Cleanup API
 * Cleans up old uploaded files from local storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStorageService } from '@/lib/local-storage-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Verify authorization (optional - add your own auth logic)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.STORAGE_CLEANUP_TOKEN || 'cleanup-secret-token';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get max age from query params (default: 24 hours)
    const { searchParams } = new URL(request.url);
    const maxAgeHours = parseInt(searchParams.get('maxAge') || '24', 10);
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;

    // Clean up old files
    const storageService = getStorageService();
    const deletedCount = await storageService.cleanupOldFiles(maxAgeMs);

    // Get storage stats
    const stats = await storageService.getStats();

    return NextResponse.json({
      success: true,
      deletedCount,
      stats,
      message: `Cleaned up ${deletedCount} files older than ${maxAgeHours} hours`,
    });
  } catch (error) {
    console.error('[Storage Cleanup] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check storage stats
export async function GET() {
  try {
    const storageService = getStorageService();
    const stats = await storageService.getStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('[Storage Stats] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to get stats',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
