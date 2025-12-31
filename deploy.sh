#!/bin/bash

# SaaS Template Deployment Script
# This script helps deploy the template to a VPS using Docker and Let's Encrypt

set -e

echo "🚀 SaaS Template Deployment Script"
echo "===================================="
echo ""

# Check if running as root (required for certbot and port 80/443)
if [ "$EUID" -ne 0 ]; then 
  echo "❌ This script must be run as root (use sudo)"
  exit 1
fi

# Ask for domain
read -p "Enter your domain (e.g., example.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
  echo "❌ Domain is required"
  exit 1
fi

# Ask for email for Let's Encrypt
read -p "Enter email for Let's Encrypt notifications: " LETSENCRYPT_EMAIL

# Ask for Firebase credentials
read -p "Enter your NEXT_PUBLIC_FIREBASE_API_KEY: " FIREBASE_API_KEY
read -p "Enter your NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: " FIREBASE_AUTH_DOMAIN
read -p "Enter your NEXT_PUBLIC_FIREBASE_PROJECT_ID: " FIREBASE_PROJECT_ID
read -p "Enter your NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: " FIREBASE_STORAGE_BUCKET
read -p "Enter your NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: " FIREBASE_MESSAGING_SENDER_ID
read -p "Enter your NEXT_PUBLIC_FIREBASE_APP_ID: " FIREBASE_APP_ID
read -p "Enter your FIREBASE_SERVICE_ACCOUNT_KEY (paste entire JSON): " FIREBASE_SERVICE_ACCOUNT_KEY
read -p "Enter your RESEND_API_KEY: " RESEND_API_KEY

echo ""
echo "🔧 Creating .env.production..."

# Create .env.production file
cat > .env.production << EOF
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=$FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$FIREBASE_APP_ID

# Firebase Admin SDK (Keep Secret!)
FIREBASE_SERVICE_ACCOUNT_KEY=$FIREBASE_SERVICE_ACCOUNT_KEY

# Resend Email Service
RESEND_API_KEY=$RESEND_API_KEY

# Application Configuration
NEXT_PUBLIC_APP_URL=https://$DOMAIN
NODE_ENV=production
EOF

echo "✅ .env.production created"
echo ""

# Create nginx config
echo "🔧 Creating nginx configuration..."

mkdir -p certbot/conf certbot/www

cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/javascript application/json;

    # HTTP - Redirect to HTTPS
    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        location / {
            return 301 https://\$host\$request_uri;
        }
    }

    # HTTPS - Main server
    server {
        listen 443 ssl http2;
        server_name $DOMAIN www.$DOMAIN;

        ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # Static files - cache for 1 year
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://app:3000;
            proxy_cache_valid 200 365d;
            expires 365d;
        }

        # Proxy to Next.js app
        location / {
            proxy_pass http://app:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

echo "✅ nginx configuration created"
echo ""

# Install Docker if not present
if ! command -v docker &> /dev/null; then
  echo "🐳 Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm get-docker.sh
  echo "✅ Docker installed"
else
  echo "✅ Docker already installed"
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
  echo "🐳 Installing Docker Compose..."
  curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
  echo "✅ Docker Compose installed"
else
  echo "✅ Docker Compose already installed"
fi

# Create certbot certificate
echo ""
echo "🔒 Creating SSL certificate with Let's Encrypt..."
echo "   (This may take a few minutes...)"

docker run -it --rm \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot certonly \
  --webroot \
  -w /var/www/certbot \
  --email "$LETSENCRYPT_EMAIL" \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --agree-tos \
  --non-interactive

if [ $? -eq 0 ]; then
  echo "✅ SSL certificate created successfully"
else
  echo "❌ Failed to create SSL certificate"
  exit 1
fi

echo ""
echo "🚀 Building and starting containers..."

# Build and start containers
docker-compose up -d

# Wait for app to be ready
echo "⏳ Waiting for application to be ready..."
for i in {1..30}; do
  if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Application is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Application failed to start"
    exit 1
  fi
  sleep 2
done

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your application is now running at: https://$DOMAIN"
echo ""
echo "📝 Next steps:"
echo "  1. Update your domain DNS records to point to this server's IP"
echo "  2. Monitor logs: docker-compose logs -f app"
echo "  3. To update the app: git pull && docker-compose up -d --build"
echo "  4. SSL certificate auto-renews every 60 days"
echo ""
echo "❌ To stop the application:"
echo "  docker-compose down"
echo ""
echo "🔄 To restart the application:"
echo "  docker-compose restart"
echo ""
