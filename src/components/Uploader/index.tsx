'use client';

import { Upload, X } from 'lucide-react';
import * as React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  type FileUploadProps,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import { uploadFile, uploadFileToBlob } from '@/services/files';
import CustomButton from '../CustomButton';

// URL'den folderType'ı çıkaran yardımcı fonksiyon
const extractPathFromUrl = (pathname: string): string => {
  const match = pathname.match(/\/([^/]+)/);
  return match?.[1] || 'default';
};

interface UploaderProps {
  control: Control<any>;
  name: string;
  folderType?: string;
  maxFiles?: number;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  onUploadSuccess?: (filePaths: string[]) => void;
  onUploadError?: (error: Error) => void;
}

export function Uploader({
  control,
  name,
  folderType,
  accept,
  maxFiles = 2,
  multiple = true,
  maxSize = 20 * 1024 * 1024, // 20MB
  disabled = false,
  onUploadSuccess,
  onUploadError,
}: UploaderProps) {
  const location = useLocation();

  const determinedPath = React.useMemo(() => {
    if (folderType) return folderType;
    return extractPathFromUrl(location.pathname);
  }, [folderType, location.pathname]);

  const onUpload: NonNullable<FileUploadProps['onUpload']> = React.useCallback(
    async (files, { onProgress, onSuccess, onError }) => {
      try {
        const uploadPromises = files.map(async file => {
          try {
            // İlerleme göstergesi başlat
            onProgress(file, 0);

            // 1. Backend'den uploadURL ve filePath al
            const response = await uploadFile({
              fileName: file.name,
              folderType: determinedPath,
            });

            // İlerleme güncelle
            onProgress(file, 50);

            // 2. Azure Blob Storage'a dosyayı yükle
            await uploadFileToBlob(response.uploadURL, file);

            // İlerleme tamamla
            onProgress(file, 100);
            onSuccess(file);

            return response.filePath;
          } catch (error) {
            const uploadError =
              error instanceof Error ? error : new Error('Yükleme başarısız');
            onError(file, uploadError);
            throw uploadError;
          }
        });

        const filePaths = await Promise.all(uploadPromises);
        onUploadSuccess?.(filePaths);

        toast.success('Dosyalar başarıyla yüklendi');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Yükleme başarısız';
        toast.error(errorMessage);
        onUploadError?.(
          error instanceof Error ? error : new Error(errorMessage)
        );
      }
    },
    [determinedPath, onUploadSuccess, onUploadError]
  );

  const onFileReject = React.useCallback(
    (_file: File, message: string) => {
      const error = new Error(message);
      toast.error(error.message);
      onUploadError?.(error);
    },
    [onUploadError]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="w-full">
          <FileUpload
            value={value || []}
            onValueChange={files => {
              onChange(files);
            }}
            onUpload={onUpload}
            onFileReject={onFileReject}
            maxFiles={maxFiles}
            multiple={multiple}
            accept={accept}
            maxSize={maxSize}
            disabled={disabled}
          >
            <FileUploadDropzone>
              <div className="flex flex-col items-center gap-3 py-2 text-center">
                <Upload className="text-primary size-6" />
                <div className="space-y-1.5">
                  <p className="text-foreground text-sm font-semibold">
                    Dosyaları sürükle-bırak veya seç
                  </p>
                  <div className="flex flex-col gap-1">
                    {accept && (
                      <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
                        <span className="font-medium">
                          Desteklenen formatlar:
                        </span>
                        <span className="bg-muted rounded px-2 py-0.5 font-mono">
                          {accept
                            .split(',')
                            .map(type => type.trim())
                            .join(', ')}
                        </span>
                      </p>
                    )}
                    {maxSize && (
                      <p className="text-muted-foreground text-xs">
                        <span className="font-medium">Maksimum boyut:</span>{' '}
                        {(maxSize / 1024 / 1024).toFixed(1)} MB
                      </p>
                    )}
                    <p className="text-muted-foreground text-xs">
                      <span className="font-medium">Dosya limiti:</span> En
                      fazla {maxFiles} dosya
                    </p>
                  </div>
                </div>
              </div>
              <FileUploadTrigger asChild>
                <CustomButton
                  icon={<Upload />}
                  label="Dosya Seç"
                  variant="ghost"
                />
              </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
              {(value || []).map((file: File, index: number) => (
                <FileUploadItem key={index} value={file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon" disabled={disabled}>
                      <X />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
          {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
      )}
    />
  );
}
