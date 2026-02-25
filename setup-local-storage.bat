@echo off
echo =========================================
echo Local Storage Setup
echo =========================================
echo.

REM Create uploads directory structure
echo Creating uploads directory structure...
if not exist "public\uploads\user-image" mkdir "public\uploads\user-image"
if not exist "public\uploads\generated-image" mkdir "public\uploads\generated-image"
if not exist "public\uploads\generated-video" mkdir "public\uploads\generated-video"
if not exist "public\uploads\audio" mkdir "public\uploads\audio"

REM Create .gitkeep files to preserve directory structure
echo Creating .gitkeep files...
type nul > "public\uploads\user-image\.gitkeep"
type nul > "public\uploads\generated-image\.gitkeep"
type nul > "public\uploads\generated-video\.gitkeep"
type nul > "public\uploads\audio\.gitkeep"

echo.
echo ✓ Local storage setup complete!
echo.
echo Directory structure:
echo   public\uploads\
echo     ├── user-image\
echo     ├── generated-image\
echo     ├── generated-video\
echo     └── audio\
echo.
echo Next steps:
echo 1. Start dev server: npm run dev
echo 2. Test image upload at /chat
echo 3. Check uploads in public\uploads\
echo.
pause
