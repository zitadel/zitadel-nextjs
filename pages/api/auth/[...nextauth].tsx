import NextAuth from 'next-auth';
import ZitadelProvider from 'next-auth/providers/zitadel';

export default NextAuth({
  providers: [
    ZitadelProvider({
      issuer: process.env.ZITADEL_ISSUER,
      clientId: process.env.ZITADEL_CLIENT_ID,
      clientSecret: process.env.ZITADEL_CLIENT_SECRET,
    }),
  ],
});
