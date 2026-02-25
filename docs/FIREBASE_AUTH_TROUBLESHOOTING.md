# Firebase Auth Troubleshooting Guide

Common issues and solutions for Firebase Authentication services.

## 🔍 Quick Diagnostics

### Check System Status

```bash
# 1. Check if dev server is running
curl http://localhost:3000/api/health

# 2. Test password reset endpoint
node scripts/test-auth-services.js

# 3. Check TypeScript compilation
npx tsc --noEmit

# 4. Check for linting errors
npm run lint
```

## ❌ Common Errors & Solutions

### Error: "User not authenticated"

**Symptoms:**
- Email change fails
- Email verification fails
- 401 Unauthorized response

**Solutions:**
1. User must be logged in
2. Check if `auth.currentUser` exists
3. Verify ID token is valid
4. User may need to log out and log back in

**Code to check:**
```typescript
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

const auth = getAuth(app);
console.log('Current user:', auth.currentUser);
console.log('Is logged in:', !!auth.currentUser);
```

---

### Error: "requires-recent-login"

**Symptoms:**
- Email change fails
- Password update fails
- Error code: `auth/requires-recent-login`

**Why it happens:**
Firebase requires recent authentication for sensitive operations (security feature).

**Solutions:**

**Option 1: Re-authenticate user**
```typescript
import { firebaseAuthService } from '@/lib/firebase-auth-service';

// Re-authenticate first
const reauth = await firebaseAuthService.reauthenticateUser(user, currentPassword);

if (reauth.success) {
  // Now proceed with email change
  const result = await firebaseAuthService.changeEmailWithVerification(user, newEmail);
}
```

**Option 2: Ask user to log out and log back in**
```typescript
// Simple solution
alert('Please log out and log back in, then try again.');
```

---

### Error: "Email not received"

**Symptoms:**
- Password reset email not arriving
- Verification email not arriving
- Email change verification not arriving

**Solutions:**

1. **Check spam folder**
   - Gmail: Check "Promotions" and "Spam"
   - Outlook: Check "Junk Email"

2. **Verify Firebase email settings**
   - Go to Firebase Console
   - Authentication → Templates
   - Check email templates are configured
   - Verify sender email is correct

3. **Check authorized domains**
   - Go to Firebase Console
   - Authentication → Settings
   - Verify your domain is in authorized domains list

4. **Test with different email provider**
   - Try Gmail, Outlook, Yahoo
   - Some providers have strict spam filters

5. **Check Firebase logs**
   - Firebase Console → Authentication → Users
   - Look for error messages

---

### Error: "email-already-in-use"

**Symptoms:**
- Cannot change to new email
- Error code: `auth/email-already-in-use`

**Why it happens:**
The new email is already registered to another account.

**Solutions:**
1. User must choose a different email
2. Or delete the other account first (if it's theirs)
3. Or merge accounts (requires custom logic)

**User message:**
```typescript
if (error.code === 'auth/email-already-in-use') {
  alert('This email is already registered. Please use a different email.');
}
```

---

### Error: "invalid-email"

**Symptoms:**
- Email validation fails
- Error code: `auth/invalid-email`

**Solutions:**
1. Check email format (must contain @)
2. Remove spaces from email
3. Check for special characters

**Validation code:**
```typescript
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

---

### Error: "too-many-requests"

**Symptoms:**
- Operations fail after multiple attempts
- Error code: `auth/too-many-requests`

**Why it happens:**
Firebase rate limiting (security feature).

**Solutions:**
1. Wait 15-30 minutes before trying again
2. Implement rate limiting on client side
3. Show user a cooldown message

**Prevention:**
```typescript
let lastRequestTime = 0;
const COOLDOWN_MS = 60000; // 1 minute

async function sendPasswordResetWithCooldown(email: string) {
  const now = Date.now();
  if (now - lastRequestTime < COOLDOWN_MS) {
    return {
      success: false,
      message: 'Please wait before trying again.'
    };
  }
  
  lastRequestTime = now;
  return await firebaseAuthService.sendPasswordReset(email);
}
```

---

### Error: "network-request-failed"

**Symptoms:**
- All Firebase operations fail
- Error code: `auth/network-request-failed`

**Solutions:**
1. Check internet connection
2. Check if Firebase is down: https://status.firebase.google.com/
3. Verify Firebase config in `.env.local`
4. Check browser console for CORS errors
5. Try different network (mobile hotspot)

---

### Error: "Firebase config incomplete"

**Symptoms:**
- Console warning about missing Firebase config
- Auth operations fail silently

**Solutions:**
1. Check `.env.local` file exists
2. Verify all Firebase variables are set:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
3. Restart dev server after changing `.env.local`
4. Check for typos in variable names

---

### Error: "invalid-action-code"

**Symptoms:**
- Email link doesn't work
- Error when clicking reset/verification link
- Error code: `auth/invalid-action-code`

**Why it happens:**
- Link already used
- Link expired
- Link malformed

**Solutions:**
1. Request a new email
2. Check link wasn't modified
3. Try copying full URL (not clicking)
4. Check action URL in Firebase templates

---

### Error: "weak-password"

**Symptoms:**
- Password update fails
- Error code: `auth/weak-password`

**Why it happens:**
Firebase requires passwords to be at least 6 characters.

**Solutions:**
1. Use password at least 6 characters long
2. Add password strength indicator
3. Show requirements to user

**Password validation:**
```typescript
function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  if (password.length < 8) {
    return { valid: true, message: 'Password is weak. Consider using 8+ characters' };
  }
  return { valid: true, message: 'Password is strong' };
}
```

---

## 🔧 Configuration Issues

### Issue: Pages return 404

**Solutions:**
1. Check file paths are correct
2. Restart dev server
3. Clear `.next` cache: `rm -rf .next`
4. Rebuild: `npm run build`

---

### Issue: API routes return 404

**Solutions:**
1. Verify file structure:
   ```
   src/app/api/auth/
   ├── password-reset/route.ts
   ├── change-email/route.ts
   └── verify-email/route.ts
   ```
2. Check Next.js version supports App Router
3. Restart dev server

---

### Issue: Components not rendering

**Solutions:**
1. Check imports are correct
2. Verify shadcn/ui components exist:
   ```bash
   ls src/components/ui/
   # Should see: button.tsx, input.tsx, card.tsx, alert.tsx
   ```
3. Install missing components:
   ```bash
   npx shadcn-ui@latest add button
   npx shadcn-ui@latest add input
   npx shadcn-ui@latest add card
   npx shadcn-ui@latest add alert
   ```

---

## 🐛 Debugging Tips

### Enable Firebase Debug Logging

```typescript
// In src/lib/firebase.ts
import { setLogLevel } from 'firebase/app';

if (process.env.NODE_ENV === 'development') {
  setLogLevel('debug');
}
```

### Check Firebase Auth State

```typescript
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebase';

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  console.log('Auth state changed:', {
    isLoggedIn: !!user,
    email: user?.email,
    emailVerified: user?.emailVerified,
    uid: user?.uid
  });
});
```

### Test API Endpoints Manually

```bash
# Test password reset
curl -X POST http://localhost:3000/api/auth/password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test with verbose output
curl -v -X POST http://localhost:3000/api/auth/password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Check Browser Console

Open browser DevTools (F12) and check:
1. Console tab for JavaScript errors
2. Network tab for failed requests
3. Application tab for Firebase state

---

## 📊 Monitoring & Logging

### Add Custom Logging

```typescript
// In src/lib/firebase-auth-service.ts

async sendPasswordReset(email: string): Promise<AuthResponse> {
  console.log('[Auth] Sending password reset to:', email);
  
  try {
    await sendPasswordResetEmail(this.auth, email, {...});
    console.log('[Auth] Password reset sent successfully');
    return { success: true, message: '...' };
  } catch (error) {
    console.error('[Auth] Password reset failed:', error);
    return { success: false, message: '...' };
  }
}
```

### Monitor Firebase Usage

1. Go to Firebase Console
2. Authentication → Usage
3. Check:
   - Daily active users
   - Email sends
   - Error rates

---

## 🔐 Security Checklist

If auth isn't working, verify:

- [ ] Firebase project is active
- [ ] Email/Password auth is enabled
- [ ] Authorized domains include your domain
- [ ] API keys are correct in `.env.local`
- [ ] Firebase security rules allow auth operations
- [ ] No CORS issues in browser console
- [ ] HTTPS is used in production

---

## 📞 Getting Help

### Check These First
1. Browser console errors
2. Firebase Console logs
3. Network tab in DevTools
4. This troubleshooting guide

### Firebase Resources
- Status: https://status.firebase.google.com/
- Docs: https://firebase.google.com/docs/auth
- Support: https://firebase.google.com/support

### Project Documentation
- Quick Start: `docs/FIREBASE_AUTH_QUICK_START.md`
- Setup Guide: `docs/FIREBASE_AUTH_SETUP.md`
- Architecture: `docs/FIREBASE_AUTH_ARCHITECTURE.md`

---

## ✅ Verification Checklist

Before asking for help, verify:

- [ ] Dev server is running
- [ ] Firebase config is complete
- [ ] Email/Password auth is enabled in Firebase
- [ ] Authorized domains are configured
- [ ] Email templates are set up
- [ ] Browser console shows no errors
- [ ] Network requests are successful
- [ ] User is logged in (for protected operations)
- [ ] Tried in incognito/private mode
- [ ] Tried different browser
- [ ] Checked spam folder for emails

---

**Still stuck?** Check the full documentation or create an issue with:
1. Error message
2. Browser console output
3. Network tab screenshot
4. Steps to reproduce
