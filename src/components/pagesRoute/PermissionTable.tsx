import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '@/lib/store';
import { changePermissionStatus, deletePermission } from '@/lib/pageRoutePermissionSlice';
import { Trash2, Plus, Edit, Search } from 'lucide-react';
import { Button, Tag, Table, Space, Switch, Input, Pagination } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';
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
  const { handleError, showSuccess } = useErrorHandler();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [localPermissions, setLocalPermissions] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [selectedPermission, setSelectedPermission] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Initialize local permissions when pageRoutePermissions change
  useEffect(() => {
    setLocalPermissions(pageRoutePermissions);
    setCurrentPage(1); // Reset to first page when permissions change
  }, [pageRoutePermissions]);

  // Filter permissions based on search term
  const filteredPermissions = useMemo(() => {
    if (!searchTerm) return localPermissions;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return localPermissions.filter((permission) => 
      permission.name?.toLowerCase().includes(lowerSearchTerm) ||
      permission.description?.toLowerCase().includes(lowerSearchTerm) ||
      permission.label?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [localPermissions, searchTerm]);

  // Get paginated permissions
  const paginatedPermissions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPermissions.slice(startIndex, endIndex);
  }, [filteredPermissions, currentPage, pageSize]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
      
      showSuccess('permissionDeletedSuccessfully');
      setDeleteModalVisible(false);
      setSelectedPermission(null);
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleEditSuccess = () => {
    setEditModalVisible(false);
    setSelectedPermission(null);
    onPermissionsUpdate(); // Permissions listesini yenile
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
      
      showSuccess('permissionStatusChangedSuccessfully');
    } catch (error: any) {
      handleError(error);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('pages.permissions')}
          </h3>
          <Tag color="blue">{localPermissions.length}</Tag>
        </div>
        {/* Filter Input */}
        <div className="w-full sm:w-72">
          <Input
            placeholder={t('permissions.searchPermissions')}
            prefix={<Search size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            className={`${theme === 'dark' ? 'dark-input' : ''}`}
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
              color: theme === 'dark' ? '#ffffff' : '#111827'
            }}
          />
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



      {/* Desktop Table View - Hidden on Mobile */}
      <div className={`hidden md:block ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} ${theme === 'dark' ? 'dark-modal' : ''}`}>
        <Table
          columns={columns}
          dataSource={paginatedPermissions}
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
                <p>{searchTerm ? t('permissions.noResultsFound') || 'No results found' : t('pages.noPermissionsAssigned')}</p>
                <p className="text-sm">{searchTerm ? t('permissions.tryDifferentSearch') || 'Try a different search term' : t('pages.createFirstPermission')}</p>
              </div>
            )
          }}
        />
      </div>

      {/* Desktop Pagination */}
      {filteredPermissions.length > 0 && (
        <div className="hidden md:flex justify-center">
          <Pagination
            current={currentPage}
            total={filteredPermissions.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            className={theme === 'dark' ? 'dark-pagination' : ''}
          />
        </div>
      )}

      {/* Mobile Card View - Hidden on Desktop */}
      <div className="block md:hidden space-y-3">
        {paginatedPermissions.length === 0 ? (
          <div className={`text-center py-8 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
            <p>{searchTerm ? t('permissions.noResultsFound') || 'No results found' : t('pages.noPermissionsAssigned')}</p>
            <p className="text-sm">{searchTerm ? t('permissions.tryDifferentSearch') || 'Try a different search term' : t('pages.createFirstPermission')}</p>
          </div>
        ) : (
          paginatedPermissions.map((permission) => (
            <div
              key={permission.id}
              className={`rounded-lg border p-4 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className={`font-medium text-base mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {permission.name}
                  </h4>
                  {permission.label && (
                    <Tag color="blue" className="mb-2">{permission.label}</Tag>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Switch
                    checked={permission.isActive}
                    loading={loadingStates[permission.id]}
                    onChange={(checked) => handleStatusChange(permission.id, checked)}
                    className={theme === 'dark' ? 'dark-switch' : ''}
                    size="small"
                  />
                </div>
              </div>

              {/* Description */}
              {permission.description && (
                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {permission.description}
                </p>
              )}

              {/* Status Badge */}
              <div className="mb-3">
                <Tag color={permission.isActive ? 'green' : 'red'} className="text-xs">
                  {permission.isActive ? 'Active' : 'Inactive'}
                </Tag>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="text"
                  icon={<Edit size={16} />}
                  onClick={() => handleEdit(permission)}
                  size="small"
                  className="flex-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  {t('common.edit') || 'Edit'}
                </Button>
                <Button
                  type="text"
                  danger
                  icon={<Trash2 size={16} />}
                  onClick={() => handleDelete(permission)}
                  size="small"
                  className="flex-1"
                >
                  {t('common.delete') || 'Delete'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile Pagination */}
      {filteredPermissions.length > 0 && (
        <div className="flex md:hidden justify-center">
          <Pagination
            current={currentPage}
            total={filteredPermissions.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            simple
            className={theme === 'dark' ? 'dark-pagination' : ''}
          />
        </div>
      )}

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