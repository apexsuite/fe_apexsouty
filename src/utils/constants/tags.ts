export const TAGS = {
  PAGE_ROUTE: 'page-route',
  ROLE: 'role',
  VENDOR: 'vendor',
} as const;

export type Tag = (typeof TAGS)[keyof typeof TAGS];
