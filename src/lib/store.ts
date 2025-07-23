import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import langReducer from './langSlice';
import themeReducer from './themeSlice';
import menuReducer from './menuSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lang: langReducer,
    theme: themeReducer,
    menu: menuReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 