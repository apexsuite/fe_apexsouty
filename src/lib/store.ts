import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import langReducer from './langSlice';
import menuReducer from './menuSlice';
import pageReducer from './pageSlice';
import permissionReducer from './pageRoutePermissionSlice';
import userPermissionsReducer from './permissionSlice';
import roleReducer from './roleSlice';
import productReducer from './productSlice';
import billingReducer from './billingSlice';
import marketplaceReducer from './marketplaceSlice';
import consentReducer from './consentSlice';
import routeGuardReducer from './routeGuardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lang: langReducer,
    menu: menuReducer,
    page: pageReducer,
    permission: permissionReducer,
    userPermissions: userPermissionsReducer,
    role: roleReducer,
    product: productReducer,
    billing: billingReducer,
    marketplace: marketplaceReducer,
    consent: consentReducer,
    routeGuard: routeGuardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
