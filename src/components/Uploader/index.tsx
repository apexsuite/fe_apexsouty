'use client';

import { FileText, Upload, X } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import type { IVendorFileDetail } from '@/services/vendor/types';
import { cn } from '@/lib/utils';

// URL'den folderType'ı çıkaran yardımcı fonksiyon
const extractPathFromUrl = (pathname: string): string => {
  const match = pathname.match(/\/([^/]+)/);
  return match?.[1] || 'default';
};

/** Backend'den gelen dosya için status badge renkleri */
const getStatusBadgeVariant = (
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'uploaded':
      return 'secondary';
    case 'processing':
      return 'default';
    case 'processed':
      return 'outline';
    case 'error':
      return 'destructive';
    default:
      return 'secondary';
  }
};

/** Status için Türkçe etiketler */
const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'uploaded':
      return 'Yüklendi';
    case 'processing':
      return 'İşleniyor';
    case 'processed':
      return 'Tamamlandı';
    case 'error':
      return 'Hata';
    default:
      return status;
  }
};

/** Dosya adından orijinal adı çıkar (UUID prefix'i kaldır) */
const extractOriginalFileName = (fileName: string): string => {
  // Format: UUID_originalName.csv şeklinde
  const parts = fileName.split('_');
  if (parts.length > 1) {
    // İlk parçayı (UUID) kaldır ve geri kalanını birleştir
    return parts.slice(1).join('_');
  }
  return fileName;
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
  /** Backend'den gelen mevcut dosya listesi (edit mode için) */
  existingFiles?: IVendorFileDetail[];
  onUploadSuccess?: (filePaths: string[]) => void;
  onUploadError?: (error: Error) => void;
  onExistingFileRemove?: (fileId: string) => void;
}

export function Uploader({
  control,
  name,
  folderType,
  accept = '.csv',
  maxFiles = 2,
  multiple = true,
  maxSize = 20 * 1024 * 1024, // 20MB
  disabled = false,
  existingFiles = [],
  onUploadSuccess,
  onUploadError,
  onExistingFileRemove,
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

  // Toplam dosya sayısı (mevcut + yeni yüklenen)
  const totalExistingFiles = existingFiles?.length || 0;
  const remainingSlots = Math.max(0, maxFiles - totalExistingFiles);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="w-full space-y-4">
          {/* Dropzone - eğer slot kaldıysa göster */}
          {remainingSlots > 0 && (
            <FileUpload
              value={value || []}
              onValueChange={files => {
                onChange(files);
              }}
              onUpload={onUpload}
              onFileReject={onFileReject}
              maxFiles={remainingSlots}
              multiple={multiple && remainingSlots > 1}
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
                      <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
                        <span className="font-medium">Desteklenen format:</span>
                        <span className="bg-muted rounded px-2 py-0.5 font-mono">
                          CSV
                        </span>
                      </p>
                      {maxSize && (
                        <p className="text-muted-foreground text-xs">
                          <span className="font-medium">Maksimum boyut:</span>{' '}
                          {(maxSize / 1024 / 1024).toFixed(1)} MB
                        </p>
                      )}
                      <p className="text-muted-foreground text-xs">
                        <span className="font-medium">Dosya limiti:</span> En
                        fazla {maxFiles} dosya
                        {totalExistingFiles > 0 &&
                          ` (${remainingSlots} slot kaldı)`}
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
          )}

          {/* Backend'den gelen mevcut dosyalar */}
          {existingFiles && existingFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                Mevcut Dosyalar
              </p>
              <div className="flex flex-col gap-2">
                {existingFiles.map(file => (
                  <div
                    key={file.id}
                    className={cn(
                      'relative flex items-center gap-2.5 rounded-md border p-3',
                      'bg-muted/30'
                    )}
                  >
                    {/* Dosya ikonu */}
                    <div className="bg-accent/50 relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border">
                      <FileText className="text-muted-foreground size-5" />
                    </div>

                    {/* Dosya bilgileri */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="truncate text-sm font-medium">
                        {extractOriginalFileName(file.fileName)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(file.status)}>
                          {getStatusLabel(file.status)}
                        </Badge>
                        {file.isProcessed && (
                          <span className="text-muted-foreground text-xs">
                            İşlendi
                          </span>
                        )}
                        {file.fileDelimeter && (
                          <span className="text-muted-foreground text-xs">
                            Ayırıcı: {file.fileDelimeter}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Silme butonu */}
                    {onExistingFileRemove && !disabled && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onExistingFileRemove(file.id)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
      )}
    />
  );
}
