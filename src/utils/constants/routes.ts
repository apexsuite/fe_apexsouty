export const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/access-denied',
] as const;

export const ALWAYS_ALLOWED_ROUTES = [
  '/',
  '/dashboard',
  '/permissions',
  '/permissions-management',
  '/all-services',
  '/all-resources',
] as const;
