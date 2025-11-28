import SearchBar from '@/components/layouts/SearchBar';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import Breadcrumb from '@/components/Breadcrumb';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Navbar() {
  return (
    <nav className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="flex items-center justify-between p-2 px-4">
        <Breadcrumb />
        <div className="max-w-64">
          <SearchBar />
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
