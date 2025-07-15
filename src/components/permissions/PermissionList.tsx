import { useTranslation } from 'react-i18next';
import PermissionItem from './PermissionItem';
import { Card } from "antd";

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
    <Card style={{ marginBottom: 24 }}>
      <Card.Meta
        title={t('permissions.title')}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {permissions.map((permission) => (
          <PermissionItem
            key={permission.id}
            permission={permission}
            onDelete={onDelete}
          />
        ))}
        {permissions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#888' }}>
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
              ? t('permissions.noPermissionsFoundCriteria')
              : t('permissions.noPermissionsFound')
            }
          </div>
        )}
      </div>
    </Card>
  );
} 