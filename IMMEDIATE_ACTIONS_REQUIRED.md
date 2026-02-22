# ⚠️ IMMEDIATE ACTIONS REQUIRED

## 🚨 CRITICAL SECURITY ISSUE

Your API keys are currently exposed in the repository. Follow these steps **IMMEDIATELY**:

---

## Step 1: Revoke ALL Exposed API Keys (DO THIS NOW!)

### Google Cloud
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API keys
3. Click "Delete" or "Regenerate"
4. Create new keys

### Groq
1. Go to: https://console.groq.com/keys
2. Delete exposed key
3. Create new key

### Hugging Face
1. Go to: https://huggingface.co/settings/tokens
2. Revoke exposed token
3. Create new token

### OpenRouter
1. Go to: https://openrouter.ai/keys
2. Delete exposed key
3. Create new key

### Cerebras
1. Go to: https://cloud.cerebras.ai/
2. Navigate to API keys
3. Revoke exposed key
4. Create new key

### Resend
1. Go to: https://resend.com/api-keys
2. Delete exposed key
3. Create new key

### ElevenLabs
1. Go to: https://elevenlabs.io/app/settings/api-keys
2. Delete exposed key
3. Create new key

---

## Step 2: Update Your Local Environment

```bash
# 1. Copy the template
cp .env.example .env.local

# 2. Open .env.local and add your NEW API keys
# (Use the new keys you just created, NOT the old ones!)

# 3. Verify .env.local is in .gitignore
cat .gitignore | grep .env.local
# Should show: .env.local
```

---

## Step 3: Remove .env.local from Git History

### Option A: Using git filter-branch
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

### Option B: Using BFG (Faster, Recommended)
```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Run BFG
java -jar bfg.jar --delete-files .env.local

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

---

## Step 4: Deploy Firebase Security Rules

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

---

## Step 5: Set Up Production Environment Variables

### For Netlify:
1. Go to your site dashboard
2. Click "Site settings"
3. Click "Environment variables"
4. Add all variables from `.env.example`
5. Use your NEW production API keys

### For Vercel:
1. Go to your project dashboard
2. Click "Settings"
3. Click "Environment Variables"
4. Add all variables from `.env.example`
5. Select "Production" environment
6. Use your NEW production API keys

---

## Step 6: Test Everything

```bash
# 1. Test locally
npm run dev

# 2. Test API endpoints
# Visit: http://localhost:3000/api/health

# 3. Test chat functionality
# Send a test message

# 4. Check for errors
# Open browser console
```

---

## ✅ Verification Checklist

- [ ] All old API keys revoked
- [ ] New API keys generated
- [ ] .env.local updated with new keys
- [ ] .env.local removed from git history
- [ ] Firebase security rules deployed
- [ ] Production environment variables set
- [ ] Local testing passed
- [ ] Production deployment successful
- [ ] No errors in production

---

## 🆘 If You Need Help

1. **Can't revoke keys?**
   - Contact the service provider support
   - Explain the situation
   - Request immediate key rotation

2. **Git history issues?**
   - Consider creating a new repository
   - Copy code (not .git folder)
   - Start fresh with proper .gitignore

3. **Firebase rules not working?**
   - Test with Firebase Emulator first
   - Check Firebase console for errors
   - Review rules syntax

---

## 📞 Emergency Contacts

- **Firebase Support**: https://firebase.google.com/support
- **Google Cloud Support**: https://cloud.google.com/support
- **GitHub Support**: https://support.github.com/

---

## ⏰ Timeline

- **Now (0-1 hour)**: Revoke all API keys
- **Today (1-4 hours)**: Update environment, remove from git
- **Today (4-8 hours)**: Deploy security rules, test
- **Tomorrow**: Monitor for any issues

---

## 🎯 Priority Order

1. **CRITICAL**: Revoke exposed API keys (DO NOW!)
2. **HIGH**: Remove from git history
3. **HIGH**: Update local environment
4. **MEDIUM**: Deploy Firebase rules
5. **MEDIUM**: Set up production env vars
6. **LOW**: Test and monitor

---

**Remember**: Until you revoke the exposed keys, anyone can use your API credits!

**Act now to prevent:**
- Unauthorized API usage
- Unexpected charges
- Data breaches
- Service abuse

---

*Created: $(date)*
*Priority: CRITICAL*
*Status: ACTION REQUIRED*
