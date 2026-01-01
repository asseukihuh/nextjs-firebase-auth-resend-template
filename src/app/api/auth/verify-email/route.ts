import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, uid } = body;

    if (!token || !uid) {
      return NextResponse.json(
        { error: 'Token ou UID manquant' },
        { status: 400 }
      );
    }

    console.log('🔍 Verifying email token...');

    // Vérifier le token
    const tokenDoc = await admin
      .firestore()
      .collection('verification_tokens')
      .doc(uid)
      .get();

    if (!tokenDoc.exists) {
      return NextResponse.json(
        { error: 'Token non trouvé' },
        { status: 404 }
      );
    }

    const tokenData = tokenDoc.data() as any;

    // Vérifier la validité du token
    if (tokenData.token !== token) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 400 }
      );
    }

    // Vérifier l'expiration
    const expiresAt = new Date(tokenData.expiresAt.seconds * 1000);
    if (new Date() > expiresAt) {
      return NextResponse.json(
        { error: 'Token expiré' },
        { status: 400 }
      );
    }

    // Marquer l'email comme vérifié
    console.log('✅ Marking email as verified...');
    await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .update({
        emailVerified: true,
        emailVerifiedAt: new Date(),
      });

    // Supprimer le token
    await admin
      .firestore()
      .collection('verification_tokens')
      .doc(uid)
      .delete();

    console.log('✅ Email verified successfully');

    return NextResponse.json(
      { success: true, message: 'Email vérifié avec succès' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Email verification error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
