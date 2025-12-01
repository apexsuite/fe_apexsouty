import { ControlledInputText } from '@/components/FormInputs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import type {
  IVendorCreateRequest,
  IVendorFile,
  IVendorFileDetail,
} from '@/services/vendor/types';
import { createVendor, getVendor, updateVendor } from '@/services/vendor';
import { useEffect, useState } from 'react';
import CustomButton from '@/components/CustomButton';
import { Uploader } from '@/components/Uploader';
import { yupResolver } from '@hookform/resolvers/yup';
import vendorValidationSchema from './vendor.validations';

const extractFileName = (filePath: string): string => {
  const fullFileName = filePath.split('/').pop() || filePath;
  const parts = fullFileName.split('_');
  if (parts.length > 1) {
    return parts.slice(1).join('_');
  }
  return fullFileName;
};

const VendorForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<IVendorFile[]>([]);
  const [existingFiles, setExistingFiles] = useState<IVendorFileDetail[]>([]);

  const { control, handleSubmit, reset } = useForm<IVendorCreateRequest>({
    resolver: yupResolver(vendorValidationSchema),
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
        vendorFiles: [],
      });
      setExistingFiles(vendorData.vendorFiles || []);
    }
  }, [vendorData, reset, isEditMode]);

  const { mutate: createVendorMutation, isPending: isCreating } = useMutation({
    mutationFn: createVendor,
    onSuccess: response => {
      toast.success('Vendor successfully created');
      reset();
      navigate(`/vendors/${response.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Bir hata oluştu');
    },
  });

  const { mutate: updateVendorMutation, isPending: isUpdating } = useMutation({
    mutationFn: (data: IVendorCreateRequest) => updateVendor(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor', id] });
      toast.success('Vendor updated successfully');
      navigate('/vendors');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update region');
    },
  });

  const handleUploadSuccess = (filePaths: string[]) => {
    const newFiles: IVendorFile[] = filePaths.map(filePath => ({
      fileName: extractFileName(filePath),
      filePath,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleExistingFileRemove = (fileId: string) => {
    setExistingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const onSubmit = (data: IVendorCreateRequest) => {
    const submitData: IVendorCreateRequest = {
      ...data,
      vendorFiles: uploadedFiles,
    };
    if (isEditMode) {
      updateVendorMutation(submitData);
    } else {
      createVendorMutation(submitData);
    }
  };

  if (isLoadingVendor && isEditMode) {
    return <LoadingSpinner />;
  }

  return (
    <div className="m-8 space-y-4 rounded-lg border p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? 'Edit Vendor' : 'Create Vendor'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? 'Update vendor information' : 'Create a new vendor'}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ControlledInputText
          control={control}
          name="name"
          label="Name"
          placeholder="Vendor name"
        />
        <ControlledInputText
          control={control}
          name="description"
          label="Description"
          placeholder="Vendor açıklamasını girin"
        />
        <Uploader
          control={control}
          name="vendorFiles"
          folderType="vendors"
          accept=".csv"
          maxFiles={2}
          existingFiles={existingFiles}
          onUploadSuccess={handleUploadSuccess}
          onExistingFileRemove={handleExistingFileRemove}
          onUploadingChange={setIsUploading}
        />
        <CustomButton
          type="submit"
          label={isEditMode ? 'Güncelle' : 'Vendor Oluştur'}
          loading={isCreating || isUpdating}
          disabled={isUploading || isCreating || isUpdating}
          className="w-full"
        />
      </form>
    </div>
  );
};

export default VendorForm;
