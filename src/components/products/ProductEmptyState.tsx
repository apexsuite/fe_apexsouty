import React from 'react';
import { useTranslation } from 'react-i18next';
import { Empty, Button, theme } from 'antd';
import { Package, Plus } from 'lucide-react';

interface ProductEmptyStateProps {
  onCreateProduct: () => void;
}

const ProductEmptyState: React.FC<ProductEmptyStateProps> = ({ onCreateProduct }) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <Empty
        image={<Package size={64} style={{ color: token.colorTextQuaternary }} />}
        description={
          <div className="text-center">
            <h3 style={{ color: token.colorText, fontWeight: 500 }} className="text-lg mb-2">
              {t('product.emptyState.title')}
            </h3>
            <p style={{ color: token.colorTextSecondary }} className="mb-6 max-w-md">
              {t('product.emptyState.description')}
            </p>
            <Button
              type="primary"
              size="large"
              icon={<Plus size={16} />}
              onClick={onCreateProduct}
            >
              {t('product.create')}
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default ProductEmptyState; 