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
  status?: string;
}

export interface IVendorFile {
  fileName: string;
  filePath: string;
}

export interface IVendorCreateRequest {
  description?: string;
  name?: string;
  vendorFiles?: IVendorFile[];
}

export interface IColumnMapping {
  columnName: string;
  index: number;
}

export interface IVendorFileDetail {
  id: string;
  fileName: string;
  isProcessed: boolean;
  status: 'uploaded' | 'processing' | 'processed' | 'error';
  fileDelimeter: string | null;
  columnMappings: IColumnMapping[] | null;
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

export interface IVendorFileConfig {
  columnMappings: IColumnMapping[];
  fileDelimeter: string;
}

export interface IVendorFileSample {
  data: {
    columnMappings: IColumnMapping[];
    createdAt: string;
    createdBy: string;
    fileDelimeter: string;
    fileName: string;
    filePath: string;
    id: string;
    isProcessed: boolean;
    isTableCreated: boolean;
    isTableDeleted: boolean;
    sample: string;
    status: string;
    tableName: string;
    vendorId: string;
    vendor: IVendor;
  };
}

export interface IProcessSelectedVendorFileRequest {
  processAgain: boolean;
  vendorFileIds: string[];
}
