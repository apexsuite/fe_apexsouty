import type { IPageParams } from '@/types/common.types';

export interface IPageRoute {
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
