'use client';

import { Upload, X } from 'lucide-react';
import * as React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  type FileUploadProps,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import { uploadFile } from '@/services/files';

interface UploaderProps {
  control: Control<any>;
  name: string;
  folderType: string;
  maxFiles?: number;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  onUploadSuccess?: (urls: string[]) => void;
  onUploadError?: (error: Error) => void;
}

export function Uploader({
  control,
  name,
  folderType,
  maxFiles = 2,
  multiple = true,
  accept,
  maxSize,
  disabled = false,
  onUploadSuccess,
  onUploadError,
}: UploaderProps) {
  const [uploadedUrls, setUploadedUrls] = React.useState<string[]>([]);

  const onUpload: NonNullable<FileUploadProps['onUpload']> = React.useCallback(
    async (files, { onProgress, onSuccess, onError }) => {
      try {
        const uploadPromises = files.map(async file => {
          try {
            const response = await uploadFile(
              file,
              folderType,
              (progress: number) => {
                onProgress(file, progress);
              }
            );

            onSuccess(file);
            return response.url;
          } catch (error) {
            const uploadError =
              error instanceof Error ? error : new Error('Upload failed');
            onError(file, uploadError);
            throw uploadError;
          }
        });

        const urls = await Promise.all(uploadPromises);
        setUploadedUrls(prev => [...prev, ...urls]);
        onUploadSuccess?.(urls);

        toast.success('Files uploaded successfully');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';
        toast.error(errorMessage);
        onUploadError?.(
          error instanceof Error ? error : new Error(errorMessage)
        );
      }
    },
    [folderType, onUploadSuccess, onUploadError]
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    const fileName =
      file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name;
    toast.error(`"${fileName}" reddedildi: ${message}`);
  }, []);

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
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="flex items-center justify-center rounded-full border p-2.5">
                  <Upload className="text-muted-foreground size-6" />
                </div>
                <p className="text-sm font-medium">
                  Dosyaları buraya sürükleyin ve bırakın
                </p>
                <p className="text-muted-foreground text-xs">
                  veya göz atmak için tıklayın (maksimum {maxFiles} dosya)
                </p>
                <p className="text-muted-foreground text-xs">
                  Dosya tipi: {accept?.split(',').join(', ')}
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-fit"
                  disabled={disabled}
                >
                  Dosya Seç
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
              {(value || []).map((file: File, index: number) => (
                <FileUploadItem key={index} value={file} className="flex-col">
                  <div className="flex w-full items-center gap-2">
                    <FileUploadItemPreview />
                    <FileUploadItemMetadata />
                    <FileUploadItemDelete asChild>
                      <Button variant="ghost" size="icon" disabled={disabled}>
                        <X />
                      </Button>
                    </FileUploadItemDelete>
                  </div>
                  <FileUploadItemProgress />
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
          {error && (
            <p className="mt-1 text-sm text-red-500">{error.message}</p>
          )}
          {uploadedUrls.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              <p>Yüklenen dosyalar:</p>
              <ul className="list-disc pl-5">
                {uploadedUrls.map((url, idx) => (
                  <li key={idx} className="truncate">
                    {url}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    />
  );
}
