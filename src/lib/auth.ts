import NextAuth, { NextAuthOptions } from 'next-auth';
import ZitadelProvider from 'next-auth/providers/zitadel';
import { randomUUID } from 'crypto';
import * as oidc from 'openid-client';
import { JWT } from 'next-auth/jwt';
import { ZITADEL_SCOPES } from './scopes';

/**
 * Automatically refreshes an expired access token using the refresh token.
 *
 * When a user's access token expires (typically after 1 hour), this function
 * seamlessly exchanges the refresh token for a new access token, allowing the
 * user to continue using the application without having to log in again.
 *
 * This is essential for maintaining long-lived sessions and preventing users
 * from being unexpectedly logged out during active use of the application.
 *
 * ## How Token Refresh Works
 *
 * 1. **Token Expiry Detection**: NextAuth automatically checks if the access token has expired
 * 2. **Refresh Request**: Uses the refresh token to request new tokens from ZITADEL
 * 3. **Token Update**: Updates the JWT with the new access token and expiry time
 * 4. **Seamless Experience**: User continues without interruption
 *
 * ## Error Handling
 *
 * If the refresh fails (e.g., refresh token expired, user permissions revoked),
 * the function sets an error flag that forces the user to sign in again.
 *
 * @param token - The current JWT containing the refresh token and other session data
 * @returns Promise resolving to updated JWT with new tokens or error state
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    console.error('No refresh token available for refresh');
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }

  try {
    const config = await oidc.discovery(
      new URL(process.env.ZITADEL_DOMAIN!),
      process.env.ZITADEL_CLIENT_ID!,
      process.env.ZITADEL_CLIENT_SECRET,
    );

    const tokenEndpointResponse = await oidc.refreshTokenGrant(
      config,
      token.refreshToken as string,
    );

    return {
      ...token,
      accessToken: tokenEndpointResponse.access_token,
      expiresAt: tokenEndpointResponse.expires_in
        ? Date.now() + tokenEndpointResponse.expires_in * 1000
        : Date.now() + 3600 * 1000,
      refreshToken: tokenEndpointResponse.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error('Token refresh failed:', error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

/**
 * Builds a secure logout URL for ZITADEL that includes proper state validation
 * to prevent CSRF attacks during the logout flow.
 *
 * This function uses the OpenID Connect Discovery protocol to automatically
 * configure the logout endpoint and creates a logout URL with:
 * - ID token hint for proper session termination
 * - Post-logout redirect URI for user experience
 * - State parameter for CSRF protection
 *
 * @param idToken - The user's ID token from their current session
 * @returns Promise containing the logout URL and state for validation
 *
 * @example
 * ```typescript
 * const session = await getServerSession(authOptions);
 * if (session?.idToken) {
 *   const { url, state } = await buildLogoutUrl(session.idToken);
 *   // Redirect user to logout URL and store state for callback validation
 * }
 * ```
 */
export async function buildLogoutUrl(
  idToken: string,
): Promise<{ url: string; state: string }> {
  // Discover the ZITADEL OIDC configuration automatically
  const config = await oidc.discovery(
    new URL(process.env.ZITADEL_DOMAIN!),
    process.env.ZITADEL_CLIENT_ID!,
    process.env.ZITADEL_CLIENT_SECRET,
  );

  // Generate a cryptographically secure state parameter for CSRF protection
  const state = randomUUID();

  // Build the logout URL with proper parameters
  const urlObj = oidc.buildEndSessionUrl(config, {
    id_token_hint: idToken,
    post_logout_redirect_uri: process.env.ZITADEL_POST_LOGOUT_URL!,
    state,
  });

  return { url: urlObj.toString(), state };
}

/**
 * Extend NextAuth.js JWT interface to include the ID token
 * This allows us to store the ID token in the JWT for logout functionality
 */
declare module 'next-auth/jwt' {
  interface JWT {
    /** The OpenID Connect ID token from ZITADEL */
    idToken?: string;
  }
}

/**
 * Extend NextAuth.js Session interface to include the ID token
 * This makes the ID token available in session objects throughout the app
 */
declare module 'next-auth' {
  interface Session {
    /** The OpenID Connect ID token from ZITADEL */
    idToken?: string;
  }
}

/**
 * NextAuth.js configuration for ZITADEL integration
 *
 * This configuration implements the OAuth 2.0 Authorization Code Flow with PKCE
 * (Proof Key for Code Exchange) for maximum security. The setup includes:
 *
 * - ZITADEL provider with proper scopes
 * - JWT session strategy for scalability
 * - Custom callbacks for token and session handling
 * - Automatic redirect to profile page after login
 */
export const authOptions: NextAuthOptions = {
  providers: [
    ZitadelProvider({
      // ZITADEL instance URL (e.g., https://my-company.zitadel.cloud)
      issuer: process.env.ZITADEL_DOMAIN!,

      // Application credentials from ZITADEL console
      clientId: process.env.ZITADEL_CLIENT_ID!,
      clientSecret: process.env.ZITADEL_CLIENT_SECRET!,

      // Configure OAuth scopes and parameters
      authorization: {
        params: {
          scope: ZITADEL_SCOPES,
        },
      },
    }),
  ],

  // Session configuration
  session: {
    // Use JWT strategy for stateless sessions (more scalable)
    strategy: 'jwt',

    // Session expiration time in seconds (from environment variable)
    maxAge: Number(process.env.SESSION_DURATION) || 3600, // Default 1 hour
  },

  // Secret for signing JWTs and encrypting session data
  secret: process.env.SESSION_SECRET,

  // Custom callback functions for handling authentication flow
  callbacks: {
    /**
     * Redirect callback - determines where users go after sign in
     * Always redirects to the profile page regardless of where they came from
     */
    async redirect({ baseUrl }) {
      return `${baseUrl}/profile`;
    },

    /**
     * JWT callback - handles token processing during authentication
     * Stores the ID token in the JWT for later use in logout flow
     */
    async jwt({ token, account }) {
      // Store the ID token when user first signs in
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      return token;
    },

    /**
     * Session callback - shapes the session object returned to the client
     * Makes the ID token available in session objects throughout the app
     */
    async session({ session, token }) {
      // Add ID token to session for logout functionality
      session.idToken = token.idToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
