'use client'; // ← makes this a Client Component

import { SessionProvider } from 'next-auth/react';

export function ZitadelProvider({ children }: { children: React.ReactNode }) {
  return (
    // you can pass next-auth options here if you like
    <SessionProvider>{children}</SessionProvider>
  );
}
