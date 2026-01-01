import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, uid } = body;

    if (!token || !uid) {
      return NextResponse.json(
        { error: 'Token et UID requis' },
        { status: 400 }
      );
    }

    console.log('📧 Confirming email change for:', uid);

    // Vérifier que la demande existe
    const requestDoc = await admin
      .firestore()
      .collection('email_change_requests')
      .doc(uid)
      .get();

    if (!requestDoc.exists) {
      return NextResponse.json(
        { error: 'Aucune demande de changement trouvée' },
        { status: 404 }
      );
    }

    const requestData = requestDoc.data() as any;

    // Vérifier le token
    if (requestData.token !== token) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Vérifier l'expiration (convertir Timestamp Firestore en millisecondes)
    const expiresAt = requestData.expiresAt.toDate ? 
      requestData.expiresAt.toDate().getTime() : 
      new Date(requestData.expiresAt).getTime();
    
    if (expiresAt < Date.now()) {
      return NextResponse.json(
        { error: 'Le lien de confirmation a expiré' },
        { status: 401 }
      );
    }

    const newEmail = requestData.newEmail;

    // Mettre à jour l'email dans Firebase Auth
    console.log('🔐 Updating email in Firebase Auth');
    await admin.auth().updateUser(uid, {
      email: newEmail,
    });

    // Mettre à jour l'email dans Firestore
    console.log('📝 Updating email in Firestore');
    await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .update({
        email: newEmail,
        emailChangedAt: new Date(),
      });

    // Supprimer la demande de changement
    console.log('🗑️ Deleting email change request');
    await admin
      .firestore()
      .collection('email_change_requests')
      .doc(uid)
      .delete();

    console.log('✅ Email changed successfully');

    return NextResponse.json(
      { success: true, message: 'Email changé avec succès' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Confirm email change error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la confirmation du changement d\'email' },
      { status: 500 }
    );
  }
}
