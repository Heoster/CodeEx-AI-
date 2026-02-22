#!/usr/bin/env python3
"""
Edge TTS Server - Production Version
A production-ready TTS server with caching, rate limiting, monitoring, and security
"""

import asyncio
import edge_tts
import io
import sys
import os
import hashlib
import time
import logging
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
from pathlib import Path
import json
from collections import defaultdict
from threading import Lock

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('tts_server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('EdgeTTS')

# Configuration
CACHE_DIR = Path('cache')
CACHE_ENABLED = os.getenv('CACHE_ENABLED', 'true').lower() == 'true'
CACHE_MAX_SIZE_MB = int(os.getenv('CACHE_MAX_SIZE_MB', '500'))
RATE_LIMIT_REQUESTS = int(os.getenv('RATE_LIMIT_REQUESTS', '100'))
RATE_LIMIT_WINDOW = int(os.getenv('RATE_LIMIT_WINDOW', '60'))
API_KEY = os.getenv('TTS_API_KEY', '')  # Optional API key for authentication
MAX_TEXT_LENGTH = int(os.getenv('MAX_TEXT_LENGTH', '5000'))
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*').split(',')

# Create cache directory
if CACHE_ENABLED:
    CACHE_DIR.mkdir(exist_ok=True)
    logger.info(f"Cache enabled: {CACHE_DIR} (max {CACHE_MAX_SIZE_MB}MB)")

# Rate limiting storage
rate_limit_data = defaultdict(list)
rate_limit_lock = Lock()

# Statistics
stats = {
    'total_requests': 0,
    'cache_hits': 0,
    'cache_misses': 0,
    'errors': 0,
    'rate_limited': 0,
    'start_time': time.time()
}
stats_lock = Lock()

class ProductionTTSHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests for health check and stats"""
        if self.path == '/health':
            self.send_health_check()
        elif self.path == '/stats':
            self.send_stats()
        else:
            self.send_error(404, 'Not Found')
    
    def do_POST(self):
        """Handle POST requests for TTS generation"""
        with stats_lock:
            stats['total_requests'] += 1
        
        try:
            # Check rate limit
            if not self.check_rate_limit():
                with stats_lock:
                    stats['rate_limited'] += 1
                self.send_error(429, 'Too Many Requests')
                logger.warning(f"Rate limited: {self.client_address[0]}")
                return
            
            # Check API key if configured
            if API_KEY and not self.check_api_key():
                self.send_error(401, 'Unauthorized')
                logger.warning(f"Unauthorized access: {self.client_address[0]}")
                return
            
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
            
            if len(text) > MAX_TEXT_LENGTH:
                self.send_error(400, f'Text too long (max {MAX_TEXT_LENGTH} characters)')
                return
            
            logger.info(f"Request from {self.client_address[0]}: {text[:50]}... (voice: {voice})")
            
            # Check cache
            cache_key = self.get_cache_key(text, voice, rate, pitch)
            cached_audio = self.get_from_cache(cache_key)
            
            if cached_audio:
                with stats_lock:
                    stats['cache_hits'] += 1
                logger.info(f"Cache hit: {cache_key}")
                self.send_audio_response(cached_audio)
                return
            
            # Generate speech
            with stats_lock:
                stats['cache_misses'] += 1
            
            audio_data = asyncio.run(self.generate_speech(text, voice, rate, pitch))
            
            if not audio_data:
                with stats_lock:
                    stats['errors'] += 1
                self.send_error(500, 'Failed to generate speech')
                return
            
            # Save to cache
            if CACHE_ENABLED:
                self.save_to_cache(cache_key, audio_data)
            
            # Send response
            self.send_audio_response(audio_data)
            logger.info(f"Generated: {len(audio_data)} bytes")
            
        except json.JSONDecodeError:
            with stats_lock:
                stats['errors'] += 1
            self.send_error(400, 'Invalid JSON')
            logger.error("Invalid JSON in request")
        except Exception as e:
            with stats_lock:
                stats['errors'] += 1
            logger.error(f"Error: {str(e)}", exc_info=True)
            self.send_error(500, str(e))
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_cors_headers()
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key')
        self.end_headers()
    
    def send_cors_headers(self):
        """Send CORS headers"""
        origin = self.headers.get('Origin', '')
        if '*' in ALLOWED_ORIGINS or origin in ALLOWED_ORIGINS:
            self.send_header('Access-Control-Allow-Origin', origin or '*')
        self.send_header('Access-Control-Allow-Credentials', 'true')
    
    def check_rate_limit(self):
        """Check if request is within rate limit"""
        if RATE_LIMIT_REQUESTS <= 0:
            return True
        
        ip = self.client_address[0]
        now = time.time()
        
        with rate_limit_lock:
            # Clean old requests
            rate_limit_data[ip] = [
                t for t in rate_limit_data[ip]
                if now - t < RATE_LIMIT_WINDOW
            ]
            
            # Check limit
            if len(rate_limit_data[ip]) >= RATE_LIMIT_REQUESTS:
                return False
            
            # Add current request
            rate_limit_data[ip].append(now)
            return True
    
    def check_api_key(self):
        """Check API key if configured"""
        if not API_KEY:
            return True
        
        provided_key = self.headers.get('X-API-Key', '')
        return provided_key == API_KEY
    
    def get_cache_key(self, text, voice, rate, pitch):
        """Generate cache key from parameters"""
        content = f"{text}|{voice}|{rate}|{pitch}"
        return hashlib.sha256(content.encode()).hexdigest()
    
    def get_from_cache(self, cache_key):
        """Get audio from cache"""
        if not CACHE_ENABLED:
            return None
        
        cache_file = CACHE_DIR / f"{cache_key}.mp3"
        if cache_file.exists():
            try:
                return cache_file.read_bytes()
            except Exception as e:
                logger.error(f"Cache read error: {e}")
        return None
    
    def save_to_cache(self, cache_key, audio_data):
        """Save audio to cache"""
        if not CACHE_ENABLED:
            return
        
        try:
            cache_file = CACHE_DIR / f"{cache_key}.mp3"
            cache_file.write_bytes(audio_data)
            
            # Check cache size and clean if needed
            self.clean_cache_if_needed()
        except Exception as e:
            logger.error(f"Cache write error: {e}")
    
    def clean_cache_if_needed(self):
        """Clean cache if it exceeds max size"""
        try:
            total_size = sum(f.stat().st_size for f in CACHE_DIR.glob('*.mp3'))
            max_size = CACHE_MAX_SIZE_MB * 1024 * 1024
            
            if total_size > max_size:
                logger.info(f"Cache size {total_size/1024/1024:.1f}MB exceeds limit, cleaning...")
                
                # Sort by access time and delete oldest
                files = sorted(CACHE_DIR.glob('*.mp3'), key=lambda f: f.stat().st_atime)
                for f in files:
                    f.unlink()
                    total_size -= f.stat().st_size
                    if total_size <= max_size * 0.8:  # Clean to 80% of max
                        break
                
                logger.info(f"Cache cleaned to {total_size/1024/1024:.1f}MB")
        except Exception as e:
            logger.error(f"Cache clean error: {e}")
    
    async def generate_speech(self, text, voice, rate, pitch):
        """Generate speech using edge-tts"""
        try:
            communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
            
            audio_buffer = io.BytesIO()
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_buffer.write(chunk["data"])
            
            return audio_buffer.getvalue()
            
        except Exception as e:
            logger.error(f"Generation error: {str(e)}", exc_info=True)
            return None
    
    def send_audio_response(self, audio_data):
        """Send audio response"""
        self.send_response(200)
        self.send_header('Content-Type', 'audio/mpeg')
        self.send_header('Content-Length', str(len(audio_data)))
        self.send_header('Cache-Control', 'public, max-age=3600')
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(audio_data)
    
    def send_health_check(self):
        """Send health check response"""
        uptime = time.time() - stats['start_time']
        health = {
            'status': 'healthy',
            'uptime_seconds': int(uptime),
            'cache_enabled': CACHE_ENABLED,
            'rate_limit': f"{RATE_LIMIT_REQUESTS}/{RATE_LIMIT_WINDOW}s"
        }
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(health).encode())
    
    def send_stats(self):
        """Send statistics response"""
        uptime = time.time() - stats['start_time']
        cache_hit_rate = 0
        if stats['cache_hits'] + stats['cache_misses'] > 0:
            cache_hit_rate = stats['cache_hits'] / (stats['cache_hits'] + stats['cache_misses']) * 100
        
        statistics = {
            'uptime_seconds': int(uptime),
            'total_requests': stats['total_requests'],
            'cache_hits': stats['cache_hits'],
            'cache_misses': stats['cache_misses'],
            'cache_hit_rate': f"{cache_hit_rate:.1f}%",
            'errors': stats['errors'],
            'rate_limited': stats['rate_limited'],
            'requests_per_second': stats['total_requests'] / uptime if uptime > 0 else 0
        }
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(statistics, indent=2).encode())
    
    def log_message(self, format, *args):
        """Custom log format"""
        logger.info(f"{self.client_address[0]} - {format % args}")

def run_production_server(port=8765):
    """Run the production TTS server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, ProductionTTSHandler)
    
    logger.info("=" * 60)
    logger.info("🎙️  Edge TTS Production Server")
    logger.info("=" * 60)
    logger.info(f"Port: {port}")
    logger.info(f"Cache: {'Enabled' if CACHE_ENABLED else 'Disabled'}")
    if CACHE_ENABLED:
        logger.info(f"Cache Size: {CACHE_MAX_SIZE_MB}MB")
    logger.info(f"Rate Limit: {RATE_LIMIT_REQUESTS} requests per {RATE_LIMIT_WINDOW}s")
    logger.info(f"Max Text Length: {MAX_TEXT_LENGTH} characters")
    logger.info(f"API Key: {'Required' if API_KEY else 'Not required'}")
    logger.info(f"Allowed Origins: {', '.join(ALLOWED_ORIGINS)}")
    logger.info("=" * 60)
    logger.info(f"Endpoints:")
    logger.info(f"  POST /tts - Generate speech")
    logger.info(f"  GET /health - Health check")
    logger.info(f"  GET /stats - Statistics")
    logger.info("=" * 60)
    logger.info("✅ Server ready!")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("\n🛑 Server stopped")
        httpd.shutdown()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    run_production_server(port)
