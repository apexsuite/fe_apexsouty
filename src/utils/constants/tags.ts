export const TAGS = {
  ROLE: 'role',
  VENDOR: 'vendor',
} as const;

export type Tag = (typeof TAGS)[keyof typeof TAGS];
