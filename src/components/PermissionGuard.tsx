import React from 'react';
import { useButtonPermissions } from '@/lib/usePermissions';

interface PermissionGuardProps {
  permission: string;
  permissionPath?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  mode?: 'hide' | 'disable';
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  permissionPath,
  fallback = null,
  children,
  mode = 'hide',
}) => {
  const { canShowButton } = useButtonPermissions();

  const hasPermission = canShowButton(permission, permissionPath);

  // If no permission and mode is hide, render fallback or nothing
  if (!hasPermission && mode === 'hide') {
    return <>{fallback}</>;
  }

  // If no permission and mode is disable, render children as disabled
  if (!hasPermission && mode === 'disable') {
    return (
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    );
  }

  // If has permission, render children normally
  return <>{children}</>;
};

export default PermissionGuard;
