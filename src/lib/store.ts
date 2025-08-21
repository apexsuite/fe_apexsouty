import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import langReducer from './langSlice';
import themeReducer from './themeSlice';
import menuReducer from './menuSlice';
import pageReducer from './pageSlice';
import permissionReducer from './pageRoutePermissionSlice';
import roleReducer from './roleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lang: langReducer,
    theme: themeReducer,
    menu: menuReducer,
    page: pageReducer,
    permission: permissionReducer,
    role: roleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 