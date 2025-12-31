'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black antialiased">
      {/* NAVBAR */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link href="/" className="font-semibold text-sm tracking-tight hover:opacity-60 transition-opacity">
            Next.js Auth Template
          </Link>
          <div className="flex gap-8 items-center text-sm">
            <a 
              href="https://github.com/asseukihuh/nextjs-firebase-auth-resend-template" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
            >
              GitHub
            </a>
            <Link href="/auth/login" className="text-gray-600 hover:text-black transition-colors">
              Login
            </Link>
            <Link 
              href="/auth/signup" 
              className="bg-black text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-8 pt-32 pb-24">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
            Production-ready
            <br />
            authentication for
            <br />
            Next.js
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl">
            Complete auth system with Firebase, email verification via Resend, and full account management. TypeScript, Docker support, and comprehensive docs included.
          </p>
          
          <div className="flex gap-4 items-center">
            <Link 
              href="/auth/signup" 
              className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
            <a 
              href="https://github.com/asseukihuh/nextjs-firebase-auth-resend-template"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black text-sm font-medium transition-colors"
            >
              View on GitHub →
            </a>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="mt-24 pt-12 border-t border-gray-100">
          <div className="grid grid-cols-4 gap-12">
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-sm text-gray-600">Open Source</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">0</div>
              <div className="text-sm text-gray-600">Vendor Lock-in</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">&lt;5min</div>
              <div className="text-sm text-gray-600">Setup Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">TypeScript</div>
              <div className="text-sm text-gray-600">Type Safe</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="max-w-4xl mx-auto px-8 py-24">
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            A complete authentication solution with all the features you'd expect from a modern SaaS application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Authentication</h3>
            <p className="text-gray-600 leading-relaxed">
              Secure email/password authentication powered by Firebase with session management and token-based verification.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Email Verification</h3>
            <p className="text-gray-600 leading-relaxed">
              Automated email verification using Resend with secure token system and 24-hour expiration for security.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Account Management</h3>
            <p className="text-gray-600 leading-relaxed">
              Full user dashboard with email changes, password resets, and account deletion. All with secure confirmation flows.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Developer Experience</h3>
            <p className="text-gray-600 leading-relaxed">
              TypeScript throughout, clean code structure, extensive documentation, and easy customization. Start building immediately.
            </p>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="max-w-4xl mx-auto px-8 py-24 border-t border-gray-100">
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Built with modern tools
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Powered by industry-standard technologies for reliability and scalability.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
            <div className="font-semibold text-lg mb-2">Next.js 16</div>
            <div className="text-sm text-gray-600">React framework with App Router</div>
          </div>
          <div className="p-6 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
            <div className="font-semibold text-lg mb-2">TypeScript</div>
            <div className="text-sm text-gray-600">Type-safe development</div>
          </div>
          <div className="p-6 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
            <div className="font-semibold text-lg mb-2">Firebase</div>
            <div className="text-sm text-gray-600">Auth & Firestore database</div>
          </div>
          <div className="p-6 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
            <div className="font-semibold text-lg mb-2">Resend</div>
            <div className="text-sm text-gray-600">Modern email delivery</div>
          </div>
          <div className="p-6 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
            <div className="font-semibold text-lg mb-2">Tailwind CSS</div>
            <div className="text-sm text-gray-600">Utility-first styling</div>
          </div>
          <div className="p-6 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
            <div className="font-semibold text-lg mb-2">Docker</div>
            <div className="text-sm text-gray-600">Container support</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-8 py-24 border-t border-gray-100">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Start building today
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Clone the repository and have a working authentication system in under 5 minutes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/auth/signup" 
              className="bg-black text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
            <a 
              href="https://github.com/asseukihuh/nextjs-firebase-auth-resend-template"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-200 text-black px-8 py-3 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors"
            >
              View Documentation
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 mt-24">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold">Next.js Auth Template</div>
            <div className="flex gap-8 text-sm text-gray-600">
              <a 
                href="https://github.com/asseukihuh/nextjs-firebase-auth-resend-template" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://github.com/asseukihuh/nextjs-firebase-auth-resend-template#readme" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                Documentation
              </a>
              <a 
                href="https://github.com/asseukihuh/nextjs-firebase-auth-resend-template/blob/main/LICENSE" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                MIT License
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}