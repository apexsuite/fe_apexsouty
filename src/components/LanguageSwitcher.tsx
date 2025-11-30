import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { setLanguage } from '@/lib/langSlice';
import i18n from '@/locales';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  {
    code: 'en',
  },
  {
    code: 'tr',
  },
] as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const lang = useSelector((state: RootState) => state.lang.language);
  const dispatch = useDispatch();

  const handleLanguageChange = (language: 'en' | 'tr') => {
    try {
      dispatch(setLanguage(language));
      i18n.changeLanguage(language);
    } catch (error) {
      console.error('Language change error:', error);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="ring-border inline-flex h-8 items-center gap-1 rounded-md p-1 shadow-sm ring-1">
        {LANGUAGES.map(language => (
          <button
            key={language.code}
            type="button"
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              'relative flex h-6 items-center justify-center rounded px-3 text-xs font-semibold',
              lang === language.code && 'bg-secondary text-secondary-foreground'
            )}
          >
            {language.code.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
