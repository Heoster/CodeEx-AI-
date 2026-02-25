import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';
import { getServerApp } from '@/lib/firebase-server';
import { getFirebaseAuthService } from '@/lib/firebase-auth-service-server';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication token is required' },
        { status: 400 }
      );
    }

    // Verify the user is authenticated
    const auth = getAuth(getServerApp());
    const user = auth.currentUser;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const authService = getFirebaseAuthService();
    const result = await authService.sendVerificationEmail(user);

    return NextResponse.json(result, { 
      status: result.success ? 200 : 400 
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send verification email' 
      },
      { status: 500 }
    );
  }
}
