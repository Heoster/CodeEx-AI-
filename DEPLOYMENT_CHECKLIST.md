# 🚀 CODEEX DEPLOYMENT CHECKLIST

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Add `YOU_API_KEY` to `.env.local`
- [ ] Verify `GROQ_API_KEY` is set
- [ ] Verify `CEREBRAS_API_KEY` is set
- [ ] Verify `GOOGLE_API_KEY` is set
- [ ] Verify `HUGGINGFACE_API_KEY` is set
- [ ] Verify all Firebase config variables are set

### 2. Firebase Configuration
- [ ] Enable Firebase Storage in console
- [ ] Update Storage Rules (see below)
- [ ] Create Firestore `memories` collection
- [ ] Add Firestore index for memories
- [ ] Test Firebase connection

### 3. Build & Test
- [ ] Run `npm run typecheck` (should pass)
- [ ] Run `npm run build` (should succeed)
- [ ] Test locally with `npm run dev`
- [ ] Test all API endpoints

### 4. Feature Testing
- [ ] Test image upload
- [ ] Test camera capture
- [ ] Test audio recording
- [ ] Test image generation
- [ ] Test video generation
- [ ] Test web search
- [ ] Test memory system

## 🔥 Firebase Storage Rules

Copy to Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User uploaded images
    match /user-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // AI generated images
    match /generated-images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // AI generated videos
    match /generated-videos/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Audio files
    match /audio/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🗄️ Firestore Setup

### Create Collection
1. Go to Firebase Console → Firestore Database
2. Click "Start collection"
3. Collection ID: `memories`
4. Add first document (can be deleted later):
   ```json
   {
     "userId": "test",
     "content": "Test memory",
     "embedding": [0.1, 0.2, 0.3],
     "type": "fact",
     "importance": 5,
     "tags": ["test"],
     "timesRecalled": 0,
     "createdAt": "2026-02-25T00:00:00Z"
   }
   ```

### Create Index
1. Go to Indexes tab
2. Click "Create Index"
3. Collection: `memories`
4. Fields to index:
   - `userId` (Ascending)
   - `createdAt` (Descending)
5. Query scope: Collection
6. Click "Create"

## 🧪 Testing Commands

### Test Image Generation
```bash
curl -X POST http://localhost:3000/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A serene mountain landscape at sunset",
    "userId": "test-user",
    "style": "realistic"
  }'
```

### Test Video Generation
```bash
curl -X POST http://localhost:3000/api/generate-video \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A cat playing with a ball of yarn",
    "userId": "test-user",
    "duration": 5
  }'
```

### Test Web Search
```bash
curl -X POST http://localhost:3000/api/web-search \
  -H "Content-Type: application/json" \
  -d '{"query": "Latest AI developments 2026"}'
```

### Test Image Upload
```bash
curl -X POST http://localhost:3000/api/upload-image \
  -F "file=@test-image.jpg" \
  -F "userId=test-user" \
  -F "autoDelete=true"
```

### Test Transcription
```bash
curl -X POST http://localhost:3000/api/transcribe \
  -F "file=@recording.webm" \
  -F "language=en"
```

## 📊 Health Check

Visit these URLs to verify everything is working:

- [ ] `http://localhost:3000/api/health` - Should return 200 OK
- [ ] `http://localhost:3000/` - Homepage loads
- [ ] `http://localhost:3000/chat` - Chat interface loads
- [ ] `http://localhost:3000/api/debug/providers` - Shows provider status

## 🎯 Integration Testing

### Test Message Flow
```typescript
// Test in chat UI:

// 1. Image Generation
"Generate an image of a dragon"
→ Should return image URL

// 2. Video Generation
"Create a video of ocean waves"
→ Should return video URL

// 3. Web Search
"Search for latest tech news"
→ Should return cited results

// 4. Regular Chat
"How do I learn Python?"
→ Should return conversational response

// 5. Voice Input
[Record audio] "Hello, how are you?"
→ Should transcribe and respond

// 6. Image Upload
[Upload image] "What's in this photo?"
→ Should analyze and describe
```

## 🚀 Deployment Steps

### For Netlify
```bash
# 1. Build
npm run build

# 2. Set environment variables in Netlify dashboard
# 3. Deploy
netlify deploy --prod

# 4. Verify deployment
curl https://your-app.netlify.app/api/health
```

### For Vercel
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Set environment variables in Vercel dashboard
# 4. Redeploy
vercel --prod
```

## 📝 Post-Deployment Checklist

- [ ] Verify all API endpoints work in production
- [ ] Test image generation in production
- [ ] Test video generation in production
- [ ] Test web search in production
- [ ] Test voice input in production
- [ ] Monitor Firebase usage
- [ ] Monitor API rate limits
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up analytics
- [ ] Test on mobile devices
- [ ] Test PWA installation

## 🔒 Security Checklist

- [ ] Firebase Security Rules are set
- [ ] API keys are in environment variables (not in code)
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled
- [ ] Input validation is working
- [ ] File upload size limits are enforced
- [ ] Authentication is required for sensitive operations

## 📈 Monitoring

### Metrics to Track
- [ ] API response times
- [ ] Error rates
- [ ] Firebase Storage usage
- [ ] Firestore read/write counts
- [ ] API key usage (Groq, Cerebras, Google, HF, You.com)
- [ ] User engagement with new features

### Set Up Alerts
- [ ] High error rate alert
- [ ] API quota warning
- [ ] Firebase storage limit warning
- [ ] Unusual traffic patterns

## 🎉 Launch Checklist

- [ ] All tests passing
- [ ] All features working
- [ ] Documentation complete
- [ ] Environment variables set
- [ ] Firebase configured
- [ ] Deployed to production
- [ ] Monitoring enabled
- [ ] Team notified
- [ ] Users notified
- [ ] Celebrate! 🎊

## 📚 Documentation Links

- [SOHAM_PIPELINE_COMPLETE.md](./SOHAM_PIPELINE_COMPLETE.md) - Full documentation
- [SOHAM_SETUP_COMPLETE.md](./SOHAM_SETUP_COMPLETE.md) - Setup guide
- [MESSAGE_FLOW_INTEGRATION_COMPLETE.md](./MESSAGE_FLOW_INTEGRATION_COMPLETE.md) - Integration details
- [FINAL_IMPLEMENTATION_SUMMARY.md](./FINAL_IMPLEMENTATION_SUMMARY.md) - Summary

## 🆘 Troubleshooting

### Image Generation Not Working
1. Check `CEREBRAS_API_KEY` and `GOOGLE_API_KEY`
2. Check `HUGGINGFACE_API_KEY` for fallback
3. Verify Firebase Storage is enabled
4. Check browser console for errors

### Video Generation Not Working
1. Check `GOOGLE_API_KEY`
2. Verify Veo 3.1 is available in your region
3. Check Firebase Storage rules
4. Monitor API quota

### Web Search Not Working
1. Check `YOU_API_KEY`
2. Verify You.com API is accessible
3. Check rate limits
4. Test with simple query

### Voice Input Not Working
1. Check `GROQ_API_KEY`
2. Verify microphone permissions
3. Check audio format support
4. Test with different browsers

### Memory System Not Working
1. Check `GOOGLE_API_KEY` (for embeddings)
2. Verify Firestore collection exists
3. Check Firestore index is created
4. Verify Firebase rules allow access

## ✅ Ready to Deploy!

Once all checkboxes are checked, you're ready to deploy CODEEX with the full SOHAM pipeline! 🚀
