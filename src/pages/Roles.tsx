import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/lib/store';
import { 
  fetchRoles, 
  deleteRole, 
  changeRoleStatus, 
  clearError,
  setCurrentPageNumber,
  setPageSize
} from '@/lib/roleSlice';
import { Plus, Search } from 'lucide-react';
import { Card, Typography, Pagination } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';

// Import components
import RoleTable from '@/components/roles/RoleTable';
import RoleDeleteModal from '@/components/roles/RoleDeleteModal';

const { Title, Paragraph } = Typography;

const Roles: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { roles, loading, error, totalPages, currentPageNumber, pageSize } = useSelector(
    (state: RootState) => state.role
  );
  const { handleError, showSuccess } = useErrorHandler();
    
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleValue] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    
    dispatch(clearError());
    loadRoles();
  }, [currentPageNumber, pageSize]);

  useEffect(() => {
    if (searchTerm !== '' || selectedRoleValue !== 'all') {
      dispatch(setCurrentPageNumber(1));
    }
    loadRoles();
  }, [searchTerm, selectedRoleValue]);

  const loadRoles = () => {
    const params: any = {
      page: currentPageNumber,
      pageSize: pageSize,
    };

    // Sadece değer varsa ekle
    if (searchTerm && searchTerm.trim() !== '') {
      params.name = searchTerm.trim();
    }

    if (selectedRoleValue && selectedRoleValue !== 'all') {
      params.roleValue = parseInt(selectedRoleValue);
    }

    dispatch(fetchRoles(params));
  };


  const handleCreateRole = () => {
    navigate('/roles/create');
  };

  const handleEditRole = (roleId: string) => {
    navigate(`/roles/${roleId}/edit`);
  };

  const handleViewRole = (roleId: string) => {
    navigate(`/roles/${roleId}`);
  };

  const handleDeleteRole = (roleId: string, roleName: string) => {
    setRoleToDelete({ id: roleId, name: roleName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteRole(roleToDelete.id)).unwrap();
      showSuccess('roleDeletedSuccessfully');
      loadRoles();
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setRoleToDelete(null);
    }
  };

  const handleStatusChange = async (roleId: string, currentStatus: boolean) => {
    try {
      await dispatch(changeRoleStatus({ roleId, status: !currentStatus })).unwrap();
      showSuccess('roleStatusChangedSuccessfully');
    } catch (error: any) {
      handleError(error);
    }
  };

  const handlePageChange = (page: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
      dispatch(setCurrentPageNumber(1));
    } else {
      dispatch(setCurrentPageNumber(page));
    }
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPageNumber(1));
  };

  // Sadece ilk yükleme sırasında loading göster
  if (loading && roles.length === 0 && !searchTerm && selectedRoleValue === 'all') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <Title level={2} className="mb-2 text-gray-900 dark:text-white">
                {t('roles.roles') || 'Roles'}
              </Title>
              <Paragraph className="text-gray-600 dark:text-gray-400 mb-0">
                {t('roles.manageRoles') || 'Manage user roles and permissions'}
              </Paragraph>
            </div>
            <button
              onClick={handleCreateRole}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border-blue-600 hover:border-blue-700"
            >
              <Plus size={16} />
              {t('roles.createRole') || 'Create Role'}
            </button>
          </div>
        </Card>

        {/* Filters */}
        <Card
          style={{
            backgroundColor: 'var(--ant-color-bg-container)',
            borderColor: 'var(--ant-color-border)',
            marginBottom: '1.5rem'
          }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  size={20} 
                />
              </div>
            </div>

          </div>
        </Card>
        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <div className="text-center text-red-600 dark:text-red-400">
              {error}
            </div>
          </Card>
        )}

        {/* Roles Table */}
        <RoleTable
          roles={roles}
          loading={loading}
          onView={handleViewRole}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          onStatusChange={handleStatusChange}
          searchTerm={searchTerm}
          selectedRoleValue={selectedRoleValue}
        />
        
        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'right',
          padding: '16px',
          backgroundColor: 'var(--ant-color-bg-container)',
          border: '1px solid var(--ant-color-border)',
          borderRadius: '8px'
        }}>
            <Pagination
              current={currentPageNumber}
              total={totalPages * pageSize}
              pageSize={pageSize}
              showSizeChanger
              showQuickJumper
              showTotal={(_, range) => (
                <span style={{ 
                  color: 'var(--ant-color-text)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {searchTerm || selectedRoleValue !== 'all' ? (
                    `${roles?.length || 0} items found`
                  ) : (
                    `${range[0]}-${range[1]} of ${totalPages * pageSize} items`
                  )}
                </span>
              )}
              onChange={(page, size) => {
                handlePageChange(page, size);
              }}
              onShowSizeChange={(_current, size) => {
                handlePageSizeChange(size);
              }}
              style={{
                color: 'var(--ant-color-text)'
              }}
            />
          </div>
      </div>

      {/* Delete Modal */}
      <RoleDeleteModal
        visible={showDeleteModal}
        roleName={roleToDelete?.name}
        loading={isDeleting}
        onOk={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default Roles; 