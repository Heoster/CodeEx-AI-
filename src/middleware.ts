import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rate Limiting Middleware
 * Prevents API abuse by limiting requests per IP address
 */

// Simple in-memory rate limiter (use Redis in production for multi-instance deployments)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 20; // requests per window
const WINDOW_MS = 60000; // 1 minute

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
  // Only rate limit AI API routes
  if (!request.nextUrl.pathname.startsWith('/api/ai')) {
    return NextResponse.next();
  }

  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    // Create new rate limit window
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return NextResponse.next();
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    // Rate limit exceeded
    return NextResponse.json(
      { 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((userLimit.resetTime - now) / 1000),
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((userLimit.resetTime - now) / 1000)),
        },
      }
    );
  }
  
  // Increment counter
  userLimit.count++;
  return NextResponse.next();
}

export const config = {
  matcher: '/api/ai/:path*',
};
