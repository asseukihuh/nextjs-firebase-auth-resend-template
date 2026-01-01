import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, idToken } = body;

    if (!uid || !idToken) {
      return NextResponse.json(
        { error: 'UID ou token manquant' },
        { status: 400 }
      );
    }

    console.log('🗑️ Deleting user account:', uid);

    // Vérifier le token
    try {
      await admin.auth().verifyIdToken(idToken);
    } catch (err) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Supprimer le document Firestore
    await admin.firestore().collection('users').doc(uid).delete();

    // Supprimer les tokens associés
    await admin.firestore().collection('verification_tokens').doc(uid).delete().catch(() => {});
    await admin.firestore().collection('email_change_tokens').doc(uid).delete().catch(() => {});

    // Supprimer le compte Firebase Auth
    await admin.auth().deleteUser(uid);

    console.log('✅ User deleted successfully');

    return NextResponse.json(
      { success: true, message: 'Compte supprimé avec succès' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Delete account error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du compte' },
      { status: 500 }
    );
  }
}
