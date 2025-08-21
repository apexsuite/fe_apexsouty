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
import { Plus } from 'lucide-react';
import { message, Card, Typography } from 'antd';

// Import components
import RoleTable from '@/components/roles/RoleTable';
import RolePagination from '@/components/roles/RolePagination';
import RoleEmptyState from '@/components/roles/RoleEmptyState';
import RoleDeleteModal from '@/components/roles/RoleDeleteModal';

const { Title, Paragraph } = Typography;

const Roles: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { roles, loading, error, totalPages, currentPageNumber, pageSize } = useSelector(
    (state: RootState) => state.role
  );
  
  // Debug için roles state'ini logla
  console.log('Roles State:', { roles, loading, error, totalPages, currentPageNumber, pageSize });
  
  const [searchTerm] = useState('');
  const [selectedRoleValue] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    console.log('Roles component mounted/updated');
    console.log('Current page:', currentPageNumber);
    console.log('Page size:', pageSize);
    
    dispatch(clearError());
    loadRoles();
  }, [currentPageNumber, pageSize]); // currentPageNumber ve pageSize değiştiğinde de çalışsın

  // searchTerm veya selectedRoleValue değiştiğinde ayrı bir useEffect
  useEffect(() => {
    if (searchTerm !== '' || selectedRoleValue !== 'all') {
      dispatch(setCurrentPageNumber(1));
      loadRoles();
    }
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

    console.log('Loading roles with params:', params);
    dispatch(fetchRoles(params));
  };

  const handlePageChange = (page: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
      dispatch(setCurrentPageNumber(1));
    } else {
      dispatch(setCurrentPageNumber(page));
    }
    // loadRoles() kaldırıldı çünkü useEffect zaten tetiklenecek
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
      message.success(t('roles.roleDeletedSuccessfully') || 'Role deleted successfully!');
      loadRoles();
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.message || t('roles.errorDeletingRole') || 'Error deleting role';
      message.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setRoleToDelete(null);
    }
  };

  const handleStatusChange = async (roleId: string, currentStatus: boolean) => {
    try {
      await dispatch(changeRoleStatus({ roleId, status: !currentStatus })).unwrap();
      message.success(t('roles.roleStatusChangedSuccessfully') || 'Role status changed successfully!');
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.message || t('roles.errorChangingStatus') || 'Error changing role status';
      message.error(errorMessage);
    }
  };

  if (loading && roles.length === 0) {
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

        {/* Filters 
        <RoleFilters
          searchTerm={searchTerm}
          selectedRoleValue={selectedRoleValue}
          onSearchChange={setSearchTerm}
          onRoleValueChange={setSelectedRoleValue}
          onSearch={handleSearch}
        />
*/}
        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <div className="text-center text-red-600 dark:text-red-400">
              {error}
            </div>
          </Card>
        )}

        {/* Roles Table or Empty State */}
        {roles.length > 0 ? (
          <>
            <RoleTable
              roles={roles}
              loading={loading}
              onView={handleViewRole}
              onEdit={handleEditRole}
              onDelete={handleDeleteRole}
              onStatusChange={handleStatusChange}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <RolePagination
                current={currentPageNumber}
                total={totalPages * pageSize}
                pageSize={pageSize}
                onChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <Card>
            <RoleEmptyState onCreateRole={handleCreateRole} />
          </Card>
        )}
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