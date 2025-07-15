import { useTranslation } from 'react-i18next';
import { Card, Button, Typography, Space } from 'antd';
import { Copy, Users, Activity } from 'lucide-react';

const { Title } = Typography;

interface PermissionQuickActionsProps {
  onDuplicate?: () => void;
  onManageAssignments?: () => void;
  onViewActivityLog?: () => void;
}

export default function PermissionQuickActions({
  onDuplicate,
  onManageAssignments,
  onViewActivityLog
}: PermissionQuickActionsProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>{t('permissions.quickActions')}</Title>
      </div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button 
          type="default"
          block
          icon={<Copy style={{ width: 16, height: 16, marginRight: 8 }} />} 
          onClick={onDuplicate}
        >
          {t('permissions.duplicatePermission')}
        </Button>
        <Button 
          type="default"
          block
          icon={<Users style={{ width: 16, height: 16, marginRight: 8 }} />} 
          onClick={onManageAssignments}
        >
          {t('permissions.manageAssignments')}
        </Button>
        <Button 
          type="default"
          block
          icon={<Activity style={{ width: 16, height: 16, marginRight: 8 }} />} 
          onClick={onViewActivityLog}
        >
          {t('permissions.viewActivityLog')}
        </Button>
      </Space>
    </Card>
  );
} 