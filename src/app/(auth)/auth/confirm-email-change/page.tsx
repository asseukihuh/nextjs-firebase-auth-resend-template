'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ConfirmEmailChangeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmailChange = async () => {
      if (!token || !uid) {
        setError('Token or UID missing');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/confirm-email-change', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, uid }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Error confirming email change');
          setLoading(false);
          return;
        }

        setSuccess(true);
        setLoading(false);

        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } catch (err: any) {
        setError('Error confirming email change');
        setLoading(false);
      }
    };

    verifyEmailChange();
  }, [token, uid, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow border border-gray-200 p-8">
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-black mb-2">Confirming...</h2>
            <p className="text-gray-600">Please wait while we confirm your email change.</p>
          </div>
        )}

        {success && (
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">Email changed successfully!</h2>
            <p className="text-gray-600 mb-4">
              Your email has been updated. Redirecting to dashboard...
            </p>
            <p className="text-sm text-gray-500">Redirecting in 3 seconds...</p>
          </div>
        )}

        {error && (
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/dashboard"
              className="inline-block bg-black hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded transition"
            >
              Back to dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmEmailChangePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ConfirmEmailChangeContent />
    </Suspense>
  );
}
