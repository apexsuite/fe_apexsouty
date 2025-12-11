import type { IPageParams } from '@/types/common.types';

export interface IPageRoutes {
  id: string;
  createdAt: string;
  name: string;
  path: string;
  component: string;
  icon: string;
  parentId: string | null;
  isVisible: boolean;
  isActive: boolean;
  description: string;
  IsUnderConstruction: boolean;
  permissionCount: number;
}

export interface IPageRouteRequest extends IPageParams {
  name?: string;
  description?: string;
  path?: string;
  component?: string;
  isActive?: boolean;
  isDefault?: boolean;
  isUnderConstruction?: boolean;
}

export interface IPageRoutePermissions {
  id: string;
  createdAt: string;
  name: string;
  description: string;
  label: string;
  pageRouteId: string;
  isActive: boolean;
}

export interface IPageRoute {
  id: string;
  createdAt: string;
  name: string;
  path: string;
  component: string;
  icon: string;
  parentId: string | null;
  isVisible: true;
  isActive: boolean;
  description: string;
  IsUnderConstruction: boolean;
  permissionCount: number;
  page_route_permissions: IPageRoutePermissions[];
}

export interface ICreatePageRoute {
  component: string;
  description: string;
  icon: string;
  isActive: boolean;
  isUnderConstruction: boolean;
  isVisible: boolean;
  name: string;
  parentId?: string | null;
  path: string;
}

export interface IUpdatePageRoute extends ICreatePageRoute {
  id: string;
}
