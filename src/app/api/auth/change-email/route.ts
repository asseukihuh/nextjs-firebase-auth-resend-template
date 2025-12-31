import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';
import { resend } from '@/lib/resend';
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
    const confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm-email-change?token=${confirmationToken}&uid=${uid}`;

    try {
      const emailResponse = await resend.emails.send({
        from: 'NY-ERP <onboarding@resend.dev>',
        to: newEmail,
        subject: 'Confirmez votre changement d\'email - NY-ERP',
        html: `
          <h2>Confirmation de changement d'email</h2>
          <p>Vous avez demandé de changer votre email de <strong>${currentEmail}</strong> à <strong>${newEmail}</strong>.</p>
          <p><a href="${confirmationLink}" style="background: #3b82f6; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Confirmer le changement</a></p>
          <p>Ou copiez ce lien: ${confirmationLink}</p>
          <p>Ce lien expire dans 24 heures.</p>
          <p>Si vous n'avez pas demandé ce changement, ignorez cet email.</p>
        `,
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
