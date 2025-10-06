import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, Space, Tag, Card, theme, Tooltip } from 'antd';
import { Edit, Eye, ChevronDown, ChevronUp, Shield, Calendar } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { RootState } from '@/lib/store';
import PermissionGuard from '@/components/PermissionGuard';

interface Permission {
  id: string;
  name: string;
  description: string;
  label: string;
  isActive: boolean;
  createdAt: string;
}

interface PageRoutePermissionTableProps {
  permissions: Permission[];
  loading: boolean;
  onView: (permissionId: string) => void;
  onEdit: (permissionId: string) => void;
}

const PageRoutePermissionTable: React.FC<PageRoutePermissionTableProps> = ({
  permissions,
  loading,
  onView,
  onEdit,
}) => {
  const { token } = theme.useToken();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);
  const [isMobile, setIsMobile] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns: ColumnsType<Permission> = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      render: (name: string) => (
        <span style={{ 
          color: currentTheme === 'dark' ? '#ffffff' : token.colorText,
          fontWeight: 500 
        }}>
          {name || 'Unnamed Permission'}
        </span>
      ),
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
      render: (description: string) => (
        <span style={{ 
          color: currentTheme === 'dark' ? '#d1d5db' : token.colorTextSecondary,
          fontSize: '14px'
        }}>
          {description || 'No description'}
        </span>
      ),
    },
    {
      title: 'Label',
      key: 'label',
      dataIndex: 'label',
      render: (label: string) => (
        <Tag color="cyan">
          {label || 'No label'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Created Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (dateString: string) => (
        <span style={{ 
          color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280',
          fontSize: '14px'
        }}>
          {dateString ? formatDate(dateString) : 'No date'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Permission) => (
        <Space size="small">
          <PermissionGuard 
            permission="get-page-route-permission" 
            mode="hide"
          >
            <Tooltip title="View">
              <Button
                type="text"
                size="small"
                icon={<Eye size={16} />}
                onClick={() => onView(record.id)}
                style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorPrimary }}
              />
            </Tooltip>
          </PermissionGuard>
          
          <PermissionGuard 
            permission="update-page-route-permission" 
            mode="hide"
          >
            <Tooltip title="Edit">
              <Button
                type="text"
                size="small"
                icon={<Edit size={16} />}
                onClick={() => onEdit(record.id)}
                style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorSuccess }}
              />
            </Tooltip>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  // Mobile Card Component
  const PermissionCard: React.FC<{ permission: Permission }> = ({ permission }) => {
    const isExpanded = openCard === permission.id;
    
    return (
      <Card
        style={{ 
          cursor: 'pointer',
          backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
          borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
        bodyStyle={{ padding: '12px' }}
        onClick={() => setOpenCard(isExpanded ? null : permission.id)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Shield 
                size={14} 
                className={currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-500'} 
              />
              <h3 
                className="font-medium text-sm truncate"
                style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}
              >
                {permission.name || 'Unnamed Permission'}
              </h3>
              <Tag 
                color={permission.isActive ? 'green' : 'red'}
                style={{ fontSize: '10px' }}
              >
                {permission.isActive ? 'Active' : 'Inactive'}
              </Tag>
            </div>
            
            {permission.description && (
              <div className="mb-1">
                <span 
                  className="text-xs line-clamp-2"
                  style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280' }}
                >
                  {permission.description}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-1">
              {permission.label && (
                <Tag 
                  color="cyan" 
                  style={{ fontSize: '10px', marginRight: 0 }}
                >
                  {permission.label}
                </Tag>
              )}
              {permission.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar size={10} className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  <span 
                    className="text-xs"
                    style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}
                  >
                    {formatDate(permission.createdAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            type="text" 
            size="small" 
            onClick={(e) => { 
              e.stopPropagation(); 
              setOpenCard(isExpanded ? null : permission.id); 
            }}
            className="p-0 h-auto"
            style={{ minWidth: 'auto' }}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>

        {isExpanded && (
          <div 
            className="mt-3 pt-3 border-t"
            style={{ borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb' }}
          >
            <div className="flex flex-wrap gap-1">
              <PermissionGuard 
                permission="get-page-route-permission" 
                mode="hide"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<Eye size={12} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(permission.id);
                  }}
                  style={{ 
                    color: currentTheme === 'dark' ? '#ffffff' : token.colorPrimary,
                    fontSize: '11px',
                    height: '24px',
                    padding: '0 6px'
                  }}
                >
                  View
                </Button>
              </PermissionGuard>
              
              <PermissionGuard 
                permission="update-page-route-permission" 
                mode="hide"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<Edit size={12} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(permission.id);
                  }}
                  style={{ 
                    color: currentTheme === 'dark' ? '#ffffff' : token.colorSuccess,
                    fontSize: '11px',
                    height: '24px',
                    padding: '0 6px'
                  }}
                >
                  Edit
                </Button>
              </PermissionGuard>
            </div>
          </div>
        )}
      </Card>
    );
  };

  if (isMobile) {
    return (
      <div className="space-y-2 px-1">
        {permissions.filter(p => p !== null).map((permission) => (
          <PermissionCard key={permission.id} permission={permission} />
        ))}
        {loading && (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={permissions.filter(p => p !== null)}
      rowKey="id"
      loading={loading}
      pagination={false}
      style={{
        backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadow
      }}
      rowClassName={currentTheme === 'dark' ? "hover:bg-gray-800" : "hover:bg-gray-50"}
    />
  );
};

export default PageRoutePermissionTable;

