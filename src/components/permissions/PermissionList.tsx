import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PermissionItem from './PermissionItem';

interface Permission {
  id: string;
  name: string;
  description: string;
  type: 'read' | 'write' | 'admin';
  status: 'active' | 'inactive';
  assignedTo: string[];
  lastModified: string;
  createdAt: string;
}

interface PermissionListProps {
  permissions: Permission[];
  onDelete: (id: string) => void;
  searchTerm: string;
  statusFilter: 'all' | 'active' | 'inactive';
  typeFilter: 'all' | 'read' | 'write' | 'admin';
}

export default function PermissionList({ 
  permissions, 
  onDelete, 
  searchTerm, 
  statusFilter, 
  typeFilter 
}: PermissionListProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('permissions.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {permissions.map((permission) => (
            <PermissionItem
              key={permission.id}
              permission={permission}
              onDelete={onDelete}
            />
          ))}
          
          {permissions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? t('permissions.noPermissionsFoundCriteria')
                : t('permissions.noPermissionsFound')
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 