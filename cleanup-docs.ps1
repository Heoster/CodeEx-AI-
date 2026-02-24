# Cleanup script to organize documentation and remove test files

Write-Host "Starting cleanup..." -ForegroundColor Green

# Create archive directory for old documentation
New-Item -ItemType Directory -Force -Path "docs/archive" | Out-Null

# Move completed feature documentation to archive
$archiveFiles = @(
    "AI_SERVICES_TESTING_COMPLETE.md",
    "ANALYTICS_QUICK_START.md",
    "API_405_ERROR_FIXED.md",
    "BUILD_VERIFIED.md",
    "DEPLOYMENT_SUCCESS.md",
    "DEPLOYMENT_URLS.md",
    "DEVELOPER_PAGE_SEO_COMPLETE.md",
    "DIRECT_APP_TESTING_GUIDE.md",
    "EDGE_TTS_VERIFIED.md",
    "ENHANCEMENTS_SUMMARY.md",
    "EXPORT_MENU_UPDATED.md",
    "FEATURE_COMPLETE_SUMMARY.md",
    "FETCH_FAILED_ERROR_FIXED.md",
    "FINAL_DEPLOYMENT_SUMMARY.md",
    "FINAL_STATUS.md",
    "FIREBASE_TTS_ERRORS_FIXED.md",
    "FIXES_COMPLETED.md",
    "GOOGLE_ANALYTICS_SETUP.md",
    "GOOGLE_VERIFICATION_GUIDE.md",
    "HYDRATION_ERROR_FIX.md",
    "IMMEDIATE_ACTIONS_REQUIRED.md",
    "LOCAL_TEST_RESULTS.md",
    "LOCAL_TESTING_COMPLETE.md",
    "LOCAL_TESTING_SETUP.md",
    "MODEL_DISPLAY_ENHANCEMENT.md",
    "NETLIFY_DEPLOYMENT_FIX.md",
    "NETLIFY_DEPLOYMENT.md",
    "NETLIFY_SECRETS_EXPLANATION.md",
    "NETLIFY_SECRETS_SCANNING_FIXED.md",
    "NETLIFY_TIMEOUT_FIX.md",
    "PERSONALITY_FEATURE_IMPLEMENTATION.md",
    "PRIVACY_POLICY_UPDATED.md",
    "PRODUCTION_DEPLOYMENT_COMPLETE.md",
    "PRODUCTION_ENV_SETUP.md",
    "PRODUCTION_READY_CHECKLIST.md",
    "PRODUCTION_READY.md",
    "PRODUCTION_TTS_COMPLETE.md",
    "PYTHON_TTS_SETUP_COMPLETE.md",
    "QUICK_DEPLOY_GUIDE.md",
    "QUICK_FIX_GUIDE.md",
    "QUICK_REFERENCE.md",
    "READY_FOR_LOCAL_TESTING.md",
    "ROUTE_CONFLICT_FIXED.md",
    "SECURITY_FIXES_COMPLETE.md",
    "SEO_ENHANCEMENT_COMPLETE.md",
    "SEO_ENHANCEMENTS_COMPLETE.md",
    "SEO_OPTIMIZATION_COMPLETE.md",
    "SHARE_EXPORT_FEATURE.md",
    "SMART_FALLBACK_SYSTEM.md",
    "THINKING_ANIMATION_IMPROVED.md",
    "TTS_EQUALS_FILTER_ADDED.md",
    "TTS_FIXED_WITH_FALLBACK.md",
    "TTS_FIXES_COMPLETE.md",
    "TTS_SYMBOL_FILTER_COMPLETE.md",
    "TYPESCRIPT_ERRORS_FIXED.md",
    "USER_MANAGEMENT_COMPLETE.md",
    "VOICE_FILTER_AND_USER_MANAGEMENT_ENHANCED.md"
)

Write-Host "Moving completed documentation to archive..." -ForegroundColor Yellow
foreach ($file in $archiveFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "docs/archive/" -Force
        Write-Host "  Archived: $file" -ForegroundColor Gray
    }
}

# Move active documentation to docs/
$activeFiles = @(
    "MODEL_SELECTION_DEBUG.md",
    "MODEL_SELECTION_TEST_GUIDE.md",
    "QUICK_START.md",
    "TEST_GUIDE.md"
)

Write-Host "Moving active documentation to docs/..." -ForegroundColor Yellow
foreach ($file in $activeFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "docs/" -Force
        Write-Host "  Moved: $file" -ForegroundColor Gray
    }
}

# Remove test files
$testFiles = @(
    "test-all-ai-services.js",
    "test-chat-direct.js",
    "test-chat-interface.js",
    "test-chat-working.js",
    "test-huggingface-router.js",
    "test-models-browser.js",
    "test-personality.html",
    "test-providers.html",
    "test-tts-api.js",
    "test-tts.html",
    "debug-chat-issue.js",
    "ai-services-test-report.json",
    "chat-interface-test-results.json",
    "WELCOME_EMAIL_PLAIN_TEXT.txt",
    "WELCOME_EMAIL_TEMPLATE.html"
)

Write-Host "Removing test files..." -ForegroundColor Yellow
foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "  Removed: $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host "- Archived documentation moved to docs/archive/" -ForegroundColor Cyan
Write-Host "- Active documentation moved to docs/" -ForegroundColor Cyan
Write-Host "- Test files removed" -ForegroundColor Cyan
