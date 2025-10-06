import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { Button, Card, Typography, Tag, Space, Modal } from 'antd';
import { Eye, Edit, Trash2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatDate, canRead, canUpdate, canDelete } from '@/lib/utils';
import PermissionGuard from '@/components/PermissionGuard';

const { Text, Title } = Typography;

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

interface PermissionItemProps {
  permission: Permission;
  onDelete: (id: string) => void;
}

export default function PermissionItem({ permission, onDelete }: PermissionItemProps) {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    setFormattedDate(formatDate(permission.lastModified));
  }, [permission.lastModified]);

  const handleViewClick = () => {
    navigate(`/permissions/${permission.id}`);
  };

  const handleEditClick = () => {
    navigate(`/permissions/${permission.id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(permission.id);
    setShowDeleteDialog(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'read': return <Eye style={{ width: 16, height: 16 }} />;
      case 'write': return <Edit style={{ width: 16, height: 16 }} />;
      case 'admin': return <Activity style={{ width: 16, height: 16 }} />;
      default: return <Activity style={{ width: 16, height: 16 }} />;
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

  return (
    <>
      <Card
        style={{ marginBottom: 8 }}
        bodyStyle={{ padding: 16 }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-2 md:gap-0 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 flex-1 w-full">
            <Space direction="horizontal" className="justify-center md:justify-start w-full">
              {getTypeIcon(permission.type)}
              <div>
                <Title level={5} style={{ margin: 0, wordBreak: 'break-word' }}>{permission.name}</Title>
                <Text type="secondary" style={{ wordBreak: 'break-word', display: 'block' }}>{permission.description}</Text>
              </div>
            </Space>
          </div>
          <Space direction="horizontal" className="justify-center md:justify-start w-full md:w-auto mt-2 md:mt-0" style={{ marginRight: 0 }}>
            <Tag color={getTypeColor(permission.type)}>
              {t(`permissions.${permission.type}`)}
            </Tag>
            <Tag color={getStatusColor(permission.status)}>
              {t(`permissions.${permission.status}`)}
            </Tag>
          </Space>
          <Space direction="horizontal" className="justify-center md:justify-end w-full md:w-auto mt-2 md:mt-0">
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formattedDate}
            </Text>
            <Space size="small">
              <PermissionGuard 
                permission="get-permission" 
                mode="hide"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<Eye style={{ width: 16, height: 16 }} />}
                  onClick={handleViewClick}
                  title="Detayları Görüntüle"
                />
              </PermissionGuard>
              
              <PermissionGuard 
                permission="update-permission" 
                mode="hide"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<Edit style={{ width: 16, height: 16 }} />}
                  onClick={handleEditClick}
                  title="Düzenle"
                />
              </PermissionGuard>
              
              <PermissionGuard 
                permission="delete-permission" 
                mode="hide"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<Trash2 style={{ width: 16, height: 16 }} />}
                  onClick={handleDeleteClick}
                  title="Sil"
                  danger
                />
              </PermissionGuard>
            </Space>
          </Space>
        </div>
      </Card>

      {/* Delete Modal */}
      <PermissionGuard 
        permission="delete-permission" 
        mode="hide"
      >
        <Modal
          title={t('permissions.deleteConfirmTitle')}
          open={showDeleteDialog}
          onOk={handleDeleteConfirm}
          onCancel={() => setShowDeleteDialog(false)}
          okText={t('permissions.deleteConfirmDelete')}
          cancelText={t('permissions.deleteConfirmCancel')}
          okButtonProps={{ danger: true }}
        >
          <p>{t('permissions.deleteConfirmMessage')}</p>
        </Modal>
      </PermissionGuard>
    </>
  );
} 