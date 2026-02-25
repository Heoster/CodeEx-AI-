# Firebase Auth Quick Start Guide

Get password reset and email change working in 5 minutes.

## ✅ What's Already Done

All code is implemented! You just need to configure Firebase.

## 🚀 Quick Setup (5 Steps)

### Step 1: Enable Email/Password Auth in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Authentication** → **Sign-in method**
4. Click **Email/Password** → Enable → Save

### Step 2: Configure Email Templates

1. In Firebase Console, go to **Authentication** → **Templates**
2. Click each template and customize:

**Password Reset Template:**
- Subject: `Reset your password for CodeEx AI`
- Click **Customize action URL**
- Set to: `https://codeex-ai.netlify.app` (or your domain)

**Email Address Change Template:**
- Subject: `Verify your new email for CodeEx AI`
- Click **Customize action URL**
- Set to: `https://codeex-ai.netlify.app`

**Email Verification Template:**
- Subject: `Verify your email for CodeEx AI`
- Click **Customize action URL**
- Set to: `https://codeex-ai.netlify.app`

### Step 3: Add Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings**
2. Scroll to **Authorized domains**
3. Add your domains:
   - `localhost` (already there)
   - `codeex-ai.netlify.app` (or your domain)

### Step 4: Test Locally

```bash
# Start your dev server
npm run dev

# Visit these pages:
# 1. Password Reset: http://localhost:3000/reset-password
# 2. Account Settings: http://localhost:3000/account-settings
```

### Step 5: Test the Features

**Test Password Reset:**
1. Go to `/reset-password`
2. Enter your email
3. Click "Send Reset Link"
4. Check your email inbox
5. Click the link to reset password

**Test Email Change:**
1. Log in to your account
2. Go to `/account-settings`
3. Enter new email in "Change Email Address" section
4. Click "Change Email"
5. Check new email inbox for verification link
6. Click link to complete change

## 📱 Available Pages

| Page | URL | Description |
|------|-----|-------------|
| Password Reset | `/reset-password` | Standalone password reset page |
| Account Settings | `/account-settings` | Full account management |

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/password-reset` | POST | Send password reset email |
| `/api/auth/change-email` | POST | Change email with verification |
| `/api/auth/verify-email` | POST | Send email verification |

## 💻 Usage in Your Code

### Send Password Reset

```typescript
const response = await fetch('/api/auth/password-reset', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
});

const result = await response.json();
console.log(result.message);
```

### Change Email

```typescript
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

const auth = getAuth(app);
const user = auth.currentUser;
const idToken = await user.getIdToken();

const response = await fetch('/api/auth/change-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    newEmail: 'new@example.com',
    idToken 
  })
});

const result = await response.json();
console.log(result.message);
```

## 🎨 Add to Navigation

Add links to your navigation menu:

```tsx
<Link href="/account-settings">Account Settings</Link>
<Link href="/reset-password">Reset Password</Link>
```

## 🐛 Troubleshooting

### Email not received?
- Check spam folder
- Verify email templates are configured
- Check authorized domains include your domain

### "requires-recent-login" error?
- User needs to log out and log back in
- Or implement re-authentication flow

### "email-already-in-use" error?
- The new email is already registered
- User must choose a different email

## 📚 Full Documentation

See `docs/FIREBASE_AUTH_SETUP.md` for complete documentation.

## ✨ Features Included

- ✅ Password reset via email
- ✅ Email change with verification
- ✅ Email verification status
- ✅ User-friendly error messages
- ✅ Loading states
- ✅ Success/error alerts
- ✅ Responsive design
- ✅ Security best practices

## 🎉 You're Done!

Your Firebase Auth services are ready to use. Just configure Firebase Console and test!
