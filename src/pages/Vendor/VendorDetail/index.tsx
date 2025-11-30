import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getVendor, processAllVendorFiles } from '@/services/vendor';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Calendar,
  Factory,
  FileText,
  MousePointerClick,
  RefreshCw,
  ToggleRight,
} from 'lucide-react';
import { VendorFileCard } from './VendorFileCard';
import { InfoSection } from '@/components/common/info-section';
import { formatDate } from '@/lib/utils';
import StatusBadge, {
  type StatusVariant,
} from '@/components/common/status-badge';
import { TAGS } from '@/utils/constants/tags';
import Empty from '@/components/common/empty';
import { DetailPage } from '@/components/CustomPageLayout/detail-page';
import CustomButton from '@/components/CustomButton';

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

  const { mutate: processAll, isPending: isProcessingAll } = useMutation({
    mutationFn: (processAgain: boolean) =>
      processAllVendorFiles(id!, processAgain),
    onSuccess: () => {
      toast.success('Tüm dosyalar işleme alındı');
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Dosyalar işlenirken hata oluştu');
    },
  });

  // Check if there are processed and unprocessed files
  const hasProcessedFiles = vendor?.vendorFiles?.some(f => f.isProcessed);
  const hasUnprocessedFiles = vendor?.vendorFiles?.some(f => !f.isProcessed);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!vendor) {
    return (
      <Empty
        title="Vendor not found"
        description="Vendor not found"
        icon={<Factory />}
      />
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
        actions={
          vendor.vendorFiles &&
          vendor.vendorFiles.length > 0 && (
            <div className="flex gap-2">
              {hasUnprocessedFiles && (
                <CustomButton
                  variant="outline"
                  onClick={() => processAll(false)}
                  disabled={isProcessingAll}
                  label="Process All"
                  icon={<MousePointerClick />}
                  iconPosition="right"
                  size="lg"
                />
              )}
              {hasProcessedFiles && (
                <CustomButton
                  variant="outline"
                  onClick={() => processAll(true)}
                  disabled={isProcessingAll}
                  label="Process All Again"
                  icon={<RefreshCw />}
                  iconPosition="right"
                  size="lg"
                />
              )}
            </div>
          )
        }
        children={
          <>
            {vendor.vendorFiles && vendor.vendorFiles.length > 0 ? (
              <div className="flex flex-col gap-2">
                {vendor.vendorFiles.map(file => (
                  <VendorFileCard
                    key={file.id}
                    vendorId={vendor.id}
                    file={file}
                    onMappingSuccess={() => refetch()}
                    onProcessSuccess={() => refetch()}
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
