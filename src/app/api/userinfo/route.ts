import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * ZITADEL UserInfo API Route
 *
 * Fetches extended user information from ZITADEL's UserInfo endpoint.
 * This provides real-time user data including roles, custom attributes,
 * and organization membership that may not be in the cached session.
 *
 * ## Usage
 *
 * ```typescript
 * const response = await fetch('/api/userinfo');
 * const userInfo = await response.json();
 * ```
 *
 * ## Returns
 *
 * Extended user profile with ZITADEL-specific claims like roles and metadata.
 */
export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.ZITADEL_DOMAIN}/oidc/v1/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`UserInfo API error: ${response.status}`);
    }

    const userInfo = await response.json();
    return NextResponse.json(userInfo);
  } catch (error) {
    console.error('UserInfo fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user info' },
      { status: 500 },
    );
  }
}
