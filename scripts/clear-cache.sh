#!/bin/bash
# Clear Next.js cache and rebuild

echo "🧹 Clearing Next.js cache..."

# Remove .next directory
if [ -d ".next" ]; then
    rm -rf .next
    echo "✓ Removed .next directory"
fi

# Remove node_modules/.cache
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "✓ Removed node_modules/.cache"
fi

echo ""
echo "✨ Cache cleared successfully!"
echo ""
echo "Next steps:"
echo "  1. Run: npm run dev"
echo "  2. Test the API routes"
echo ""
