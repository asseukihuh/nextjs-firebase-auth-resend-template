# Next.js Firebase Auth + Resend Template

A production-ready authentication template for Next.js with Firebase, Resend email verification, and complete account management.

## Features

- **Firebase Authentication** - Secure login/signup
- **Email Verification** - Token-based verification with Resend
- **Account Management** - Email changes, password resets, account deletion
- **Minimalist Dashboard** - Clean and functional interface
- **Responsive Design** - Mobile-friendly with Tailwind CSS
- **Production-Ready** - Deploy to Vercel, VPS, or any platform

## Prerequisites

- Node.js 18+ and pnpm
- Firebase account (Firestore Database + Authentication)
- Resend account for transactional emails

## Installation & Setup

### 1. Clone and install

```bash
git clone https://github.com/asseukihuh/nextjs-firebase-auth-resend-template.git
cd nextjs-firebase-auth-resend-template
pnpm install
```

### 2. Firebase Configuration

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activez **Authentication** (Email/Password)
3. Créez une **Firestore Database** en mode production
4. Dans Settings → Service Accounts, générez une clé JSON (pour Firebase Admin SDK)
5. Créez une Web App et copiez les credentials

### 3. Configuration Resend

1. Créez un compte sur [Resend](https://resend.com)
2. Vérifiez votre domaine ou utilisez le domaine Resend par défaut
3. Générez une API Key

### 4. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Firebase (Web App)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","...":"..."}'

# Resend Email
RESEND_API_KEY=re_xxxxxxxxxxxxx

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Où trouver chaque valeur :**

| Variable | Localisation | Notes |
|----------|--------------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Settings → Web App → apiKey | Public, peut être versionné |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console → Settings → Web App → authDomain | Format: `project-id.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console → Settings | ID du projet |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console → Settings → Web App → storageBucket | |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Settings → Web App → messagingSenderId | |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Settings → Web App → appId | |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase Console → Settings → Service Accounts → Generate New Private Key | **GARDEZ SECRET** |
| `RESEND_API_KEY` | Resend Dashboard → API Keys | **GARDEZ SECRET** |

### 5. Configuration Firestore

Les collections seront créées automatiquement au premier usage :

```
Firestore Database
├── users/
│   └── {uid}
│       ├── email: string
│       ├── username: string
│       ├── emailVerified: boolean
│       ├── emailVerifiedAt: timestamp
│       ├── createdAt: timestamp
│       └── ...
├── verification_tokens/
│   └── {uid}
│       ├── token: string (32 bytes hex)
│       ├── expiresAt: timestamp (24h)
│       └── email: string
└── email_change_requests/
    └── {uid}
        ├── token: string (32 bytes hex)
        ├── newEmail: string
        ├── expiresAt: timestamp (24h)
        └── createdAt: timestamp
```

## Démarrage

```bash
# Développement
pnpm dev

# Build pour production
pnpm build

# Production (serveur)
pnpm start
```

L'application sera disponible sur `http://localhost:3000`

## Structure du Projet

```
src/
├── app/
│   ├── (auth)/                    # Routes d'authentification
│   │   ├── auth/login/
│   │   ├── auth/signup/
│   │   ├── auth/verify-email/
│   │   ├── auth/confirm-email-change/
│   │   └── verify-email-sent/
│   ├── (dashboard)/               # Routes protégées
│   │   └── dashboard/
│   │       ├── page.tsx          # Dashboard accueil
│   │       └── settings/
│   │           └── page.tsx      # Paramètres compte
│   ├── api/auth/                  # API endpoints
│   │   ├── signup/
│   │   ├── login/
│   │   ├── verify-email/
│   │   ├── change-email/
│   │   ├── confirm-email-change/
│   │   ├── delete-account/
│   │   └── send-verification-email/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Landing page
├── lib/
│   ├── firebase-client.ts         # Client Firebase
│   ├── firebase-admin.ts          # Admin SDK
│   ├── resend.ts                  # Client Resend
│   └── ...
├── components/                    # Composants réutilisables
│   └── ...
└── types/                         # Types TypeScript
    └── ...

public/                            # Assets statiques
.env.local                         # Variables sensibles
.env.example                       # Modèle de .env.local
```

## Sécurité

### Points importants :

1. **Variables sensibles** : Jamais dans git
   ```bash
   # .gitignore contient déjà:
   .env.local
   .env.*.local
   .env.*.secret
   ```

2. **Firebase Admin SDK** : Utilisé uniquement server-side
   - Clé JSON stockée dans `FIREBASE_SERVICE_ACCOUNT_KEY`
   - Jamais exposée au client

3. **Tokens de vérification** :
   - Générés cryptographiquement (32 bytes)
   - Expiration 24h
   - Supprimés après utilisation

4. **Mots de passe** :
   - Gérés par Firebase Authentication
   - Jamais stockés en plaintext
   - Réauthentification requise pour les changements sensibles

## Configuration Email (Resend)

### Domaine par défaut (développement)

```typescript
// src/lib/resend.ts
from: 'onboarding@resend.dev'  // Domaine Resend par défaut
```

### Domaine personnalisé (production)

1. Dans Resend Dashboard, vérifiez votre domaine
2. Remplacez `from` par votre domaine :

```typescript
from: 'noreply@yourdomain.com'
```

3. Mettez à jour tous les fichiers qui envoient des emails :
   - `src/app/api/auth/signup/route.ts`
   - `src/app/api/auth/change-email/route.ts`
   - `src/app/api/auth/send-verification-email/route.ts`

## Déploiement

### Vercel (Recommandé)

```bash
# Connectez votre repo GitHub
# Vercel détecte Next.js automatiquement

# Dans le dashboard Vercel:
# 1. Environment Variables → Ajouter .env.local
# 2. Deploy
```

### VPS / Serveur Custom

```bash
# 1. SSH sur votre serveur
ssh user@your-vps.com

# 2. Cloner le projet
git clone <repo>
cd saas-auth-template

# 3. Installer les dépendances
pnpm install

# 4. Créer .env.local avec les variables de production
nano .env.local
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
# ... autres variables

# 5. Build
pnpm build

# 6. Démarrer avec PM2 (recommandé)
pnpm install -g pm2
pm2 start "pnpm start" --name "saas-app"
pm2 startup
pm2 save

# 7. Reverse proxy avec Nginx
# Voir nginx.example.conf pour un exemple complet
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 📝 API Routes

### Authentication

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/signup` | POST | Créer un compte |
| `/api/auth/login` | POST | Se connecter |
| `/api/auth/verify-email` | POST | Vérifier email |
| `/api/auth/send-verification-email` | POST | Renvoyer verification |
| `/api/auth/change-email` | POST | Demander changement email |
| `/api/auth/confirm-email-change` | POST | Confirmer nouveau email |
| `/api/auth/delete-account` | POST | Supprimer le compte |

### Exemples de requêtes

**Signup**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## Customisation

### Changer les couleurs

Modifiez `src/app/globals.css` ou les classes Tailwind dans les pages :

```tsx
// Exemple: Changer de bleu à vert
className="bg-blue-600" → className="bg-green-600"
```

### Ajouter des champs utilisateur

1. Modifiez `src/app/api/auth/signup/route.ts` pour ajouter des champs
2. Mettez à jour Firestore `users` collection schema

### Personnaliser les emails

Les templates d'email sont dans les fichiers API :
- `src/app/api/auth/signup/route.ts` - Email de vérification
- `src/app/api/auth/change-email/route.ts` - Email de changement

## 🐛 Troubleshooting

### "Port 3000 is already in use"

```bash
# Trouver et tuer le processus
lsof -i :3000
kill -9 <PID>

# Ou utiliser un port différent
PORT=3001 pnpm dev
```

### Firebase: "Permission denied"

1. Vérifiez votre `FIREBASE_SERVICE_ACCOUNT_KEY`
2. Vérifiez les Firestore Rules:
   ```
   match /databases/{database}/documents {
     match /{document=**} {
       allow read, write: if request.auth != null;
     }
   }
   ```

### Resend: "Email not sent"

1. Vérifiez votre `RESEND_API_KEY`
2. Assurez-vous que le domaine `from` est vérifié dans Resend
3. Vérifiez les logs du serveur pour les erreurs

## Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

MIT

## Support

Pour toute question ou problème, créez une issue sur GitHub.

---

**Made with ❤️ for SaaS builders**This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
