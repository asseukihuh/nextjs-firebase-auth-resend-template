# Security Policy

## Reporting a Vulnerability

**Please do not publicly report security vulnerabilities.** Instead, please email security issues to the maintainers privately.

When reporting a security vulnerability, please include:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if available)

We will acknowledge your report within 48 hours and provide updates on the status of a fix.

---

## Security Best Practices

This template includes several security measures. When deploying, ensure you follow these best practices:

### Environment Variables

- **Never commit `.env.local` or `.env.production`** to version control
- **Rotate credentials regularly**, especially API keys
- **Use strong, randomly generated values** for sensitive data
- **Keep `FIREBASE_SERVICE_ACCOUNT_KEY` confidential** - it provides admin access
- **Restrict access to environment variables** in your deployment environment

### Firebase Security

1. **Enable Firebase Authentication Security**
   - Enforce strong passwords (minimum 6 characters, but recommend 12+)
   - Enable email verification for all users
   - Enable CORS restrictions in Firebase Console
   - Limit API key restrictions to your domain

2. **Configure Firestore Security Rules**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own document
       match /users/{userId} {
         allow read, write: if request.auth.uid == userId;
       }
       
       // Email change requests are private
       match /users/{userId}/email_change_requests/{requestId} {
         allow read, write: if request.auth.uid == userId;
       }
     }
   }
   ```

3. **Enable Firestore Audit Logs**
   - Go to Firebase Console → Firestore Database → Settings
   - Enable Cloud Audit Logs
   - Monitor access patterns regularly

### Application Security

1. **Rate Limiting**
   - The template uses API routes without built-in rate limiting
   - Add rate limiting middleware in production:
     ```typescript
     import rateLimit from 'express-rate-limit';
     
     const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100 // limit each IP to 100 requests per windowMs
     });
     
     app.use('/api/', limiter);
     ```

2. **CSRF Protection**
   - Next.js has built-in CSRF protection for API routes
   - Always use `next/router` for navigation
   - Validate request origins in production

3. **Input Validation**
   - All forms validate email format
   - Passwords are validated client-side before submission
   - Server-side validation is recommended for production
   - Add Zod or similar for schema validation:
     ```typescript
     import { z } from 'zod';
     
     const SignupSchema = z.object({
       email: z.string().email(),
       password: z.string().min(12)
     });
     ```

4. **CORS Configuration**
   - Restrict to your domain in production
   - Configure in `next.config.ts`:
     ```typescript
     const corsHeaders = {
       'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL,
       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
       'Access-Control-Allow-Headers': 'Content-Type'
     };
     ```

### Email Security

1. **Resend Configuration**
   - Verify your sender domain in Resend Console
   - Use SPF, DKIM, and DMARC records for your domain
   - Monitor email delivery and bounces
   - Implement email authentication

2. **Email Links**
   - All verification links include 32-byte tokens
   - Tokens expire after 24 hours
   - Links use your `NEXT_PUBLIC_APP_URL` (must be HTTPS in production)
   - Never include sensitive data in email links

3. **Email Content**
   - Never include passwords in emails
   - Include clear unsubscribe instructions
   - Comply with GDPR, CAN-SPAM, and other regulations

### SSL/TLS

- **Always use HTTPS in production**
- The docker-compose setup includes Let's Encrypt with automatic renewal
- For VPS deployments, ensure SSL certificates are valid:
  ```bash
  # Check certificate expiration
  openssl s_client -connect your-domain.com:443 -showcerts
  ```

### Password Security

1. **Storage**
   - Passwords are hashed by Firebase Authentication
   - Never store plain-text passwords
   - Never send passwords via email

2. **Validation**
   - Minimum 6 characters (recommended 12+)
   - Consider adding complexity requirements:
     - At least one uppercase letter
     - At least one number
     - At least one special character

3. **Change Procedure**
   - Users must authenticate with old password first
   - New password cannot be same as old password
   - Implement cooldown period (e.g., 1 day between changes)

### Session Management

1. **Firebase Auth Tokens**
   - ID tokens expire after 1 hour
   - Refresh tokens are stored securely
   - No need for server-side session storage

2. **Logout**
   - `signOut()` immediately invalidates client-side session
   - Consider server-side invalidation for sensitive operations

### Data Protection

1. **User Data**
   - Minimize collected data (email, password only)
   - Enable encryption at rest (Firebase default)
   - Regular backups using Firestore export
   - Implement data retention policies

2. **Compliance**
   - GDPR: Implement right to deletion (account deletion)
   - CCPA: Implement data export and deletion
   - Privacy policy should be linked on sign-up page
   - Data processing agreements for Firebase and Resend

### Deployment Security

1. **Vercel**
   - Environment variables are encrypted
   - Use Preview Deployments for testing
   - Enable branch protection in GitHub
   - Monitor deployment logs

2. **VPS/Docker**
   - Keep Docker and packages updated
   - Use non-root user for running application
   - Enable firewall rules:
     ```bash
     sudo ufw allow 22/tcp    # SSH
     sudo ufw allow 80/tcp    # HTTP
     sudo ufw allow 443/tcp   # HTTPS
     sudo ufw enable
     ```
   - Monitor system logs: `journalctl -u docker`
   - Use fail2ban for SSH protection

3. **Database Security**
   - Firestore has built-in encryption
   - Enable point-in-time recovery if available
   - Regular automated backups
   - Monitor access via Cloud Audit Logs

### Monitoring and Logging

1. **Firebase Monitoring**
   - Enable Cloud Logging
   - Monitor authentication errors
   - Set up alerts for suspicious activity

2. **Application Logging**
   ```typescript
   // Log security events
   console.warn('[SECURITY]', {
     event: 'failed_login_attempt',
     email: userEmail,
     timestamp: new Date()
   });
   ```

3. **Metrics to Monitor**
   - Failed authentication attempts
   - Unusual API usage patterns
   - Email delivery failures
   - Database query errors

### Dependencies

1. **Keep Updated**
   ```bash
   # Check for vulnerable dependencies
   pnpm audit
   
   # Update dependencies
   pnpm update
   ```

2. **Security Scanning**
   - Enable GitHub Dependabot
   - Regular npm security audits
   - Monitor security advisories

### Incident Response

1. **If Credentials Are Compromised**
   - Immediately rotate the compromised credential
   - Review recent access logs
   - Notify affected users
   - Update documentation

2. **If Data Breach Is Suspected**
   - Stop and investigate immediately
   - Preserve logs and evidence
   - Notify users and authorities as required
   - Implement security patches

---

## Security Checklist

Before deploying to production:

- [ ] `.env.local` and `.env.production` are in `.gitignore`
- [ ] All credentials are strong and randomly generated
- [ ] Firestore security rules are restrictive
- [ ] Firebase API key has domain restrictions
- [ ] Email domain is verified in Resend
- [ ] SSL/TLS certificate is valid
- [ ] CORS is configured for your domain
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] Logging is enabled
- [ ] Backups are configured
- [ ] Monitoring and alerts are set up
- [ ] Privacy policy is published
- [ ] Security policy is published
- [ ] Dependencies are up to date
- [ ] No test data is in production database
- [ ] Admin access is restricted
- [ ] Failed login attempts are logged
- [ ] 2FA is enabled on all admin accounts

---

## Security Vulnerabilities in Dependencies

This project uses the following key dependencies:

- **Next.js**: Actively maintained by Vercel
- **Firebase**: Actively maintained by Google
- **Resend**: Actively maintained
- **Tailwind CSS**: Actively maintained

Subscribe to security advisories:

- [Next.js Security Advisories](https://github.com/vercel/next.js/security/advisories)
- [Firebase Security](https://firebase.google.com/security)
- [npm Security Advisories](https://www.npmjs.com/advisories)

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/database/security)
- [Next.js Security](https://nextjs.org/docs/going-to-production/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/nodejs-security/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

Thank you for helping keep this project secure!
