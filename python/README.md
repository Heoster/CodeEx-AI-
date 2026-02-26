# Edge TTS Python Server

A reliable Python-based Text-to-Speech server using Microsoft's Edge TTS service.

## Features

- ✅ Uses official `edge-tts` Python library
- ✅ More reliable than direct API calls
- ✅ Supports all Edge TTS voices
- ✅ Adjustable rate and pitch
- ✅ CORS enabled for web apps
- ✅ Simple HTTP API
- ✅ No API key required

## Requirements

- Python 3.8 or higher
- pip (Python package manager)

## Quick Start

### Linux/Mac

```bash
# 1. Setup (first time only)
cd python
chmod +x setup.sh start.sh
./setup.sh

# 2. Start server
./start.sh
```

### Windows

```cmd
# 1. Setup (first time only)
cd python
setup.bat

# 2. Start server
start.bat
```

## Manual Setup

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate.bat

# Install dependencies
pip install -r requirements.txt

# Run server
python edge_tts_server.py
```

## Usage

### Start Server

```bash
python edge_tts_server.py [port]
# Default port: 8765
```

### API Endpoint

**POST** `http://localhost:8765/tts`

**Request Body** (JSON):
```json
{
  "text": "Hello, world!",
  "voice": "en-US-AriaNeural",
  "rate": "+0%",
  "pitch": "+0Hz"
}
```

**Response**: Audio file (MP3)

### Example with curl

```bash
curl -X POST http://localhost:8765/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","voice":"en-US-AriaNeural"}' \
  --output speech.mp3
```

### Example with JavaScript

```javascript
const response = await fetch('http://localhost:8765/tts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Hello, world!',
    voice: 'en-US-AriaNeural',
    rate: '+0%',
    pitch: '+0Hz',
  }),
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();
```

## Available Voices

### English (US)
- `en-US-AriaNeural` (Female)
- `en-US-GuyNeural` (Male)
- `en-US-JennyNeural` (Female)
- `en-US-ChristopherNeural` (Male)
- `en-US-EricNeural` (Male)
- `en-US-MichelleNeural` (Female)

### English (UK)
- `en-GB-SoniaNeural` (Female)
- `en-GB-RyanNeural` (Male)
- `en-GB-LibbyNeural` (Female)

### English (Australia)
- `en-AU-NatashaNeural` (Female)
- `en-AU-WilliamNeural` (Male)

### English (India)
- `en-IN-NeerjaNeural` (Female)
- `en-IN-PrabhatNeural` (Male)

### Other Languages
- Spanish: `es-ES-ElviraNeural`, `es-MX-DaliaNeural`
- French: `fr-FR-DeniseNeural`, `fr-CA-SylvieNeural`
- German: `de-DE-KatjaNeural`, `de-DE-ConradNeural`
- Italian: `it-IT-ElsaNeural`, `it-IT-DiegoNeural`
- Japanese: `ja-JP-NanamiNeural`, `ja-JP-KeitaNeural`
- Korean: `ko-KR-SunHiNeural`, `ko-KR-InJoonNeural`
- Chinese: `zh-CN-XiaoxiaoNeural`, `zh-CN-YunxiNeural`
- Hindi: `hi-IN-SwaraNeural`, `hi-IN-MadhurNeural`

[Full voice list](https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support?tabs=tts)

## Rate and Pitch

### Rate (Speed)
- `-50%` to `+100%`
- Examples: `-20%` (slower), `+0%` (normal), `+50%` (faster)

### Pitch
- `-50Hz` to `+50Hz`
- Examples: `-10Hz` (lower), `+0Hz` (normal), `+10Hz` (higher)

## Integration with Next.js

### 1. Enable Python Server

Add to `.env.local`:
```env
USE_PYTHON_TTS=true
PYTHON_TTS_SERVER_URL=http://localhost:8765/tts
```

### 2. Start Python Server

```bash
cd python
./start.sh  # or start.bat on Windows
```

### 3. Start Next.js App

```bash
npm run dev
```

The Next.js app will automatically use the Python server for TTS generation.

## Production Deployment

### Option 1: Run on Same Server

```bash
# Start Python server in background
cd python
nohup python edge_tts_server.py 8765 > tts.log 2>&1 &

# Start Next.js app
npm run build
npm start
```

### Option 2: Separate Server

Deploy Python server on a separate machine/container:

```bash
# On TTS server
python edge_tts_server.py 8765

# Update Next.js .env
PYTHON_TTS_SERVER_URL=http://tts-server:8765/tts
```

### Option 3: Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY edge_tts_server.py .

EXPOSE 8765
CMD ["python", "edge_tts_server.py", "8765"]
```

## Troubleshooting

### Server won't start

```bash
# Check if port is already in use
# Linux/Mac:
lsof -i :8765
# Windows:
netstat -ano | findstr :8765

# Use different port
python edge_tts_server.py 8766
```

### Connection refused

- Make sure server is running
- Check firewall settings
- Verify port number matches in both server and client

### Audio not playing

- Check browser console for errors
- Verify audio format is supported (MP3)
- Test with curl to verify server is working

## Performance

- **Latency**: ~1-3 seconds for typical sentences
- **Throughput**: Can handle multiple concurrent requests
- **Memory**: ~50-100MB per instance
- **CPU**: Minimal (mostly I/O bound)

## Advantages over Direct API

1. **More Reliable**: Uses official library with better error handling
2. **Easier Debugging**: Python stack traces are clearer
3. **Better Control**: Can add caching, rate limiting, etc.
4. **Offline Capable**: Can cache voices for offline use
5. **Extensible**: Easy to add features like voice cloning

## License

MIT License - Free to use for personal and commercial projects

## Support

For issues or questions:
- Check [edge-tts documentation](https://github.com/rany2/edge-tts)
- Open an issue on GitHub
- Contact: codeex@email.com
