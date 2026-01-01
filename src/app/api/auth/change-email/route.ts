import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';
import { resend } from '@/lib/resend';
import { buildEmailChangeLink } from '@/lib/links';
import { confirmEmailChangeEmail } from '@/lib/email-templates';
import { getEmailReplyTo, getResendFromHeader } from '@/lib/app-config';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, newEmail } = body;

    if (!uid || !newEmail) {
      return NextResponse.json(
        { error: 'UID et nouvel email requis' },
        { status: 400 }
      );
    }

    console.log('📧 Requesting email change for:', uid);

    // Vérifier que l'email n'est pas déjà utilisé
    try {
      await admin.auth().getUserByEmail(newEmail);
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    } catch (err: any) {
      if (err.code !== 'auth/user-not-found') {
        throw err;
      }
    }

    // Générer un token de confirmation
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Sauvegarder la demande de changement d'email
    await admin.firestore().collection('email_change_requests').doc(uid).set({
      uid,
      newEmail,
      token: confirmationToken,
      expiresAt: tokenExpiry,
      createdAt: new Date(),
    });

    // Obtenir le user actuel pour récupérer son email
    const userRecord = await admin.auth().getUser(uid);
    const currentEmail = userRecord.email;

    // Envoyer un email de confirmation au NOUVEL email
    console.log('📧 Sending confirmation email to:', newEmail);
    console.log('🔑 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    const confirmationLink = buildEmailChangeLink(confirmationToken, uid);

    try {
      const replyTo = getEmailReplyTo();

      const emailResponse = await resend.emails.send({
        from: getResendFromHeader(),
        ...(replyTo ? { replyTo } : {}),
        to: newEmail,
        ...confirmEmailChangeEmail(confirmationLink, currentEmail || '', newEmail),
      });
      console.log('✅ Email sent response:', emailResponse);
      if (emailResponse.error) {
        console.error('❌ Resend error:', emailResponse.error);
        throw new Error(`Resend error: ${JSON.stringify(emailResponse.error)}`);
      }
    } catch (emailErr: any) {
      console.error('❌ Failed to send email:', emailErr.message);
      throw emailErr;
    }

    console.log('✅ Email change requested successfully');

    return NextResponse.json(
      { success: true, message: 'Un lien de confirmation a été envoyé à votre nouvel email.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Email change request error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la demande de changement' },
      { status: 500 }
    );
  }
}
