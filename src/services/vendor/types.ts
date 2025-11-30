import type { IPageParams } from '@/types/common.types';

export interface IVendor {
  createdAt: string;
  description: string;
  fileCount: number;
  id: string;
  name: string;
  status: string;
  updatedAt: string;
}

export interface IVendorRequest extends IPageParams {
  name?: string;
  description?: string;
}

// FOR CREATING VENDOR
export interface IVendorFile {
  fileName: string;
  filePath: string;
}

export interface IVendorCreateRequest {
  description?: string;
  name?: string;
  vendorFiles?: IVendorFile[];
}

/** Column mapping için kullanılan tip */
export interface IColumnMapping {
  columnName: string;
  index: number;
}

/** Backend'den gelen dosya detay bilgisi */
export interface IVendorFileDetail {
  id: string;
  fileName: string;
  isProcessed: boolean;
  status: 'uploaded' | 'processing' | 'processed' | 'error';
  fileDelimeter: string | null;
  columnMappings: IColumnMapping[] | null;
  /** CSV sample verisi - string formatında (satırlar \n ile ayrılmış) */
  sample: string | null;
}

export interface IVendorDetail {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  status: string;
  updatedAt: string;
  vendorFiles: IVendorFileDetail[];
}

/** Column mapping update için request tipi */
export interface IVendorFileUpdateRequest {
  columnMappings: IColumnMapping[];
  fileDelimeter: string;
}

/** Desteklenen column name seçenekleri */
export const COLUMN_NAME_OPTIONS = [
  { value: 'asin/upc', label: 'ASIN/UPC', required: true },
  { value: 'sku', label: 'SKU', required: false },
  { value: 'url', label: 'URL', required: false },
  { value: 'brand', label: 'Brand', required: false },
  { value: 'price', label: 'Price', required: true },
  { value: 'name', label: 'Name', required: true },
  { value: 'category', label: 'Category', required: false },
] as const;

export type ColumnNameType = (typeof COLUMN_NAME_OPTIONS)[number]['value'];
