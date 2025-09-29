import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Marketplace } from '@/lib/marketplaceSlice';

const { Text } = Typography;

interface MarketplaceDeleteModalProps {
  visible: boolean;
  marketplace: { id: string; name: string } | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const MarketplaceDeleteModal: React.FC<MarketplaceDeleteModalProps> = ({
  visible,
  marketplace,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-red-500" />
          <span>{t('marketplace.deleteTitle')}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          {t('common.cancel')}
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          onClick={onConfirm}
          loading={loading}
        >
          {t('common.delete')}
        </Button>,
      ]}
      centered
    >
      <div className="py-4">
        <Text>
          {t('marketplace.deleteConfirm', { name: marketplace?.name })}
        </Text>
      </div>
    </Modal>
  );
};

export default MarketplaceDeleteModal;
