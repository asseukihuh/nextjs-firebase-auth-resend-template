'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const uid = searchParams.get('uid');

      if (!token || !uid) {
        setError('Invalid verification link');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, uid }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Error verifying email');
          setLoading(false);
          return;
        }

        setSuccess(true);
        setLoading(false);
        setTimeout(() => router.push('/dashboard'), 3000);
      } catch (err) {
        setError('Error verifying email');
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-black rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-black mb-4">Verification Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/auth/signup" className="inline-block bg-black hover:bg-gray-900 text-white px-6 py-2 font-semibold transition">
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-black mb-4">Email Verified!</h1>
          <p className="text-gray-600 mb-6">Your email has been verified successfully. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
