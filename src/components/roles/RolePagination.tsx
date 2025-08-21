import React from 'react';
import { Pagination, Card } from 'antd';
import { useTranslation } from 'react-i18next';

interface RolePaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize?: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
}

const RolePagination: React.FC<RolePaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  showSizeChanger = true,
  showQuickJumper = true,
  showTotal = true,
}) => {
  const { t } = useTranslation();

  const itemRender = (_page: number, type: string, element: React.ReactNode) => {
    if (type === 'prev') {
      return <span className="text-gray-700 dark:text-gray-300">{t('roles.previous') || 'Previous'}</span>;
    }
    if (type === 'next') {
      return <span className="text-gray-700 dark:text-gray-300">{t('roles.next') || 'Next'}</span>;
    }
    return element;
  };

  const showTotalText = (total: number, range: [number, number]) => {
    return t('roles.showing') + ' ' + range[0] + '-' + range[1] + ' ' + t('roles.of') + ' ' + total + ' ' + t('roles.results');
  };

  return (
    <Card 
      className="mt-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      bodyStyle={{ padding: '24px' }}
    >
      <div className="flex justify-center">
        <Pagination
          current={current}
          total={total}
          pageSize={pageSize}
          onChange={onChange}
          showSizeChanger={showSizeChanger}
          showQuickJumper={showQuickJumper}
          showTotal={showTotal ? showTotalText : undefined}
          itemRender={itemRender}
          size="default"
          className="text-center dark:text-gray-300"
        />
      </div>
    </Card>
  );
};

export default RolePagination; 