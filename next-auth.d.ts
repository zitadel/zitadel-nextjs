import { DefaultSession, User } from 'next-auth';
import 'next-auth/jwt';

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string;
      loginName?: string;
      orgName?: string;
    } & DefaultSession['user'];
    error?: string;
    clientId: string;
  }

  interface User {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    loginName: string;
    image: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
