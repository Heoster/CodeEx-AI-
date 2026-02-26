# Edge TTS Server - Production Deployment Guide

Complete guide for deploying the Edge TTS server to production with Docker, systemd, or cloud platforms.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Docker Deployment](#docker-deployment)
4. [Systemd Deployment](#systemd-deployment)
5. [Nginx Configuration](#nginx-configuration)
6. [Cloud Deployment](#cloud-deployment)
7. [Monitoring](#monitoring)
8. [Security](#security)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

- Python 3.8+ or Docker
- Linux server (Ubuntu 20.04+ recommended)
- Root/sudo access
- Domain name (optional, for HTTPS)

## Deployment Options

### Option 1: Docker (Recommended)
- ✅ Easy to deploy
- ✅ Isolated environment
- ✅ Easy to scale
- ✅ Automatic restarts

### Option 2: Systemd Service
- ✅ Native Linux integration
- ✅ Better performance
- ✅ System-level monitoring
- ✅ More control

### Option 3: Cloud Platforms
- ✅ Managed infrastructure
- ✅ Auto-scaling
- ✅ Global distribution
- ✅ Built-in monitoring

## Docker Deployment

### Quick Start

```bash
# 1. Clone repository
cd python

# 2. Build and run with Docker Compose
docker-compose up -d

# 3. Check status
docker-compose ps
docker-compose logs -f
```

### Manual Docker Build

```bash
# Build image
docker build -t edge-tts-server .

# Run container
docker run -d \
  --name edge-tts \
  -p 8765:8765 \
  -v $(pwd)/cache:/app/cache \
  -e CACHE_ENABLED=true \
  -e RATE_LIMIT_REQUESTS=100 \
  --restart unless-stopped \
  edge-tts-server

# Check logs
docker logs -f edge-tts

# Check health
curl http://localhost:8765/health
```

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  edge-tts:
    build: .
    ports:
      - "8765:8765"
    environment:
      - CACHE_ENABLED=true
      - CACHE_MAX_SIZE_MB=500
      - RATE_LIMIT_REQUESTS=100
      - RATE_LIMIT_WINDOW=60
      - ALLOWED_ORIGINS=https://codeex-ai.netlify.app
    volumes:
      - ./cache:/app/cache
      - ./logs:/app/logs
    restart: unless-stopped
```

### Docker Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart

# View logs
docker-compose logs -f

# Update
docker-compose pull
docker-compose up -d

# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Systemd Deployment

### Automated Deployment

```bash
# Run deployment script
sudo chmod +x deploy.sh
sudo ./deploy.sh
```

### Manual Deployment

#### 1. Setup Directory

```bash
sudo mkdir -p /var/www/codeex/python
sudo mkdir -p /var/log/edge-tts
cd /var/www/codeex/python
```

#### 2. Copy Files

```bash
sudo cp edge_tts_server_production.py /var/www/codeex/python/
sudo cp requirements.txt /var/www/codeex/python/
sudo cp .env.production /var/www/codeex/python/
```

#### 3. Setup Python Environment

```bash
cd /var/www/codeex/python
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

#### 4. Configure Environment

Edit `/var/www/codeex/python/.env.production`:

```env
CACHE_ENABLED=true
CACHE_MAX_SIZE_MB=500
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
TTS_API_KEY=your_secret_key_here
ALLOWED_ORIGINS=https://codeex-ai.netlify.app,https://codeex-ai.vercel.app
```

#### 5. Install Systemd Service

```bash
sudo cp edge-tts.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable edge-tts
sudo systemctl start edge-tts
```

#### 6. Check Status

```bash
sudo systemctl status edge-tts
sudo journalctl -u edge-tts -f
```

### Systemd Commands

```bash
# Start
sudo systemctl start edge-tts

# Stop
sudo systemctl stop edge-tts

# Restart
sudo systemctl restart edge-tts

# Status
sudo systemctl status edge-tts

# Enable auto-start
sudo systemctl enable edge-tts

# Disable auto-start
sudo systemctl disable edge-tts

# View logs
sudo journalctl -u edge-tts -f
sudo journalctl -u edge-tts --since today
```

## Nginx Configuration

### Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### Configure Nginx

```bash
# Copy configuration
sudo cp nginx.conf /etc/nginx/sites-available/edge-tts

# Enable site
sudo ln -s /etc/nginx/sites-available/edge-tts /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d tts.codeex-ai.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/edge-tts-access.log
sudo tail -f /var/log/nginx/edge-tts-error.log
```

## Cloud Deployment

### AWS (Elastic Beanstalk)

1. **Create Dockerfile** (already provided)

2. **Create `Dockerrun.aws.json`**:
```json
{
  "AWSEBDockerrunVersion": "1",
  "Image": {
    "Name": "edge-tts-server",
    "Update": "true"
  },
  "Ports": [
    {
      "ContainerPort": 8765,
      "HostPort": 8765
    }
  ]
}
```

3. **Deploy**:
```bash
eb init -p docker edge-tts-server
eb create edge-tts-prod
eb deploy
```

### Google Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/edge-tts

# Deploy
gcloud run deploy edge-tts \
  --image gcr.io/PROJECT_ID/edge-tts \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8765
```

### Azure Container Instances

```bash
# Create resource group
az group create --name edge-tts-rg --location eastus

# Deploy container
az container create \
  --resource-group edge-tts-rg \
  --name edge-tts \
  --image edge-tts-server \
  --dns-name-label edge-tts \
  --ports 8765
```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Select Docker as build method
3. Set port to 8765
4. Deploy

### Heroku

```bash
# Login
heroku login
heroku container:login

# Create app
heroku create edge-tts-server

# Deploy
heroku container:push web
heroku container:release web

# Open
heroku open
```

## Monitoring

### Health Check

```bash
# Check if server is running
curl http://localhost:8765/health

# Expected response:
{
  "status": "healthy",
  "uptime_seconds": 3600,
  "cache_enabled": true,
  "rate_limit": "100/60s"
}
```

### Statistics

```bash
# Get server statistics
curl http://localhost:8765/stats

# Expected response:
{
  "uptime_seconds": 3600,
  "total_requests": 1234,
  "cache_hits": 890,
  "cache_misses": 344,
  "cache_hit_rate": "72.1%",
  "errors": 5,
  "rate_limited": 12,
  "requests_per_second": 0.34
}
```

### Monitoring Tools

#### Prometheus

Add to `docker-compose.yml`:
```yaml
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

#### Grafana

```yaml
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

#### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake
- Better Uptime

### Log Monitoring

```bash
# Real-time logs
tail -f /var/log/edge-tts/access.log
tail -f /var/log/edge-tts/error.log

# Search logs
grep "ERROR" /var/log/edge-tts/error.log
grep "rate_limited" /var/log/edge-tts/access.log

# Log rotation
sudo logrotate -f /etc/logrotate.d/edge-tts
```

## Security

### API Key Authentication

1. **Generate API Key**:
```bash
openssl rand -hex 32
```

2. **Set in Environment**:
```env
TTS_API_KEY=your_generated_key_here
```

3. **Use in Requests**:
```bash
curl -X POST http://localhost:8765/tts \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_generated_key_here" \
  -d '{"text":"Hello"}'
```

### Firewall Configuration

```bash
# Allow only specific IPs
sudo ufw allow from 1.2.3.4 to any port 8765

# Or allow from specific network
sudo ufw allow from 10.0.0.0/8 to any port 8765

# Enable firewall
sudo ufw enable
```

### Rate Limiting

Configure in `.env.production`:
```env
RATE_LIMIT_REQUESTS=100  # Max requests
RATE_LIMIT_WINDOW=60     # Time window in seconds
```

### CORS Configuration

```env
# Allow specific origins
ALLOWED_ORIGINS=https://codeex-ai.netlify.app,https://codeex-ai.vercel.app

# Allow all (not recommended for production)
ALLOWED_ORIGINS=*
```

### SSL/TLS

Always use HTTPS in production:
- Use Let's Encrypt for free SSL certificates
- Configure Nginx as reverse proxy
- Enable HSTS headers

## Troubleshooting

### Server Won't Start

```bash
# Check logs
sudo journalctl -u edge-tts -n 50

# Check if port is in use
sudo lsof -i :8765
sudo netstat -tulpn | grep 8765

# Check Python environment
source /var/www/codeex/python/venv/bin/activate
python --version
pip list
```

### High Memory Usage

```bash
# Check memory
free -h
docker stats

# Reduce cache size
# Edit .env.production:
CACHE_MAX_SIZE_MB=100

# Restart service
sudo systemctl restart edge-tts
```

### Slow Response Times

```bash
# Check server load
top
htop

# Check network
ping localhost
curl -w "@curl-format.txt" http://localhost:8765/health

# Increase workers (if using gunicorn)
# Add to systemd service:
ExecStart=/path/to/gunicorn -w 4 -b 0.0.0.0:8765 app:app
```

### Cache Issues

```bash
# Clear cache
rm -rf /var/www/codeex/python/cache/*

# Disable cache temporarily
# Edit .env.production:
CACHE_ENABLED=false

# Restart
sudo systemctl restart edge-tts
```

### Connection Refused

```bash
# Check if service is running
sudo systemctl status edge-tts

# Check firewall
sudo ufw status

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Test locally
curl http://localhost:8765/health
```

## Performance Optimization

### Caching Strategy

```env
# Aggressive caching for production
CACHE_ENABLED=true
CACHE_MAX_SIZE_MB=1000
```

### Load Balancing

Use Nginx upstream:
```nginx
upstream edge_tts {
    server 127.0.0.1:8765;
    server 127.0.0.1:8766;
    server 127.0.0.1:8767;
    keepalive 32;
}
```

### CDN Integration

Use CloudFlare or AWS CloudFront to cache audio files globally.

## Backup and Recovery

### Backup Cache

```bash
# Backup
tar -czf cache-backup-$(date +%Y%m%d).tar.gz /var/www/codeex/python/cache

# Restore
tar -xzf cache-backup-20260222.tar.gz -C /var/www/codeex/python/
```

### Backup Configuration

```bash
# Backup
cp /var/www/codeex/python/.env.production /backup/
cp /etc/systemd/system/edge-tts.service /backup/
cp /etc/nginx/sites-available/edge-tts /backup/
```

## Scaling

### Horizontal Scaling

Run multiple instances:
```bash
# Instance 1
python edge_tts_server_production.py 8765

# Instance 2
python edge_tts_server_production.py 8766

# Instance 3
python edge_tts_server_production.py 8767
```

Configure Nginx load balancer (see above).

### Vertical Scaling

Increase server resources:
- More CPU cores
- More RAM
- Faster disk (SSD)

## Cost Optimization

### Free Tier Options

- **Heroku**: 550-1000 free hours/month
- **Google Cloud Run**: 2M requests/month free
- **AWS Lambda**: 1M requests/month free
- **Azure Functions**: 1M requests/month free

### Paid Options

- **DigitalOcean**: $5/month droplet
- **Linode**: $5/month instance
- **Vultr**: $5/month instance
- **AWS EC2**: t3.micro ~$8/month

## Support

For issues or questions:
- Check logs: `sudo journalctl -u edge-tts -f`
- Test health: `curl http://localhost:8765/health`
- View stats: `curl http://localhost:8765/stats`
- Email: codeex@email.com

---

**Last Updated**: February 22, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
