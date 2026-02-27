# Netlify Cache Issue - JavaScript Chunk 404 Errors

## Problem
You're seeing errors like:
```
GET https://codeex-ai.netlify.app/_next/static/chunks/fd37fa83-2fca480fd0fc6fa6.js net::ERR_ABORTED 404
Refused to execute script because its MIME type ('text/html') is not executable
```

## Root Cause
Netlify is serving an old cached build. The JavaScript chunks from the previous build don't match the current deployment. This happens when:
1. Build cache contains old chunk references
2. Service worker cached old chunk URLs
3. Browser cached old HTML with old chunk references

## Solution: Force Complete Cache Clear

### Step 1: Clear Netlify Build Cache (REQUIRED)

**Option A: Using Netlify UI (Recommended)**
1. Go to https://app.netlify.com/
2. Select your site: **codeex-ai**
3. Go to **Site settings** → **Build & deploy** → **Build settings**
4. Scroll down and click **Clear cache and retry deploy**
5. Wait for the new build to complete

**Option B: Using Netlify CLI**
```bash
netlify build --clear-cache
netlify deploy --prod
```

### Step 2: Clear Service Worker Cache (REQUIRED)

After the new build is deployed, users need to clear their service worker cache:

**For You (Developer):**
1. Open https://codeex-ai.netlify.app in Chrome
2. Press F12 to open DevTools
3. Go to **Application** tab
4. Click **Service Workers** in left sidebar
5. Click **Unregister** next to your service worker
6. Go to **Storage** in left sidebar
7. Click **Clear site data**
8. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**For Users:**
They'll need to do the same, or you can add a version check to force service worker update.

### Step 3: Verify the Fix

1. Open https://codeex-ai.netlify.app in an incognito window
2. Open DevTools (F12) → Network tab
3. Refresh the page
4. Check that all JavaScript chunks load with 200 status (not 404)
5. Try navigating to different pages
6. Check console for errors

## Alternative: Add Service Worker Version Check

To automatically force service worker updates, we can add a version check. This will help prevent this issue in the future.

### Update Service Worker Configuration

Add this to your `next.config.js` in the PWA workboxOptions:

```javascript
workboxOptions: {
  // ... existing options
  buildId: process.env.BUILD_ID || Date.now().toString(),
}
```

This will force the service worker to update when the build ID changes.

## Prevention: Best Practices

### 1. Always Clear Cache on Major Updates
When you make significant changes (like we did), always clear Netlify cache:
```bash
# Before deploying
git commit -m "Major update"
git push origin main

# Then in Netlify UI: Clear cache and retry deploy
```

### 2. Use Build IDs
Netlify automatically generates build IDs, but we can make them more explicit:

In `netlify.toml`, add:
```toml
[build.environment]
  BUILD_ID = "${COMMIT_REF}"
```

### 3. Service Worker Update Strategy
Consider adding a "New version available" notification to prompt users to refresh.

## Current Status

- ✅ Code pushed to GitHub (commit: 3a09764)
- ✅ `.netlify-rebuild` file updated to force cache clear
- ⚠️ **ACTION REQUIRED:** Clear Netlify build cache (see Step 1 above)
- ⚠️ **ACTION REQUIRED:** Clear browser/service worker cache (see Step 2 above)

## Quick Fix Commands

```bash
# 1. Update the rebuild trigger file (already done)
echo "# Force rebuild $(date)" > .netlify-rebuild

# 2. Commit and push
git add .netlify-rebuild
git commit -m "Force Netlify cache clear"
git push origin main

# 3. Then go to Netlify UI and click "Clear cache and retry deploy"
```

## Why This Happens

Next.js generates unique chunk names based on content hashes. When you:
1. Build locally → generates chunks like `4241-876245a25c4c5b5d.js`
2. Deploy to Netlify → Netlify caches the build
3. Make changes and deploy again → generates NEW chunks like `4241-abc123def456.js`
4. But Netlify cache still references OLD chunks
5. Browser tries to load old chunks → 404 error

The solution is to clear ALL caches (Netlify build cache, service worker cache, browser cache).

## Testing After Fix

Once you've cleared all caches and redeployed:

```bash
# Test in incognito mode
# 1. Open https://codeex-ai.netlify.app
# 2. Check console for errors
# 3. Navigate to different pages
# 4. Try AI chat
# 5. Check TTS functionality
```

All JavaScript chunks should load successfully with 200 status codes.

---

**Next Steps:**
1. Go to Netlify dashboard
2. Click "Clear cache and retry deploy"
3. Wait for build to complete
4. Test in incognito window
5. If still issues, clear service worker cache (Step 2)
