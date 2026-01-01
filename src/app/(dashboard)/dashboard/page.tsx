'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase-client';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-black rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link href="/" className="font-semibold text-sm tracking-tight hover:opacity-60 transition-opacity">
            Next.js Auth Template
          </Link>
          
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        
        {/* WELCOME SECTION */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-black mb-6 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back, <span className="text-black">{user?.email?.split('@')[0]}</span>
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Settings Card */}
          <Link href="/dashboard/settings">
            <div className="group p-8 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Account Settings</h3>
              <p className="text-gray-600 text-sm">
                Manage your account, email, password and security preferences
              </p>
            </div>
          </Link>

          {/* Documentation Card */}
          <a 
            href="https://github.com/asseukihuh/nextjs-firebase-auth-resend-template#readme"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="group p-8 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Documentation</h3>
              <p className="text-gray-600 text-sm">
                Learn how to customize and extend your authentication system
              </p>
            </div>
          </a>

        </div>

      </div>
    </div>
  );
}

