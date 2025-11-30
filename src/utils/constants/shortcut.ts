export const SHORTCUTS = {
  OPEN_SEARCH_BAR: 'K',
  CREATE: 'N',
} as const;

export type Shortcut = keyof typeof SHORTCUTS;
