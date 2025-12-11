import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

export const THEME_STORAGE_KEY = 'theme' as const;

export const THEME_CONFIG = [
  {
    key: 'system',
    label: 'System theme',
    icon: MonitorIcon,
  },
  {
    key: 'light',
    label: 'Light theme',
    icon: SunIcon,
  },
  {
    key: 'dark',
    label: 'Dark theme',
    icon: MoonIcon,
  },
] as const;

export type Theme = (typeof THEME_CONFIG)[number]['key'];
