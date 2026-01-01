# Deployment Guide - SaaS Authentication Template

This guide covers deploying the SaaS Template to production using various platforms.

## Table of Contents

1. [Quick Start (Docker)](#quick-start-docker)
2. [Vercel Deployment](#vercel-deployment)
3. [VPS Deployment (Ubuntu 22.04)](#vps-deployment-ubuntu-2204)
4. [Docker Deployment](#docker-deployment)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start (Docker)

The easiest way to deploy locally or on any server:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd saas-template

# 2. Copy environment file and fill in your credentials
cp .env.example .env.local

# 3. Start with Docker Compose
docker-compose up -d

# 4. Access at http://localhost:3000
```

---

## Vercel Deployment

Vercel is the recommended platform for Next.js applications.

### Step 1: Prepare Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select Next.js as framework (auto-detected)
5. Configure build settings:
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

### Step 3: Set Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
NEXT_PUBLIC_FIREBASE_APP_ID=your_value
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
FIREBASE_SERVICE_ACCOUNT_KEY=your_json_key
RESEND_API_KEY=your_key
NODE_ENV=production
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Access your app at `https://your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. In Vercel Settings → Domains
2. Add your custom domain
3. Update your DNS provider with Vercel's nameservers

---

## VPS Deployment (Ubuntu 22.04)

### Prerequisites

- Ubuntu 22.04 LTS server
- Root or sudo access
- Domain name
- Email for Let's Encrypt notifications

### Step 1: Prepare Server

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y curl git
```

### Step 2: Automated Deployment

We provide a deployment script that handles everything:

```bash
# Clone the repository
git clone <your-repo-url>
cd saas-template

# Make deploy script executable
chmod +x deploy.sh

# Run deployment script (requires root)
sudo ./deploy.sh
```

The script will:
- Create `.env.production` with your credentials
- Install Docker and Docker Compose
- Generate SSL certificate with Let's Encrypt
- Build and start containers
- Configure nginx reverse proxy

### Step 3: Manual DNS Configuration

Update your domain's DNS records to point to your server:

```
A Record:    your-domain.com    → your-server-ip
A Record:    www.your-domain.com → your-server-ip
```

Allow 24 hours for DNS propagation.

### Step 4: Verify Deployment

```bash
# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f app

# Test SSL
curl -I https://your-domain.com
```

### Step 5: Automatic Updates

Setup auto-updates via cron:

```bash
# Edit crontab
crontab -e

# Add this line to pull updates daily at 2 AM
0 2 * * * cd /path/to/saas-template && git pull && docker-compose up -d --build
```

---

## Docker Deployment

### Local Development

```bash
# Build image
docker build -t saas-template:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_value \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value \
  -e NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value \
  -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value \
  -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value \
  -e NEXT_PUBLIC_FIREBASE_APP_ID=your_value \
  -e FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}' \
  -e RESEND_API_KEY=your_key \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  saas-template:latest

# Access at http://localhost:3000
```

### Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag saas-template:latest yourusername/saas-template:latest

# Push image
docker push yourusername/saas-template:latest

# Later, pull and run
docker pull yourusername/saas-template:latest
docker run -p 3000:3000 -e ... yourusername/saas-template:latest
```

### Docker Compose (Recommended)

```bash
# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services:**
- **app**: Next.js application (port 3000)
- **nginx**: Reverse proxy with SSL (ports 80, 443)
- **certbot**: Automatic SSL certificate renewal

---

## Environment Variables Reference

### Firebase Configuration

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Project Settings → Web App |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase Console → Project Settings → Service Accounts (entire JSON) |

### Application Configuration

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend API key (starts with `re_`) |
| `NEXT_PUBLIC_APP_URL` | Your application URL (used for email links) |
| `NODE_ENV` | Set to `production` in production |

---

## Monitoring

### View Logs

```bash
# Real-time app logs
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app

# Nginx logs
docker-compose logs -f nginx
```

### Health Check

```bash
# Check if app is running
curl http://localhost:3000/health

# Over HTTPS
curl https://your-domain.com/health
```

### Resource Usage

```bash
# Check container resource usage
docker stats

# View disk usage
docker system df
```

---

## Updates and Maintenance

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Update Dependencies

```bash
# Update packages
pnpm update

# Rebuild
docker-compose up -d --build
```

### SSL Certificate Renewal

Let's Encrypt certificates are valid for 90 days. The `certbot` service in docker-compose automatically renews them every 60 days.

To manually renew:

```bash
docker-compose exec certbot certbot renew --quiet
```

### Database Backups

Since this template uses Firebase (no local database), backups are handled by Firebase automatically. However, you can export Firestore data:

1. Go to Firebase Console
2. Firestore Database → Data → Export Collections
3. Choose Cloud Storage bucket for export

---

## Troubleshooting

### Common Issues

#### 1. "Connection refused" or "Cannot reach application"

```bash
# Check if containers are running
docker-compose ps

# If not running, start them
docker-compose up -d

# Check logs for errors
docker-compose logs app
```

#### 2. SSL Certificate Issues

```bash
# Check certificate status
docker-compose logs certbot

# Manually renew
docker-compose exec certbot certbot renew

# Verify certificate
openssl s_client -connect your-domain.com:443
```

#### 3. "Firebase initialization error"

- Verify `FIREBASE_SERVICE_ACCOUNT_KEY` is complete JSON (no truncation)
- Ensure service account has proper permissions
- Check that Firestore is enabled in Firebase Console

#### 4. "Email not sending" (Resend)

- Verify `RESEND_API_KEY` starts with `re_`
- Check that sender domain is verified in Resend Console
- In development, check logs: `docker-compose logs app | grep -i email`

#### 5. "Port already in use"

```bash
# If port 3000 is in use
# Change in docker-compose.yml:
# ports:
#   - "3001:3000"

# Or stop the conflicting service
sudo lsof -i :3000
sudo kill -9 <PID>
```

#### 6. "Certbot certificate creation failed"

```bash
# Ensure DNS is pointing to your server
nslookup your-domain.com

# Check that port 80 is accessible
nc -zv your-domain.com 80

# Check nginx logs
docker-compose logs nginx
```

---

## Performance Optimization

### Enable Compression

The docker-compose and nginx configs already include gzip compression. Verify:

```bash
curl -I -H "Accept-Encoding: gzip" https://your-domain.com
# Should see: Content-Encoding: gzip
```

### Cache Static Assets

Static assets are cached for 1 year in nginx. To cache-bust, update filenames in Next.js build.

### Database Optimization

- Create Firestore indexes for frequently queried fields
- Monitor Firestore usage in Firebase Console → Firestore Database → Usage
- Archive old data using Firebase scheduled functions

---

## Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] Firestore security rules restrict unauthorized access
- [ ] Email domain is verified in Resend
- [ ] Firebase project has limited API key restrictions
- [ ] SSL certificate is valid (check regularly)
- [ ] Regular security updates: `docker-compose up -d --build`
- [ ] Monitor Firebase Cloud Audit Logs
- [ ] Implement rate limiting for API routes
- [ ] Use strong, randomly generated credentials
- [ ] Enable 2FA on Firebase Console and GitHub

---

## Support and Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Docker Documentation](https://docs.docker.com/)
- [Let's Encrypt](https://letsencrypt.org/docs/)
- [nginx Configuration](https://nginx.org/en/docs/)

---

## Questions?

Check the main [README.md](./README.md) for more information about setup, configuration, and customization.
