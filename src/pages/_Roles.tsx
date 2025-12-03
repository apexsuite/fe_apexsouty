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
  setPageSize,
} from '@/lib/roleSlice';
import { Plus, Search, Filter, X } from 'lucide-react';
import { Card, Pagination, Select, Button } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';
import PermissionGuard from '@/components/PermissionGuard';

import RoleTable from '@/components/roles/RoleTable';
import RoleEmptyState from '@/components/roles/RoleEmptyState';
import RoleDeleteModal from '@/components/roles/RoleDeleteModal';
import { useTheme } from '@/providers/theme';

const Roles: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    roles,
    loading,
    totalPages,
    totalCount,
    currentPageNumber,
    pageSize,
  } = useSelector((state: RootState) => state.role);
  const { theme: currentTheme } = useTheme();
  const { handleError, showSuccess } = useErrorHandler();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    isDefault: undefined as boolean | undefined,
    isActive: undefined as boolean | undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoleValue] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    loadRoles();
  }, [
    currentPageNumber,
    pageSize,
    searchTerm,
    filters.name,
    filters.isDefault,
    filters.isActive,
  ]);

  useEffect(() => {
    if (searchTerm !== '' || selectedRoleValue !== 'all') {
      dispatch(setCurrentPageNumber(1));
    }
  }, [searchTerm, selectedRoleValue]);

  useEffect(() => {
    const hasActiveFilters =
      (filters.name && filters.name !== '') ||
      filters.isDefault !== undefined ||
      filters.isActive !== undefined;

    if (hasActiveFilters) {
      dispatch(setCurrentPageNumber(1));
    }
  }, [filters.name, filters.isDefault, filters.isActive]);

  const loadRoles = () => {
    const params: any = {
      page: currentPageNumber,
      pageSize: pageSize,
    };

    if (searchTerm && searchTerm.trim() !== '') {
      params.name = searchTerm.trim();
    }

    if (filters.name && filters.name.trim() !== '') {
      params.name = filters.name.trim();
    }
    if (filters.isDefault !== undefined) {
      params.isDefault = filters.isDefault;
    }
    if (filters.isActive !== undefined) {
      params.isActive = filters.isActive;
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
      await dispatch(
        changeRoleStatus({ roleId, status: !currentStatus })
      ).unwrap();
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

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      isDefault: undefined,
      isActive: undefined,
    });
    dispatch(setCurrentPageNumber(1));
  };

  return (
    <div
      style={{
        padding: '1.5rem',
        minHeight: '100vh',
        backgroundColor: currentTheme === 'dark' ? '#111827' : '#f9fafb',
        color: currentTheme === 'dark' ? '#ffffff' : '#111827',
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 'bold',
                  color: currentTheme === 'dark' ? '#ffffff' : '#111827',
                }}
              >
                {t('roles.roles') || 'Roles'}
              </h1>
              <p
                style={{
                  marginTop: '0.5rem',
                  color: currentTheme === 'dark' ? '#d1d5db' : '#4b5563',
                }}
              >
                {t('roles.manageRoles') || 'Manage user roles and permissions'}
              </p>
            </div>
            <PermissionGuard permission="create-role" mode="hide">
              <button
                onClick={handleCreateRole}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                <Plus size={20} />
                {t('roles.createRole') || 'Create Role'}
              </button>
            </PermissionGuard>
          </div>
        </div>

        <Card
          style={{
            backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
            marginBottom: '1.5rem',
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('roles.searchPlaceholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={`w-full rounded-lg border py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                      currentTheme === 'dark'
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                    style={{
                      backgroundColor:
                        currentTheme === 'dark' ? '#374151' : '#ffffff',
                      borderColor:
                        currentTheme === 'dark' ? '#4b5563' : '#d1d5db',
                      color: currentTheme === 'dark' ? '#ffffff' : '#111827',
                    }}
                  />
                  <Search
                    className={`absolute top-1/2 left-3 -translate-y-1/2 transform ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}
                    size={20}
                  />
                </div>
              </div>

              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 ${
                  Object.values(filters).some(
                    value => value !== '' && value !== undefined
                  )
                    ? 'bg-blue-600 text-white'
                    : currentTheme === 'dark'
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                }`}
                style={{
                  backgroundColor: Object.values(filters).some(
                    value => value !== '' && value !== undefined
                  )
                    ? '#2563eb'
                    : currentTheme === 'dark'
                      ? '#374151'
                      : '#f3f4f6',
                  borderColor: currentTheme === 'dark' ? '#4b5563' : '#d1d5db',
                  color: Object.values(filters).some(
                    value => value !== '' && value !== undefined
                  )
                    ? '#ffffff'
                    : currentTheme === 'dark'
                      ? '#d1d5db'
                      : '#374151',
                }}
              >
                <Filter size={16} />
                {t('roles.filters') || 'Filters'}
                {Object.values(filters).some(
                  value => value !== '' && value !== undefined
                ) && (
                  <span className="ml-1 rounded-full bg-white px-1.5 py-0.5 text-xs text-blue-600">
                    {
                      Object.values(filters).filter(
                        value => value !== '' && value !== undefined
                      ).length
                    }
                  </span>
                )}
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 gap-4 border-t border-gray-200 p-4 md:grid-cols-3 dark:border-gray-700">
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('roles.name') || 'Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={t('roles.enterName') || 'Enter name'}
                    value={filters.name}
                    onChange={e => handleFilterChange('name', e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                      currentTheme === 'dark'
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('roles.isDefault') || 'Is Default'}
                  </label>
                  <Select
                    placeholder={t('roles.selectIsDefault') || 'Select default'}
                    value={filters.isDefault}
                    onChange={value => handleFilterChange('isDefault', value)}
                    className="w-full"
                    suffixIcon={null}
                    showSearch={false}
                    options={[
                      { label: t('common.all') || 'All', value: undefined },
                      { label: t('common.yes') || 'Yes', value: true },
                      { label: t('common.no') || 'No', value: false },
                    ]}
                  />
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('common.status') || 'Status'}
                  </label>
                  <Select
                    placeholder={t('roles.selectStatus') || 'Select status'}
                    value={filters.isActive}
                    onChange={value => handleFilterChange('isActive', value)}
                    className="w-full"
                    suffixIcon={null}
                    showSearch={false}
                    options={[
                      { label: t('common.all') || 'All', value: undefined },
                      { label: t('common.active') || 'Active', value: true },
                      {
                        label: t('common.inactive') || 'Inactive',
                        value: false,
                      },
                    ]}
                  />
                </div>

                <div className="flex justify-end gap-2 md:col-span-3">
                  <Button
                    onClick={clearFilters}
                    className="flex items-center gap-2"
                    style={{
                      backgroundColor:
                        currentTheme === 'dark' ? '#374151' : '#f3f4f6',
                      borderColor:
                        currentTheme === 'dark' ? '#4b5563' : '#d1d5db',
                      color: currentTheme === 'dark' ? '#d1d5db' : '#374151',
                    }}
                  >
                    <X size={16} />
                    {t('common.clearFilters') || 'Clear Filters'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Roles Table or Empty State */}
        <div
          style={{
            backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
            border: `1px solid ${currentTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {roles.length === 0 && !loading ? (
            <RoleEmptyState onCreateRole={handleCreateRole} />
          ) : (
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
          )}
        </div>

        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'right',
            padding: '16px',
            backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
            border: `1px solid ${currentTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
          }}
        >
          <Pagination
            current={currentPageNumber}
            total={totalPages * pageSize}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => (
              <span
                style={{
                  color: currentTheme === 'dark' ? '#d1d5db' : '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {`${range[0]}-${range[1]} of ${totalCount || total} items`}
              </span>
            )}
            onChange={(page, size) => {
              handlePageChange(page, size);
            }}
            onShowSizeChange={(_current, size) => {
              handlePageSizeChange(size);
            }}
            style={{
              color: 'var(--ant-color-text)',
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
