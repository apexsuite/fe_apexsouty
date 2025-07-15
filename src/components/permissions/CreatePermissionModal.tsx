import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { Button, Input, Typography, Checkbox, Modal, Form, Space } from 'antd';
import { canCreate } from '@/lib/utils';

const { Title, Text } = Typography;

interface NewPermission {
  name: string;
  description: string;
  actions: string[];
  assignedTo: string;
}

interface CreatePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPermission: NewPermission;
  setNewPermission: (permission: NewPermission) => void;
  onSubmit: () => void;
}

const CRUD_ACTIONS = ['create', 'read', 'delete', 'update'];

export default function CreatePermissionModal({
  isOpen,
  onClose,
  newPermission,
  setNewPermission,
  onSubmit,
}: CreatePermissionModalProps) {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleActionChange = (action: string) => {
    const currentActions = newPermission.actions || [];
    const newActions = currentActions.includes(action)
      ? currentActions.filter((a) => a !== action)
      : [...currentActions, action];
    setNewPermission({ ...newPermission, actions: newActions });
  };

  // Eğer Create izni yoksa modal'ı gösterme
  if (!canCreate(user)) {
    return null;
  }

  return (
    <Modal
      title={t('permissions.createNewPermission')}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t('permissions.cancel')}
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
          {t('permissions.createPermission')}
        </Button>,
      ]}
      width={500}
    >
      <Form layout="vertical">
        <Form.Item label={t('permissions.permissionName')}>
          <Input
            value={newPermission.name}
            onChange={(e) =>
              setNewPermission({ ...newPermission, name: e.target.value })
            }
            placeholder={t('permissions.enterPermissionName')}
          />
        </Form.Item>
        
        <Form.Item label={t('permissions.description')}>
          <Input
            value={newPermission.description}
            onChange={(e) =>
              setNewPermission({
               ...newPermission,
                description: e.target.value,
              })
            }
            placeholder={t('permissions.enterDescription')}
          />
        </Form.Item>
        
        <Form.Item label={t('permissions.actions')}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {CRUD_ACTIONS.map((action) => (
              <Checkbox
                key={action}
                checked={(newPermission.actions || []).includes(action)}
                onChange={() => handleActionChange(action)}
              >
                <Text style={{ textTransform: 'capitalize' }}>
                  {t(`permissions.${action}`)}
                </Text>
              </Checkbox>
            ))}
          </Space>
        </Form.Item>
        
        <Form.Item label={t('permissions.assignedTo')}>
          <Input
            value={newPermission.assignedTo}
            onChange={(e) =>
              setNewPermission({
               ...newPermission,
                assignedTo: e.target.value,
              })
            }
            placeholder={t('permissions.enterUserName')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
} 