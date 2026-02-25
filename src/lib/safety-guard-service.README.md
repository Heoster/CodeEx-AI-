# Safety Guard Service

The Safety Guard Service provides dual-layer safety checking using Groq's Llama Guard 4 12B model for input and output validation. It ensures all user inputs and AI-generated outputs are validated for safety before processing or returning to users.

## Features

- **Dual-Layer Protection**: Validates both user inputs and AI model outputs
- **7 Safety Categories**: Detects HATE_SPEECH, VIOLENCE, SEXUAL_CONTENT, SELF_HARM, DANGEROUS_CONTENT, HARASSMENT, and ILLEGAL_ACTIVITY
- **Confidence Scoring**: Provides 0-1 confidence scores for each safety check
- **Severity Levels**: Assigns LOW, MEDIUM, HIGH, or CRITICAL severity to violations
- **Violation Tracking**: Maintains per-user violation history
- **Feature Flag Support**: Can be disabled via `ENABLE_SAFETY_GUARD` environment variable
- **Fail-Open Design**: Allows content on API errors to prevent service disruption

## Requirements

This implementation satisfies the following requirements from the CODEEX V3.3 spec:

- **Requirement 2.1**: Validate user input using Llama Guard 4 12B
- **Requirement 2.2**: Reject unsafe input immediately
- **Requirement 2.3**: Provide specific violation category
- **Requirement 2.4**: Check all 7 safety categories
- **Requirement 2.5**: Validate model output before returning to user
- **Requirement 2.6**: Reject unsafe output
- **Requirement 2.7**: Assign confidence score (0-1) to each check
- **Requirement 2.8**: Assign severity level to each violation
- **Requirement 2.9**: Track violation history per user
- **Requirement 2.10**: Support feature flag bypass

## Installation

The service is already integrated into the CODEEX V3.3 system. No additional installation is required.

## Configuration

### Environment Variables

```bash
# Enable or disable safety guard (default: true)
ENABLE_SAFETY_GUARD=true

# Groq API key (required for safety checks)
GROQ_API_KEY=your_groq_api_key_here
```

### Feature Flag

The safety guard can be disabled by setting `ENABLE_SAFETY_GUARD=false` in your environment variables. When disabled, all safety checks are bypassed and content is allowed through.

## Usage

### Basic Input Validation

```typescript
import { getSafetyGuardService } from '@/lib/safety-guard-service';

const safetyGuard = getSafetyGuardService();

// Check user input
const result = await safetyGuard.checkInput({
  content: 'User message to check',
  type: 'INPUT',
  userId: 'user123', // Optional: for violation tracking
});

if (!result.isSafe) {
  console.log('Unsafe content detected!');
  console.log('Category:', result.category);
  console.log('Violations:', result.violations);
  console.log('Confidence:', result.confidence);
}
```

### Output Validation

```typescript
// Check AI model output
const result = await safetyGuard.checkOutput({
  content: 'AI-generated response to check',
  type: 'OUTPUT',
  userId: 'user123',
});

if (!result.isSafe) {
  // Replace with safe fallback response
  return 'I apologize, but I cannot provide that response.';
}
```

### With Context

```typescript
// Provide conversation context for better accuracy
const result = await safetyGuard.checkInput({
  content: 'Current message',
  type: 'INPUT',
  context: 'Previous conversation context...',
  userId: 'user123',
});
```

### Violation History

```typescript
// Get user's violation history
const history = safetyGuard.getViolationHistory('user123');

console.log('Total violations:', history.length);
history.forEach(violation => {
  console.log(`- ${violation.type}: ${violation.description} (${violation.severity})`);
});
```

### Complete Request Flow

```typescript
import { processUserRequest } from '@/lib/safety-guard-service.example';

const result = await processUserRequest(
  'User message',
  'user123',
  async (message) => {
    // Your AI model generation logic here
    return 'AI response';
  }
);

if (result.success) {
  console.log('Safe response:', result.response);
} else {
  console.log('Safety violation:', result.error);
}
```

## API Reference

### SafetyGuardService

#### Methods

##### `checkInput(request: SafetyCheckRequest): Promise<SafetyCheckResult>`

Validates user input for safety violations.

**Parameters:**
- `request.content` (string): The content to check
- `request.type` (string): Must be 'INPUT'
- `request.context` (string, optional): Additional context for better accuracy
- `request.userId` (string, optional): User ID for violation tracking

**Returns:** `SafetyCheckResult` with safety status, violations, and confidence score

##### `checkOutput(request: SafetyCheckRequest): Promise<SafetyCheckResult>`

Validates AI model output for safety violations.

**Parameters:**
- `request.content` (string): The content to check
- `request.type` (string): Must be 'OUTPUT'
- `request.context` (string, optional): Additional context
- `request.userId` (string, optional): User ID for violation tracking

**Returns:** `SafetyCheckResult` with safety status, violations, and confidence score

##### `isEnabled(): boolean`

Check if the safety guard is enabled.

**Returns:** `true` if enabled, `false` if disabled via feature flag

##### `getViolationHistory(userId: string): SafetyViolation[]`

Get violation history for a specific user.

**Parameters:**
- `userId` (string): The user ID to query

**Returns:** Array of `SafetyViolation` objects

### Types

#### SafetyCheckRequest

```typescript
interface SafetyCheckRequest {
  content: string;
  type: 'INPUT' | 'OUTPUT';
  context?: string;
  userId?: string;
}
```

#### SafetyCheckResult

```typescript
interface SafetyCheckResult {
  isSafe: boolean;
  violations: SafetyViolation[];
  confidence: number; // 0-1 range
  category?: SafetyCategory;
}
```

#### SafetyViolation

```typescript
interface SafetyViolation {
  type: SafetyCategory;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}
```

#### SafetyCategory

```typescript
type SafetyCategory = 
  | 'HATE_SPEECH'
  | 'VIOLENCE'
  | 'SEXUAL_CONTENT'
  | 'SELF_HARM'
  | 'DANGEROUS_CONTENT'
  | 'HARASSMENT'
  | 'ILLEGAL_ACTIVITY';
```

## Safety Categories

The service checks for the following 7 categories based on the MLCommons Taxonomy:

1. **HATE_SPEECH**: Content promoting hatred or discrimination based on protected characteristics
2. **VIOLENCE**: Content depicting, glorifying, or encouraging violence or harm
3. **SEXUAL_CONTENT**: Explicit sexual content or sexual exploitation
4. **SELF_HARM**: Content encouraging or depicting self-harm or suicide
5. **DANGEROUS_CONTENT**: Instructions for dangerous activities or harmful substances
6. **HARASSMENT**: Content intended to harass, bully, or intimidate
7. **ILLEGAL_ACTIVITY**: Content promoting or facilitating illegal activities

## Severity Levels

Each violation is assigned a severity level:

- **LOW**: Minor policy violations with minimal harm potential
- **MEDIUM**: Moderate violations requiring attention
- **HIGH**: Serious violations with significant harm potential
- **CRITICAL**: Severe violations requiring immediate action

## Error Handling

The service implements a **fail-open** design for reliability:

- If the Groq API is unavailable, content is allowed through
- If the API key is missing, safety checks are bypassed
- If network errors occur, content is allowed through
- All errors are logged for monitoring

This ensures that temporary API issues don't disrupt the user experience while still providing safety protection when the service is available.

## Performance

- **Timeout**: 5 seconds per safety check
- **Model**: Llama Guard 4 12B via Groq API
- **Rate Limits**: 30 requests/minute, 14,400 requests/day (Groq free tier)
- **Latency**: Typically <500ms per check

## Testing

Run the test suite:

```bash
npm test -- src/lib/safety-guard-service.test.ts
```

The test suite includes:
- Singleton pattern verification
- Feature flag functionality
- Input/output validation
- Violation history tracking
- Error handling scenarios
- Response parsing
- Confidence scoring

## Integration with Router

The Safety Guard Service is integrated into the CODEEX V3.3 router pipeline:

1. **Input Validation**: User requests are checked before classification
2. **Output Validation**: AI responses are checked before returning to user
3. **Violation Tracking**: Per-user violation history is maintained
4. **Graceful Degradation**: System continues to function if safety checks fail

## Monitoring

The service logs all safety-related events:

- Unsafe content detections
- Violation categories and severity
- API errors and timeouts
- Feature flag status changes

Monitor these logs to:
- Track safety violation patterns
- Identify potential abuse
- Optimize safety thresholds
- Ensure API availability

## Best Practices

1. **Always check both input and output**: Validate user inputs before processing and AI outputs before returning
2. **Provide context when available**: Include conversation history for better accuracy
3. **Track violations per user**: Use userId parameter to identify patterns
4. **Handle violations gracefully**: Provide helpful error messages to users
5. **Monitor violation rates**: Track and analyze safety metrics
6. **Test with edge cases**: Verify behavior with borderline content
7. **Respect feature flags**: Allow administrators to disable when needed

## Limitations

- **Language Support**: Optimized for English, may have reduced accuracy in other languages
- **Context Window**: 8,192 tokens maximum per check
- **Rate Limits**: Subject to Groq free tier limits (30 RPM, 14,400 RPD)
- **Multimodal**: Currently text-only (image support planned for future)

## Future Enhancements

- Multimodal support (text + images)
- Custom safety categories
- Adjustable severity thresholds
- Batch safety checking
- Caching for repeated content
- Integration with other safety models

## Support

For issues or questions:
- Check the test suite for usage examples
- Review the example file for integration patterns
- Consult the CODEEX V3.3 design document
- Contact the development team

## License

Part of the CODEEX V3.3 Multi-Model AI Router system.
