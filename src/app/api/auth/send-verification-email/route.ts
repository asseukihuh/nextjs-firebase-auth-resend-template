import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';
import { resend } from '@/lib/resend';
import { buildVerificationLink } from '@/lib/links';
import { verificationEmail } from '@/lib/email-templates';
import { getEmailReplyTo, getResendFromHeader } from '@/lib/app-config';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    console.log('🔍 Looking up user by email...');

    // Trouver l'utilisateur par email
    const userSnapshot = await admin
      .firestore()
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const userDoc = userSnapshot.docs[0];
    const uid = userDoc.id;

    // Générer nouveau token
    console.log('🔐 Generating verification token...');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await admin.firestore().collection('verification_tokens').doc(uid).set({
      token: verificationToken,
      expiresAt: tokenExpiry,
      email: email,
    });

    // Envoyer email
    console.log('📧 Sending verification email...');
    const verificationLink = buildVerificationLink(verificationToken, uid);
    const replyTo = getEmailReplyTo();

    await resend.emails.send({
      from: getResendFromHeader(),
      ...(replyTo ? { replyTo } : {}),
      to: email,
      ...verificationEmail(verificationLink),
    });

    console.log('✅ Verification email sent');

    return NextResponse.json(
      { success: true, message: 'Email de vérification envoyé' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error sending verification email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
