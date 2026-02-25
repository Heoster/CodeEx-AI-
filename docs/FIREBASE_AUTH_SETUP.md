# Firebase Authentication Services Setup

Complete guide for password reset and email change functionality using Firebase Auth.

## Features Implemented

✅ Password Reset via Email
✅ Email Address Change with Verification
✅ Email Verification
✅ Re-authentication for Sensitive Operations
✅ User-friendly Error Handling
✅ Responsive UI Components

## File Structure

```
src/
├── lib/
│   ├── firebase-auth-service.ts          # Core auth service
│   └── firebase.ts                        # Firebase config
├── components/
│   └── auth/
│       ├── change-email-form.tsx          # Email change UI
│       └── password-reset-form.tsx        # Password reset UI
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── password-reset/route.ts    # Password reset API
│   │       ├── change-email/route.ts      # Email change API
│   │       └── verify-email/route.ts      # Email verification API
│   ├── reset-password/page.tsx            # Password reset page
│   └── account-settings/page.tsx          # Account settings page
```

## Services Available

### 1. FirebaseAuthService Class

Located in `src/lib/firebase-auth-service.ts`

#### Methods:

- `sendPasswordReset(email: string)` - Sends password reset email
- `changeEmailWithVerification(user: User, newEmail: string)` - Changes email with verification
- `updateEmailDirect(user: User, newEmail: string)` - Direct email update (requires recent auth)
- `updateUserPassword(user: User, newPassword: string)` - Updates password
- `reauthenticateUser(user: User, password: string)` - Re-authenticates user
- `sendVerificationEmail(user: User)` - Sends email verification

### 2. API Routes

#### POST /api/auth/password-reset
```typescript
// Request
{
  "email": "user@example.com"
}

// Response
{
  "success": true,
  "message": "Password reset email sent successfully."
}
```

#### POST /api/auth/change-email
```typescript
// Request
{
  "newEmail": "newemail@example.com",
  "idToken": "firebase-id-token"
}

// Response
{
  "success": true,
  "message": "Verification email sent to new address."
}
```

#### POST /api/auth/verify-email
```typescript
// Request
{
  "idToken": "firebase-id-token"
}

// Response
{
  "success": true,
  "message": "Verification email sent."
}
```

## Usage Examples

### 1. Password Reset

```typescript
import { firebaseAuthService } from '@/lib/firebase-auth-service';

const result = await firebaseAuthService.sendPasswordReset('user@example.com');
if (result.success) {
  console.log('Reset email sent!');
}
```

### 2. Change Email

```typescript
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { firebaseAuthService } from '@/lib/firebase-auth-service';

const auth = getAuth(app);
const user = auth.currentUser;

if (user) {
  const result = await firebaseAuthService.changeEmailWithVerification(
    user, 
    'newemail@example.com'
  );
  if (result.success) {
    console.log('Verification email sent!');
  }
}
```

### 3. Send Email Verification

```typescript
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { firebaseAuthService } from '@/lib/firebase-auth-service';

const auth = getAuth(app);
const user = auth.currentUser;

if (user && !user.emailVerified) {
  const result = await firebaseAuthService.sendVerificationEmail(user);
  if (result.success) {
    console.log('Verification email sent!');
  }
}
```

## Firebase Console Configuration

### 1. Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Email/Password** provider

### 2. Configure Email Templates

1. Go to **Authentication** > **Templates**
2. Customize templates for:
   - Password reset
   - Email address change
   - Email verification

### 3. Set Action URL

In email templates, set the action URL to:
- Development: `http://localhost:3000`
- Production: Your production URL (e.g., `https://codeex-ai.netlify.app`)

### 4. Configure Authorized Domains

1. Go to **Authentication** > **Settings**
2. Add authorized domains:
   - `localhost` (for development)
   - Your production domain

## Environment Variables

Ensure these are set in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Pages

### 1. Password Reset Page
URL: `/reset-password`

Standalone page for users who forgot their password.

### 2. Account Settings Page
URL: `/account-settings`

Comprehensive account management page with:
- Email verification status
- Change email form
- Password reset link
- Account information

## Security Features

### 1. Re-authentication Required

For sensitive operations (email/password change), Firebase requires recent authentication:

```typescript
// Re-authenticate before sensitive operations
const result = await firebaseAuthService.reauthenticateUser(user, currentPassword);
if (result.success) {
  // Proceed with email/password change
}
```

### 2. Email Verification

Email changes require verification at the new address before taking effect:

```typescript
// Sends verification email to new address
await firebaseAuthService.changeEmailWithVerification(user, newEmail);
// User must click link in email to complete change
```

### 3. Error Handling

All methods return standardized responses:

```typescript
interface AuthResponse {
  success: boolean;
  message: string;
}
```

User-friendly error messages for:
- Invalid email
- User not found
- Too many requests
- Network errors
- Expired codes
- And more...

## Testing

### 1. Test Password Reset

```bash
# Using curl
curl -X POST http://localhost:3000/api/auth/password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 2. Test Email Change

```bash
# Get user token first, then:
curl -X POST http://localhost:3000/api/auth/change-email \
  -H "Content-Type: application/json" \
  -d '{"newEmail":"new@example.com","idToken":"your-token"}'
```

## Common Issues & Solutions

### Issue: "requires-recent-login" Error

**Solution:** User needs to re-authenticate before changing email/password:

```typescript
// Re-authenticate first
await firebaseAuthService.reauthenticateUser(user, password);
// Then proceed with change
await firebaseAuthService.changeEmailWithVerification(user, newEmail);
```

### Issue: Email Not Received

**Solutions:**
1. Check spam folder
2. Verify email provider settings in Firebase Console
3. Check authorized domains
4. Verify action URL in email templates

### Issue: "email-already-in-use" Error

**Solution:** The new email is already registered. User must use a different email.

## Best Practices

1. **Always verify email addresses** before allowing sensitive operations
2. **Require re-authentication** for email/password changes
3. **Use HTTPS in production** for secure token transmission
4. **Rate limit** password reset requests to prevent abuse
5. **Log security events** for audit trails
6. **Provide clear feedback** to users about email verification status

## Integration with Existing Code

The service integrates seamlessly with your existing Firebase setup:

```typescript
// Your existing firebase.ts
import { app } from '@/lib/firebase';

// New auth service
import { firebaseAuthService } from '@/lib/firebase-auth-service';

// Use together
const auth = getAuth(app);
const user = auth.currentUser;
if (user) {
  await firebaseAuthService.sendPasswordReset(user.email);
}
```

## Next Steps

1. ✅ Services implemented
2. ✅ API routes created
3. ✅ UI components built
4. ✅ Pages created
5. 🔲 Configure Firebase email templates
6. 🔲 Test in development
7. 🔲 Deploy to production
8. 🔲 Add to navigation menu

## Support

For issues or questions:
- Check Firebase Console logs
- Review browser console for errors
- Verify environment variables
- Check Firebase Auth documentation: https://firebase.google.com/docs/auth

---

**Created:** February 2026
**Version:** 1.0.0
