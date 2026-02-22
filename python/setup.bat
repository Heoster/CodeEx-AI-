@echo off
REM Setup script for Edge TTS Python server (Windows)

echo 🎙️  Setting up Edge TTS Python Server...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

echo ✅ Python found
python --version

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo 📥 Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

echo.
echo ✅ Setup complete!
echo.
echo To start the server:
echo   1. Activate virtual environment: venv\Scripts\activate.bat
echo   2. Run server: python edge_tts_server.py
echo.
echo Or use the start script: start.bat
