import { NextRequest, NextResponse } from 'next/server';
import { UserProfileService } from '@/lib/user-profile-service';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({ message: 'OK' }, { status: 200, headers: corsHeaders });
}

/**
 * GET /api/profile?userId=xxx
 * Get user profile
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const profile = await UserProfileService.getProfile(userId);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({ profile }, { headers: corsHeaders });
  } catch (error) {
    console.error('[Profile API] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * POST /api/profile
 * Create or update user profile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, communicationStyle, preferences } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    let profile = await UserProfileService.getProfile(userId);

    if (!profile) {
      profile = {
        userId,
        communicationStyle,
        preferences,
        memories: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      if (communicationStyle) profile.communicationStyle = communicationStyle;
      if (preferences) profile.preferences = { ...profile.preferences, ...preferences };
    }

    const updatedProfile = await UserProfileService.upsertProfile(profile);

    return NextResponse.json(
      { success: true, profile: updatedProfile },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('[Profile API] POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * DELETE /api/profile?userId=xxx&action=clearMemories|deleteProfile
 * Clear memories or delete profile
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (action === 'clearMemories') {
      await UserProfileService.clearMemories(userId);
      return NextResponse.json(
        { success: true, message: 'Memories cleared' },
        { headers: corsHeaders }
      );
    } else if (action === 'deleteProfile') {
      await UserProfileService.deleteProfile(userId);
      return NextResponse.json(
        { success: true, message: 'Profile deleted' },
        { headers: corsHeaders }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use clearMemories or deleteProfile' },
        { status: 400, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('[Profile API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
