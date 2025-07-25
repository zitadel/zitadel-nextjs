'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

/**
 * Displays a user-friendly error page for failed logout attempts.
 *
 * This page is typically shown when a security check fails during the logout
 * process. The most common cause is a Cross-Site Request Forgery (CSRF)
 * protection failure, where a 'state' parameter from the identity provider
 * does not match the one stored securely in the user's session.
 */
export default function LogoutErrorPage() {
  const params = useSearchParams();
  const reason = params.get('reason') || 'An unknown error occurred.';

  return (
    <main className="flex-1 grid place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">Error</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Logout unsuccessful
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          {reason}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
}
