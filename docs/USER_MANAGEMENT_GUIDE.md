# User Management Guide

## Overview

CODEEX AI provides comprehensive user management features including authentication, profile management, and security settings.

## Features

### 1. Authentication

#### Sign In Methods
- **Email/Password**: Traditional email and password authentication
- **Google Sign-In**: Quick authentication using Google account
- **Password Reset**: Available directly from the login page

#### Password Reset Flow
1. Click "Forgot your password?" on the login page
2. Enter your email address
3. Receive a password reset link via email
4. Click the link to create a new password
5. Sign in with your new password

### 2. Profile Management

Access user management at `/user-management` after signing in.

#### Available Tabs

##### Profile Tab
- **Display Name**: Update your display name shown in chats
- **Email Address**: Change your email (requires password verification)
- **Account Information**: View user ID, provider, and account age

##### Security Tab
- **Change Password**: Update your password (requires current password verification)
- **Account Security Status**: View email verification and password protection status

##### Preferences Tab
- **Theme Settings**: Customize visual experience
- **AI Model Selection**: Choose preferred AI model
- **Voice Settings**: Configure text-to-speech options
- **Notifications**: Manage notification preferences (coming soon)
- **Language**: Choose preferred language

##### Quick Links Tab
- Documentation & Help
- Legal & Policies
- App Settings
- Data Management

##### Danger Zone Tab
- **Delete Account**: Permanently delete your account and all data

### 3. Security Features

#### Re-authentication
For sensitive operations (email change, password change), the system requires re-authentication:
1. Enter your current password
2. System verifies your identity
3. Proceed with the requested change

This prevents unauthorized changes if someone gains temporary access to your device.

#### Email Verification
- New email addresses require verification
- Verification emails are sent automatically
- Check your inbox and spam folder

### 4. Password Requirements

- Minimum 6 characters
- Must match confirmation when changing
- Current password required for changes

### 5. Email Change Process

1. Navigate to User Management → Profile tab
2. Enter new email address
3. Click "Update" button
4. Enter current password for verification
5. Receive verification email at new address
6. Click verification link to complete change

### 6. Password Change Process

1. Navigate to User Management → Security tab
2. Enter new password (min 6 characters)
3. Confirm new password
4. Click "Update Password"
5. Enter current password for verification
6. Password updated successfully

### 7. Account Deletion

⚠️ **Warning**: This action is irreversible!

1. Navigate to User Management → Danger Zone tab
2. Click "Delete My Account"
3. Type "DELETE" to confirm
4. All data will be permanently deleted

## Provider-Specific Features

### Email/Password Accounts
- Full access to all features
- Can change email and password
- Password reset available

### Google Sign-In Accounts
- Cannot change email (managed by Google)
- Cannot change password (managed by Google)
- Can update display name and preferences

## Troubleshooting

### "Please sign out and sign in again"
This error occurs when your session is too old for sensitive operations. Simply:
1. Sign out
2. Sign in again
3. Retry the operation

### Email Not Received
- Check spam/junk folder
- Verify email address is correct
- Wait a few minutes for delivery
- Contact support if issue persists

### Password Reset Not Working
- Ensure you're using the correct email
- Check spam folder for reset email
- Contact support at codeex@email.com

## Best Practices

1. **Use Strong Passwords**: Minimum 6 characters, mix of letters, numbers, and symbols
2. **Verify Email**: Complete email verification for account recovery
3. **Regular Updates**: Update password periodically for security
4. **Secure Sign Out**: Always sign out on shared devices

## Support

Need help? Contact us at:
- Email: codeex@email.com
- Documentation: `/documentation`
- FAQ: `/documentation/faq`

## API Integration

For developers integrating with CODEEX AI:

### Firebase Auth Service
Located at `src/lib/firebase-auth-service.ts`

Available methods:
- `sendPasswordReset(email)`: Send password reset email
- `changeEmailWithVerification(user, newEmail)`: Change email with verification
- `updateUserPassword(user, newPassword)`: Update password
- `reauthenticateUser(user, password)`: Re-authenticate for sensitive operations
- `sendVerificationEmail(user)`: Send email verification

### Example Usage

```typescript
import { firebaseAuthService } from '@/lib/firebase-auth-service';
import { getAuth } from 'firebase/auth';

// Send password reset
const result = await firebaseAuthService.sendPasswordReset('user@example.com');
if (result.success) {
  console.log('Reset email sent');
}

// Change password (requires re-authentication first)
const auth = getAuth();
const user = auth.currentUser;

if (user) {
  // Re-authenticate
  const reauthResult = await firebaseAuthService.reauthenticateUser(user, 'currentPassword');
  
  if (reauthResult.success) {
    // Update password
    const updateResult = await firebaseAuthService.updateUserPassword(user, 'newPassword');
    console.log(updateResult.message);
  }
}
```

## Security Considerations

1. **Password Storage**: Passwords are never stored in plain text
2. **Re-authentication**: Required for sensitive operations
3. **Email Verification**: Ensures account ownership
4. **Session Management**: Automatic timeout for inactive sessions
5. **Provider Security**: Google Sign-In uses OAuth 2.0

## Updates and Changelog

### Latest Updates
- ✅ Added re-authentication for email/password changes
- ✅ Improved password reset flow from login page
- ✅ Enhanced security with current password verification
- ✅ Added provider-specific feature detection
- ✅ Improved error messages and user feedback

---

**Last Updated**: February 2026
**Version**: 3.3
