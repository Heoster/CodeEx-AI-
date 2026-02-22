import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for logging API errors and adding CORS headers
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log API requests for debugging
  if (pathname.startsWith('/api/')) {
    console.log(`[${new Date().toISOString()}] ${request.method} ${pathname}`);
  }

  // Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Allow requests from your domains
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'http://localhost:3000',
      'https://codeex-ai.netlify.app',
      'https://codeex-ai.vercel.app',
    ];
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
