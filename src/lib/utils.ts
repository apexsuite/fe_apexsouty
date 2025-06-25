import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Hydration-safe date formatting
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if invalid date
    }
    return date.toLocaleDateString();
  } catch {
    return dateString; // Return original string if error
  }
}

// Hydration-safe date formatting with options
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

// Permission kontrolü için utility fonksiyonları
export interface UserPermissions {
  permissions: string[];
}

// Menu item interface'i
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

// Kullanıcının belirli bir izne sahip olup olmadığını kontrol eder
export function hasPermission(user: UserPermissions | null, permission: string): boolean {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
}

// Kullanıcının birden fazla izne sahip olup olmadığını kontrol eder (AND operatörü)
export function hasAllPermissions(user: UserPermissions | null, permissions: string[]): boolean {
  if (!user || !user.permissions) return false;
  return permissions.every(permission => user.permissions.includes(permission));
}

// Kullanıcının belirtilen izinlerden en az birine sahip olup olmadığını kontrol eder (OR operatörü)
export function hasAnyPermission(user: UserPermissions | null, permissions: string[]): boolean {
  if (!user || !user.permissions) return false;
  return permissions.some(permission => user.permissions.includes(permission));
}

// CRUD izinlerini kontrol eden özel fonksiyonlar
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

// Sidebar menü öğelerini filtrelemek için
export function filterMenuItemsByPermissions(menuItems: MenuItem[], user: UserPermissions | null): MenuItem[] {
  if (!user || !user.permissions) return [];
  
  return menuItems.filter(item => {
    // Eğer item'ın permission gereksinimi yoksa göster
    if (!item.requiredPermission) return true;
    
    // Permission gereksinimi varsa kontrol et
    return hasPermission(user, item.requiredPermission);
  });
} 