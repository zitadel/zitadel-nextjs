// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // wherever you keep your NextAuth options

// Create the handler in the module scope
const handler = NextAuth(authOptions);

// Re‑export it for both GET and POST
export { handler as GET, handler as POST };
