/**
 * Memory Extraction API Endpoint
 * STEP 7: Extract and store memories after conversations
 * 
 * This endpoint is called asynchronously after sending the response to the user
 * to avoid blocking the conversation flow.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMemoryExtractionService } from '@/lib/memory-extraction-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userMessage, assistantResponse, userId } = body;

    // Validate input
    if (!userMessage || !assistantResponse || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: userMessage, assistantResponse, userId' },
        { status: 400 }
      );
    }

    // Check if memory extraction is enabled
    const memoryService = getMemoryExtractionService();
    if (!memoryService.isEnabled()) {
      // Return success when disabled (not an error)
      return NextResponse.json(
        { 
          success: true,
          message: 'Memory extraction is disabled', 
          extracted: 0 
        },
        { status: 200 }
      );
    }

    // Extract and store memories
    const extractedCount = await memoryService.extractAndStore({
      userMessage,
      assistantResponse,
      userId,
    });

    return NextResponse.json({
      success: true,
      extracted: extractedCount,
      message: `Extracted and stored ${extractedCount} memories`,
    });
  } catch (error) {
    console.error('[Memory Extraction API] Error:', error);
    
    // Return success with 0 extracted instead of error
    // This prevents blocking the chat flow
    return NextResponse.json(
      {
        success: true,
        extracted: 0,
        message: 'Memory extraction skipped due to error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    );
  }
}
