# Frequently Asked Questions (FAQ)

## Getting Started

### Q: How long does setup take?
**A:** About 5-10 minutes total. See [QUICK_START.md](./QUICK_START.md) for a walkthrough.

### Q: Do I need to use Vercel to deploy?
**A:** No! You can deploy to:
- **Vercel** (easiest for Next.js)
- **VPS** (Ubuntu, CentOS, etc.)
- **Docker** (any Docker host)
- **Cloud platforms** (AWS, Azure, Google Cloud, etc.)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Q: What are the costs?
**A:** All free tiers available:
- **Firebase**: Free tier includes 50,000 reads/writes/deletes per day
- **Resend**: Free tier includes 100 emails/day
- **Vercel**: Free tier suitable for small projects
- **Tailwind CSS**: Open source, free
- **Next.js**: Open source, free

---

## Firebase & Database

### Q: How do I connect to my own Firebase project?
**A:** Follow these steps:

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create Firestore Database (Production mode)
4. Get credentials from Project Settings → Web App
5. Add to `.env.local`

See [README.md](./README.md) or [QUICK_START.md](./QUICK_START.md) for details.

### Q: Can I migrate from another database?
**A:** Yes, but you'll need to:
1. Create custom data migration scripts
2. Update API routes to connect to your database
3. Modify Firestore security rules

This template is optimized for Firebase. Migrating to PostgreSQL/MySQL would require significant changes.

### Q: How do I back up my data?
**A:** Firebase provides automatic backups. To export data:

1. Go to Firebase Console → Firestore Database
2. Click **Data** → **Export Collections**
3. Choose Cloud Storage bucket
4. Download exported files

For automated daily backups, use Firebase Functions or third-party tools.

### Q: Can I use Realtime Database instead of Firestore?
**A:** The template uses Firestore. Converting to Realtime Database would require rewriting all database calls. Not recommended.

---

## Email & Resend

### Q: Why aren't emails being sent?
**A:** Check these:

1. **API Key**: Should start with `re_`
2. **Domain verification**: Verify sender domain in Resend Console
3. **Email address**: Use verified domain or default `onboarding@resend.dev` (test emails only)
4. **Logs**: Check browser console and server logs

```bash
# Check logs
docker-compose logs app | grep -i email
```

### Q: Can I use my own email service (SendGrid, Mailgun)?
**A:** Yes! Replace Resend with:
1. Install provider's SDK: `pnpm add sendgrid` or similar
2. Update `/src/lib/resend.ts` with new provider
3. Modify `/src/app/api/auth/signup/route.ts` to use new service
4. Update `.env.local` with new credentials

### Q: How do I send custom email templates?
**A:** Resend supports HTML emails:

```typescript
// In your API route
await resend.emails.send({
  from: 'noreply@example.com',
  to: email,
  subject: 'Verify your email',
  html: `<h1>Welcome!</h1><p>Click here to verify.</p>`
});
```

For more complex templates, consider:
- [React Email](https://react.email/)
- [MJML](https://mjml.io/)
- [Handlebars](https://handlebarsjs.com/)

### Q: Can I schedule emails?
**A:** Resend doesn't support scheduled emails in its free tier. Options:
1. Use Firebase Cloud Functions for scheduling
2. Use a separate service (SendGrid, Mailgun)
3. Use cron jobs with your VPS

---

## Authentication

### Q: Can I add social login (Google, GitHub)?
**A:** Yes! Firebase supports OAuth. To add Google Sign-In:

1. Enable Google provider in Firebase Console
2. Configure OAuth consent screen
3. Update login page:

```typescript
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

const googleProvider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, googleProvider);
```

See [Firebase OAuth Documentation](https://firebase.google.com/docs/auth/web/google-signin).

### Q: How do I enable two-factor authentication?
**A:** Firebase supports phone number 2FA:

```typescript
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// Setup RecaptchaVerifier
const verifier = new RecaptchaVerifier(auth, 'recaptcha-container');

// Send SMS code
const result = await signInWithPhoneNumber(auth, '+1234567890', verifier);
```

See [Firebase Phone Authentication](https://firebase.google.com/docs/auth/web/phone-auth).

### Q: How are passwords secured?
**A:** Firebase Authentication hashes passwords using bcrypt. Passwords:
- Are never sent in plain text
- Never stored in your database
- Are managed by Firebase servers
- Can be reset via email link
- Can be changed in dashboard

### Q: Can I prevent password reuse?
**A:** Firebase doesn't have built-in password history. To implement:

```typescript
// Store old password hashes
const oldPasswords = userData.passwordHistory || [];

// When changing password
if (oldPasswords.includes(hashedNewPassword)) {
  throw new Error('Cannot reuse recent passwords');
}
```

---

## Customization

### Q: Can I change the colors?
**A:** Yes! Edit `/src/app/globals.css`:

```css
@tailwind base;

:root {
  --primary: #000;      /* Black */
  --secondary: #666;    /* Gray */
  --accent: #fff;       /* White */
}

@tailwind components;
@tailwind utilities;
```

Or update Tailwind config in `tailwind.config.ts`.

### Q: How do I add more fields to user signup?
**A:** 

1. Update signup form in `/src/app/(auth)/auth/signup/page.tsx`:
```typescript
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
```

2. Update API route `/src/app/api/auth/signup/route.ts`:
```typescript
// Store in Firestore
await setDoc(doc(db, 'users', user.uid), {
  email,
  firstName,
  lastName,
  // ...
});
```

3. Update Firestore schema in README.md

### Q: Can I add a user profile page?
**A:** Yes! Create `/src/app/(dashboard)/dashboard/profile/page.tsx`:

```typescript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      const docSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
      setUser(docSnap.data());
    };
    fetchUser();
  }, []);
  
  return <div>{/* display user data */}</div>;
}
```

### Q: How do I add user roles?
**A:** Add a `role` field to user document:

```typescript
// In signup
await setDoc(doc(db, 'users', user.uid), {
  email,
  role: 'user', // or 'admin'
});

// In Firestore rules
allow read, write: if request.auth.uid == userId && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
```

---

## Deployment

### Q: What's the difference between staging and production?
**A:**

**Staging**: Test environment before production
- Use test Firebase project
- Use test Resend domain
- Small daily email limit
- Used for QA and testing

**Production**: Live environment for users
- Use production Firebase project
- Use verified production domain
- Full resources available
- Monitor performance and errors

### Q: How do I set up a custom domain?
**A:** 

**On Vercel**:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records with Vercel's nameservers

**On VPS**:
1. Update DNS A record to your server IP
2. Run deployment script: `sudo ./deploy.sh`
3. Certbot automatically creates SSL certificate

### Q: How do I monitor production?
**A:** 

**Firebase Console**:
- Authentication: Monitor sign-ups, failures
- Firestore: Check usage, queries
- Cloud Functions: View logs

**Application Monitoring**:
- Add logging to API routes
- Use Firebase Cloud Logging
- Consider: Sentry, LogRocket, or similar

```typescript
// Log important events
console.log('[AUTH]', {
  event: 'signup_success',
  email: user.email,
  timestamp: new Date(),
});
```

### Q: How often should I update dependencies?
**A:** 

- **Security patches**: Immediately
- **Minor updates**: Weekly
- **Major updates**: Monthly (test thoroughly)

```bash
# Check for vulnerabilities
pnpm audit

# Update all dependencies
pnpm update

# Update specific package
pnpm add next@latest
```

---

## Performance

### Q: How can I improve page load speed?
**A:**

1. **Images**: Optimize with Next.js Image component
2. **Code splitting**: Next.js does this automatically
3. **Caching**: Browser cache static assets
4. **CDN**: Use Vercel's edge network or CloudFlare
5. **Database**: Add Firestore indexes for slow queries

### Q: Does this template support SEO?
**A:** Partially. To improve:

1. Add metadata in `/src/app/layout.tsx`:
```typescript
export const metadata = {
  title: 'Your SaaS',
  description: 'Description here',
};
```

2. Add og:image, og:description for social sharing
3. Create `/public/sitemap.xml` for Google
4. Add robots.txt: `/public/robots.txt`

### Q: Can I use ISR (Incremental Static Regeneration)?
**A:** Yes! Update page routes:

```typescript
export const revalidate = 3600; // Revalidate every hour
```

---

## Security

### Q: Is this template production-ready?
**A:** Yes, with these considerations:

- HTTPS/SSL required
- Secure password handling
- Email verification
- Add rate limiting for production
- Monitor for suspicious activity
- Regular security audits

See [SECURITY.md](./SECURITY.md) for detailed checklist.

### Q: What about GDPR compliance?
**A:** This template includes:
- Email verification
- Account deletion
- Data export
- Consent banners

For full GDPR compliance:
1. Add privacy policy page
2. Add cookie consent banner
3. Implement data export feature
4. Add terms of service

### Q: How do I prevent brute-force attacks?
**A:** Add rate limiting:

```typescript
// Install package
pnpm add express-rate-limit

// Use in API routes
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5 // 5 attempts per window
});

export const POST = limiter(handler);
```

---

## Troubleshooting

### Q: Build fails with "Firebase initialization error"
**A:** 

1. Check `.env.local` has all 6 Firebase variables
2. Verify `FIREBASE_SERVICE_ACCOUNT_KEY` is valid JSON
3. Ensure Firestore is enabled in Firebase Console

```bash
# Test Firebase connection
npm run build
```

### Q: "Port 3000 already in use"
**A:** 

```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Q: "CORS error when sending emails"
**A:** This is normal for browser requests. Email sending must happen server-side in API routes. Check that:

1. Emails are sent in `/src/app/api/auth/*` routes
2. Not trying to send from client-side code
3. Resend API key is correct

### Q: Docker container exits immediately
**A:** 

```bash
# Check logs
docker-compose logs app

# Common issues:
# - Wrong environment variables
# - Port already in use
# - Build failed
```

### Q: "Certificate validation failed"
**A:** 

```bash
# Check certificate
openssl s_client -connect yourdomain.com:443

# Renew certificate
docker-compose exec certbot certbot renew --force-renewal

# Check nginx config
docker-compose exec nginx nginx -t
```

---

## Getting Help

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Support Channels

1. **GitHub Issues**: Bug reports and features
2. **GitHub Discussions**: Questions and ideas
3. **Email**: Check repo for contact info

### Contributing

Found a bug or have a suggestion? See [CONTRIBUTING.md](./CONTRIBUTING.md)!

---

## Have a Question Not Listed?

1. Check the [README.md](./README.md)
2. Check the [DEPLOYMENT.md](./DEPLOYMENT.md)
3. Open a GitHub Issue
4. Start a GitHub Discussion

We're here to help!
