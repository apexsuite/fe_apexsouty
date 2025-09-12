import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal, Typography, Button, theme } from 'antd';
import { AlertTriangle } from 'lucide-react';
import { RootState } from '@/lib/store';

const { Text, Paragraph } = Typography;

interface ProductDeleteModalProps {
  visible: boolean;
  product: { id: string; name: string } | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({
  visible,
  product,
  onConfirm,
  onCancel,
  loading,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { theme: currentTheme } = useSelector((state: RootState) => state.theme);

  if (!product) return null;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={20} />
          <span style={{ color: currentTheme === 'dark' ? '#ffffff' : token.colorText }}>{t('product.deleteModal.title')}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button 
          key="cancel" 
          onClick={onCancel}
          style={{
            backgroundColor: currentTheme === 'dark' ? '#262626' : token.colorBgContainer,
            borderColor: token.colorBorder,
            color: token.colorText
          }}
        >
          {t('common.cancel')}
        </Button>,
        <Button 
          key="delete" 
          danger 
          onClick={onConfirm}
          loading={loading}
          style={{
            backgroundColor: currentTheme === 'dark' ? '#ff4d4f' : undefined,
            borderColor: currentTheme === 'dark' ? '#ff4d4f' : undefined,
            color: currentTheme === 'dark' ? '#ffffff' : undefined
          }}
        >
          {t('common.delete')}
        </Button>
      ]}
      centered
      styles={{
        content: {
          backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgElevated,
          borderColor: token.colorBorder
        },
        header: {
          backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgElevated,
          borderColor: token.colorBorder
        },
        body: {
          backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgElevated
        },
        footer: {
          backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : token.colorBgElevated,
          borderColor: token.colorBorder
        }
      }}
    >
      <div className="py-4">
        <Paragraph style={{ color: token.colorText }} className="mb-4">
          {t('product.deleteModal.description')}
        </Paragraph>
        <div style={{ 
          backgroundColor: currentTheme === 'dark' ? '#262626' : token.colorBgLayout, 
          padding: '16px', 
          borderRadius: '8px' 
        }}>
          <Text strong style={{ color: token.colorText }}>
            {product.name}
          </Text>
        </div>
        <Paragraph style={{ color: token.colorTextSecondary }} className="mt-4 text-sm">
          {t('product.deleteModal.warning')}
        </Paragraph>
      </div>
    </Modal>
  );
};

export default ProductDeleteModal; 