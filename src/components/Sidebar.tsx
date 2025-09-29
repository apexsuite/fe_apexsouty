import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { useEffect } from "react";
import { logoutUser } from "@/lib/authSlice";
import { Drawer } from "antd";
import { fetchMenu, fetchFavorites, selectFavorites, deleteFavorite, updateFavoriteOrder, reorderFavoritesLocally } from "@/lib/menuSlice";
import * as LucideIcons from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';



export default function Sidebar({ mobileOpen, onMobileClose }: { mobileOpen?: boolean, onMobileClose?: () => void }) {
  const { t, i18n } = useTranslation();
  const lang = useSelector((state: RootState) => state.lang.language);
  const dispatch = useDispatch<AppDispatch>();
  const favoritesMenu = useSelector(selectFavorites);
  const menuItems = useSelector((state: RootState) => state.menu.items);
  
  useEffect(() => {
    dispatch(fetchMenu());
    dispatch(fetchFavorites());
  }, [dispatch]);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  if (i18n.language !== lang) return null;

  const handleNavigate = (href: string) => {
    navigate(href);
    if (onMobileClose) onMobileClose();
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());
    if (onMobileClose) onMobileClose();
  };

  // Favori sırası değişince API'ye güncelleme at
  const handleFavoriteReorder = (result: DropResult) => {
    if (!result.destination) return;
    
    const reordered = Array.from(favoritesMenu);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    
    const reorderedWithOrder = reordered.map((fav: any, idx: number) => ({ ...fav, order: idx }));
    const movedItem = reorderedWithOrder[result.destination.index];
    let pageRouteID = movedItem.pageRouteID;
    if (!pageRouteID) {
      const match = menuItems.find((item: any) => item.favouriteId === movedItem.favouriteId || item.id === movedItem.id);
      pageRouteID = match?.pageRouteID;
    }

    dispatch(reorderFavoritesLocally(reorderedWithOrder));
    dispatch(updateFavoriteOrder({ 
      favouriteId: movedItem.favouriteId, 
      pageRouteID, 
      newOrder: result.destination.index 
    }));
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div onClick={() => handleNavigate("/dashboard")} className="mb-8 cursor-pointer font-bold  text-center hover:text-green-600 dark:hover:text-green-300 text-3xl">ApexScouty</div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {favoritesMenu.length > 0 && (
            <>
              <div className="text-xs font-bold text-gray-800 dark:text-gray-400 mb-1 flex items-center gap-1 mt-2">
                <Star size={14} className="text-yellow-400" /> {t("sidebar.favorites")}
              </div>
              <DragDropContext onDragEnd={handleFavoriteReorder}>
                <Droppable droppableId="favorites-list">
                  {(provided) => (
                    <ul className="mb-2" ref={provided.innerRef} {...provided.droppableProps}>
                      {[...favoritesMenu].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((item: any, idx: number) => {
                        console.log(item , "item");
                        const LucideIcon = item.icon && (LucideIcons as any)[item.icon];
                        return (
                          <Draggable key={item.favouriteId || item.id} draggableId={String(item.favouriteId || item.id)} index={idx}>
                            {(provided, snapshot) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center group ${snapshot.isDragging ? 'bg-yellow-50 dark:bg-yellow-800' : ''}`}
                              >
                                <Link to={item.path} className="flex items-center gap-3 flex-1 px-3 py-2 rounded-lg text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900 transition-colors font-medium">
                                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-100">
                                    {LucideIcon ? <LucideIcon size={20} /> : <Star size={20} />}
                                  </span>
                                  <span className="truncate font-medium text-sm text-foreground">{item.name}</span>
                                </Link>
                                <button
                                  className="ml-2 p-1 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-800 transition"
                                  title="Favoriden çıkar"
                                  onClick={() => dispatch(deleteFavorite(item.favouriteId))}
                                >
                                  <Star size={18} fill="#facc15" stroke="#facc15" />
                                </button>
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
      <div className="mt-auto">
        <button
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition-colors mb-3"
          onClick={handleLogout}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M16 17l5-5m0 0l-5-5m5 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
         {t("sidebar.logout")}
        </button>
        <div className="text-xs text-muted-foreground text-center">© 2024 ApexScouty</div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex h-screen w-64 bg-background border-r border-border flex-col py-6 px-4 fixed top-0 left-0 z-40">
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