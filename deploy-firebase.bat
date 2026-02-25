@echo off
echo ========================================
echo Firebase Storage Rules Deployment
echo ========================================
echo.

echo Step 1: Checking Firebase CLI...
firebase --version
if %errorlevel% neq 0 (
    echo ERROR: Firebase CLI not found!
    echo Please run: npm install -g firebase-tools
    pause
    exit /b 1
)
echo ✓ Firebase CLI installed
echo.

echo Step 2: Logging in to Firebase...
echo (This will open your browser)
firebase login
if %errorlevel% neq 0 (
    echo ERROR: Login failed!
    pause
    exit /b 1
)
echo ✓ Logged in successfully
echo.

echo Step 3: Setting project...
firebase use codeex-ai-v3
if %errorlevel% neq 0 (
    echo ERROR: Failed to set project!
    pause
    exit /b 1
)
echo ✓ Project set to codeex-ai-v3
echo.

echo Step 4: Deploying storage rules...
firebase deploy --only storage
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed!
    pause
    exit /b 1
)
echo.
echo ========================================
echo ✓ Deployment Complete!
echo ========================================
echo.
echo Your storage rules have been deployed.
echo You can now test image uploads in the app.
echo.
pause
