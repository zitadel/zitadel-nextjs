import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, buildLogoutUrl } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // CORRECT: Use getServerSession to get the session data
  const session = await getServerSession(authOptions);

  if (!session?.idToken) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  const { url, state } = await buildLogoutUrl(session.idToken);
  const response = NextResponse.redirect(url);

  response.cookies.set('logout_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/logout/callback',
  });

  return response;
}
