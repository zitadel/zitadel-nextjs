/**
 * Defines categories of authentication-related errors.
 * - 'signin-error': Errors related to the direct sign-in flow (e.g., from an
 * OAuth callback or credential submission).
 * - 'auth-error': General authentication errors typically displayed on an
 * error page (e.g., configuration issues, access denied).
 */
type ErrorCategory = 'signin-error' | 'auth-error';

/**
 * Retrieves a user-friendly error message and heading based on an error code
 * and category.
 *
 * @param errorInput The error input which can be:
 * - A specific error code string (e.g., 'OAuthCallback', 'AccessDenied')
 * - A route query value from route.query.error (string, array, null, or undefined)
 * @param category The category of the error ('signin-error' for flow-specific
 * messages, 'auth-error' for general error page messages).
 * @returns An object containing a 'heading' and a 'message' for display.
 */
export function getMessage(
  errorInput: string | null | string[] | undefined,
  category: ErrorCategory,
): { heading: string; message: string } {
  const errorCode = Array.isArray(errorInput)
    ? (errorInput[0]?.toString() ?? null)
    : (errorInput?.toString() ?? null);
  const normalizedErrorCode = errorCode ? errorCode.toLowerCase() : 'default';

  if (category === 'signin-error') {
    switch (normalizedErrorCode) {
      case 'signin':
      case 'oauthsignin':
      case 'oauthcallback':
      case 'oauthcreateaccount':
      case 'emailcreateaccount':
      case 'callback':
        return {
          heading: 'Sign-in Failed',
          message: 'Try signing in with a different account.',
        };
      case 'oauthaccountnotlinked':
        return {
          heading: 'Account Not Linked',
          message:
            'To confirm your identity, sign in with the same account you used ' +
            'originally.',
        };
      case 'emailsignin':
        return {
          heading: 'Email Not Sent',
          message: 'The email could not be sent.',
        };
      case 'credentialssignin':
        return {
          heading: 'Sign-in Failed',
          message:
            'Sign in failed. Check the details you provided are correct.',
        };
      case 'sessionrequired':
        return {
          heading: 'Sign-in Required',
          message: 'Please sign in to access this page.',
        };
      default:
        return {
          heading: 'Unable to Sign in',
          message:
            'An unexpected error occurred during sign-in. Please try again.',
        };
    }
  } else if (category === 'auth-error') {
    switch (normalizedErrorCode) {
      case 'configuration':
        return {
          heading: 'Server Error',
          message:
            'There is a problem with the server configuration. Check the ' +
            'server logs for more information.',
        };
      case 'accessdenied':
        return {
          heading: 'Access Denied',
          message: 'You do not have permission to sign in.',
        };
      case 'verification':
        return {
          heading: 'Sign-in Link Invalid',
          message:
            'The sign-in link is no longer valid. It may have been used ' +
            'already or it may have expired.',
        };
      default:
        return {
          heading: 'Authentication Error',
          message:
            'An unexpected error occurred during authentication. Please try ' +
            'again.',
        };
    }
  }

  // Fallback for unexpected categories (shouldn't happen with proper typing)
  return {
    heading: 'Unknown Error',
    message: 'An unknown error occurred.',
  };
}
