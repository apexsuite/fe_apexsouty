import { useTranslation } from 'react-i18next';
import { Card, Typography, Tag } from 'antd';
import { Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

const { Title, Text } = Typography;

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

interface PermissionMetadataProps {
  permission: Permission;
}

export default function PermissionMetadata({ permission }: PermissionMetadataProps) {
  const { t } = useTranslation();
  const [formattedCreatedDate, setFormattedCreatedDate] = useState<string>('');
  const [formattedModifiedDate, setFormattedModifiedDate] = useState<string>('');

  useEffect(() => {
    setFormattedCreatedDate(formatDate(permission.createdAt));
    setFormattedModifiedDate(formatDate(permission.lastModified));
  }, [permission.createdAt, permission.lastModified]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar style={{ width: 20, height: 20 }} />
          {t('permissions.metadata')}
        </Title>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>{t('permissions.created')}</Text>
          <Text type="secondary" style={{ fontSize: 14 }}>
            {formattedCreatedDate}
          </Text>
        </div>
        
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>{t('permissions.lastModified')}</Text>
          <Text type="secondary" style={{ fontSize: 14 }}>
            {formattedModifiedDate}
          </Text>
        </div>

        {permission.scope && (
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>{t('permissions.scope')}</Text>
            <Text type="secondary" style={{ fontSize: 14, textTransform: 'capitalize' }}>
              {permission.scope}
            </Text>
          </div>
        )}

        {permission.priority && (
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>{t('permissions.priority')}</Text>
            <Tag color={getPriorityColor(permission.priority)}>
              {t(`permissions.${permission.priority}`)}
            </Tag>
          </div>
        )}
      </div>
    </Card>
  );
} 