import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Handles the callback from an external Identity Provider (IdP) after a user
 * signs out. This endpoint is responsible for validating the logout request to
 * prevent Cross-Site Request Forgery (CSRF) attacks by comparing a `state`
 * parameter from the URL with a value stored in a secure, server-side cookie.
 * If validation is successful, it clears the user's session cookies and
 * redirects to a success page. Otherwise, it redirects to an error page.
 *
 * @param request - The incoming Next.js request object, which contains the
 * URL and its search parameters, including the `state` from the IdP.
 * @returns A NextResponse object that either redirects the user to a success
 * or error page. Upon success, it includes headers to delete session cookies.
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const state = request.nextUrl.searchParams.get('state');
  const logoutStateCookie = cookieStore.get('logout_state');

  if (state && logoutStateCookie && state === logoutStateCookie.value) {
    const successUrl = new URL('/logout/success', request.url);
    const response = NextResponse.redirect(successUrl);

    response.headers.set('Clear-Site-Data', '"cookies"');
    return response;
  } else {
    const errorUrl = new URL('/logout/error', request.url);
    errorUrl.searchParams.set('reason', 'Invalid or missing state parameter.');
    return NextResponse.redirect(errorUrl);
  }
}
