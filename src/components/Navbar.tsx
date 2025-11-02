import { Globe, Menu as MenuIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { setLanguage } from '@/lib/langSlice';
import i18n from '@/lib/i18n';
import SearchBar from '@/components/layouts/SearchBar';
import { ThemeSwitcher } from '@/components/switcher/theme-switcher';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const lang = useSelector((state: RootState) => state.lang.language);
  const dispatch = useDispatch();
  return (
    <>
      <nav
        className={`border-border bg-background sticky top-0 z-40 flex w-full items-center justify-between border-b px-4 py-6 shadow-sm md:px-12`}
      >
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <button
            className="group rounded p-2 hover:bg-green-100 lg:hidden dark:hover:bg-green-900"
            onClick={onMenuClick}
            aria-label="Menüyü Aç"
          >
            <MenuIcon
              size={24}
              className="transition-colors group-hover:text-green-600 dark:group-hover:text-green-300"
            />
          </button>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-green-700 dark:text-green-300">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-14a6 6 0 1 0 0 12A6 6 0 0 0 12 6Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="text-xl font-bold text-green-700 dark:text-green-300">
            ApexScouty
          </span>
        </div>
        <div className="flex w-full justify-center">
          <SearchBar />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Globe size={18} className="text-muted-foreground" />
          <button
            className={`cursor-pointer px-1 font-semibold ${lang === 'en' ? 'text-red-700' : 'text-muted-foreground'}`}
            onClick={() => {
              try {
                dispatch(setLanguage('en'));
                i18n.changeLanguage('en');
              } catch (error) {
                console.error('Language change error:', error);
              }
            }}
          >
            EN
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            className={`cursor-pointer px-1 font-semibold ${lang === 'tr' ? 'text-red-700' : 'text-muted-foreground'}`}
            onClick={() => {
              try {
                dispatch(setLanguage('tr'));
                i18n.changeLanguage('tr');
              } catch (error) {
                console.error('Language change error:', error);
              }
            }}
          >
            TR
          </button>
          <ThemeSwitcher />
        </div>
      </nav>
    </>
  );
}
