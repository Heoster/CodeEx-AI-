# 🔥 Firebase Storage Rules Deployment

## ✅ Setup Complete

I've created the necessary Firebase configuration files:
- `firebase.json` - Firebase project configuration
- `.firebaserc` - Project ID configuration (codeex-ai-v3)

## 🚀 Deploy Storage Rules

### Step 1: Login to Firebase

Open a new terminal and run:

```bash
firebase login
```

This will:
1. Open your browser
2. Ask you to sign in with your Google account
3. Grant Firebase CLI access

### Step 2: Verify Project

```bash
firebase use codeex-ai-v3
```

Should show:
```
Now using project codeex-ai-v3
```

### Step 3: Deploy Storage Rules

```bash
firebase deploy --only storage
```

Expected output:
```
=== Deploying to 'codeex-ai-v3'...

i  deploying storage
i  storage: checking storage.rules for compilation errors...
✔  storage: rules file storage.rules compiled successfully
i  storage: uploading rules storage.rules...
✔  storage: released rules storage.rules to firebase.storage/codeex-ai-v3.firebasestorage.app

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/codeex-ai-v3/overview
```

### Step 4: Verify Deployment

1. Go to [Firebase Console](https://console.firebase.google.com/project/codeex-ai-v3/storage/rules)
2. Check that the rules show the new SOHAM paths
3. Look for timestamp to confirm deployment

---

## 🎯 Alternative: Manual Deployment via Console

If you prefer not to use CLI:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **codeex-ai-v3**
3. Click **Storage** in left sidebar
4. Click **Rules** tab
5. Copy contents from `storage.rules` file
6. Paste into editor
7. Click **Publish**

---

## ✅ After Deployment

Test image upload:

```bash
# Start dev server
npm run dev

# Open http://localhost:3000/chat
# Click 📷 button
# Upload an image
# Should work without errors!
```

---

## 📋 What's Being Deployed

The new storage rules add support for:

✅ **User Images** (`user-image/{userId}/`)
- Camera captures
- File uploads
- Max size: 20MB

✅ **Generated Images** (`generated-image/{userId}/`)
- AI-generated images from SOHAM pipeline
- Max size: 20MB

✅ **Generated Videos** (`generated-video/{userId}/`)
- AI-generated videos from Veo 3.1
- Max size: 20MB

✅ **Audio Files** (`audio/{userId}/`)
- Voice recordings
- TTS audio
- Max size: 20MB

All paths are user-scoped and require authentication.

---

## 🔧 Troubleshooting

### "Not authorized"
```bash
firebase login --reauth
```

### "No project active"
```bash
firebase use codeex-ai-v3
```

### "Permission denied"
Make sure you're logged in with the Google account that owns the Firebase project.

---

## 📞 Need Help?

If deployment fails, you can:
1. Use the Firebase Console method (easier)
2. Check Firebase Console → Storage → Rules to verify
3. Contact Firebase support if permissions issues persist

---

## Status

⏳ **Waiting for deployment**

Once deployed:
✅ All storage errors will be fixed
✅ Image uploads will work
✅ SOHAM pipeline fully functional
