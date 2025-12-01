import { ControlledInputText, ControlledSelect } from '@/components/FormInputs';
import { Button } from '@/components/ui/button';
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

  const isPending = isCreating || isUpdating;

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
    <div className="m-8 space-y-4 rounded-lg border p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? 'Edit Marketplace' : 'Create Marketplace'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? 'Update marketplace information'
              : 'Create a new marketplace'}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-4">
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
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/marketplaces')}
            >
              Cancel
            </Button>
            <CustomButton
              label={isEditMode ? 'Update' : 'Create'}
              onClick={handleSubmit(onSubmit)}
              disabled={isPending}
              loading={isPending}
              className="w-full"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default MarketPlaceForm;
