import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Typography, Row, Col } from "antd";
import { SearchOutlined, UserOutlined, SafetyOutlined } from "@ant-design/icons";
import usersData from '@/data/users.json';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

export default function PermissionManagementPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setUsers(usersData as User[]);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f5f5f5' }}>
      <Card>
        <Typography.Title level={3}>{t('sidebar.permissionsManagement')}</Typography.Title>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder={t('navbar.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>
        <Row gutter={[24, 24]}>
          {filteredUsers.map(user => (
            <Col xs={24} md={12} lg={8} key={user.id}>
              <Card
                hoverable
                onClick={() => navigate(`/permissions-management/${user.id}`)}
                style={{ textAlign: 'center' }}
              >
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <UserOutlined style={{ fontSize: 32, color: '#bfbfbf' }} />
                </div>
                <Typography.Title level={5}>{user.name}</Typography.Title>
                <div style={{ color: '#888', fontSize: 14 }}>@{user.username}</div>
                <div style={{ color: '#888', fontSize: 14 }}>{user.email}</div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12 }}>
                  <SafetyOutlined />
                  <span>{user.permissions.length} Permissions</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
} 