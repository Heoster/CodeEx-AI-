#!/usr/bin/env pwsh
# Clear Next.js cache and rebuild

Write-Host "🧹 Clearing Next.js cache..." -ForegroundColor Cyan

# Remove .next directory
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✓ Removed .next directory" -ForegroundColor Green
}

# Remove node_modules/.cache
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "✓ Removed node_modules/.cache" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Cache cleared successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run: npm run dev" -ForegroundColor White
Write-Host "  2. Test the API routes" -ForegroundColor White
Write-Host ""
