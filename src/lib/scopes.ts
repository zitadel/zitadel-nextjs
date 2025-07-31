/**
 * ZITADEL OAuth 2.0 / OpenID Connect Scopes
 *
 * Simply comment/uncomment the scopes you need for your application.
 *
 * @see https://zitadel.com/docs/apis/openidoauth/scopes
 */
export const ZITADEL_SCOPES = [
  // ========================================================================
  // Standard OpenID Connect Scopes
  // ========================================================================

  /** openid - REQUIRED SCOPE
   * This is the fundamental scope for OpenID Connect authentication. Without
   * this scope, you cannot perform OIDC authentication. It provides the basic
   * user identifier (sub claim) and enables all other OIDC functionality.
   *
   * Claims provided: sub, iss, aud, exp, iat, auth_time
   * Use case: Always required for any OIDC authentication
   * Security: Minimal data exposure - only provides user identification
   */
  'openid',

  /** profile - User Profile Information
   * Grants access to the user's basic profile information including their
   * display name, given name, family name, locale, and when their profile
   * was last updated. This is essential for personalizing the user experience
   * and displaying user information in your application interface.
   *
   * Claims provided: name, given_name, family_name, middle_name, nickname,
   *                 preferred_username, profile, picture, website, gender,
   *                 birthdate, zoneinfo, locale, updated_at
   * Use case: Showing "Welcome, John Doe" instead of "Welcome, User"
   * Security: Contains personally identifiable information
   */
  'profile',

  /** email - Email Address and Verification
   * Provides access to the user's email address and whether it has been
   * verified by ZITADEL. Essential for applications that need to send
   * notifications, password resets, or any email-based communication.
   * The verification status helps determine if the email can be trusted.
   *
   * Claims provided: email, email_verified
   * Use case: Account notifications, password resets, user contact
   * Security: Contains sensitive contact information
   */
  'email',

  /** address - Postal Address Information (DISABLED)
   * Grants access to the user's postal address information including street
   * address, city, state, postal code, and country. Useful for applications
   * that need shipping addresses, billing information, or location-based
   * services. Uncomment only if your application specifically needs this.
   *
   * Claims provided: address (formatted, street_address, locality, region,
   *                 postal_code, country)
   * Use case: E-commerce shipping, billing addresses, location services
   * Security: Contains sensitive location and personal information
   */
  // 'address',

  /** phone - Phone Number and Verification (DISABLED)
   * Provides access to the user's phone number and whether it has been
   * verified. Useful for applications requiring SMS notifications, two-factor
   * authentication via SMS, or voice communications. The verification status
   * indicates if the phone number can be trusted for security purposes.
   *
   * Claims provided: phone_number, phone_number_verified
   * Use case: SMS notifications, 2FA, voice calls, mobile verification
   * Security: Contains sensitive contact information
   */
  // 'phone',

  /** offline_access - Refresh Token for Long-Lived Sessions
   * Grants a refresh token that allows your application to obtain new access
   * tokens without requiring the user to re-authenticate. This is crucial for
   * applications that need to maintain user sessions for extended periods
   * (days, weeks, or months) without forcing re-login.
   *
   * Claims provided: (refresh_token in response, not in token claims)
   * Use case: Long-lived sessions, background token refresh, mobile apps
   * Security: Provides long-term access - store refresh tokens securely
   */
  'offline_access',

  // ========================================================================
  // ZITADEL-Specific Extended Scopes
  // ========================================================================

  /** urn:zitadel:iam:user:metadata - Custom User Attributes
   * Grants access to custom metadata and attributes that have been defined
   * for users in your ZITADEL instance. This includes any custom fields
   * you've added to user profiles such as employee IDs, department information,
   * custom preferences, or any other organization-specific user data.
   *
   * Claims provided: urn:zitadel:iam:user:metadata (base64 encoded values)
   * Use case: Employee directories, custom user properties, business logic
   * Security: May contain sensitive business or personal information
   */
  'urn:zitadel:iam:user:metadata',

  /** urn:zitadel:iam:user:resourceowner - Organization Information
   * Provides information about the organization (resource owner) that the
   * user belongs to. This includes the organization's ID, name, and primary
   * domain. Essential for multi-tenant applications where you need to know
   * which organization context the user is operating in.
   *
   * Claims provided: urn:zitadel:iam:user:resourceowner:id,
   *                 urn:zitadel:iam:user:resourceowner:name,
   *                 urn:zitadel:iam:user:resourceowner:primary_domain
   * Use case: Multi-tenant applications, organization branding, admin panels
   * Security: Contains organization structure information
   */
  'urn:zitadel:iam:user:resourceowner',

  /** urn:zitadel:iam:org:projects:roles - Project Role Assignments
   * Grants access to the user's role assignments across all projects within
   * their organization. This is fundamental for implementing role-based access
   * control (RBAC) in your application. Each role assignment includes the
   * role name and the project/organization context where it applies.
   *
   * Claims provided: urn:zitadel:iam:org:project:{projectid}:roles
   * Use case: RBAC, permission checks, feature flags, admin interfaces
   * Security: Contains authorization and privilege information
   */
  'urn:zitadel:iam:org:projects:roles',

  /** urn:zitadel:iam:org:project:id:zitadel:aud - ZITADEL Management API (DISABLED)
   * Adds the ZITADEL project ID to the access token audience, enabling your
   * application to call ZITADEL's management APIs for administrative tasks
   * like user management, organization administration, and project configuration.
   * Only enable this if you need to perform administrative operations.
   *
   * Claims provided: (adds zitadel project to aud claim)
   * Use case: Admin dashboards, user management, organization administration
   * Security: Grants administrative access - requires elevated privileges
   */
  // 'urn:zitadel:iam:org:project:id:zitadel:aud',
].join(' ');
