'use client';

import Link from 'next/link';

export default function VerifyEmailSentPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-black mb-4 tracking-tight">
          Check your email
        </h1>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-2">
          We've sent a verification link to your email address.
        </p>
        <p className="text-gray-600 mb-8">
          Click the link to confirm your registration.
        </p>

        {/* Info */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-600">
            The link expires in 24 hours.
          </p>
        </div>

        {/* CTA */}
        <Link 
          href="/auth/login" 
          className="inline-block bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
