import { Link, useNavigate } from 'react-router-dom';
import { LogOutIcon, Star } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/lib/store';
import { useEffect } from 'react';
import { logoutUser } from '@/lib/authSlice';
import { Drawer } from 'antd';
import {
  fetchMenu,
  fetchFavorites,
  selectFavorites,
  deleteFavorite,
  updateFavoriteOrder,
  reorderFavoritesLocally,
} from '@/lib/menuSlice';
import * as LucideIcons from 'lucide-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { clearPageHistory } from '@/utils/hooks/usePageHistory';
import CustomButton from '@/components/CustomButton';
import { t } from 'i18next';

export default function Sidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const favoritesMenu = useSelector(selectFavorites);
  const menuItems = useSelector((state: RootState) => state.menu.items);

  useEffect(() => {
    dispatch(fetchMenu());
    dispatch(fetchFavorites());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleNavigate = (href: string) => {
    navigate(href);
    if (onMobileClose) onMobileClose();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    clearPageHistory();
    if (onMobileClose) onMobileClose();
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

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div
        onClick={() => handleNavigate('/dashboard')}
        className="mb-8 cursor-pointer text-center text-3xl font-bold hover:text-green-600 dark:hover:text-green-300"
      >
        ApexScouty
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {favoritesMenu.length > 0 && (
            <>
              <div className="mt-2 mb-1 flex items-center gap-1 text-xs font-bold">
                <Star size={14} className="text-yellow-400" />{' '}
                {t('sidebar.favorites')}
              </div>
              <DragDropContext onDragEnd={handleFavoriteReorder}>
                <Droppable droppableId="favorites-list">
                  {provided => (
                    <ul
                      className="mb-2"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {[...favoritesMenu]
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map((item: any, idx: number) => {
                          const LucideIcon =
                            item.icon && (LucideIcons as any)[item.icon];
                          return (
                            <Draggable
                              key={item.favouriteId || item.id}
                              draggableId={String(item.favouriteId || item.id)}
                              index={idx}
                            >
                              {(provided, snapshot) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`group flex items-center ${snapshot.isDragging ? 'bg-yellow-50 dark:bg-yellow-800' : ''}`}
                                >
                                  <Link
                                    to={item.path}
                                    className="dark:hover:bg-yellow-900s flex flex-1 items-center justify-between gap-3 rounded-lg px-3 py-2 font-medium hover:bg-yellow-100"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="rounded bg-linear-to-b from-yellow-200 to-yellow-400 p-2 text-yellow-800 dark:from-yellow-200 dark:to-yellow-600">
                                        <LucideIcon />
                                      </div>
                                      <span className="text-foreground truncate text-sm font-medium">
                                        {item.name}
                                      </span>
                                    </div>
                                    <button
                                      className="ml-auto cursor-pointer rounded-full p-1 transition hover:bg-yellow-100 dark:hover:bg-yellow-800"
                                      title="Favoriden çıkar"
                                      onClick={() =>
                                        dispatch(
                                          deleteFavorite(item.favouriteId)
                                        )
                                      }
                                    >
                                      <Star
                                        size={18}
                                        fill="#facc15"
                                        stroke="#facc15"
                                      />
                                    </button>
                                  </Link>
                                </li>
                              )}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}
        </ul>
      </nav>
      <CustomButton
        variant="outline"
        onClick={handleLogout}
        label={t('sidebar.logout')}
        icon={<LogOutIcon />}
        className="w-full"
      />
      <div className="text-muted-foreground text-center text-xs">
        © 2024 ApexScouty
      </div>
    </div>
  );

  return (
    <>
      <aside className="bg-background border-border fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col border-r px-4 py-6 lg:flex">
        {sidebarContent}
      </aside>
      <Drawer
        placement="left"
        open={!!mobileOpen}
        onClose={onMobileClose}
        width={260}
        bodyStyle={{ padding: 16 }}
        className="lg:hidden"
        closeIcon={false}
        maskClosable={true}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
}
