This is our ZITADEL [Next.js](https://nextjs.org/) template. It shows how to authenticate as a user and retrieve user information from the OIDC endpoint.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzitadel%2Fzitadel-nextjs&env=NEXTAUTH_URL,ZITADEL_CLIENT_ID,ZITADEL_CLIENT_SECRET,ZITADEL_ISSUER,NEXTAUTH_SECRET&envDescription=Navigate%20to%20your%20ZITADEL%20cloud%20application%20and%20copy%20the%20required%20information.%20Provide%20a%20random%20value%20for%20ZITADEL_CLIENT_SECRET%20and%20NEXTAUTH_SECRET&project-name=zitadel-nextjs&repo-name=zitadel-nextjs&redirect-url=https%3A%2F%2Fzitadel.cloud)

## Getting Started

First, to install the dependencies run:

```bash
yarn install
```

then create a file `.env` in the root of the project and add the following keys to it.
You can find your Issuer Url on the application detail page in console.

```
NEXTAUTH_URL=http://localhost:3000
ZITADEL_ISSUER=[yourIssuerUrl]
ZITADEL_CLIENT_ID=[yourClientId]
ZITADEL_CLIENT_SECRET=[randomvalue]
NEXTAUTH_SECRET=[randomvalue]
```

next-auth requires a secret for all providers, so just define a random value here.
then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Configuration

NextAuth.js exposes a REST API which is used by your client.
To setup your configuration, create a file called [...nextauth].tsx in `pages/api/auth`.
You can directly import our ZITADEL provider from [next-auth](https://next-auth.js.org/providers/zitadel).

```ts
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
```

You can overwrite the default callbacks too, just append them to the ZITADEL provider.

```ts
...
ZitadelProvider({
    issuer: process.env.ZITADEL_ISSUER,
    clientId: process.env.ZITADEL_CLIENT_ID,
    clientSecret: process.env.ZITADEL_CLIENT_SECRET,
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
...
```

We recommend using the Authentication Code flow secured by PKCE for the Authentication flow.
To be able to connect to ZITADEL, navigate to your Console Projects, create or select an existing project and add your app selecting WEB, then CODE, and then add `http://localhost:3000/api/auth/callback/zitadel` as redirect url to your app.

For simplicity reasons we set the default to the one that next-auth provides us. You'll be able to change the redirect later if you want to.

Hit Create, then in the detail view of your application make sure to enable dev mode. Dev mode ensures that you can start an auth flow from a non https endpoint for testing.

> Once you have created the application, you will see a dialog providing the clientId and clientSecret.

Copy the secret as it will not be shown again.

Now go to Token settings and check the checkbox for **User Info inside ID Token** to get your users name directly on authentication.

# User interface

Now we can start editing the homepage by modifying `pages/index.tsx`.
Add this snippet your file. This code gets your auth session from next-auth, renders a Logout button if your authenticated or shows a Signup button if your not.
Note that signIn method requires the id of the provider we provided earlier, and provides a possibilty to add a callback url, Auth Next will redirect you to the specified route if logged in successfully.

```ts
import { signIn, signOut, useSession } from 'next-auth/client';

export default function Page() {
    const { data: session } = useSession();
    ...
    {!session && <>
        Not signed in <br />
        <button onClick={() => signIn('zitadel', { callbackUrl: 'http://localhost:3000/profile' })}>
            Sign in
        </button>
    </>}
    {session && <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
    </>}
    ...
}
```

### Session state

To allow session state to be shared between pages - which improves performance, reduces network traffic and avoids component state changes while rendering - you can use the NextAuth.js Provider in `/pages/_app.tsx`.
Take a loot at the template `_app.tsx`.

```ts
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
```

Last thing: create a `profile.tsx` in /pages which renders the callback page.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
