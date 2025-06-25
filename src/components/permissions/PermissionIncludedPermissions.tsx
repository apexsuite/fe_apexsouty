import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  type: 'read' | 'write' | 'admin';
  status: 'active' | 'inactive';
  assignedTo: string[];
  lastModified: string;
  createdAt: string;
  permissions?: string[];
  scope?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface PermissionIncludedPermissionsProps {
  permission: Permission;
}

export default function PermissionIncludedPermissions({ permission }: PermissionIncludedPermissionsProps) {
  const { t } = useTranslation();

  if (!permission.permissions || permission.permissions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('permissions.includedPermissions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {permission.permissions.map((perm, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-background rounded"
            >
              <span className="text-sm">{perm}</span>
              <Button variant="ghost" size="sm">
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 