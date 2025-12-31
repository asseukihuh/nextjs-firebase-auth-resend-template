'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email.trim() || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Signing in...');
      const startTime = performance.now();
      
      // ✅ PARALLÉLISER: getIdToken pendant que le serveur fait son truc
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      console.log('Firebase login:', performance.now() - startTime, 'ms');

      // ✅ Créer session en parallèle avec la redirection
      const idToken = await userCredential.user.getIdToken();
      
      // ✅ Envoyer au serveur SANS ATTENDRE LA RÉPONSE
      // La session sera créée en background
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }).catch(err => console.error('Session creation failed:', err));

      // ✅ REDIRIGER IMMÉDIATEMENT
      console.log('✅ Redirecting to dashboard...');
      router.push('/dashboard');
      
    } catch (err: any) {
      console.error('❌ Login error:', err);
      
      const errorCode = err?.code || '';
      
      if (errorCode === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (errorCode === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (errorCode === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Authentication failed. Please try again.');
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Back link */}
        <div className="mb-12">
          <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-3 tracking-tight">
            Sign in
          </h1>
          <p className="text-gray-600">
            Welcome back. Enter your credentials to continue.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-black font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
