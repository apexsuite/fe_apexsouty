import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { setLanguage } from '@/lib/langSlice';
import i18n from '@/locales';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

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
      <Globe className="h-4 w-4 text-gray-600 dark:text-gray-50" />
      <div className="bg-white ring-border inline-flex h-8 items-center gap-1 rounded-md p-1 ring-1 shadow-sm">
        <button
          type="button"
          onClick={() => handleLanguageChange('en')}
          className={cn(
            'relative flex h-6 items-center justify-center rounded px-3 text-xs font-semibold transition-all duration-300',
            lang === 'en'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
          )}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => handleLanguageChange('tr')}
          className={cn(
            'relative flex h-6 items-center justify-center rounded px-3 text-xs font-semibold transition-all duration-300',
            lang === 'tr'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
          )}
          aria-label="Türkçe'ye geç"
        >
          TR
        </button>
      </div>
    </div>
  );
}

