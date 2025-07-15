import { useTranslation } from 'react-i18next';
import { Card, Button, Typography, Space } from 'antd';
import { Copy } from 'lucide-react';

const { Title } = Typography;

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
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>{t('permissions.includedPermissions')}</Title>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 8 }}>
        {permission.permissions.map((perm, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 8,
              backgroundColor: '#fafafa',
              borderRadius: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>{perm}</span>
            <Button type="text" size="small">
              <Copy style={{ width: 12, height: 12 }} />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
} 