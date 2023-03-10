import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import ZitadelProvider from 'next-auth/providers/zitadel';
import { Issuer } from 'openid-client';

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const issuer = await Issuer.discover(process.env.ZITADEL_ISSUER ?? '');
    const client = new issuer.Client({
      client_id: process.env.ZITADEL_CLIENT_ID || '',
      token_endpoint_auth_method: 'none',
    });

    const { refresh_token, access_token, expires_at } = await client.refresh(token.refreshToken as string);

    return {
      ...token,
      accessToken: access_token,
      expiresAt: (expires_at ?? 0) * 1000,
      refreshToken: refresh_token, // Fall back to old refresh token
    };
  } catch (error) {
    console.error('Error during refreshAccessToken', error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  providers: [
    ZitadelProvider({
      issuer: process.env.ZITADEL_ISSUER,
      clientId: process.env.ZITADEL_CLIENT_ID,
      clientSecret: process.env.ZITADEL_CLIENT_SECRET,
      authorization: {
        params: {
          scope: `openid email profile offline_access`,
        },
      },
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          loginName: profile.preferred_username,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      token.user ??= user;
      token.accessToken ??= account?.access_token;
      token.refreshToken ??= account?.refresh_token;
      token.expiresAt ??= (account?.expires_at ?? 0) * 1000;
      token.error = undefined;
      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token: { user, error: tokenError } }) {
      session.user = {
        id: user?.id,
        email: user?.email,
        image: user?.image,
        name: user?.name,
        loginName: user?.loginName,
      };
      session.clientId = process.env.ZITADEL_CLIENT_ID;
      session.error = tokenError;
      return session;
    },
  },
});
