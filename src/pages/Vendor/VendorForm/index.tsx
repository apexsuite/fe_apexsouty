import { ControlledInputText } from '@/components/FormInputs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import type {
  IVendorCreateRequest,
  IVendorFile,
} from '@/services/vendor/types';
import { createVendor, getVendor } from '@/services/vendor';
import { useEffect, useState } from 'react';
import CustomButton from '@/components/CustomButton';
import { Uploader } from '@/components/Uploader';

const VendorForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<IVendorFile[]>([]);

  const { control, handleSubmit, reset, setValue } =
    useForm<IVendorCreateRequest>({
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
      toast.success('Vendor created successfully');
      reset();
      navigate('/vendors');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleUploadSuccess = (filePaths: string[]) => {
    // Her dosya yüklendiğinde fileName ve filePath ile vendor dosyalarını güncelle
    const newFiles: IVendorFile[] = filePaths.map(filePath => {
      const fileName = filePath.split('/').pop() || filePath;
      return {
        fileName,
        filePath,
      };
    });

    setUploadedFiles(prev => {
      const updated = [...prev, ...newFiles];
      setValue('vendorFiles', updated);
      return updated;
    });
  };

  const onSubmit = (data: IVendorCreateRequest) => {
    // Form submit edildiğinde yüklenen dosyaları da gönder
    const submitData: IVendorCreateRequest = {
      ...data,
      vendorFiles: uploadedFiles,
    };
    createVendorMutation(submitData as any);
  };

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
        <Uploader
          control={control}
          name="vendorFiles"
          folderType="vendors"
          onUploadSuccess={handleUploadSuccess}
        />
        <CustomButton
          type="submit"
          label="Create Vendor"
          loading={isCreating}
          className="w-full"
        />
      </form>
    </div>
  );
};

export default VendorForm;
