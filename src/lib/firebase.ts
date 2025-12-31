import admin from 'firebase-admin';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY not found');
}

let adminApp;

try {
  const serviceAccount = JSON.parse(serviceAccountKey);

  if (!admin.apps.length) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } else {
    adminApp = admin.app();
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  throw error;
}

export const auth = admin.auth(adminApp);
export const db = admin.firestore(adminApp);
