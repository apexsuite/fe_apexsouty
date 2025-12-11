import { ControlledInputText, ControlledSelect } from '@/components/FormInputs';
import {
  createMarketplace,
  getMarketplaceById,
  updateMarketplace,
} from '@/services/marketplaces';
import { IMarketPlaceCreateRequest } from '@/services/marketplaces/type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import marketPlaceValidationSchema from './marketPlace.validations';
import { getRegions } from '@/services/region';
import CustomButton from '@/components/CustomButton';
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from '@/components/ui/frame';

const MarketPlaceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const { control, handleSubmit, reset } = useForm<IMarketPlaceCreateRequest>({
    resolver: yupResolver(marketPlaceValidationSchema),
    defaultValues: {
      marketplace: '',
      marketplaceURL: '',
      marketplaceKey: '',
      regionId: '',
    },
  });

  const { data: marketplaceData, isLoading: isLoadingMarketplace } = useQuery({
    queryKey: ['marketplace', id],
    queryFn: () => getMarketplaceById(id!),
    enabled: isEditMode,
  });

  const { data: regionsData, isLoading: isLoadingRegions } = useQuery({
    queryKey: ['regions'],
    queryFn: () => getRegions({ page: 1, pageSize: 1000 }),
  });

  useEffect(() => {
    if (marketplaceData && isEditMode) {
      reset({
        marketplace: marketplaceData.marketplace,
        marketplaceURL: marketplaceData.marketplaceURL,
        marketplaceKey: marketplaceData.marketplaceKey,
        regionId: marketplaceData.regionId,
      });
    }
  }, [marketplaceData, reset, isEditMode]);

  const { mutate: createMarketplaceMutation, isPending: isCreating } =
    useMutation({
      mutationFn: createMarketplace,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['marketplaces'] });
        toast.success('Marketplace created successfully');
        reset();
        navigate('/marketplaces');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create marketplace');
      },
    });

  const { mutate: updateMarketplaceMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: (data: IMarketPlaceCreateRequest) =>
        updateMarketplace(id!, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['marketplaces'] });
        queryClient.invalidateQueries({ queryKey: ['marketplace', id] });
        toast.success('Region updated successfully');
        navigate('/marketplaces');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update region');
      },
    });

  const regionsOptions = useMemo(() => {
    return (
      regionsData?.items.map(region => ({
        label: region?.regionName,
        value: region?.id,
      })) || []
    );
  }, [regionsData]);

  const onSubmit = (data: IMarketPlaceCreateRequest) => {
    if (isEditMode) {
      updateMarketplaceMutation(data);
    } else {
      createMarketplaceMutation(data);
    }
  };

  if (isLoadingMarketplace && isEditMode) {
    return (
      <div className="container mx-auto space-y-6 px-4 py-8">
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <Loader className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading marketplace data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="p-4">
      <Frame>
        <FrameHeader>
          <FrameTitle className="text-2xl font-bold">
            {isEditMode ? 'Edit Marketplace' : 'Create Marketplace'}
          </FrameTitle>
          <FrameDescription className="text-muted-foreground text-base">
            {isEditMode
              ? 'Update marketplace information'
              : 'Create a new marketplace'}
          </FrameDescription>
        </FrameHeader>
        <FramePanel>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ControlledInputText
                control={control}
                name="marketplace"
                label="Marketplace Name"
                placeholder="e.g., North America"
              />
              <ControlledInputText
                control={control}
                name="marketplaceURL"
                label="Marketplace URL"
                placeholder="e.g., https://..."
              />
              <ControlledInputText
                control={control}
                name="marketplaceKey"
                label="Marketplace Key"
                placeholder="e.g., A1234567890"
              />
              <ControlledSelect
                control={control}
                name="regionId"
                label="Region"
                placeholder="Select Region"
                options={regionsOptions}
                disabled={isLoadingRegions}
              />

              <CustomButton
                label="Cancel"
                onClick={() => navigate('/marketplaces')}
                variant="outline"
                className="w-full md:w-auto"
              />
              <CustomButton
                label={isEditMode ? 'Update' : 'Create'}
                onClick={handleSubmit(onSubmit)}
                disabled={isCreating || isUpdating}
                loading={isCreating || isUpdating}
                className="w-full md:w-auto"
              />
            </div>
          </form>
        </FramePanel>
      </Frame>
    </section>
  );
};

export default MarketPlaceForm;
