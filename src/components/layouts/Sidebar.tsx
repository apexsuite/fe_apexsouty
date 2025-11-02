import * as React from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/lib/store';
import * as LucideIcons from 'lucide-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { t } from 'i18next';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  fetchMenu,
  fetchFavorites,
  selectFavorites,
  deleteFavorite,
  updateFavoriteOrder,
  reorderFavoritesLocally,
} from '@/lib/menuSlice';
import { logoutUser } from '@/lib/authSlice';
import { clearPageHistory } from '@/utils/hooks/usePageHistory';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>();
  const favoritesMenu = useSelector(selectFavorites);
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const { setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = React.useState(false);

  useEffect(() => {
    dispatch(fetchMenu());
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleNavigate = (href: string) => {
    if (isDragging) return;
    navigate(href);
    setOpenMobile(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    clearPageHistory();
    setOpenMobile(false);
  };

  const handleFavoriteReorder = (result: DropResult) => {
    setIsDragging(false);
    if (!result.destination) return;

    const reordered = Array.from(favoritesMenu);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    const reorderedWithOrder = reordered.map((fav: any, idx: number) => ({
      ...fav,
      order: idx,
    }));
    const movedItem = reorderedWithOrder[result.destination.index];
    let pageRouteID = movedItem.pageRouteID;
    if (!pageRouteID) {
      const match = menuItems.find(
        (item: any) =>
          item.favouriteId === movedItem.favouriteId || item.id === movedItem.id
      );
      pageRouteID = match?.pageRouteID;
    }

    dispatch(reorderFavoritesLocally(reorderedWithOrder));
    dispatch(
      updateFavoriteOrder({
        favouriteId: movedItem.favouriteId,
        pageRouteID,
        newOrder: result.destination.index,
      })
    );
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDeleteFavorite = (
    e: React.MouseEvent<HTMLButtonElement>,
    favouriteId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(deleteFavorite(favouriteId));
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div
          onClick={() => handleNavigate('/dashboard')}
          className="text-center text-3xl font-bold"
        >
          ApexScouty
        </div>
      </SidebarHeader>
      <SidebarContent>
        {favoritesMenu.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <LucideIcons.Star />
              <span>{t('sidebar.favorites')}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <DragDropContext
                onDragEnd={handleFavoriteReorder}
                onDragStart={handleDragStart}
              >
                <Droppable droppableId="favorites">
                  {provided => (
                    <SidebarMenu
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-1"
                    >
                      {[...favoritesMenu]
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .reduce(
                          (
                            acc: React.ReactElement[],
                            item: any,
                            idx: number
                          ) => {
                            const Icon =
                              item.icon &&
                              LucideIcons[
                                item.icon as keyof typeof LucideIcons
                              ];
                            acc.push(
                              <Draggable
                                key={item.favouriteId || item.id}
                                draggableId={String(
                                  item.favouriteId || item.id
                                )}
                                index={idx}
                              >
                                {(provided, snapshot) => (
                                  <SidebarMenuItem
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={cn(
                                      snapshot.isDragging &&
                                        'h flex items-center gap-3 bg-yellow-50 p-4 dark:bg-yellow-900/20',
                                      'group cursor-grab active:cursor-grabbing'
                                    )}
                                  >
                                    <SidebarMenuButton
                                      asChild
                                      tooltip={item.name}
                                      className="flex items-center gap-2 p-4 group-hover:cursor-grab active:cursor-grabbing"
                                    >
                                      <Link
                                        to={item.path}
                                        onClick={e => {
                                          if (isDragging) {
                                            e.preventDefault();
                                          }
                                        }}
                                      >
                                        {Icon && (
                                          <div className="rounded bg-linear-to-b from-yellow-200 to-yellow-400 p-2 text-yellow-800 dark:from-yellow-200 dark:to-yellow-600">
                                            <Icon size={16} />
                                          </div>
                                        )}
                                        <span>{item.name}</span>
                                      </Link>
                                    </SidebarMenuButton>
                                    <SidebarMenuAction
                                      onClick={e => {
                                        handleDeleteFavorite(
                                          e,
                                          item.favouriteId
                                        );
                                      }}
                                      showOnHover
                                    >
                                      <LucideIcons.Star
                                        size={16}
                                        fill="#facc15"
                                        stroke="#facc15"
                                      />
                                    </SidebarMenuAction>
                                  </SidebarMenuItem>
                                )}
                              </Draggable>
                            );
                            return acc;
                          },
                          []
                        )}
                      {provided.placeholder}
                    </SidebarMenu>
                  )}
                </Droppable>
              </DragDropContext>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start gap-2"
        >
          <LucideIcons.LogOut />
          {t('sidebar.logout')}
        </Button>
        <div className="text-muted-foreground px-2 text-center text-xs">
          © 2024 ApexScouty
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
