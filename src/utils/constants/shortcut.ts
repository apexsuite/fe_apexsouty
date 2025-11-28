export const SHORTCUTS = {
  OPEN_SEARCH_BAR: 'K',
} as const;

export type Shortcut = keyof typeof SHORTCUTS;
