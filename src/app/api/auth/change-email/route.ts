import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase/auth';
import { getServerApp } from '@/lib/firebase-server';
import { getFirebaseAuthService } from '@/lib/firebase-auth-service-server';

export async function POST(request: NextRequest) {
  try {
    const { newEmail, idToken } = await request.json();

    if (!newEmail || !idToken) {
      return NextResponse.json(
        { success: false, message: 'Email and authentication token are required' },
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
    const result = await authService.changeEmail(user, newEmail, idToken);

    return NextResponse.json(result, { 
      status: result.success ? 200 : 400 
    });
  } catch (error) {
    console.error('Email change error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process email change request' 
      },
      { status: 500 }
    );
  }
}
