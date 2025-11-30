import * as React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
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
import CustomButton from '@/components/CustomButton';
import SearchBar from './search-bar';
import { Separator } from '../ui/separator';

type LucideIconComponent = React.ComponentType<{ size?: number }>;

const getIconComponent = (icon?: string): LucideIconComponent | undefined => {
  if (!icon) return undefined;

  return LucideIcons[icon as keyof typeof LucideIcons] as
    | LucideIconComponent
    | undefined;
};

function DashboardSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const favoritesMenu = useSelector(selectFavorites);
  const menuItems = useSelector((state: RootState) => state.menu.items);
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  useEffect(() => {
    dispatch(fetchMenu());
    dispatch(fetchFavorites());
  }, [dispatch]);

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
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader
        className={cn(
          'flex pt-2',
          isCollapsed
            ? 'flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start'
            : 'flex-row items-center justify-between'
        )}
      >
        <motion.div
          key={isCollapsed ? 'header-collapsed' : 'header-expanded'}
          className={cn(
            'flex w-full items-center justify-between gap-2',
            isCollapsed ? 'flex-row md:flex-col' : 'flex-row'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-sidebar-primary flex size-8 items-center justify-center rounded-md">
            <span className="text-white">A</span>
          </div>
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      {!isCollapsed && <Separator />}
      <SidebarContent className="flex flex-1 flex-col items-center gap-2">
        <div className={cn(!isCollapsed && 'w-full', 'pt-2')}>
          <SearchBar />
        </div>
        {favoritesMenu.length > 0 && (
          <SidebarGroup>
            {state === 'expanded' && (
              <SidebarGroupLabel className="flex items-center gap-2 px-2">
                <LucideIcons.Star fill="#facc15" stroke="#facc15" />
                <span className="text-sm font-medium">
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
                      {favoritesMenu.map((item: MenuItem, idx: number) => {
                        const Icon = getIconComponent(item.icon);
                        const draggableId = String(item.favouriteId || item.id);
                        const colorClasses = COLORS[idx % COLORS.length];

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
                                    'group flex cursor-grab items-center gap-2 active:cursor-grabbing'
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
                                        <Icon />
                                      </div>
                                    )}
                                    <span>{item.name || item.label}</span>
                                  </Link>
                                </SidebarMenuButton>
                                {item.favouriteId && (
                                  <SidebarMenuAction asChild>
                                    <CustomButton
                                      variant="ghost"
                                      size="icon-xs"
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
        <CustomButton
          icon={<LucideIcons.LogOut />}
          label={t('sidebar.logout')}
          onClick={handleLogout}
          variant="outline"
          size={isCollapsed ? 'icon' : 'default'}
        />
        {state === 'expanded' && (
          <div className="text-muted-foreground px-2 text-center text-xs">
            © 2024 ApexScouty
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default DashboardSidebar;
