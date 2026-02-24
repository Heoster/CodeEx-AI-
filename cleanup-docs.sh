#!/bin/bash
# Cleanup script to organize documentation and remove test files

# Create archive directory for old documentation
mkdir -p docs/archive

# Move completed feature documentation to archive
mv AI_SERVICES_TESTING_COMPLETE.md docs/archive/ 2>/dev/null
mv ANALYTICS_QUICK_START.md docs/archive/ 2>/dev/null
mv API_405_ERROR_FIXED.md docs/archive/ 2>/dev/null
mv BUILD_VERIFIED.md docs/archive/ 2>/dev/null
mv DEPLOYMENT_SUCCESS.md docs/archive/ 2>/dev/null
mv DEPLOYMENT_URLS.md docs/archive/ 2>/dev/null
mv DEVELOPER_PAGE_SEO_COMPLETE.md docs/archive/ 2>/dev/null
mv DIRECT_APP_TESTING_GUIDE.md docs/archive/ 2>/dev/null
mv EDGE_TTS_VERIFIED.md docs/archive/ 2>/dev/null
mv ENHANCEMENTS_SUMMARY.md docs/archive/ 2>/dev/null
mv EXPORT_MENU_UPDATED.md docs/archive/ 2>/dev/null
mv FEATURE_COMPLETE_SUMMARY.md docs/archive/ 2>/dev/null
mv FETCH_FAILED_ERROR_FIXED.md docs/archive/ 2>/dev/null
mv FINAL_DEPLOYMENT_SUMMARY.md docs/archive/ 2>/dev/null
mv FINAL_STATUS.md docs/archive/ 2>/dev/null
mv FIREBASE_TTS_ERRORS_FIXED.md docs/archive/ 2>/dev/null
mv FIXES_COMPLETED.md docs/archive/ 2>/dev/null
mv GOOGLE_ANALYTICS_SETUP.md docs/archive/ 2>/dev/null
mv GOOGLE_VERIFICATION_GUIDE.md docs/archive/ 2>/dev/null
mv HYDRATION_ERROR_FIX.md docs/archive/ 2>/dev/null
mv IMMEDIATE_ACTIONS_REQUIRED.md docs/archive/ 2>/dev/null
mv LOCAL_TEST_RESULTS.md docs/archive/ 2>/dev/null
mv LOCAL_TESTING_COMPLETE.md docs/archive/ 2>/dev/null
mv LOCAL_TESTING_SETUP.md docs/archive/ 2>/dev/null
mv MODEL_DISPLAY_ENHANCEMENT.md docs/archive/ 2>/dev/null
mv NETLIFY_DEPLOYMENT_FIX.md docs/archive/ 2>/dev/null
mv NETLIFY_DEPLOYMENT.md docs/archive/ 2>/dev/null
mv NETLIFY_SECRETS_EXPLANATION.md docs/archive/ 2>/dev/null
mv NETLIFY_SECRETS_SCANNING_FIXED.md docs/archive/ 2>/dev/null
mv NETLIFY_TIMEOUT_FIX.md docs/archive/ 2>/dev/null
mv PERSONALITY_FEATURE_IMPLEMENTATION.md docs/archive/ 2>/dev/null
mv PRIVACY_POLICY_UPDATED.md docs/archive/ 2>/dev/null
mv PRODUCTION_DEPLOYMENT_COMPLETE.md docs/archive/ 2>/dev/null
mv PRODUCTION_ENV_SETUP.md docs/archive/ 2>/dev/null
mv PRODUCTION_READY_CHECKLIST.md docs/archive/ 2>/dev/null
mv PRODUCTION_READY.md docs/archive/ 2>/dev/null
mv PRODUCTION_TTS_COMPLETE.md docs/archive/ 2>/dev/null
mv PYTHON_TTS_SETUP_COMPLETE.md docs/archive/ 2>/dev/null
mv QUICK_DEPLOY_GUIDE.md docs/archive/ 2>/dev/null
mv QUICK_FIX_GUIDE.md docs/archive/ 2>/dev/null
mv QUICK_REFERENCE.md docs/archive/ 2>/dev/null
mv READY_FOR_LOCAL_TESTING.md docs/archive/ 2>/dev/null
mv ROUTE_CONFLICT_FIXED.md docs/archive/ 2>/dev/null
mv SECURITY_FIXES_COMPLETE.md docs/archive/ 2>/dev/null
mv SEO_ENHANCEMENT_COMPLETE.md docs/archive/ 2>/dev/null
mv SEO_ENHANCEMENTS_COMPLETE.md docs/archive/ 2>/dev/null
mv SEO_OPTIMIZATION_COMPLETE.md docs/archive/ 2>/dev/null
mv SHARE_EXPORT_FEATURE.md docs/archive/ 2>/dev/null
mv SMART_FALLBACK_SYSTEM.md docs/archive/ 2>/dev/null
mv THINKING_ANIMATION_IMPROVED.md docs/archive/ 2>/dev/null
mv TTS_EQUALS_FILTER_ADDED.md docs/archive/ 2>/dev/null
mv TTS_FIXED_WITH_FALLBACK.md docs/archive/ 2>/dev/null
mv TTS_FIXES_COMPLETE.md docs/archive/ 2>/dev/null
mv TTS_SYMBOL_FILTER_COMPLETE.md docs/archive/ 2>/dev/null
mv TYPESCRIPT_ERRORS_FIXED.md docs/archive/ 2>/dev/null
mv USER_MANAGEMENT_COMPLETE.md docs/archive/ 2>/dev/null
mv VOICE_FILTER_AND_USER_MANAGEMENT_ENHANCED.md docs/archive/ 2>/dev/null

# Move active documentation to docs/
mv MODEL_SELECTION_DEBUG.md docs/ 2>/dev/null
mv MODEL_SELECTION_TEST_GUIDE.md docs/ 2>/dev/null
mv QUICK_START.md docs/ 2>/dev/null
mv TEST_GUIDE.md docs/ 2>/dev/null

# Remove test files
rm -f test-all-ai-services.js
rm -f test-chat-direct.js
rm -f test-chat-interface.js
rm -f test-chat-working.js
rm -f test-huggingface-router.js
rm -f test-models-browser.js
rm -f test-personality.html
rm -f test-providers.html
rm -f test-tts-api.js
rm -f test-tts.html
rm -f debug-chat-issue.js

# Remove test result files
rm -f ai-services-test-report.json
rm -f chat-interface-test-results.json

# Remove email templates (should be in src/templates if needed)
rm -f WELCOME_EMAIL_PLAIN_TEXT.txt
rm -f WELCOME_EMAIL_TEMPLATE.html

echo "Cleanup complete!"
echo "- Archived documentation moved to docs/archive/"
echo "- Active documentation moved to docs/"
echo "- Test files removed"
