import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import Breadcrumb from '@/components/layouts/breadcrumb';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex items-center justify-between p-2 px-4">
        <Breadcrumb />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
