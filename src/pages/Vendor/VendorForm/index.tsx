import { ControlledInputText } from '@/components/FormInputs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import type {
  IVendorCreateRequest,
  IVendorFile,
  IVendorFileDetail,
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
  const [existingFiles, setExistingFiles] = useState<IVendorFileDetail[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
        vendorFiles: [],
      });
      setExistingFiles(vendorData.vendorFiles || []);
    }
  }, [vendorData, reset, isEditMode]);

  const { mutate: createVendorMutation, isPending: isCreating } = useMutation({
    mutationFn: createVendor,
    onSuccess: response => {
      toast.success(
        isEditMode
          ? 'Vendor başarıyla güncellendi'
          : 'Vendor başarıyla oluşturuldu'
      );
      reset();
      navigate(`/vendors/${response.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Bir hata oluştu');
    },
  });

  /** filePath'ten orijinal dosya adını çıkarır (UUID prefix'i kaldırır) */
  const extractFileName = (filePath: string): string => {
    // Path'ten dosya adını al (son / sonrası)
    const fullFileName = filePath.split('/').pop() || filePath;
    // UUID prefix'ini kaldır (ilk _ sonrası)
    const parts = fullFileName.split('_');
    if (parts.length > 1) {
      return parts.slice(1).join('_');
    }
    return fullFileName;
  };

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
    createVendorMutation(submitData);
  };

  if (isLoadingVendor && isEditMode) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <ControlledInputText
        control={control}
        name="name"
        label="Name"
        placeholder="Vendor adını girin"
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
        loading={isCreating}
        disabled={isUploading}
        className="w-full"
      />
    </form>
  );
};

export default VendorForm;
