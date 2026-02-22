#!/bin/bash
# Production deployment script for Edge TTS Server

set -e

echo "🚀 Deploying Edge TTS Server to Production..."

# Configuration
DEPLOY_USER="www-data"
DEPLOY_PATH="/var/www/codeex/python"
SERVICE_NAME="edge-tts"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

echo -e "${YELLOW}Step 1: Creating deployment directory...${NC}"
mkdir -p $DEPLOY_PATH
mkdir -p /var/log/edge-tts

echo -e "${YELLOW}Step 2: Copying files...${NC}"
cp edge_tts_server_production.py $DEPLOY_PATH/
cp requirements.txt $DEPLOY_PATH/
cp .env.production $DEPLOY_PATH/

echo -e "${YELLOW}Step 3: Setting up Python environment...${NC}"
cd $DEPLOY_PATH
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo -e "${YELLOW}Step 4: Setting permissions...${NC}"
chown -R $DEPLOY_USER:$DEPLOY_USER $DEPLOY_PATH
chown -R $DEPLOY_USER:$DEPLOY_USER /var/log/edge-tts
chmod 755 $DEPLOY_PATH
chmod 644 $DEPLOY_PATH/*.py
chmod 644 $DEPLOY_PATH/.env.production

echo -e "${YELLOW}Step 5: Installing systemd service...${NC}"
cp edge-tts.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable $SERVICE_NAME
systemctl restart $SERVICE_NAME

echo -e "${YELLOW}Step 6: Checking service status...${NC}"
sleep 2
systemctl status $SERVICE_NAME --no-pager

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Service commands:"
echo "  sudo systemctl status $SERVICE_NAME"
echo "  sudo systemctl restart $SERVICE_NAME"
echo "  sudo systemctl stop $SERVICE_NAME"
echo "  sudo journalctl -u $SERVICE_NAME -f"
echo ""
echo "Test the server:"
echo "  curl http://localhost:8765/health"
echo ""
echo "View logs:"
echo "  tail -f /var/log/edge-tts/access.log"
echo "  tail -f /var/log/edge-tts/error.log"
