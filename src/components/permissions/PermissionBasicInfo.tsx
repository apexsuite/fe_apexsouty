import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, Edit, Activity, CheckCircle, XCircle } from 'lucide-react';
import { canUpdate } from '@/lib/utils';

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

interface PermissionBasicInfoProps {
  permission: Permission;
  isEditing: boolean;
  editedPermission: Partial<Permission>;
  setEditedPermission: (permission: Partial<Permission>) => void;
}

export default function PermissionBasicInfo({
  permission,
  isEditing,
  editedPermission,
  setEditedPermission
}: PermissionBasicInfoProps) {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'read': return <Eye className="w-5 h-5" />;
      case 'write': return <Edit className="w-5 h-5" />;
      case 'admin': return <Shield className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'read': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'write': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Kullanıcının Update izni yoksa sadece görüntüleme modunda göster
  const canEdit = canUpdate(user);
  const displayMode = isEditing && canEdit ? 'editing' : 'viewing';

  return (
    <Card className='bg-background'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
          <Shield className="w-5 h-5" />
          {t('permissions.basicInformation')}
          {!canEdit && (
            <span className="text-xs text-muted-foreground ml-2">
              (Salt Okunur)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 text-green-800 dark:text-green-300">{t('permissions.permissionName')}</Label>
          {displayMode === 'editing' ? (
            <Input
              value={editedPermission.name || ''}
              onChange={(e) => setEditedPermission({ ...editedPermission, name: e.target.value })}
              className="mt-1 text-green-800 dark:text-green-300 bg-background"
            />
          ) : (
              <p className="mt-1 text-gray-600">{permission.name}</p>
          )}  
        </div>
        
        <div>
          <Label className="text-sm font-medium text-gray-700 text-green-800 dark:text-green-300 bg-background">{t('permissions.description')}</Label>
          {displayMode === 'editing' ? (
            <Input
              value={editedPermission.description || ''}
              onChange={(e) => setEditedPermission({ ...editedPermission, description: e.target.value })}
              className="mt-1 bg-background "
            />
          ) : (
            <p className="mt-1 text-gray-600">{permission.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 text-green-800 dark:text-green-300 bg-background">{t('permissions.type')}</Label>
            {displayMode === 'editing' ? (
              <select
                value={editedPermission.type || 'read'}
                onChange={(e) => setEditedPermission({ 
                  ...editedPermission, 
                  type: e.target.value as 'read' | 'write' | 'admin' 
                })}
                className="mt-1 w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="read">{t('permissions.read')}</option>
                <option value="write">{t('permissions.write')}</option>
                <option value="admin">{t('permissions.admin')}</option> 
              </select>
            ) : (
              <div className="mt-1 flex items-center gap-2">
                {getTypeIcon(permission.type)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(permission.type)}`}>
                  {t(`permissions.${permission.type}`)}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 text-green-800 dark:text-green-300 bg-background">{t('permissions.status')}</Label>
            {displayMode === 'editing' ? (
              <select
                value={editedPermission.status || 'active'}
                onChange={(e) => setEditedPermission({ 
                  ...editedPermission, 
                  status: e.target.value as 'active' | 'inactive' 
                })}
                className="mt-1 w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="active">{t('permissions.active')}</option>
                <option value="inactive">{t('permissions.inactive')}</option>
              </select>
            ) : (
              <div className="mt-1 flex items-center gap-2">
                {permission.status === 'active' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-600" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(permission.status)}`}>
                  {t(`permissions.${permission.status}`)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 