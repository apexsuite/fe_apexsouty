import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '@/lib/store';
import { changePermissionStatus, deletePermission } from '@/lib/pageRoutePermissionSlice';
import { Trash2, Plus, Edit } from 'lucide-react';
import { message, Button, Tag, Table, Space, Switch } from 'antd';
import CreatePermissionModal from './CreatePermissionModal';
import DeletePermissionModal from './DeletePermissionModal';
import EditPermissionModal from './EditPermissionModal';
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

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [localPermissions, setLocalPermissions] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [selectedPermission, setSelectedPermission] = useState<any>(null);

  // Initialize local permissions when pageRoutePermissions change
  useEffect(() => {
    setLocalPermissions(pageRoutePermissions);
  }, [pageRoutePermissions]);

  const handleEdit = (permission: any) => {
    setSelectedPermission(permission);
    setEditModalVisible(true);
  };

  const handleDelete = (permission: any) => {
    setSelectedPermission(permission);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPermission) return;
    
    try {
      await dispatch(deletePermission({ 
        pageRouteId, 
        permissionId: selectedPermission.id 
      })).unwrap();
      
      // Remove permission from local permissions array
      const updatedPermissions = localPermissions.filter(p => p.id !== selectedPermission.id);
      setLocalPermissions(updatedPermissions);
      onPermissionsChange(updatedPermissions);
      
      message.success(t('permissions.deletedSuccessfully') || 'Permission deleted successfully');
      setDeleteModalVisible(false);
      setSelectedPermission(null);
    } catch (error: any) {
      message.error(error.message || t('permissions.deleteError') || 'Failed to delete permission');
    }
  };

  const handleEditSuccess = () => {
    setEditModalVisible(false);
    setSelectedPermission(null);
    onPermissionsUpdate(); // Refresh the list
  };

  const handleStatusChange = async (permissionId: string, isActive: boolean) => {
    setLoadingStates(prev => ({ ...prev, [permissionId]: true }));
    try {
      await dispatch(changePermissionStatus({ 
        pageRouteId, 
        permissionId, 
        status: isActive 
      })).unwrap();
      
      // Update local permissions
      const updatedPermissions = localPermissions.map(p => 
        p.id === permissionId ? { ...p, isActive } : p
      );
      setLocalPermissions(updatedPermissions);
      onPermissionsChange(updatedPermissions);
      
      message.success(t('permissions.statusUpdated') || 'Permission status updated successfully');
    } catch (error: any) {
      message.error(error.message || t('permissions.statusUpdateError') || 'Failed to update permission status');
    } finally {
      setLoadingStates(prev => ({ ...prev, [permissionId]: false }));
    }
  };

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    onPermissionsUpdate(); // Refresh the permissions list
  };

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
      render: (isActive: boolean, record: any) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={isActive}
            loading={loadingStates[record.id]}
            onChange={(checked) => handleStatusChange(record.id, checked)}
            className={theme === 'dark' ? 'dark-switch' : ''}
          />
          <Tag color={isActive ? 'green' : 'red'} className="text-xs">
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<Edit size={16} />}
            onClick={() => handleEdit(record)}
            size="small"
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            {t('common.edit') || 'Edit'}
          </Button>
          <Button
            type="text"
            danger
            icon={<Trash2 size={16} />}
            onClick={() => handleDelete(record)}
            size="small"
          >
            {t('common.delete') || 'Delete'}
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
          onClick={() => setCreateModalVisible(true)}
          size="small"
        >
          {t('permissions.createPermission') || 'Create Permission'}
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

      {/* Create Permission Modal */}
      <CreatePermissionModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
        pageRouteId={pageRouteId}
      />

      <DeletePermissionModal
        visible={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedPermission(null);
        }}
        onConfirm={handleConfirmDelete}
        permission={selectedPermission}
        loading={loadingStates[selectedPermission?.id]}
      />

      <EditPermissionModal
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedPermission(null);
        }}
        onSuccess={handleEditSuccess}
        permission={selectedPermission}
        pageRouteId={pageRouteId}
      />
    </div>
  );
};

export default PermissionTable;