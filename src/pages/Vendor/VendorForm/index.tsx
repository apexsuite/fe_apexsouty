import { ControlledInputText } from '@/components/FormInputs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { IVendorCreateRequest } from '@/services/vendor/types';
import { createVendor, getVendor } from '@/services/vendor';
import { useEffect } from 'react';
import CustomButton from '@/components/CustomButton';
import { Uploader } from '@/components/Uploader';

const VendorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const { control, handleSubmit, reset } = useForm<IVendorCreateRequest>({
    defaultValues: {
      name: '',
      description: '',
      vendorFiles: [],
    },
  });

  const { data: vendorData, isLoading: isLoadingVendor } = useQuery({
    queryKey: ['vendor', id],
    queryFn: () => getVendor(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (vendorData && isEditMode) {
      reset({
        name: vendorData.name,
        description: vendorData.description,
        vendorFiles: vendorData.vendorFiles,
      });
    }
  }, [vendorData, reset, isEditMode]);

  const { mutate: createVendorMutation, isPending: isCreating } = useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor created successfully');
      reset();
      navigate('/vendors');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create vendor');
    },
  });

  const onSubmit = (data: IVendorCreateRequest) => {
    createVendorMutation(data as any);
  };

  const isPending = isCreating;

  if (isLoadingVendor && isEditMode) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ControlledInputText
          control={control}
          name="name"
          label="Name"
          placeholder="Enter vendor name"
        />
        <ControlledInputText
          control={control}
          name="description"
          label="Description"
          placeholder="Enter vendor description"
        />
        <Uploader control={control} name="vendorFiles" folderType="vendor" />
        <CustomButton
          type="submit"
          label="Create Vendor"
          loading={isPending}
          className="w-full"
        />
      </form>
    </div>
  );
};

export default VendorForm;
