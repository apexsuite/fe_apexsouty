export const TAGS = {
  VENDOR: 'vendor',
} as const;

export type Tag = (typeof TAGS)[keyof typeof TAGS];
