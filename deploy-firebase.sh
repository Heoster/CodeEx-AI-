#!/bin/bash

echo "========================================"
echo "Firebase Storage Rules Deployment"
echo "========================================"
echo ""

echo "Step 1: Checking Firebase CLI..."
if ! command -v firebase &> /dev/null; then
    echo "ERROR: Firebase CLI not found!"
    echo "Please run: npm install -g firebase-tools"
    exit 1
fi
firebase --version
echo "✓ Firebase CLI installed"
echo ""

echo "Step 2: Logging in to Firebase..."
echo "(This will open your browser)"
firebase login
if [ $? -ne 0 ]; then
    echo "ERROR: Login failed!"
    exit 1
fi
echo "✓ Logged in successfully"
echo ""

echo "Step 3: Setting project..."
firebase use codeex-ai-v3
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to set project!"
    exit 1
fi
echo "✓ Project set to codeex-ai-v3"
echo ""

echo "Step 4: Deploying storage rules..."
firebase deploy --only storage
if [ $? -ne 0 ]; then
    echo "ERROR: Deployment failed!"
    exit 1
fi

echo ""
echo "========================================"
echo "✓ Deployment Complete!"
echo "========================================"
echo ""
echo "Your storage rules have been deployed."
echo "You can now test image uploads in the app."
echo ""
