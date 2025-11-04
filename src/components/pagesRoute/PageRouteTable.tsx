import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Card, Switch, theme, Tooltip } from 'antd';
import { Edit, Eye, Trash2, ChevronDown, ChevronUp, FolderOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { PageRoute } from '@/lib/pageSlice';
import PermissionGuard from '@/components/PermissionGuard';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '@/providers/theme';

// Function to get Lucide icon dynamically
const getLucideIcon = (iconName: string) => {
  if (!iconName) return LucideIcons.Circle;

  const pascalCaseName = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const IconComponent = (LucideIcons as any)[pascalCaseName];
  return IconComponent || LucideIcons.Circle;
};

interface PageRouteTableProps {
  pageRoutes: PageRoute[];
  loading: boolean;
  statusChangeLoading: boolean;
  onView: (pageId: string) => void;
  onEdit: (pageId: string) => void;
  onStatusChange: (pageRouteId: string, currentStatus: boolean) => void;
  onDelete: (pageId: string) => void;
}

const PageRouteTable: React.FC<PageRouteTableProps> = ({
  pageRoutes,
  loading,
  statusChangeLoading,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { theme: currentTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPageRoute, setSelectedPageRoute] = useState<PageRoute | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDeleteClick = (pageRoute: PageRoute) => {
    setSelectedPageRoute(pageRoute);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPageRoute) return;

    setIsDeleting(true);
    try {
      await onDelete(selectedPageRoute.id);
      setShowDeleteModal(false);
      setSelectedPageRoute(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedPageRoute(null);
  };

  const columns: ColumnsType<PageRoute> = [
    {
      title: t('pages.table.name'),
      key: 'name',
      dataIndex: 'name',
      render: (name: string) => (
        <span style={{
          color: currentTheme === 'dark' ? '#ffffff' : token.colorText,
          fontWeight: 500
        }}>
          {name}
        </span>
      ),
    },
    {
      title: t('pages.table.component'),
      key: 'component',
      dataIndex: 'component',
      render: (component: string) => (
        <span style={{
          color: currentTheme === 'dark' ? '#ffffff' : token.colorText,
          fontWeight: 500
        }}>
          {component}
        </span>
      ),
    },
    {
      title: t('pages.table.path'),
      key: 'path',
      dataIndex: 'path',
      render: (path: string) => (
        <Tag color="blue" style={{ fontFamily: 'monospace' }}>
          {path}
        </Tag>
      ),
    },
    {
      title: t('pages.table.icon'),
      key: 'icon',
      dataIndex: 'icon',
      render: (icon: string) => {
        const IconComponent = getLucideIcon(icon);
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComponent size={20} style={{ color: '#1890ff' }} />
          </div>
        );
      },
    },
    {
      title: t('pages.table.status'),
      key: 'status',
      dataIndex: 'is_active',
      render: (isActive: boolean, record: PageRoute) => (
        <div className="flex items-center gap-2">
          <PermissionGuard
            permission="change-page-route-status"
            mode="disable"
          >
            <Switch
              checked={isActive}
              onChange={(checked) => onStatusChange(record.id, !checked)}
              loading={statusChangeLoading}
              className={`custom-switch ${currentTheme === 'dark' ? 'dark-switch' : ''}`}
            />
          </PermissionGuard>
          <Tag color={isActive ? 'success' : 'default'}>
            {isActive ? t('common.active') : t('common.inactive')}
          </Tag>
        </div>
      ),
    },
    {
      title: t('pages.table.visible'),
      key: 'visible',
      dataIndex: 'is_visible',
      render: (isVisible: boolean) => (
        <Tag color={isVisible ? 'green' : 'red'}>
          {isVisible ? t('common.visible') : t('common.hidden')}
        </Tag>
      ),
    },
    {
      title: t('pages.table.permissions'),
      key: 'permissionCount',
      dataIndex: 'permissionCount',
      render: (count: number) => (
        <Tag color="purple">
          {count || 0}
        </Tag>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record: PageRoute) => (
        <Space size="small">
          <PermissionGuard
            permission="get-page-route"
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
            permission="update-page-route"
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

          <PermissionGuard
            permission="delete-page-route"
            mode="hide"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                size="small"
                danger
                icon={<Trash2 size={16} />}
                onClick={() => handleDeleteClick(record)}
                style={{ color: currentTheme === 'dark' ? '#ef4444' : '#dc2626' }}
              />
            </Tooltip>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  // Mobile Card Component
  const PageRouteCard: React.FC<{ pageRoute: PageRoute }> = ({ pageRoute }) => {
    const isExpanded = openCard === pageRoute.id;
    const IconComponent = getLucideIcon(pageRoute.icon);

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
        onClick={() => setOpenCard(isExpanded ? null : pageRoute.id)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <IconComponent
                size={14}
                className={currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
              />
              <h3
                className="font-medium text-sm truncate flex-1"
                style={{ color: currentTheme === 'dark' ? '#ffffff' : '#111827' }}
              >
                {pageRoute.name}
              </h3>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs"
                style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}
              >
                Status:
              </span>
              <PermissionGuard
                permission="change-page-route-status"
                mode="disable"
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={pageRoute.is_active}
                    onChange={(checked) => onStatusChange(pageRoute.id, !checked)}
                    size="small"
                  />
                </div>
              </PermissionGuard>
              <Tag
                color={pageRoute.is_active ? 'success' : 'default'}
                style={{ fontSize: '10px' }}
              >
                {pageRoute.is_active ? 'Active' : 'Inactive'}
              </Tag>
            </div>

            <div className="flex items-center gap-1 mb-1">
              <FolderOpen size={12} className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              <span
                className="text-xs truncate flex-1"
                style={{ color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280' }}
              >
                {pageRoute.component}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <Tag
                color="blue"
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  marginRight: 0
                }}
              >
                {pageRoute.path}
              </Tag>
              <Tag
                color={pageRoute.is_visible ? 'green' : 'red'}
                style={{ fontSize: '10px' }}
              >
                {pageRoute.is_visible ? 'Visible' : 'Hidden'}
              </Tag>
              <Tag
                color="purple"
                style={{ fontSize: '10px' }}
              >
                {pageRoute.permissionCount || 0} perms
              </Tag>
            </div>
          </div>

          <Button
            type="text"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpenCard(isExpanded ? null : pageRoute.id);
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
                permission="get-page-route"
                mode="hide"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<Eye size={12} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(pageRoute.id);
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
                permission="update-page-route"
                mode="hide"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<Edit size={12} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(pageRoute.id);
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

              <PermissionGuard
                permission="delete-page-route"
                mode="hide"
              >
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<Trash2 size={12} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(pageRoute);
                  }}
                  style={{
                    color: currentTheme === 'dark' ? '#ef4444' : '#dc2626',
                    fontSize: '11px',
                    height: '24px',
                    padding: '0 6px'
                  }}
                >
                  Delete
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
      <>
        <div className="space-y-2 px-1">
          {pageRoutes.map((pageRoute) => (
            <PageRouteCard key={pageRoute.id} pageRoute={pageRoute} />
          ))}
          {loading && (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {showDeleteModal && selectedPageRoute && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${currentTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}>
              <h3 className={`text-lg font-semibold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t('pages.deletePage')}
              </h3>
              <p className={`mb-6 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('pages.deleteConfirmMessage', { title: selectedPageRoute.name })}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 ${currentTheme === 'dark'
                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  disabled={isDeleting}
                >
                  {t('pages.cancel')}
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? t('pages.saving') : t('pages.delete')}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={pageRoutes}
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

      {/* Delete Modal */}
      {showDeleteModal && selectedPageRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${currentTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
            <h3 className={`text-lg font-semibold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('pages.deletePage')}
            </h3>
            <p className={`mb-6 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('pages.deleteConfirmMessage', { title: selectedPageRoute.name })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className={`flex-1 px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 ${currentTheme === 'dark'
                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                disabled={isDeleting}
              >
                {t('pages.cancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? t('pages.saving') : t('pages.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageRouteTable;

