import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPermissions, updatePermission } from '@/lib/pageRoutePermissionSlice';
import { Trash2, Search, Check, Plus } from 'lucide-react';
import { message, Button, Tag, Modal, Input, List, Checkbox, Table, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface PermissionTableProps {
  pageRouteId: string;
  pageRoutePermissions: any[];
  onPermissionsUpdate: () => void;
  onPermissionsChange: (permissions: any[]) => void;
}

const PermissionTable: React.FC<PermissionTableProps> = ({
  pageRouteId,
  pageRoutePermissions,
  onPermissionsUpdate,
  onPermissionsChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.theme);

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [localPermissions, setLocalPermissions] = useState<any[]>([]);

  // Initialize local permissions when pageRoutePermissions change
  useEffect(() => {
    setLocalPermissions(pageRoutePermissions);
  }, [pageRoutePermissions]);

  const loadAllPermissions = async () => {
    try {
      const response = await dispatch(fetchPermissions({})).unwrap();
      setAllPermissions(response.data?.items || []);
    } catch (error) {
      console.error('Failed to load all permissions:', error);
    }
  };

  const handleAssignPermissions = () => {
    // Add selected permissions to local permissions array
    const newPermissions = selectedPermissions.map(permissionId => {
      const permission = allPermissions.find(p => p.id === permissionId);
      if (permission) {
        return {
          ...permission,
          pageRouteId: pageRouteId,
        };
      }
      return null;
    }).filter(Boolean);

    const updatedPermissions = [...localPermissions, ...newPermissions];
    setLocalPermissions(updatedPermissions);
    onPermissionsChange(updatedPermissions);
    
    message.success(t('pages.permissionsAssigned'));
    setShowPermissionModal(false);
    setSelectedPermissions([]);
  };

  const handleUnassignPermission = (permissionId: string) => {
    // Remove permission from local permissions array
    const updatedPermissions = localPermissions.filter(p => p.id !== permissionId);
    setLocalPermissions(updatedPermissions);
    onPermissionsChange(updatedPermissions);
    
    message.success(t('pages.permissionUnassigned'));
  };

  const handlePermissionSelection = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  // Filter available permissions (not assigned to current page route)
  const availablePermissions = allPermissions.filter(permission => 
    !localPermissions.some(current => current.id === permission.id) &&
    permission.name.toLowerCase().includes(permissionSearchTerm.toLowerCase())
  );

  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {text || 'No description'}
        </span>
      ),
    },
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
      render: (text: string) => text ? (
        <Tag color="blue">{text}</Tag>
      ) : null,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            danger
            icon={<Trash2 size={16} />}
            onClick={() => handleUnassignPermission(record.id)}
            size="small"
          >
            {t('pages.unassign')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('pages.permissions')}
          </h3>
          <Tag color="blue">{localPermissions.length}</Tag>
        </div>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => {
            setShowPermissionModal(true);
            loadAllPermissions();
          }}
          size="small"
        >
          {t('pages.managePermissions')}
        </Button>
      </div>

      {/* Permissions Table */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} ${theme === 'dark' ? 'dark-modal' : ''}`}>
        <Table
          columns={columns}
          dataSource={localPermissions}
          rowKey="id"
          pagination={false}
          size="small"
          className={`${theme === 'dark' ? 'dark-table' : ''}`}
          style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          }}
          locale={{
            emptyText: (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>{t('pages.noPermissionsAssigned')}</p>
                <p className="text-sm">{t('pages.createFirstPermission')}</p>
              </div>
            )
          }}
        />
      </div>

      {/* Permission Selection Modal */}
      <Modal
        title={t('pages.selectPermissionsToAssign')}
        open={showPermissionModal}
        onOk={handleAssignPermissions}
        onCancel={() => {
          setShowPermissionModal(false);
          setSelectedPermissions([]);
          setPermissionSearchTerm('');
        }}
        okText={t('pages.assignSelected')}
        cancelText={t('common.cancel')}
        width={800}
        className={theme === 'dark' ? 'dark-modal' : ''}
        styles={{
          body: {
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#f3f4f6' : '#000000',
          },
          header: {
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderBottom: theme === 'dark' ? '1px solid #4b5563' : '1px solid #f0f0f0',
            color: theme === 'dark' ? '#f3f4f6' : '#000000',
          },
          footer: {
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderTop: theme === 'dark' ? '1px solid #4b5563' : '1px solid #f0f0f0',
          }
        }}
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder={t('pages.searchPermissions')}
              value={permissionSearchTerm}
              onChange={(e) => setPermissionSearchTerm(e.target.value)}
              prefix={<Search size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />}
              className={theme === 'dark' ? 'dark-input' : ''}
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                color: theme === 'dark' ? '#f3f4f6' : '#000000',
              }}
            />
          </div>

          {/* Available Permissions Table */}
          <div className={`max-h-96 overflow-y-auto ${theme === 'dark' ? 'dark-modal' : ''}`}>
            {availablePermissions.length > 0 ? (
              <Table
                columns={[
                  {
                    title: 'Select',
                    key: 'select',
                    width: 60,
                    render: (_, record) => (
                      <Checkbox
                        checked={selectedPermissions.includes(record.id)}
                        onChange={(e) => handlePermissionSelection(record.id, e.target.checked)}
                      />
                    ),
                  },
                  {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text: string) => (
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {text}
                      </span>
                    ),
                  },
                  {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                    render: (text: string) => (
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {text || 'No description'}
                      </span>
                    ),
                  },
                  {
                    title: 'Status',
                    dataIndex: 'isActive',
                    key: 'isActive',
                    render: (isActive: boolean) => (
                      <Tag color={isActive ? 'green' : 'red'}>
                        {isActive ? 'Active' : 'Inactive'}
                      </Tag>
                    ),
                  },
                ]}
                dataSource={availablePermissions}
                rowKey="id"
                pagination={false}
                size="small"
                className={`${theme === 'dark' ? 'dark-table' : ''}`}
                style={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                }}
                locale={{
                  emptyText: (
                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <p>{t('pages.noAvailablePermissions')}</p>
                      <p className="text-sm">{t('pages.allPermissionsAssigned')}</p>
                    </div>
                  )
                }}
              />
            ) : (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>{t('pages.noAvailablePermissions')}</p>
                <p className="text-sm">{t('pages.allPermissionsAssigned')}</p>
              </div>
            )}
          </div>

          {/* Selected Count */}
          {selectedPermissions.length > 0 && (
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} border border-blue-200`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                <Check size={16} className="inline mr-1" />
                {selectedPermissions.length} {t('pages.permissionsSelected')}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PermissionTable;
