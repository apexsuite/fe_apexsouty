import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../services/api';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  description?: string;
  pageRouteID?: string;
  favouriteId?: string;
  name?: string;
  order?: number;
  isFavourite?: boolean;
}

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  favoriteIds: string[];
  favorites: MenuItem[];
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
  favoriteIds: [],
  favorites: [],
};

export const fetchMenu = createAsyncThunk<MenuItem[]>(
  'menu/fetchMenu',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/navigations/top-bar-menu-list', { withCredentials: true });
      const list = data?.data?.serviceList;
      if (Array.isArray(list)) {
        console.log(list , "itm1231231232345zsxfc")
        return list.map((item: any) => ({
          id: item.pageRouteID || item.path || item.name,
          label: item.name,
          icon: item.icon,
          path: item.path,
          description: item.desctiption,
          pageRouteID: item.pageRouteId,
          isFavourite: item.isFavourite,
        }));
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err?.data?.message || 'Menu fetch failed');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'menu/addFavorite',
  async (pageRouteID: string, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest('/navigations/favourites/', {
        method: 'POST',
        body: JSON.stringify({ pageRouteID }),
        withCredentials: true,
      });
      // Favori ekledikten sonra favori listesini ve menü listesini güncelle
      await dispatch(fetchFavorites() as any);
      await dispatch(fetchMenu() as any);
      return pageRouteID;
    } catch (err: any) {
      return rejectWithValue(err?.data?.message || 'Favorite add failed');
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  'menu/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/navigations/favourites', { method: 'GET', withCredentials: true });
      return Array.isArray(data?.data)
        ? data.data.map((item: any) => ({
            id: item.favouriteId || item.path || item.name,
            favouriteId: item.favouriteId,
            name: item.name,
            path: item.path,
            icon: item.icon,
            order: item.order,
            label: item.name,
          }))
        : [];
    } catch (err: any) {
      return rejectWithValue(err?.data?.message || 'Favorites fetch failed');
    }
  }
);

export const deleteFavorite = createAsyncThunk(
  'menu/deleteFavorite',
  async (favouriteId: string, { dispatch, rejectWithValue }) => {
    try {
      await apiRequest(`/navigations/favourites/${favouriteId}`, {
        method: 'DELETE',
        withCredentials: true,
      });
      // Favori silindikten sonra favori listesini ve menü listesini güncelle
      await dispatch(fetchFavorites() as any);
      await dispatch(fetchMenu() as any);
      return favouriteId;
    } catch (err: any) {
      return rejectWithValue(err?.data?.message || 'Favorite delete failed');
    }
  }
);

// Favori sırasını güncelleyen thunk
export const updateFavoriteOrder = createAsyncThunk(
  'menu/updateFavoriteOrder',
  async (favorites: { favouriteId: string; pageRouteID: string }[], { dispatch, rejectWithValue }) => {
    try {
      // Her bir favori için yeni order ile API'ye güncelleme at
      for (let i = 0; i < favorites.length; i++) {
        const fav = favorites[i];
        await apiRequest(`/navigations/favourites/${fav.favouriteId}`, {
          method: 'PUT',
          body: JSON.stringify({ listOrder: i, pageRouteID: fav.pageRouteID }),
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
      }
      // Favori listesini güncelle
      await dispatch(fetchFavorites() as any);
      return true;
    } catch (err: any) {
      return rejectWithValue(err?.data?.message || 'Favorite order update failed');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    reorderFavoritesLocally: (state, action) => {
      state.favorites = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (action.payload && !state.favoriteIds.includes(action.payload)) {
          state.favoriteIds.push(action.payload);
        }
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(deleteFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(fav => fav.favouriteId !== action.payload);
      });
  },
});

export default menuSlice.reducer;
export const selectMenu = (state: any) => state.menu.items;
export const selectFavoriteIds = (state: any) => state.menu.favoriteIds;
export const selectFavorites = (state: any) => state.menu.favorites;
export const { reorderFavoritesLocally } = menuSlice.actions; 