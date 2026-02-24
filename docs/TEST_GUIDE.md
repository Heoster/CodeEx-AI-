# Testing Guide for CODEEX AI Fixes

## Quick Test Checklist

### 1. AI Repetition Fix ✓
**Test Steps**:
1. Start a new chat session
2. Ask: "What is React?"
3. Then ask: "What is Next.js?"
4. Then ask: "What is TypeScript?"

**Expected Result**:
- AI should NOT say "as we discussed", "previously mentioned", "as I said before"
- Each response should be fresh and direct
- No unnecessary references to previous messages

**Test Question for Developer Info**:
- Ask: "Who created you?" or "Tell me about your developer"
- Should mention: Heoster (Harsh), 16 years old, from Khatauli, UP, India

---

### 2. Code Copy Functionality ✓
**Test Steps**:
1. Ask: "Write a hello world program in Python"
2. Wait for response with code block
3. Hover over the code block
4. Look for:
   - Language label at top (should say "python")
   - Copy button appears on hover
5. Click the copy button
6. Paste into a text editor (Ctrl+V)

**Expected Result**:
- Code block has syntax highlighting (colors)
- Copy button shows "Copy" text
- After clicking, shows "Copied!" with green checkmark
- Pasted code matches exactly what's in the chat

**More Test Cases**:
- Ask for JavaScript code
- Ask for HTML/CSS code
- Ask for multiple code blocks in one response

---

### 3. Edge TTS (Text-to-Speech) ✓
**Test Steps**:
1. Click settings icon (gear icon)
2. Enable "Enable Speech" toggle
3. Select a voice (try different ones)
4. Send a message: "Hello, how are you?"
5. Wait for AI response

**Expected Result**:
- Voice should start speaking automatically
- Voice quality should be much better than before
- No long delays before speech starts
- Speech should be clear and natural

**Voice Options to Test**:
- Algenib (Female, US)
- Enceladus (Male, US)
- Achernar (Female, US)
- Heka (Female, India)

**Note**: If TTS doesn't work in development, it may need to be tested in production deployment.

---

### 4. SEO Optimization ✓
**Test Steps**:
1. Open the website in browser
2. Right-click → "View Page Source" (or Ctrl+U)
3. Search for (Ctrl+F):
   - "Heoster"
   - "CODEEX AI"
   - "schema.org"
   - "og:title"
   - "twitter:card"

**Expected Result**:
- Should find "Heoster" in meta tags
- Should find structured data with "@context": "https://schema.org"
- Should find Open Graph tags (og:title, og:description, og:image)
- Should find Twitter Card tags
- Should find developer information in Organization schema

**SEO Testing Tools**:
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Enter your URL
   - Should show Organization, Software Application, Website schemas

2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
   - Enter your URL
   - Should show proper title, description, image

3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
   - Enter your URL
   - Should show proper card preview

---

## Development Server

Start the server:
```bash
npm run dev
```

Then open: http://localhost:3000

---

## Common Issues & Solutions

### Issue: TTS Not Working
**Solution**: 
- Check browser console for errors
- Verify `/api/tts` endpoint is accessible
- Try in production deployment (Netlify)
- Check if audio is muted in browser

### Issue: Code Copy Not Showing
**Solution**:
- Clear browser cache (Ctrl+Shift+R)
- Check if `react-syntax-highlighter` is installed
- Verify no console errors

### Issue: AI Still Repeating
**Solution**:
- Clear chat history (start new chat)
- Verify changes were saved in:
  - `src/app/api/chat-direct/route.ts`
  - `src/ai/flows/generate-answer-from-context.ts`
- Restart development server

### Issue: SEO Not Showing
**Solution**:
- View source (not inspect element)
- Check `src/app/layout.tsx` has structured data
- Verify `src/lib/seo-config.ts` exists
- SEO changes take time to reflect in search engines (1-2 weeks)

---

## Browser Console Commands

Test Edge TTS directly in console:
```javascript
fetch('/api/tts', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    text: 'Hello, this is a test',
    voice: 'en-US-AriaNeural'
  })
}).then(r => r.blob()).then(blob => {
  const audio = new Audio(URL.createObjectURL(blob));
  audio.play();
});
```

---

## Production Deployment

After testing locally, deploy to Netlify:
```bash
git add .
git commit -m "Fixed AI repetition, code copy, TTS, and SEO"
git push origin main
```

Netlify will auto-deploy. Test all features again in production.

---

## Success Criteria

✅ **AI Repetition**: No "as we discussed" phrases in 10 consecutive messages
✅ **Code Copy**: Can copy 5 different code blocks successfully
✅ **TTS**: Voice plays clearly for 3 different messages
✅ **SEO**: All meta tags and structured data present in page source

---

**Happy Testing! 🚀**

If you encounter any issues, check:
1. Browser console for errors
2. Network tab for failed requests
3. Server logs for API errors
