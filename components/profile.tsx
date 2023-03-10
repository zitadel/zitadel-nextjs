import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Profile() {
  const { data: session, status } = useSession();

  const loading = status === 'loading';

  return (
    <>
      {!session && (
        <>
          <p>Not signed in</p>
          <br />

          <button
            onClick={() =>
              signIn('zitadel', {
                callbackUrl: 'http://localhost:3000/profile',
              })
            }
          >
            Sign in
          </button>
        </>
      )}
      {session && (
        <>
          <div>
            {session.user?.image && <Image src={session.user.image} width={40} height={40} alt="user avatar" />}
            <p>
              Signed in as {session.user.name}
              <br />
            </p>
          </div>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </>
  );
}
