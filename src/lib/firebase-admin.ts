import admin, { ServiceAccount } from 'firebase-admin';

const parseServiceAccount = (): ServiceAccount => {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON');
      throw error;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Handle both escaped newlines (\\n) and literal newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase admin env. Provide FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY');
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  } as ServiceAccount;
};

try {
  const serviceAccount = parseServiceAccount();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.projectId,
    });
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  throw error;
}

export { admin };
