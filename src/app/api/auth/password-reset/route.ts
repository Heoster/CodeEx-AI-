import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAuthService } from '@/lib/firebase-auth-service-server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const authService = getFirebaseAuthService();
    const result = await authService.sendPasswordReset(email);

    return NextResponse.json(result, { 
      status: result.success ? 200 : 400 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process password reset request' 
      },
      { status: 500 }
    );
  }
}
