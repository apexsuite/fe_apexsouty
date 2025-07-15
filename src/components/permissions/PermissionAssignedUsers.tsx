import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { Card, Input, Typography } from 'antd';
import { Users } from 'lucide-react';
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

interface PermissionAssignedUsersProps {
  permission: Permission;
  isEditing: boolean;
  editedPermission: Partial<Permission>;
  setEditedPermission: (permission: Partial<Permission>) => void;
}

export default function PermissionAssignedUsers({
  permission,
  isEditing,
  editedPermission,
  setEditedPermission
}: PermissionAssignedUsersProps) {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  // Kullanıcının Update izni yoksa sadece görüntüleme modunda göster
  const canEdit = canUpdate(user);
  const displayMode = isEditing && canEdit ? 'editing' : 'viewing';

  return (
    <Card>
      <Card.Header>
        <Typography.Title level={5} className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {t('permissions.assignedTo')}
          {!canEdit && (
            <span className="text-xs text-muted-foreground ml-2">
              (Salt Okunur)
            </span>
          )}
        </Typography.Title>
      </Card.Header>
      <Card.Content>
        {displayMode === 'editing' ? (
          <Input
            value={editedPermission.assignedTo?.join(', ') || ''}
            onChange={(e) => setEditedPermission({ 
              ...editedPermission, 
              assignedTo: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            })}
            placeholder={t('permissions.enterUsernamesSeparated')}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {permission.assignedTo.map((user, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {user}
              </span>
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
} 