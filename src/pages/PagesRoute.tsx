import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState, store } from '@/lib/store';
import { fetchPageRoutes, setCurrentPageNumber, setPageSize, clearError } from '@/lib/pageSlice';

import { Eye, Edit, Plus } from 'lucide-react';
import { Table, Pagination, Button, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const PagesRoute: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { pageRoutes, loading, error, totalPages, currentPageNumber, pageSize } = useSelector(
    (state: RootState) => state.page
  );
  
  // Debug için pageRoutes'u logla
  console.log('PageRoutes in component:', pageRoutes);
  console.log('PageRoutes length:', pageRoutes?.length);
  const theme = useSelector((state: RootState) => state.theme.theme);
  
  // Debug için tema değerini logla ve force re-render için key kullan
  console.log('Current theme in PagesRoute:', theme);
  
  // Tema değişikliğini zorlamak için key kullan
  const themeKey = theme === 'light' ? 'light' : 'dark';
  
  // Tema değişikliğini dinle
  useEffect(() => {
    console.log('Theme changed to:', theme);
  }, [theme]);
  
  // Redux store'u kontrol et
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const currentTheme = store.getState().theme.theme;
      console.log('Store theme changed to:', currentTheme);
    });
    
    return () => unsubscribe();
  }, []);

  const [searchTerm] = useState('');
  const [selectedCategory] = useState('');

  useEffect(() => {
    dispatch(clearError());
    loadPages();
  }, [currentPageNumber, pageSize, searchTerm, selectedCategory]);

  const loadPages = () => {
    dispatch(fetchPageRoutes({
      page: currentPageNumber,
      limit: pageSize,
      search: searchTerm || undefined,
      category: selectedCategory || undefined,
    }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPageNumber(page));
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPageNumber(1));
  };

  const handleViewPage = (pageId: string) => {
    navigate(`/page-routes/${pageId}`);
  };

  const handleEditPage = (pageId: string) => {
    navigate(`/page-routes/${pageId}/edit`);
  };

  const handleCreatePage = () => {
    navigate('/page-routes/create');
  };



  const columns: ColumnsType<any> = [
    {
      title: 'Component',
      key: 'component',
      dataIndex: 'component',
      render: (component: string, record: any) => (
        <Space>
          <span style={{ fontSize: '16px' }}>{record.icon}</span>
          <span style={{ fontWeight: 500 }}>{component}</span>
        </Space>
      ),
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      render: (name: string) => (
        <span style={{ fontWeight: 500 }}>{name}</span>
      ),
    },
    {
      title: 'Path',
      key: 'path',
      dataIndex: 'path',
      render: (path: string) => (
        <Tag color="blue" style={{ fontFamily: 'monospace' }}>
          {path}
        </Tag>
      ),
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
      render: (description: string) => (
        <div style={{ maxWidth: '300px' }} title={description}>
          {description}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: any) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<Eye size={14} />}
            onClick={() => handleViewPage(record.id)}
            style={{
              backgroundColor: theme === 'dark' ? '#1890ff' : '#1890ff',
              borderColor: theme === 'dark' ? '#1890ff' : '#1890ff',
              color: '#ffffff'
            }}
          >
            View
          </Button>
          <Button 
            size="small" 
            icon={<Edit size={14} />}
            onClick={() => handleEditPage(record.id)}
            style={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
              color: theme === 'dark' ? '#ffffff' : '#374151',
              display: 'inline-block',
              visibility: 'visible',
              opacity: 1
            }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  if (loading && pageRoutes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div 
      key={themeKey}
      style={{
        padding: '1.5rem',
        minHeight: '100vh',
        backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
        color: theme === 'dark' ? '#ffffff' : '#111827'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 
                style={{ 
                  fontSize: '1.875rem',
                  fontWeight: 'bold',
                  color: theme === 'dark' ? '#ffffff' : '#111827'
                }}
              >
                {t('pages.title')}
              </h1>
              <p 
                style={{ 
                  marginTop: '0.5rem',
                  color: theme === 'dark' ? '#d1d5db' : '#4b5563'
                }}
              >
                {t('pages.subtitle')}
              </p>
            </div>
            <button
              onClick={handleCreatePage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              {t('pages.newPage')}
            </button>
          </div>

      
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 rounded-lg p-4 transition-colors duration-200 ${
            theme === 'dark' 
              ? 'bg-red-900/20 border border-red-800' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`transition-colors duration-200 ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>{error}</p>
          </div>
        )}

        {/* Ant Design Table */}
        <div style={{ 
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <Table
            columns={columns}
            dataSource={pageRoutes}
            rowKey="id"
            loading={loading}
            pagination={false}
            size="middle"
            style={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            }}
            className={theme === 'dark' ? 'dark-table' : ''}
          />
        </div>

        {/* Ant Design Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            marginTop: '16px', 
            display: 'flex', 
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px'
          }}>
            <Pagination
              current={currentPageNumber}
              total={totalPages * pageSize}
              pageSize={pageSize}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              onChange={(page, size) => {
                handlePageChange(page);
                if (size !== pageSize) {
                  handlePageSizeChange(size);
                }
              }}
              onShowSizeChange={(_current, size) => {
                handlePageSizeChange(size);
              }}
            />
          </div>
        )}

     

      </div>
    </div>
  );
};

export default PagesRoute; 