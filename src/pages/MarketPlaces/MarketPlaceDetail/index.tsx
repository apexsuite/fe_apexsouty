import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getMarketplaceById } from '@/services/marketplaces';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Key,
  MapPin,
  Pencil,
  Store,
  ToggleRight,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import CustomButton from '@/components/CustomButton';
import StatusBadge from '@/components/common/status-badge';
import { InfoSection } from '@/components/common/info-section';

const MarketPlaceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: marketplace, isLoading: isLoadingMarketplace } = useQuery({
    queryKey: ['marketplace', id],
    queryFn: () => getMarketplaceById(id!),
    enabled: !!id,
  });

  if (isLoadingMarketplace) {
    return <LoadingSpinner />;
  }

  if (!marketplace) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <Store className="text-muted-foreground h-16 w-16" />
          <h2 className="text-2xl font-semibold">Marketplace not found</h2>
          <Button onClick={() => navigate('/marketplaces')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplaces
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/marketplaces')}
            className="mt-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {marketplace.marketplace}
              </h1>
              <StatusBadge isActive={marketplace.isActive} />
            </div>
            <p className="text-muted-foreground text-sm">
              Marketplace Detail Information
            </p>
          </div>
        </div>
        <CustomButton
          icon={<Pencil className="h-4 w-4" />}
          label="Edit Marketplace"
          onClick={() => navigate(`/marketplaces/${id}/edit`)}
          variant="default"
        />
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InfoSection
          title="Marketplace Information"
          items={[
            {
              label: 'Marketplace Name',
              value: marketplace.marketplace,
              icon: <Store />,
            },
            {
              label: 'Marketplace URL',
              value: marketplace.marketplaceURL,
              icon: <ExternalLink />,
              type: 'link',
            },
            {
              label: 'Marketplace Key',
              value: marketplace.marketplaceKey,
              icon: <Key />,
              type: 'code',
            },
          ]}
        />
        <InfoSection
          title="Region Information"
          items={[
            {
              label: 'Region Name',
              value: marketplace?.region?.regionName || '-',
              icon: <MapPin />,
            },
            {
              label: 'Region URL',
              value: marketplace?.region?.regionURL || '-',
              icon: <ExternalLink />,
            },
            {
              label: 'Region Status',
              value: <StatusBadge isActive={marketplace?.region?.isActive} />,
              icon: <ToggleRight />,
            },
          ]}
        />
      </div>
      <InfoSection
        title="System Information"
        icon={<Calendar />}
        layout="grid"
        items={[
          {
            label: 'Created Date',
            value: formatDate(marketplace.createdAt) || '-',
            icon: <Calendar />,
          },
          {
            label: 'Marketplace ID',
            value: marketplace.id || '-',
            type: 'code',
            icon: <Key />,
          },
          {
            label: 'Region ID',
            value: marketplace.regionId || '-',
            type: 'code',
            icon: <MapPin />,
          },
        ]}
      />
    </div>
  );
};

export default MarketPlaceDetail;
