import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getVendor } from '@/services/vendor';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Calendar, Factory, FileText, ToggleRight } from 'lucide-react';
import { VendorFileCard } from './VendorFileCard';
import { InfoSection } from '@/components/common/info-section';
import { formatDate } from '@/lib/utils';
import StatusBadge, {
  type StatusVariant,
} from '@/components/common/status-badge';
import { TAGS } from '@/utils/constants/tags';
import Empty from '@/components/common/empty';
import { DetailPage } from '@/components/CustomPageLayout/detail-page';

const VendorDetail = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: vendor,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [TAGS.VENDOR, id],
    queryFn: () => getVendor(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Vendor bulunamadı</p>
        <Link to="/vendors">
          <Button variant="link">Vendor listesine dön</Button>
        </Link>
      </div>
    );
  }

  return (
    <DetailPage
      name={vendor.name}
      description={vendor.description}
      edit={{
        label: 'Edit Vendor',
        path: `/vendors/${id}/edit`,
      }}
    >
      <InfoSection
        title="Vendor Information"
        layout="grid"
        icon={<Factory />}
        items={[
          {
            label: 'Created At',
            value: formatDate(vendor.createdAt),
            icon: <Calendar />,
          },
          {
            label: 'Updated At',
            value: formatDate(vendor.updatedAt),
            icon: <Calendar />,
          },
          {
            label: 'Status',
            value: <StatusBadge status={vendor.status as StatusVariant} />,
            icon: <ToggleRight />,
          },
        ]}
      />

      <InfoSection
        title="Files"
        layout="grid"
        icon={<FileText />}
        children={
          <>
            {vendor.vendorFiles && vendor.vendorFiles.length > 0 ? (
              <div className="flex flex-col gap-4">
                {vendor.vendorFiles.map(file => (
                  <VendorFileCard
                    key={file.id}
                    vendorId={vendor.id}
                    file={file}
                    onMappingSuccess={() => refetch()}
                  />
                ))}
              </div>
            ) : (
              <Empty
                title="No files found"
                description="No files found for this vendor"
                icon={<FileText />}
              />
            )}
          </>
        }
      />
    </DetailPage>
  );
};

export default VendorDetail;
