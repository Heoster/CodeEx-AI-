import { NextResponse } from 'next/server';
import { resetModelRegistry } from '@/lib/model-registry';

/**
 * Model Registry Refresh Endpoint
 * Allows refreshing the model registry cache without restarting the app
 * Useful after updating API keys or model configurations
 */

export async function POST() {
  try {
    // Reset the model registry to reload configurations
    resetModelRegistry();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Model registry refreshed successfully. All model configurations have been reloaded.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        message: 'Failed to refresh model registry',
      }, 
      { status: 500 }
    );
  }
}

// Also support GET for easy testing
export async function GET() {
  return NextResponse.json({
    message: 'Model registry refresh endpoint. Use POST to refresh.',
    usage: 'POST /api/admin/refresh-models',
  });
}
