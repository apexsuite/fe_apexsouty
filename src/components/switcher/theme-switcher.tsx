import { useTheme } from '@/providers/theme';
import { cn } from '@/lib/utils';
import { THEME_CONFIG } from '@/utils/constants/config';

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        'bg-background ring-border inline-flex h-8 w-fit rounded-md p-1 ring-1',
        className
      )}
    >
      {THEME_CONFIG.map(config => {
        const isActive = theme === config.key;
        return (
          <button
            type="button"
            key={config.key}
            className="relative size-6 cursor-pointer rounded-md transition-all duration-300"
            onClick={() => setTheme(config.key)}
            aria-label={config.label}
          >
            {isActive && (
              <span className="bg-secondary absolute inset-0 rounded-md" />
            )}
            <config.icon
              className={cn(
                'relative m-auto size-4',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
