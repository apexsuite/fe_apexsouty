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
  type MenuItem,
} from '@/lib/menuSlice';
import { logoutUser } from '@/lib/authSlice';
import { clearPageHistory } from '@/utils/hooks/usePageHistory';
import { COLORS } from '@/utils/constants/colors';
import CustomButton from '../CustomButton';

type LucideIconComponent = React.ComponentType<{ size?: number }>;

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

const getSortedFavorites = (favorites: MenuItem[]): MenuItem[] => {
  return [...favorites].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

const getIconComponent = (
  iconName?: string
): LucideIconComponent | undefined => {
  if (!iconName) return undefined;
  return LucideIcons[iconName as keyof typeof LucideIcons] as
    | LucideIconComponent
    | undefined;
};

export function AppSidebar({ ...props }: AppSidebarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const favoritesMenu = useSelector(selectFavorites);
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMenu());
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleNavigate = (href: string) => {
    navigate(href);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    clearPageHistory();
  };

  const handleFavoriteReorder = (result: DropResult) => {
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
            <SidebarGroupLabel className="flex items-center gap-2">
              <span className="font-medium uppercase">
                {t('sidebar.favorites')}
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <DragDropContext onDragEnd={handleFavoriteReorder}>
                <Droppable droppableId="favorites">
                  {provided => (
                    <SidebarMenu
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {getSortedFavorites(favoritesMenu).map((item, idx) => {
                        const Icon = getIconComponent(item.icon);
                        const draggableId = String(item.favouriteId || item.id);
                        const colorClasses =
                          COLORS[idx % COLORS.length]?.light ||
                          COLORS[0]!.light;

                        return (
                          <Draggable
                            key={draggableId}
                            draggableId={draggableId}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <SidebarMenuItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  snapshot.isDragging &&
                                    'group flex cursor-grab items-center gap-3 bg-yellow-50 active:cursor-grabbing dark:bg-yellow-900/20'
                                )}
                              >
                                <SidebarMenuButton
                                  asChild
                                  tooltip={item.name}
                                  size="lg"
                                >
                                  <Link to={item.path ?? '#'}>
                                    {Icon && (
                                      <div className={colorClasses}>
                                        <Icon size={16} />
                                      </div>
                                    )}
                                    <span>{item.name || item.label}</span>
                                  </Link>
                                </SidebarMenuButton>
                                {item.favouriteId && (
                                  <SidebarMenuAction asChild>
                                    <CustomButton
                                      variant="ghost"
                                      size="icon"
                                      className="size-6"
                                      icon={
                                        <LucideIcons.Star
                                          fill="#facc15"
                                          stroke="#facc15"
                                        />
                                      }
                                      onClick={() =>
                                        dispatch(
                                          deleteFavorite(item.favouriteId!)
                                        )
                                      }
                                    />
                                  </SidebarMenuAction>
                                )}
                              </SidebarMenuItem>
                            )}
                          </Draggable>
                        );
                      })}
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
