import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination, Spin } from 'antd';

interface ProductPaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize?: number) => void;
  loading: boolean;
}

const ProductPagination: React.FC<ProductPaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  loading,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (total === 0) {
    return null;
  }

  return (
    <div className="flex justify-center items-center py-6">
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger
        showQuickJumper
        showTotal={(total, range) =>
          t('pagination.showing', {
            start: range[0],
            end: range[1],
            total: total,
          })
        }
        pageSizeOptions={['10', '20', '50', '100']}
        className="text-center"
      />
    </div>
  );
};

export default ProductPagination; 