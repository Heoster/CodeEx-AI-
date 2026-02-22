/**
 * API Error Handler
 * Centralized error handling for API routes
 */

import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
}

/**
 * Handle API errors and return appropriate response
 */
export function handleAPIError(error: unknown): NextResponse<ErrorResponse> {
  console.error('[API Error]', error);

  // Handle known APIError
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString(),
      },
      { status: error.statusCode }
    );
  }

  // Handle standard Error
  if (error instanceof Error) {
    // Don't expose internal error messages in production
    const message =
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'An unexpected error occurred';

    return NextResponse.json(
      {
        error: message,
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}

/**
 * Validate required fields in request body
 */
export function validateRequired(
  data: any,
  fields: string[]
): { valid: boolean; missing?: string[] } {
  const missing = fields.filter((field) => !data[field]);

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}

/**
 * Common API error responses
 */
export const APIErrors = {
  UNAUTHORIZED: new APIError('Unauthorized', 401, 'UNAUTHORIZED'),
  FORBIDDEN: new APIError('Forbidden', 403, 'FORBIDDEN'),
  NOT_FOUND: new APIError('Resource not found', 404, 'NOT_FOUND'),
  BAD_REQUEST: (message: string) => new APIError(message, 400, 'BAD_REQUEST'),
  VALIDATION_ERROR: (details: any) =>
    new APIError('Validation failed', 400, 'VALIDATION_ERROR', details),
  RATE_LIMIT: new APIError('Rate limit exceeded', 429, 'RATE_LIMIT'),
  INTERNAL_ERROR: new APIError('Internal server error', 500, 'INTERNAL_ERROR'),
  SERVICE_UNAVAILABLE: new APIError(
    'Service temporarily unavailable',
    503,
    'SERVICE_UNAVAILABLE'
  ),
};

/**
 * Wrap async API handler with error handling
 */
export function withErrorHandler<T>(
  handler: () => Promise<NextResponse<T>>
): Promise<NextResponse<T | ErrorResponse>> {
  return handler().catch((error) => handleAPIError(error));
}

/**
 * Log API request for monitoring
 */
export function logAPIRequest(
  method: string,
  path: string,
  duration: number,
  status: number
) {
  const log = {
    method,
    path,
    duration: `${duration}ms`,
    status,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[API Request]', log);
  }

  // TODO: Send to monitoring service in production
}
