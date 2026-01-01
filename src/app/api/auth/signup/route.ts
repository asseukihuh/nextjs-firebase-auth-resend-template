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
    const { email, username, password, confirmPassword } = body;

    console.log('🔍 Validating signup data...');
    console.log('Received:', { email, username, password: '***', confirmPassword: '***' });

    // ✅ VALIDATION - TRIM LES ESPACES
    const trimmedEmail = email?.trim();
    const trimmedUsername = username?.trim();

    if (!trimmedEmail || !trimmedUsername || !password || !confirmPassword) {
      console.log('❌ Validation failed - missing fields');
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // ✅ Vérifier que l'email n'existe pas déjà
    console.log('🔍 Checking if email already exists...');
    try {
      await admin.auth().getUserByEmail(trimmedEmail);
      return NextResponse.json(
        { error: 'Cet email est déjà enregistré' },
        { status: 400 }
      );
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    console.log('🔐 Creating Firebase Auth user...');
    const userRecord = await admin.auth().createUser({
      email: trimmedEmail,
      password,
      displayName: trimmedUsername,
    });

    const uid = userRecord.uid;
    console.log('✅ User created:', uid);

    // ✅ Créer le document user dans Firestore
    console.log('📝 Creating user document in Firestore...');
    await admin.firestore().collection('users').doc(uid).set({
      email: trimmedEmail,
      username: trimmedUsername,
      createdAt: new Date(),
      emailVerified: false,
      plan: 'free',
      stripeCustomerId: null,
      subscriptionId: null,
      twoFAEnabled: false,
    });

    // ✅ Générer token de vérification
    console.log('🔐 Generating verification token...');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await admin.firestore().collection('verification_tokens').doc(uid).set({
      token: verificationToken,
      expiresAt: tokenExpiry,
      email: trimmedEmail,
    });

    // ✅ Envoyer email de vérification
    console.log('📧 Sending verification email...');
    const verificationLink = buildVerificationLink(verificationToken, uid);
    const replyTo = getEmailReplyTo();

    await resend.emails.send({
      from: getResendFromHeader(),
      ...(replyTo ? { replyTo } : {}),
      to: trimmedEmail,
      ...verificationEmail(verificationLink),
    });

    console.log('✅ Signup successful');

    return NextResponse.json(
      {
        success: true,
        message: 'Inscription réussie! Veuillez vérifier votre email.',
        uid,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Signup error:', error);

    let errorMessage = 'Erreur lors de l\'inscription';

    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Cet email est déjà enregistré';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email invalide';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Le mot de passe est trop faible';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
