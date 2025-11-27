import { apiRequest } from '@/services/api';
import { type IFileRequest, type IFileResponse } from '@/services/files/types';

export const uploadFile = async (
  data: IFileRequest
): Promise<IFileResponse> => {
  const response = await apiRequest('/files', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const uploadFileToBlob = async (
  uploadURL: string,
  file: File
): Promise<void> => {
  const response = await fetch(uploadURL, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Dosya yükleme başarısız: ${response.statusText}`);
  }
};
