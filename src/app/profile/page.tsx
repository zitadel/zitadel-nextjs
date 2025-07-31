'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // noinspection JSIgnoredPromiseFromCall
      signIn('zitadel', { callbackUrl: '/profile' });
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading your session…</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header isAuthenticated={true} />
      <main className="flex-1 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-green-900">
                  Authentication Successful!
                </h2>
                <p className="text-green-700 mt-1">
                  You have successfully logged into the application.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Session Information
            </h2>
            <p className="text-gray-600 mb-6">
              Below is the authentication data stored in your session:
            </p>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono leading-relaxed">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
