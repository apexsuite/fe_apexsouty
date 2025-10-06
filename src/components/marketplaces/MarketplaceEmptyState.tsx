import React from 'react';
import { useTranslation } from 'react-i18next';
import { Empty, Button, theme } from 'antd';
import { Store, Plus } from 'lucide-react';

interface MarketplaceEmptyStateProps {
  onCreateMarketplace: () => void;
}

const MarketplaceEmptyState: React.FC<MarketplaceEmptyStateProps> = ({ onCreateMarketplace }) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <Empty
        image={<Store size={64} style={{ color: token.colorTextQuaternary }} />}
        description={
          <div className="text-center">
            <h3 style={{ color: token.colorText, fontWeight: 500 }} className="text-lg mb-2">
              {t('marketplace.emptyState.title')}
            </h3>
            <p style={{ color: token.colorTextSecondary }} className="mb-6 max-w-md">
              {t('marketplace.emptyState.description')}
            </p>
            <Button
              type="primary"
              size="large"
              icon={<Plus size={16} />}
              onClick={onCreateMarketplace}
            >
              {t('marketplace.create')}
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default MarketplaceEmptyState;
