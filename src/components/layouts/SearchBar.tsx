import { useState, useEffect, useOptimistic, useTransition } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppDispatch } from '@/lib/store';
import {
  MenuItem,
  addFavorite,
  deleteFavorite,
  fetchMenu,
  fetchFavorites,
} from '@/lib/menuSlice';
import * as LucideIcons from 'lucide-react';
import { getPageHistory, clearPageHistory } from '@/utils/hooks/usePageHistory';
import { useKeyboardShortcut } from '@/utils/hooks/useKeyboardShortcut';
import { Button } from '@/components/ui/button';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

const SearchBar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [, startTransition] = useTransition();
  const [history, setHistory] = useState(getPageHistory());
  const navigate = useNavigate();

  const dispatchRedux = useDispatch<AppDispatch>();

  const [optimisticMenuItems, addOptimistic] = useOptimistic(
    menuItems,
    (
      currentItems: MenuItem[],
      { pageRouteID, isFavorite }: { pageRouteID: string; isFavorite: boolean }
    ) => {
      return currentItems.map(item => {
        if ((item.pageRouteID || item.id) === pageRouteID) {
          return {
            ...item,
            isFavourite: !isFavorite,
          };
        }
        return item;
      });
    }
  );

  const handleFavorite = async (isFavorite: boolean, pageRouteID: string) => {
    startTransition(async () => {
      addOptimistic({ pageRouteID, isFavorite });

      try {
        if (isFavorite) {
          const currentMenuItem = menuItems.find(
            item => (item.pageRouteID || item.id) === pageRouteID
          );

          if (!currentMenuItem) {
            console.error('Menu item bulunamadı:', pageRouteID);
            throw new Error('Menu item not found');
          }

          const favoritesResult =
            await dispatchRedux(fetchFavorites()).unwrap();

          // Önce path ile eşleştir, sonra label ile
          const favoriteItem = favoritesResult.find((fav: MenuItem) => {
            // path exact match
            if (
              fav.path &&
              currentMenuItem.path &&
              fav.path === currentMenuItem.path
            ) {
              return true;
            }
            // label/name match
            if (
              fav.name &&
              currentMenuItem.label &&
              fav.name === currentMenuItem.label
            ) {
              return true;
            }
            // pageRouteID match (eğer favorites'ta varsa)
            if (
              (fav as any).pageRouteID &&
              (fav as any).pageRouteID === pageRouteID
            ) {
              return true;
            }
            return false;
          });

          if (favoriteItem?.favouriteId) {
            await dispatchRedux(
              deleteFavorite(favoriteItem.favouriteId)
            ).unwrap();
          } else {
            console.error('favouriteId bulunamadı:', {
              pageRouteID,
              currentMenuItem,
              favoritesResult,
              favoriteItem,
            });
            throw new Error('Favorite ID not found');
          }
        } else {
          await dispatchRedux(addFavorite(pageRouteID)).unwrap();
        }
        // Menüleri yeniden yükle
        const updatedMenu = await dispatchRedux(fetchMenu()).unwrap();
        setMenuItems(updatedMenu as MenuItem[]);
      } catch (error) {
        console.error('Favorite toggle error:', error);
        // Hata durumunda menüleri yeniden yükle (optimistic update'i geri al)
        const updatedMenu = await dispatchRedux(fetchMenu()).unwrap();
        setMenuItems(updatedMenu as MenuItem[]);
      }
    });
  };

  const handleNavigate = (path: string) => {
    if (path) {
      navigate(path);
      setOpen(false);
    }
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    clearPageHistory();
    setHistory([]);
  };

  useEffect(() => {
    dispatchRedux(fetchMenu()).then(res => {
      setMenuItems(res.payload as MenuItem[]);
      console.log(res.payload);
    });
  }, [dispatchRedux]);

  useEffect(() => {
    if (open) {
      setHistory(getPageHistory());
    }
  }, [open]);

  useKeyboardShortcut({
    key: 'k',
    metaKey: true,
    onPress: () => {
      setOpen(open => !open);
    },
  });

  const RANDOM_COLORS = [
    {
      light:
        'rounded bg-gradient-to-b from-yellow-200 to-yellow-400 p-2 text-yellow-800 dark:from-yellow-200 dark:to-yellow-600',
    },
    {
      light:
        'rounded bg-gradient-to-b from-orange-200 to-orange-400 p-2 text-orange-800 dark:from-orange-200 dark:to-orange-600',
    },
    {
      light:
        'rounded bg-gradient-to-b from-red-200 to-red-400 p-2 text-red-800 dark:from-red-200 dark:to-red-600',
    },
    {
      light:
        'rounded bg-gradient-to-b from-green-200 to-green-400 p-2 text-green-800 dark:from-green-200 dark:to-green-600',
    },
    {
      light:
        'rounded bg-gradient-to-b from-blue-200 to-blue-400 p-2 text-blue-800 dark:from-blue-200 dark:to-blue-600',
    },
    {
      light:
        'rounded bg-gradient-to-b from-purple-200 to-purple-400 p-2 text-purple-800 dark:from-purple-200 dark:to-purple-600',
    },
    {
      light:
        'rounded bg-gradient-to-b from-pink-200 to-pink-400 p-2 text-pink-800 dark:from-pink-200 dark:to-pink-600',
    },
    {
      light:
        'rounded bg-gradient-to-b from-amber-200 to-amber-400 p-2 text-amber-800 dark:from-amber-200 dark:to-amber-600',
    },
    {
      light:
        'rounded bg-gradient-to-b from-gray-200 to-gray-400 p-2 text-gray-800 dark:from-gray-200 dark:to-gray-600',
    },
  ];

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <span className="flex grow items-center">
          <LucideIcons.SearchIcon
            className="text-muted-foreground/80 -ms-1 me-3"
            aria-hidden="true"
          />
          <span className="text-muted-foreground/70 font-normal">
            {t('searchBar.search')}
          </span>
        </span>
        <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t('searchBar.search')} />
        <CommandList className="max-h-[50vh] w-full">
          <CommandEmpty>{t('searchBar.noResults')}</CommandEmpty>
          {history.length > 0 ? (
            <>
              <CommandGroup
                heading={
                  <div className="flex w-full items-center justify-between">
                    <span>{t('searchBar.history')}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 cursor-pointer px-2 text-xs"
                      onClick={handleClearHistory}
                      aria-label={t('searchBar.clearHistory')}
                    >
                      <LucideIcons.X size={14} className="-me-1" />
                      {t('searchBar.clearHistory')}
                    </Button>
                  </div>
                }
              >
                {history.map(item => (
                  <CommandItem
                    key={item.path}
                    onSelect={() => handleNavigate(item.path)}
                  >
                    <LucideIcons.SquareArrowOutUpRight size={14} />
                    <span className="flex-1">{t(item.title as string)}</span>
                    <Kbd>↵</Kbd>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          ) : null}

          <CommandGroup heading={t('searchBar.pages')}>
            {optimisticMenuItems.map((fav: MenuItem, index: number) => {
              const Icon = fav.icon && (LucideIcons as any)[fav.icon];
              const isFavorite = fav.isFavourite === true;
              const colorClasses =
                RANDOM_COLORS[index % RANDOM_COLORS.length]?.light ||
                RANDOM_COLORS[0]!.light;
              return (
                <CommandItem
                  key={fav.id}
                  onSelect={() => fav.path && handleNavigate(fav.path)}
                  className="flex items-center gap-3 py-3"
                >
                  {Icon && (
                    <div className={colorClasses}>
                      <Icon />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{fav.label}</div>
                    {fav.description && (
                      <div className="text-muted-foreground mt-0.5 truncate text-xs">
                        {fav.description}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 cursor-pointer hover:bg-transparent"
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleFavorite(isFavorite, fav.pageRouteID as string);
                    }}
                  >
                    <LucideIcons.Star
                      fill={isFavorite ? `#facc15` : 'transparent'}
                      stroke={`#facc15`}
                      className="transition-all"
                    />
                  </Button>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
        <div className="border-input text-muted-foreground flex items-center justify-between border-t px-3 py-2 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <KbdGroup>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
              </KbdGroup>
              <span className="text-xs">
                {t('searchBar.navigation.navigate')}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              <span className="text-xs">
                {t('searchBar.navigation.select')}
              </span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
