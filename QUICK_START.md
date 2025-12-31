# Quick Start Guide - SaaS Template

Get up and running in less than 5 minutes!

## Prerequisites

- **Node.js 18.0.0** or higher ([download](https://nodejs.org/))
- **pnpm** ([install guide](https://pnpm.io/installation))
- **Firebase Account** (free tier works great) ([sign up](https://firebase.google.com/))
- **Resend Account** (for emails) ([sign up](https://resend.com/))

## Step 1: Clone & Install (1 minute)

```bash
# Clone the repository
git clone https://github.com/yourusername/saas-template.git
cd saas-template

# Install dependencies
pnpm install
```

## Step 2: Firebase Setup (2 minutes)

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name it anything (e.g., "My SaaS"), accept terms, create project
4. Wait for project creation to complete

### Enable Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **"Get started"**
3. Enable **Email/Password** sign-in method
4. Click **Save**

### Create Firestore Database

1. Go to **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Select **Start in production mode**
4. Choose location closest to you
5. Click **"Enable"**

### Get Your Credentials

1. Go to **Project Settings** (gear icon → Project settings)
2. Click the **Web** app (`</>`) if creating a new app
3. Copy these 6 values:
   ```
   apiKey
   authDomain
   projectId
   storageBucket
   messagingSenderId
   appId
   ```

### Generate Service Account Key

1. In **Project Settings**, go to **Service Accounts** tab
2. Click **"Generate New Private Key"**
3. You'll get a JSON file - copy its entire content

## Step 3: Resend Setup (1 minute)

1. Go to [Resend Console](https://resend.com/)
2. Sign up / log in
3. Go to **API Keys**
4. Copy your API Key (starts with `re_`)

## Step 4: Configure Environment (.env.local)

```bash
# Copy example file
cp .env.local.example .env.local

# Edit with your values
nano .env.local  # or use your preferred editor
```

Fill in these variables:

```bash
# Firebase Web App (from step 2 above)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (entire JSON from Service Account Key)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Resend
RESEND_API_KEY=re_your_api_key

# Development URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Step 5: Run Development Server

```bash
pnpm dev
```

Visit **http://localhost:3000**

---

## What Can You Do Now?

### Sign Up
1. Go to http://localhost:3000
2. Click **"Sign up"**
3. Enter email and password
4. Check your email for verification link
5. Click link to verify
6. You're logged in!

### Manage Account
1. Go to http://localhost:3000/dashboard
2. Click **"Settings"**
3. Change email, password, or delete account

---

## Common Issues

### "Firestore initialization failed"
- Make sure Firestore Database is **enabled** in Firebase Console
- Check that your `FIREBASE_SERVICE_ACCOUNT_KEY` is complete (no truncation)

### "Email not sending"
- Verify your `RESEND_API_KEY` is correct (starts with `re_`)
- Check spam/junk folder
- Verify you can access Resend dashboard

### "Email verification token invalid"
- Token expires after 24 hours
- Start signup process again

### Port 3000 already in use
```bash
# Kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm build
```

---

## Next Steps

### 1. Customize
- Edit `/src/app/page.tsx` for landing page
- Update colors in `src/app/globals.css`
- Modify email templates in API routes

### 2. Deploy
- **To Vercel**: Push to GitHub → Connect in Vercel Dashboard
- **To VPS**: Run `sudo ./deploy.sh`
- **To Docker**: Use `docker-compose up -d`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### 3. Add Features
- OAuth (Google, GitHub)
- Two-factor authentication
- User roles and permissions
- Admin dashboard

See [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute features.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, signup, verification pages
│   ├── (dashboard)/         # Dashboard and settings
│   ├── api/auth/            # Authentication API routes
│   ├── globals.css          # Tailwind styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
├── lib/                      # Utilities
│   ├── firebase.ts          # Client Firebase config
│   ├── firebase-admin.ts    # Admin Firebase config
│   └── resend.ts            # Email sending
└── types/                   # TypeScript types
```

---

## Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **Language**: TypeScript
- **Auth**: Firebase Authentication
- **Database**: Firestore
- **Email**: Resend
- **Styling**: Tailwind CSS
- **Deployment**: Vercel, Docker, VPS

---

## Getting Help

- **Full Documentation**: See [README.md](./README.md)
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Security**: See [SECURITY.md](./SECURITY.md)
- **Questions**: Open a GitHub Issue or Discussion
- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Ready to Deploy?

```bash
# Build for production
pnpm build

# Test production build locally
pnpm start

# Then deploy to Vercel, VPS, or Docker!
# See DEPLOYMENT.md for instructions
```

---

**Enjoy building with SaaS Template!**

Questions? Check out [README.md](./README.md) or open a GitHub issue.
