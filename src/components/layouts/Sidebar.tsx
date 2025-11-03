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
  SidebarTrigger,
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
  type MenuItem,
} from '@/lib/menuSlice';
import { logoutUser } from '@/lib/authSlice';
import { clearPageHistory } from '@/utils/hooks/usePageHistory';
import { COLORS } from '@/utils/constants/colors';
import CustomButton from '../CustomButton';

type LucideIconComponent = React.ComponentType<{ size?: number }>;

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> { }

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
  const { state } = useSidebar();

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
    <Sidebar {...props} collapsible="icon" className="flex h-screen flex-col">
      <SidebarHeader className="shrink-0 border-b border-border/40 pb-4">
        <div className="flex items-center justify-between gap-2">
          {state === "expanded" && (
            <div
              onClick={() => handleNavigate('/dashboard')}
              className="group flex cursor-pointer items-center gap-2 transition-all duration-300 hover:opacity-80"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/90 to-primary shadow-md ring-1 ring-primary/20">
                <span className="text-lg font-bold text-primary-foreground">A</span>
              </div>
              <span className="text-lg font-bold leading-tight tracking-tight">
                ApexScouty
              </span>
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            {state === "collapsed" && (
              <div
                onClick={() => handleNavigate('/dashboard')}
                className="group flex size-8 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-primary/90 to-primary shadow-md ring-1 ring-primary/20 transition-all duration-300 hover:opacity-80"
              >
                <span className="text-base font-bold text-primary-foreground">A</span>
              </div>
            )}
            <SidebarTrigger className="ml-auto" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        {favoritesMenu.length > 0 && (
          <SidebarGroup>
            {state === "expanded" && (
              <SidebarGroupLabel className="flex items-center gap-2 px-2">
                <LucideIcons.Star className="size-4 text-yellow-500" fill="currentColor" />
                <span className="text-xs font-semibold tracking-wider text-foreground/80">
                  {t('sidebar.favorites')}
                </span>
              </SidebarGroupLabel>
            )}
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
      <SidebarFooter className="shrink-0 border-t border-border/40">
        <Button
          variant="outline"
          onClick={handleLogout}
          className={cn(
            "w-full gap-2",
            state === "collapsed" ? "justify-center px-2" : "justify-start"
          )}
        >
          <LucideIcons.LogOut className={state === "collapsed" ? "size-5" : ""} />
          {state === "expanded" && t('sidebar.logout')}
        </Button>
        {state === "expanded" && (
          <div className="text-muted-foreground px-2 text-center text-xs">
            © 2024 ApexScouty
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
