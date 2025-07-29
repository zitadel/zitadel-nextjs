'use client';

import {
  getProviders,
  getCsrfToken,
  ClientSafeProvider,
  LiteralUnion,
} from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';
import { getMessage } from '@/app/auth/message';

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType>,
    ClientSafeProvider
  > | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    const fetchProviders = async () => {
      const [providersData, tokenData] = await Promise.all([
        getProviders(),
        getCsrfToken(),
      ]);
      setProviders(providersData);
      setCsrfToken(tokenData || '');
    };

    void fetchProviders();
  }, []);

  if (!providers) {
    return (
      <main className="flex-1 grid place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  const provider = providers?.zitadel;

  return (
    <main className="flex-1 grid place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center max-w-md w-full">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-6">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
        <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Sign in
        </h1>
        <p
          className={`mt-6 text-lg font-medium text-pretty sm:text-xl/8 ${
            error ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {error
            ? getMessage(error, 'signin-error').message
            : 'Continue to your account'}
        </p>

        {provider && (
          <div className="mt-10">
            <form
              action={provider.signinUrl}
              method="POST"
              className="space-y-4"
            >
              <input type="hidden" name="csrfToken" value={csrfToken} />
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
                    clipRule="evenodd"
                  />
                </svg>
                Sign in with {provider.name}
              </button>
            </form>
          </div>
        )}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

/**
 * Custom NextAuth sign-in page that matches the application's design system.
 *
 * Provides a clean, branded sign-in experience specifically designed for
 * single-provider authentication with ZITADEL.
 */
export default function CustomSignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
