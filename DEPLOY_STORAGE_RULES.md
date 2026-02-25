# 🚀 Deploy Firebase Storage Rules

## Quick Guide

Your Firebase Storage rules have been updated to support SOHAM image uploads. You need to deploy them to Firebase.

---

## Option 1: Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `codeex-ai-v3`
3. Click **Storage** in left sidebar
4. Click **Rules** tab
5. Copy the contents of `storage.rules` file
6. Paste into the editor
7. Click **Publish**

---

## Option 2: Firebase CLI (Recommended)

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

### Step 3: Initialize Firebase (if not already done)

```bash
firebase init
```

Select:
- ✅ Storage
- Choose existing project: `codeex-ai-v3`
- Use `storage.rules` as the rules file

### Step 4: Deploy Storage Rules

```bash
firebase deploy --only storage
```

You should see:
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/codeex-ai-v3/overview
```

---

## Verify Deployment

### Test Image Upload

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000/chat

3. Click the 📷 (image upload) button

4. Upload an image

5. Should see success message: "Image uploaded - Your image is ready to analyze"

### Check Console

Open browser DevTools → Console

Before deployment:
```
❌ Firebase Storage: An unknown error occurred
❌ storage/unknown
```

After deployment:
```
✅ No errors
✅ Image uploaded successfully
```

---

## What Changed in Storage Rules

### Added SOHAM Paths

```javascript
// User uploaded images (camera/file picker)
match /user-image/{userId}/{fileName} {
  allow read: if isOwner(userId);
  allow write: if isOwner(userId) && isValidImageSize() && isImage();
  allow delete: if isOwner(userId);
}

// Generated images (from AI)
match /generated-image/{userId}/{fileName} { ... }

// Generated videos (from AI)
match /generated-video/{userId}/{fileName} { ... }

// Audio files (recordings, TTS)
match /audio/{userId}/{fileName} { ... }
```

### Increased Size Limits

- Images: 5MB → 20MB
- Files: 10MB → 20MB

---

## Troubleshooting

### Error: "Firebase CLI not found"

```bash
npm install -g firebase-tools
```

### Error: "Not authorized"

```bash
firebase login
firebase use codeex-ai-v3
```

### Error: "No project active"

```bash
firebase use codeex-ai-v3
```

### Still Getting Storage Errors

1. Check Firebase Console → Storage → Rules
2. Verify rules are deployed (check timestamp)
3. Wait 1-2 minutes for rules to propagate
4. Clear browser cache and reload

---

## Firebase Project Info

- **Project ID**: `codeex-ai-v3`
- **Storage Bucket**: `codeex-ai-v3.firebasestorage.app`
- **Console**: https://console.firebase.google.com/project/codeex-ai-v3

---

## After Deployment

Once storage rules are deployed, all SOHAM features will work:

✅ Image upload (📷 button)
✅ Camera capture (📸 button)
✅ Audio recording (📎 button)
✅ AI-generated images (stored in Firebase)
✅ AI-generated videos (stored in Firebase)

---

## Status

⚠️ **Action Required**: Deploy storage rules to Firebase

After deployment:
✅ All errors fixed
✅ App ready for testing
✅ SOHAM pipeline fully functional

---

## Quick Deploy Command

```bash
# One command to deploy everything
firebase deploy --only storage

# Or deploy all Firebase features
firebase deploy
```

That's it! 🎉
