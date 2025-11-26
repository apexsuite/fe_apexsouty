import { apiRequest } from '@/services/api';
import { IUploadFileResponse } from '@/services/files/types';

export const uploadFile = async (
  file: File,
  folderType: string,
  onProgress?: (progress: number) => void
): Promise<IUploadFileResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folderType', folderType);

  const response = await apiRequest('/files', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent: any) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      }
    },
  });
  return response.data;
};
