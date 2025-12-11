import type { IPageParams } from '@/types/common.types';

export interface IRole {
  id: string;
  description: string;
  isActive: boolean;
  isDefault: boolean;
  name: string;
  permissionCount: number;
  roleValue: number;
}

export interface IRoleRequest extends IPageParams {
  name?: string;
  description?: string;
  roleValue?: number;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface IRoleCreateRequest {
  name: string;
  roleValue: number;
  description: string;
  isActive: boolean;
  isDefault: boolean;
}

export interface IRoleUpdateRequest extends IRoleCreateRequest {
  id: string;
}

export interface IPageRoutePermission {
  id: string;
  createdAt: string;
  name: string;
  description: string;
  label: string;
}

export interface IRolePermission {
  createdAt: string;
  id: string;
  isActive: boolean;
  permission: IPageRoutePermission;
  permissionId: string;
  role: IRole;
  roleId: string;
}

export interface IRole {
  createdAt: string;
  description: string;
  id: string;
  isActive: boolean;
  isDefault: boolean;
  name: string;
  permissionCount: number;
  rolePermissions: IRolePermission[];
  roleValue: number;
}
