import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPermissions } from '@/lib/pageRoutePermissionSlice';
import { createRolePermissions, deleteRolePermission } from '@/lib/roleSlice';
import { Trash2, Search, Check, Plus, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Tag, Modal, Input, Table, Space, Card, Pagination } from 'antd';
import { useErrorHandler } from '@/lib/useErrorHandler';
import type { ColumnsType } from 'antd/es/table';

interface RolePermissionTableProps {
  roleId: string;
  rolePermissions: any[];
  onRefresh?: () => void; // Parent component'ten refresh fonksiyonu
}

const RolePermissionTable: React.FC<RolePermissionTableProps> = ({
  roleId,
  rolePermissions,
  onRefresh,
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
  const [isAssigning, setIsAssigning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize local permissions when rolePermissions change
  useEffect(() => {
    setLocalPermissions(rolePermissions);
    setCurrentPage(1); // Reset to first page when permissions change
  }, [rolePermissions]);

  // Filter permissions based on search term
  const filteredPermissions = useMemo(() => {
    if (!searchTerm) return localPermissions;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return localPermissions.filter((rolePermission) => {
      const permission = rolePermission.permission;
      return (
        permission?.name?.toLowerCase().includes(lowerSearchTerm) ||
        permission?.description?.toLowerCase().includes(lowerSearchTerm) ||
        permission?.label?.toLowerCase().includes(lowerSearchTerm)
      );
    });
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

  const loadAllPermissions = async () => {
    try {
      const response = await dispatch(fetchPermissions({})).unwrap();
      const allPerms = response.data?.items || [];
      setAllPermissions(allPerms);
    } catch (error) {
      console.error('Failed to load all permissions:', error);
    }
  };

  const handleAssignPermissions = async () => {
    if (selectedPermissions.length === 0) {
      setShowPermissionModal(false);
      return;
    }

    setIsAssigning(true);
    try {
      // API'ye istek at
      await dispatch(createRolePermissions({
        roleId,
        permissionIdList: selectedPermissions
      })).unwrap();

      // Başarılı olursa parent component'ten role permissions'ı yeniden yükle
      if (onRefresh) {
        onRefresh();
      }
      
      showSuccess('permissionAssignedSuccessfully');
      setShowPermissionModal(false);
      setSelectedPermissions([]);
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignPermission = async (permissionId: string) => {
    try {
      const rolePermission = localPermissions.find(p => 
        p.permissionId === permissionId || 
        p.permission?.id === permissionId || 
        p.id === permissionId
      );
      
      if (rolePermission) {
        const rolePermissionId = rolePermission.rolePermissionID || rolePermission.id;
        
        if (rolePermissionId) {
          await dispatch(deleteRolePermission({
            roleId,
            rolePermissionId: rolePermissionId
          })).unwrap();
          
          if (onRefresh) {
            onRefresh();
          }
          
          showSuccess('permissionUnassignedSuccessfully');
        }
      }
    } catch (error: any) {
      handleError(error);
    }
  };

  const handlePermissionSelection = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
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

  const PermissionCard: React.FC<{ permission: any }> = ({ permission }) => {
    const isExpanded = openCard === permission.permissionId;
    
    return (
      <Card
        style={{ 
          cursor: 'pointer',
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          borderRadius: '6px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          marginBottom: '6px'
        }}
        bodyStyle={{ padding: '8px 10px' }}
        onClick={() => setOpenCard(isExpanded ? null : permission.permissionId)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield 
                size={12} 
                className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} 
              />
              <h3 
                className="font-medium truncate flex-1"
                style={{ color: theme === 'dark' ? '#ffffff' : '#111827', fontSize: '13px' }}
              >
                {permission.permission?.name}
              </h3>
              <Tag 
                color={permission.isActive ? 'green' : 'red'}
                style={{ fontSize: '10px', padding: '0 4px', lineHeight: '18px' }}
              >
                {permission.isActive ? 'Active' : 'Inactive'}
              </Tag>
            </div>
            
            {permission.permission?.description && (
              <div className="mb-1">
                <span 
                  className="line-clamp-1"
                  style={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280', fontSize: '11px' }}
                >
                  {permission.permission.description}
                </span>
              </div>
            )}
            
            {permission.permission?.label && (
              <div>
                <Tag color="blue" style={{ fontSize: '9px', padding: '0 4px', lineHeight: '16px' }}>
                  {permission.permission.label}
                </Tag>
              </div>
            )}
          </div>
          
          <Button 
            type="text" 
            size="small" 
            onClick={(e) => { 
              e.stopPropagation(); 
              setOpenCard(isExpanded ? null : permission.permissionId); 
            }}
            className="p-0 h-auto"
            style={{ minWidth: 'auto', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </Button>
        </div>

        {isExpanded && (
          <div 
            className="mt-2 pt-2 border-t"
            style={{ borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}
          >
            <div className="flex flex-wrap gap-1">
              <Button
                type="text"
                danger
                size="small"
                icon={<Trash2 size={10} />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnassignPermission(permission.permissionId || permission.permission?.id || permission.id);
                }}
                style={{ 
                  fontSize: '10px',
                  height: '22px',
                  padding: '0 6px'
                }}
              >
                Unassign
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-2 md:space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm md:text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('pages.permissions')}
          </h3>
          <Tag color="blue" style={{ fontSize: '10px', padding: '0 6px', lineHeight: '18px' }}>{localPermissions.length}</Tag>
        </div>
        <div className="w-full sm:w-72">
          <Input
            placeholder={t('permissions.searchPermissions') || 'Search by name, description or label...'}
            prefix={<Search size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            size="small"
            className={`${theme === 'dark' ? 'dark-input' : ''}`}
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
              color: theme === 'dark' ? '#ffffff' : '#111827'
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<Plus size={14} />}
            onClick={() => {
              setShowPermissionModal(true);
              setSelectedPermissions([]);
              setPermissionSearchTerm('');
              loadAllPermissions();
            }}
            loading={isAssigning}
            disabled={isAssigning}
            size="small"
            className="flex-1 md:flex-initial"
            style={{ fontSize: '12px', height: '28px', padding: '0 10px' }}
          >
            {isAssigning ? (t('pages.assigning') || 'Assigning...') : (t('pages.managePermissions') || 'Manage Permissions')}
          </Button>
        </div>
      </div>

    

      {isMobile ? (
        <>
          <div>
            {paginatedPermissions.length === 0 ? (
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-8 text-center`}>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  {searchTerm ? (t('permissions.noResultsFound') || 'No results found') : t('pages.noPermissionsAssigned')}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {searchTerm ? (t('permissions.tryDifferentSearch') || 'Try a different search term') : t('pages.createFirstPermission')}
                </p>
              </div>
            ) : (
              paginatedPermissions.map((permission) => (
                <PermissionCard key={permission.permissionId || permission.id} permission={permission} />
              ))
            )}
          </div>

          {filteredPermissions.length > 0 && (
            <div className="flex justify-center mt-3">
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
        </>
      ) : (
        <>
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} ${theme === 'dark' ? 'dark-modal' : ''}`}>
            <Table
              columns={columns}
              dataSource={paginatedPermissions}
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
                    <p>{searchTerm ? (t('permissions.noResultsFound') || 'No results found') : t('pages.noPermissionsAssigned')}</p>
                    <p className="text-sm">{searchTerm ? (t('permissions.tryDifferentSearch') || 'Try a different search term') : t('pages.createFirstPermission')}</p>
                  </div>
                )
              }}
            />
          </div>

          {filteredPermissions.length > 0 && (
            <div className="flex justify-center mt-4">
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
        </>
      )}

      <Modal
        title={t('pages.selectPermissionsToAssign')}
        open={showPermissionModal}
        onOk={handleAssignPermissions}
        confirmLoading={isAssigning}
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
