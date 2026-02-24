# Google Analytics - Quick Start

## ✅ Installation Complete

Google Analytics (GA4) is now active on CODEEX AI with tracking ID: **G-YH87NZPSKB**

## What's Working

- ✅ Automatic page view tracking on all routes
- ✅ Google Analytics script loaded in `<head>`
- ✅ Analytics component tracking route changes
- ✅ 20+ event tracking functions ready to use

## Quick Usage

### Import and Track Events

```typescript
import { 
  trackChatMessage,
  trackModelSelection,
  trackFeatureUsage,
  trackExport,
  trackShare,
} from '@/lib/analytics';

// Track chat message
trackChatMessage('llama-3.1-8b-instant', 150);

// Track model selection
trackModelSelection('gemini-2.5-flash', 'general');

// Track feature usage
trackFeatureUsage('pdf_analysis');

// Track export
trackExport('pdf');

// Track share
trackShare('copy');
```

## Verify It's Working

1. Open [Google Analytics](https://analytics.google.com/)
2. Go to **Reports > Realtime**
3. Visit your website
4. See active users in real-time!

## Next Steps

Add tracking to:
1. Chat interface (message sends, model changes)
2. PDF analyzer (uploads, analysis)
3. Visual math (image uploads, solutions)
4. Export/share buttons
5. Authentication (signup, login)

## Full Documentation

See `GOOGLE_ANALYTICS_SETUP.md` for complete guide.

---

**Status**: ✅ Active  
**Tracking ID**: G-YH87NZPSKB
