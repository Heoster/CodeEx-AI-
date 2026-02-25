#!/bin/bash

echo "========================================="
echo "Local Storage Setup"
echo "========================================="
echo ""

# Create uploads directory structure
echo "Creating uploads directory structure..."
mkdir -p public/uploads/user-image
mkdir -p public/uploads/generated-image
mkdir -p public/uploads/generated-video
mkdir -p public/uploads/audio

# Set permissions (Linux/Mac only)
if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "win32" ]]; then
    echo "Setting permissions..."
    chmod 755 public/uploads
    chmod 755 public/uploads/*
fi

# Create .gitkeep files to preserve directory structure
echo "Creating .gitkeep files..."
touch public/uploads/user-image/.gitkeep
touch public/uploads/generated-image/.gitkeep
touch public/uploads/generated-video/.gitkeep
touch public/uploads/audio/.gitkeep

echo ""
echo "✅ Local storage setup complete!"
echo ""
echo "Directory structure:"
echo "  public/uploads/"
echo "    ├── user-image/"
echo "    ├── generated-image/"
echo "    ├── generated-video/"
echo "    └── audio/"
echo ""
echo "Next steps:"
echo "1. Start dev server: npm run dev"
echo "2. Test image upload at /chat"
echo "3. Check uploads in public/uploads/"
echo ""
