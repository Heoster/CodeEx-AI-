@echo off
REM Start Edge TTS Python server (Windows)

echo 🎙️  Starting Edge TTS Server...

REM Check if virtual environment exists
if not exist "venv\" (
    echo ❌ Virtual environment not found. Please run setup.bat first.
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Start server
echo 🚀 Starting server on port 8765...
python edge_tts_server.py 8765
