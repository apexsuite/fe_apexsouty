import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Typography } from "antd";
import { Shield, Activity, Users } from 'lucide-react';

interface PermissionStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    read: number;
    write: number;
    admin: number;
  };
}

export default function PermissionStats({ stats }: PermissionStatsProps) {
  const { t } = useTranslation();

  return (
    <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
      <Col xs={24} md={12} lg={6}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography.Text type="secondary">{t('permissions.totalPermissions')}</Typography.Text>
            <Shield style={{ fontSize: 20, color: '#bfbfbf' }} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>{stats.total}</div>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography.Text type="secondary">{t('permissions.activePermissions')}</Typography.Text>
            <Activity style={{ fontSize: 20, color: '#bfbfbf' }} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 12, color: '#16a34a' }}>{stats.active}</div>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography.Text type="secondary">{t('permissions.inactivePermissions')}</Typography.Text>
            <Users style={{ fontSize: 20, color: '#bfbfbf' }} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 12, color: '#6b7280' }}>{stats.inactive}</div>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography.Text type="secondary">{t('permissions.userRoles')}</Typography.Text>
            <Users style={{ fontSize: 20, color: '#bfbfbf' }} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>{stats.admin + stats.write + stats.read}</div>
        </Card>
      </Col>
    </Row>
  );
} 