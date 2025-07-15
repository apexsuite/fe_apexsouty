import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { Card, Input, Typography, Select, Tag, Space } from 'antd';
import { Shield, Eye, Edit, Activity, CheckCircle, XCircle } from 'lucide-react';
import { canUpdate } from '@/lib/utils';

const { Title, Text } = Typography;
const { Option } = Select;

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
      case 'read': return 'blue';
      case 'write': return 'orange';
      case 'admin': return 'red';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'green' : 'default';
  };

  // Kullanıcının Update izni yoksa sadece görüntüleme modunda göster
  const canEdit = canUpdate(user);
  const displayMode = isEditing && canEdit ? 'editing' : 'viewing';

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield className="w-5 h-5" />
          {t('permissions.basicInformation')}
          {!canEdit && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              (Salt Okunur)
            </Text>
          )}
        </Title>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>{t('permissions.permissionName')}</Text>
          {displayMode === 'editing' ? (
            <Input
              value={editedPermission.name || ''}
              onChange={(e) => setEditedPermission({ ...editedPermission, name: e.target.value })}
            />
          ) : (
            <Text>{permission.name}</Text>
          )}  
        </div>
        
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>{t('permissions.description')}</Text>
          {displayMode === 'editing' ? (
            <Input
              value={editedPermission.description || ''}
              onChange={(e) => setEditedPermission({ ...editedPermission, description: e.target.value })}
            />
          ) : (
            <Text>{permission.description}</Text>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>{t('permissions.type')}</Text>
            {displayMode === 'editing' ? (
              <Select
                value={editedPermission.type || 'read'}
                onChange={(value) => setEditedPermission({ 
                  ...editedPermission, 
                  type: value as 'read' | 'write' | 'admin' 
                })}
                style={{ width: '100%' }}
              >
                <Option value="read">{t('permissions.read')}</Option>
                <Option value="write">{t('permissions.write')}</Option>
                <Option value="admin">{t('permissions.admin')}</Option> 
              </Select>
            ) : (
              <Space>
                {getTypeIcon(permission.type)}
                <Tag color={getTypeColor(permission.type)}>
                  {t(`permissions.${permission.type}`)}
                </Tag>
              </Space>
            )}
          </div>
          
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>{t('permissions.status')}</Text>
            {displayMode === 'editing' ? (
              <Select
                value={editedPermission.status || 'active'}
                onChange={(value) => setEditedPermission({ 
                  ...editedPermission, 
                  status: value as 'active' | 'inactive' 
                })}
                style={{ width: '100%' }}
              >
                <Option value="active">{t('permissions.active')}</Option>
                <Option value="inactive">{t('permissions.inactive')}</Option>
              </Select>
            ) : (
              <Space>
                {permission.status === 'active' ? (
                  <CheckCircle className="w-4 h-4" style={{ color: '#52c41a' }} />
                ) : (
                  <XCircle className="w-4 h-4" style={{ color: '#8c8c8c' }} />
                )}
                <Tag color={getStatusColor(permission.status)}>
                  {t(`permissions.${permission.status}`)}
                </Tag>
              </Space>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 