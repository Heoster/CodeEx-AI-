#!/usr/bin/env python3
"""
Edge TTS Server
A Python-based TTS server using the official edge-tts library
More reliable than direct API calls
"""

import asyncio
import edge_tts
import io
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import json

class TTSHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle POST requests for TTS generation"""
        try:
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            text = data.get('text', '')
            voice = data.get('voice', 'en-US-AriaNeural')
            rate = data.get('rate', '+0%')
            pitch = data.get('pitch', '+0Hz')
            
            # Validate input
            if not text:
                self.send_error(400, 'Text is required')
                return
            
            if len(text) > 5000:
                self.send_error(400, 'Text too long (max 5000 characters)')
                return
            
            print(f"[TTS] Generating speech for: {text[:50]}...")
            print(f"[TTS] Voice: {voice}, Rate: {rate}, Pitch: {pitch}")
            
            # Generate speech using edge-tts
            audio_data = asyncio.run(self.generate_speech(text, voice, rate, pitch))
            
            if not audio_data:
                self.send_error(500, 'Failed to generate speech')
                return
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'audio/mpeg')
            self.send_header('Content-Length', str(len(audio_data)))
            self.send_header('Cache-Control', 'public, max-age=3600')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(audio_data)
            
            print(f"[TTS] Success! Audio size: {len(audio_data)} bytes")
            
        except json.JSONDecodeError:
            self.send_error(400, 'Invalid JSON')
        except Exception as e:
            print(f"[TTS] Error: {str(e)}")
            self.send_error(500, str(e))
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    async def generate_speech(self, text, voice, rate, pitch):
        """Generate speech using edge-tts"""
        try:
            # Create communicate object
            communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
            
            # Generate audio
            audio_buffer = io.BytesIO()
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_buffer.write(chunk["data"])
            
            return audio_buffer.getvalue()
            
        except Exception as e:
            print(f"[TTS] Generation error: {str(e)}")
            return None
    
    def log_message(self, format, *args):
        """Custom log format"""
        print(f"[HTTP] {format % args}")

def run_server(port=8765):
    """Run the TTS server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, TTSHandler)
    print(f"🎙️  Edge TTS Server running on http://localhost:{port}")
    print(f"📝 Send POST requests to http://localhost:{port}/tts")
    print(f"💡 Example: curl -X POST http://localhost:{port}/tts -H 'Content-Type: application/json' -d '{{\"text\":\"Hello world\",\"voice\":\"en-US-AriaNeural\"}}'")
    print(f"\n✅ Server ready!")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped")
        httpd.shutdown()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    run_server(port)
