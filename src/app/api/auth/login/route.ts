import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token requis' },
        { status: 400 }
      );
    }

    console.log('🔐 Verifying ID token...');
    
    // Verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    console.log('📝 Looking up user in Firestore...');

    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .get();

    if (!userDoc.exists) {
      console.error('❌ User not found:', uid);
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    console.log('✅ User found:', userData);

    // ✅ SI EMAIL PAS VÉRIFIÉ: AFFICHE ERREUR PROPRE
    if (!userData?.emailVerified) {
      console.error('❌ Email not verified for user:', uid);
      return NextResponse.json(
        { 
          error: 'Email non vérifié. Veuillez vérifier votre email avant de vous connecter.' 
        },
        { status: 403 }
      );
    }

    console.log('✅ User verified, creating session...');

    const response = NextResponse.json(
      {
        success: true,
        message: 'Connexion réussie',
        user: {
          uid,
          email,
          username: userData.username,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'authToken',
      value: idToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
