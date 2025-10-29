import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { ExternalLink } from 'lucide-react';
import { Button, Tag, Table, Space, Card, Pagination, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PermissionGuard from '@/components/PermissionGuard';

interface Consent {
  id: string;
  marketplace: string;
  marketplaceURL: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface ConsentTableProps {
  consents: Consent[];
  loading: boolean;
  onAuthorize: (consentId: string) => void;
}

const ConsentTable: React.FC<ConsentTableProps> = ({
  consents,
  loading,
  onAuthorize,
}) => {
  const { t } = useTranslation();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredConsents = useMemo(() => consents, [consents]);

  const paginatedConsents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredConsents.slice(startIndex, endIndex);
  }, [filteredConsents, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [consents]);

  const columns: ColumnsType<Consent> = [
    {
      title: t('consents.name'),
      dataIndex: 'marketplace',
      key: 'marketplace',
      render: (text: string) => (
        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {text}
        </span>
      ),
    },
    {
      title: t('consents.website'),
      dataIndex: 'marketplaceURL',
      key: 'marketplaceURL',
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} truncate`}>
            {text}
          </span>
          <Tooltip title="Open URL">
            <Button
              type="text"
              size="small"
              icon={<ExternalLink size={14} />}
              onClick={() => window.open(text, '_blank')}
              className="flex-shrink-0"
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: t('consents.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: t('consents.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <PermissionGuard permission="get-consent-link" mode="hide">
            <Tooltip title={t('consents.authorize')}>
              <Button
                type="primary"
                size="small"
                onClick={() => onAuthorize(record.id)}
              >
                {t('consents.authorize')}
              </Button>
            </Tooltip>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  // Mobile Card Component
  const ConsentCard: React.FC<{ consent: Consent }> = ({ consent }) => {
    return (
      <Card
        style={{ 
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          borderRadius: '6px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          marginBottom: '8px'
        }}
        bodyStyle={{ padding: '12px 16px' }}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-medium truncate"
                style={{ color: theme === 'dark' ? '#ffffff' : '#111827', fontSize: '14px' }}
              >
                {consent.marketplace}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span 
                  className="text-xs truncate flex-1"
                  style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                >
                  {consent.marketplaceURL}
                </span>
                <Button
                  type="text"
                  size="small"
                  icon={<ExternalLink size={12} />}
                  onClick={() => window.open(consent.marketplaceURL, '_blank')}
                  className="flex-shrink-0 p-1"
                />
              </div>
            </div>
            <Tag 
              color={consent.isActive ? 'green' : 'red'}
              style={{ fontSize: '10px', padding: '0 6px', lineHeight: '18px' }}
            >
              {consent.isActive ? 'Active' : 'Inactive'}
            </Tag>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t" style={{ borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}>
            <PermissionGuard permission="authorize-consent" mode="hide">
              <Button
                type="primary"
                size="small"
                onClick={() => onAuthorize(consent.id)}
                className="flex-1"
              >
                {t('consents.authorize')}
              </Button>
            </PermissionGuard>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table View - Hidden on Mobile */}
      <div className={`hidden md:block ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <Table
          columns={columns}
          dataSource={paginatedConsents}
          rowKey="id"
          pagination={false}
          loading={loading}
          className={`${theme === 'dark' ? 'dark-table' : ''}`}
          style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          }}
          locale={{
            emptyText: (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>{t('consents.emptyState.title')}</p>
                <p className="text-sm">{t('consents.emptyState.description')}</p>
              </div>
            )
          }}
        />
      </div>

      {/* Desktop Pagination */}
      {filteredConsents.length > 0 && (
        <div className="hidden md:flex justify-center">
          <Pagination
            current={currentPage}
            total={filteredConsents.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            className={theme === 'dark' ? 'dark-pagination' : ''}
          />
        </div>
      )}

      {/* Mobile Card View - Hidden on Desktop */}
      <div className="block md:hidden space-y-3">
        {paginatedConsents.length === 0 ? (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-8 text-center`}>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              {t('consents.emptyState.title')}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('consents.emptyState.description')}
            </p>
          </div>
        ) : (
          paginatedConsents.map((consent) => (
            <ConsentCard key={consent.id} consent={consent} />
          ))
        )}
      </div>

      {/* Mobile Pagination */}
      {filteredConsents.length > 0 && (
        <div className="flex md:hidden justify-center">
          <Pagination
            current={currentPage}
            total={filteredConsents.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            simple
            className={theme === 'dark' ? 'dark-pagination' : ''}
          />
        </div>
      )}
    </div>
  );
};

export default ConsentTable;
