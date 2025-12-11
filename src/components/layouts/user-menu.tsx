import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Globe, UserIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { logoutUser } from '@/lib/authSlice';
import { clearPageHistory } from '@/utils/hooks/usePageHistory';
import { useTheme } from '@/providers/theme';
import { setLanguage } from '@/lib/langSlice';
import i18n from '@/locales';
import { LANGUAGES, type Language } from '@/components/LanguageSwitcher';
import CustomButton from '@/components/CustomButton';
import { THEME_CONFIG } from '@/utils/constants/theme';

export function UserMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, setTheme } = useTheme();
  const locale = useSelector((state: RootState) => state.lang.language);

  const handleLogout = () => {
    dispatch(logoutUser());
    clearPageHistory();
  };

  const handleLanguageChange = (lang: Language) => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
  };

  const currentThemeConfig = THEME_CONFIG.find(config => config.key === theme);
  const ThemeIcon = currentThemeConfig?.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CustomButton icon={<UserIcon />} size="icon" variant="outline" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" sideOffset={0}>
        <div className="flex items-center gap-2 p-1">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.firstname} />
            <AvatarFallback>{user?.firstname[0]}</AvatarFallback>
          </Avatar>
          <span className="line-clamp-1 text-sm">
            {`${user?.firstname} ${user?.lastname}`.trim()}
          </span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="h-9 px-2">
            <div className="flex items-center gap-2">
              {ThemeIcon && <ThemeIcon className="h-4 w-4" />}
              <span>Theme</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {THEME_CONFIG.map(config => {
              const isActive = theme === config.key;
              const Icon = config.icon;
              return (
                <DropdownMenuItem
                  key={config.key}
                  onClick={() => setTheme(config.key)}
                  className={isActive ? 'bg-muted' : ''}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{config.label.replace(' theme', '')}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="h-9 px-2">
            <div className="flex items-center gap-2">
              <Globe />
              <span>Language</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {Object.entries(LANGUAGES).map(([key, lang]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => handleLanguageChange(key as Language)}
                className={locale === key ? 'bg-muted' : ''}
              >
                <span className="mr-2 text-base">{lang.flag}</span>
                <span>{lang.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <CustomButton
          icon={<LogOut />}
          onClick={handleLogout}
          variant="destructive"
          label="Log out"
          className="w-full"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
