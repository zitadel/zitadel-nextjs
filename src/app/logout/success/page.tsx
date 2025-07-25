'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function LogoutSuccessPage() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'refresh');
    meta.setAttribute('content', '10;url=/');
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-medium text-gray-900">Logout Successful</h1>
        <p className="mt-2 text-gray-600">Redirecting in 10 seconds...</p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
