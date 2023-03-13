import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import useSWR from 'swr';

const loadData = (url: string) =>
  fetch(url).then((resp) => {
    if (resp.ok) {
      return resp.json() as Promise<any>;
    } else {
      return resp.json().then((error) => {
        throw error;
      });
    }
  });

export default function Profile() {
  const { data: session, status } = useSession();

  const loading = status === 'loading';

  const { data: user, isValidating } = useSWR(`/api/userinfo`, (url) => loadData(url));

  const scope = 'urn:zitadel:iam:org:project:roles';

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
      {(loading || isValidating) && <span>loading...</span>}
      {user && (
        <>
          <div className="profile-row">
            {user.picture && (
              <Image
                style={{ borderRadius: '50vw', marginRight: '1rem' }}
                src={session.user.image}
                width={40}
                height={40}
                alt="user avatar"
              />
            )}
            <p>
              Signed in as {user.name}
              <br />
            </p>
          </div>
          {user && user[scope] && (
            <div className="user-roles-row">[{user[scope] && Object.keys(user[scope]).join(',')}]</div>
          )}
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </>
  );
}
