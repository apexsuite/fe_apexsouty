import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/lib/store';
import { 
  fetchProducts, 
  deleteProduct, 
  changeProductStatus, 
  clearError,
  setCurrentPageNumber,
  setPageSize
} from '@/lib/productSlice';
import { Plus, Search } from 'lucide-react';
import { message, Card, Typography, Button, theme, Pagination } from 'antd';

// Import components
import ProductTable from '@/components/products/ProductTable';
import ProductDeleteModal from '@/components/products/ProductDeleteModal';

const { Title, Paragraph } = Typography;


const Products: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = theme.useToken();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);
  const { products, loading, error, currentPageNumber, pageSize, totalPages, totalCount } = useSelector((state: RootState) => state.product);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const loadProducts = () => {
    const params: any = {
      page: currentPageNumber || 1,
      pageSize: pageSize || 10,
    };

    if (searchTerm && searchTerm.trim() !== '') {
      params.name = searchTerm.trim();
    }

    dispatch(fetchProducts(params));
  };

  useEffect(() => {
    dispatch(clearError());
    loadProducts();
  }, [currentPageNumber, pageSize]);

  useEffect(() => {
    if (searchTerm !== '') {
      dispatch(setCurrentPageNumber(1));
    }
    loadProducts();
  }, [searchTerm]);

  const handlePageChange = (page: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
      dispatch(setCurrentPageNumber(1));
    } else {
      dispatch(setCurrentPageNumber(page));
    }
  };

  const handleCreateProduct = () => {
    navigate('/products/create');
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/products/${productId}/edit`);
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    setProductToDelete({ id: productId, name: productName });
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteProduct(productToDelete.id)).unwrap();
      message.success(t('product.deleteSuccess'));
      setShowDeleteModal(false);
      setProductToDelete(null);
      loadProducts();
    } catch (error: any) {
      message.error(error.message || t('product.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (productId: string) => {
    try {
      await dispatch(changeProductStatus(productId)).unwrap();
      message.success(t('product.statusChangeSuccess'));
      loadProducts();
    } catch (error: any) {
      message.error(error.message || t('product.statusChangeError'));
    }
  };


  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPageNumber(1));
  };



  if (error) {
    message.error(error);
  }

  return (
    <div 
      style={{
        padding: '1.5rem',
        minHeight: '100vh',
        backgroundColor: currentTheme === 'dark' ? '#111827' : '#f9fafb',
        color: currentTheme === 'dark' ? '#ffffff' : '#111827'
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
                  color: currentTheme === 'dark' ? '#ffffff' : '#111827'
                }}
              >
                {t('product.title')}
              </h1>
              <p 
                style={{ 
                  marginTop: '0.5rem',
                  color: currentTheme === 'dark' ? '#d1d5db' : '#4b5563'
                }}
              >
                {t('product.description')}
              </p>
            </div>
            <button
              onClick={handleCreateProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              {t('product.create')}
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card
          style={{
            backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
            marginBottom: '1.5rem'
          }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    currentTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  style={{
                    backgroundColor: currentTheme === 'dark' ? '#374151' : '#ffffff',
                    borderColor: currentTheme === 'dark' ? '#4b5563' : '#d1d5db',
                    color: currentTheme === 'dark' ? '#ffffff' : '#111827'
                  }}
                />
                <Search 
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} 
                  size={20} 
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 rounded-lg p-4 transition-colors duration-200 ${
            currentTheme === 'dark' 
              ? 'bg-red-900/20 border border-red-800' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`transition-colors duration-200 ${currentTheme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>{error}</p>
          </div>
        )}

        {/* Products Table */}
        <div style={{ 
          backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
          border: `1px solid ${currentTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <ProductTable
            products={products}
            loading={loading}
            onEdit={handleEditProduct}
            onView={handleViewProduct}
            onDelete={handleDeleteProduct}
            onStatusChange={handleStatusChange}
          />
        </div>

        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'right',
          padding: '16px',
          backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
          border: `1px solid ${currentTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
          borderRadius: '8px'
        }}>
          <Pagination
            current={currentPageNumber}
            total={totalPages * pageSize}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => (
              <span style={{ 
                color: currentTheme === 'dark' ? '#d1d5db' : '#374151',
                fontSize: '14px',
                fontWeight: '500'
              }}>
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
              color: currentTheme === 'dark' ? '#f9fafb' : '#111827'
            }}
          />
        </div>

        <ProductDeleteModal
          visible={showDeleteModal}
          product={productToDelete}
          onConfirm={confirmDeleteProduct}
          onCancel={() => {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }}
          loading={isDeleting}
        />
      </div>
    </div>
  );
};

export default Products; 