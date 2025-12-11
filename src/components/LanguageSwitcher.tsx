import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { setLanguage } from '@/lib/langSlice';
import i18n from '@/locales';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import CustomButton from './CustomButton';

const LANGUAGES = {
  en: {
    name: 'English',
    flag: '🇬🇧',
  },
  tr: {
    name: 'Türkçe',
    flag: '🇹🇷',
  },
} as const;

export type Language = keyof typeof LANGUAGES;

export function LanguageSwitcher() {
  const locale = useSelector((state: RootState) => state.lang.language);
  const dispatch = useDispatch();

  const handleChangeLocale = (key: Language) => {
    try {
      dispatch(setLanguage(key));
      i18n.changeLanguage(key);
    } catch (error) {
      console.error('Language change error:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CustomButton icon={<Globe />} variant="secondary" size="icon" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="space-y-0.5">
        {Object.entries(LANGUAGES).map(([key, language]) => {
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => handleChangeLocale(key as Language)}
              className={cn(
                'flex cursor-pointer',
                locale === key && 'bg-muted'
              )}
              aria-label={language.name}
              aria-disabled={locale === key}
            >
              {language.flag} {language.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
