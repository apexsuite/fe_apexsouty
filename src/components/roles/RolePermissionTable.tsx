import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPermissions } from '@/lib/pageRoutePermissionSlice';
import { setRolePermissionsBulk } from '@/lib/roleSlice';
import { Trash2, Search, Check, Plus, Save } from 'lucide-react';
import { Button, Tag, Modal, Input, Table, Space } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';
import type { ColumnsType } from 'antd/es/table';

interface RolePermissionTableProps {
  roleId: string;
  rolePermissions: any[];
}

const RolePermissionTable: React.FC<RolePermissionTableProps> = ({
  roleId,
  rolePermissions,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const { handleError, showSuccess } = useErrorHandler();

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [localPermissions, setLocalPermissions] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize local permissions when rolePermissions change
  useEffect(() => {
    setLocalPermissions(rolePermissions);
  }, [rolePermissions]);

  const loadAllPermissions = async () => {
    try {
      const response = await dispatch(fetchPermissions({})).unwrap();
      const allPerms = response.data?.items || [];
      setAllPermissions(allPerms);
    } catch (error) {
      console.error('Failed to load all permissions:', error);
    }
  };

  const handleAssignPermissions = () => {
    const newPermissions = selectedPermissions.map(permissionId => {
      const permission = allPermissions.find(p => p.id === permissionId);
      if (permission) {
        return {
          id: `temp-${Date.now()}-${Math.random()}`, // Temporary ID for new assignments
          permissionId: permission.id,
          rolePermissionID: roleId,
          isActive: true,
          permission: permission,
        };
      }
      return null;
    }).filter(Boolean);

    const updatedPermissions = [...localPermissions, ...newPermissions];
    setLocalPermissions(updatedPermissions);
    
    showSuccess('permissionCreatedSuccessfully');
    setShowPermissionModal(false);
    setSelectedPermissions([]);
  };

  const handleUnassignPermission = (permissionId: string) => {
    console.log('=== UNASSIGN DEBUG ===');
    console.log('Unassigning permission ID:', permissionId);
    console.log('Current localPermissions:', localPermissions);
    
    // Remove permission from local permissions array
    // Try multiple possible field names for permission ID
    const updatedPermissions = localPermissions.filter(p => 
      p.permissionId !== permissionId && 
      p.permission?.id !== permissionId && 
      p.id !== permissionId
    );
    console.log('Updated permissions after unassign:', updatedPermissions);
    
    setLocalPermissions(updatedPermissions);
    
    showSuccess('permissionDeletedSuccessfully');
  };

  const handlePermissionSelection = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const handleSavePermissions = async () => {
    setIsSaving(true);
    try {
      const permissionsToSend = localPermissions.map(permission => {
        // Check if this is an existing permission (not a newly assigned one)
        const isNewlyAssigned = permission.id && permission.id.startsWith('temp-');
        
        if (isNewlyAssigned) {
          // New permission - only send permissionId
          return {
            permissionId: permission.permissionId
          };
        } else {
          // Existing permission - send both permissionId and rolePermissionId
          return {
            permissionId: permission.permissionId,
            rolePermissionId: permission.rolePermissionID || permission.id
          };
        }
      });

      // Debug: Log permissions being sent
      console.log('=== API REQUEST DEBUG ===');
      console.log('Role ID:', roleId);
      console.log('Local permissions:', localPermissions);
      console.log('Permissions to send:', permissionsToSend);
      console.log('Full request body:', { permissions: permissionsToSend });
      
      // Debug each permission type
      permissionsToSend.forEach((perm, index) => {
        const localPerm = localPermissions[index];
        console.log(`Permission ${index}:`, {
          local: localPerm,
          sent: perm,
          isNewlyAssigned: localPerm.id && localPerm.id.startsWith('temp-')
        });
      });

      await dispatch(setRolePermissionsBulk({
        roleId,
        permissions: permissionsToSend
      })).unwrap();

      showSuccess('permissionUpdatedSuccessfully');

    } catch (error: any) {
      handleError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const currentRolePermissionIds = rolePermissions.map(rp => {
    return rp.permissionId || rp.permission?.id || rp.id;
  }).filter(Boolean);
  const availablePermissions = allPermissions.filter(permission => {
    const isNotAssigned = !currentRolePermissionIds.includes(permission.id);
    const matchesSearch = permission.name.toLowerCase().includes(permissionSearchTerm.toLowerCase());

    return isNotAssigned && matchesSearch;
  });

  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: ['permission', 'name'],
      key: 'name',
      render: (text: string) => (
        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: ['permission', 'description'],
      key: 'description',
      render: (text: string) => (
        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {text || 'No description'}
        </span>
      ),
    },
    {
      title: 'Label',
      dataIndex: ['permission', 'label'],
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            danger
            icon={<Trash2 size={16} />}
            onClick={() => {
              console.log('=== RECORD DEBUG ===');
              console.log('record:', record);
              console.log('record.permissionId:', record.permissiınId);
              console.log('record.permission?.id:', record.permission?.id);
              console.log('record.id:', record.id);
              console.log('==================');
              handleUnassignPermission(record.permissionId || record.permission?.id || record.id);
            }}
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
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<Save size={16} />}
            onClick={handleSavePermissions}
            loading={isSaving}
            size="small"
            disabled={isSaving}
          >
            {isSaving ? (t('pages.saving') || 'Saving...') : (t('pages.save') || 'Save')}
          </Button>
          <Button
            type="default"
            icon={<Plus size={16} />}
            onClick={() => {
              setShowPermissionModal(true);
              setSelectedPermissions([]); // Clear previous selections
              setPermissionSearchTerm(''); // Clear search term
              loadAllPermissions();
            }}
            size="small"
          >
            {t('pages.managePermissions')}
          </Button>
        </div>
      </div>

      {/* Permissions Table */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} ${theme === 'dark' ? 'dark-modal' : ''}`}>
        <Table
          columns={columns}
          dataSource={localPermissions}
          rowKey="permissionId"
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
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(record.id)}
                        onChange={(e) => handlePermissionSelection(record.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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

export default RolePermissionTable;
