import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString();
  } catch {
    return dateString;
  }
}

export function formatDateWithOptions(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString(undefined, options);
  } catch {
    return dateString;
  }
}

export interface UserPermissions {
  permissions: string[];
}

export interface MenuItem {
  requiredPermission?: string;
  key?: string;
  icon?: string;
  href?: string;
  fixed?: boolean;
  favorite?: number;
  children?: MenuItem[];
  [key: string]: unknown;
}

export function hasPermission(user: UserPermissions | null, permission: string): boolean {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
}

export function hasAllPermissions(user: UserPermissions | null, permissions: string[]): boolean {
  if (!user || !user.permissions) return false;
  return permissions.every(permission => user.permissions.includes(permission));
}

export function hasAnyPermission(user: UserPermissions | null, permissions: string[]): boolean {
  if (!user || !user.permissions) return false;
  return permissions.some(permission => user.permissions.includes(permission));
}

export function canCreate(user: UserPermissions | null): boolean {
  return hasPermission(user, "Create");
}

export function canRead(user: UserPermissions | null): boolean {
  return hasPermission(user, "Read");
}

export function canUpdate(user: UserPermissions | null): boolean {
  return hasPermission(user, "Update");
}

export function canDelete(user: UserPermissions | null): boolean {
  return hasPermission(user, "Delete");
}

export function filterMenuItemsByPermissions(menuItems: MenuItem[], user: UserPermissions | null): MenuItem[] {
  if (!user || !user.permissions) return [];
  
  return menuItems.filter(item => { 
    if (!item.requiredPermission) return true;
    
    return hasPermission(user, item.requiredPermission);
  });
} 