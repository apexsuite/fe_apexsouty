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
  if (!hasPermission && mode === 'hide') {
    return <>{fallback}</>;
  }

  if (!hasPermission && mode === 'disable') {
    return (
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
