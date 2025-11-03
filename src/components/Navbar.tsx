import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { setLanguage } from '@/lib/langSlice';
import i18n from '@/locales';
import SearchBar from '@/components/layouts/SearchBar';
import { ThemeSwitcher } from '@/components/switcher/theme-switcher';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from './ui/sidebar';

export default function Navbar() {
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
    <nav className="border-border bg-background sticky top-0 z-40 w-full border-b">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:max-w-md md:flex-1">
          <SidebarTrigger className="block md:hidden" />
          <SearchBar />
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-background ring-border inline-flex h-8 items-center gap-1 rounded-md p-1 ring-1">
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={cn(
                'relative flex h-6 items-center justify-center rounded px-3 text-xs font-semibold transition-all duration-300',
                lang === 'en'
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
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
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label="Türkçe'ye geç"
            >
              TR
            </button>
          </div>

          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
