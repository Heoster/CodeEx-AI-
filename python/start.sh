#!/bin/bash
# Start Edge TTS Python server

echo "🎙️  Starting Edge TTS Server..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Start server
echo "🚀 Starting server on port 8765..."
python edge_tts_server.py 8765
