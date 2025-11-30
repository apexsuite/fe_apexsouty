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

export interface IVendorFile {
  fileName: string;
  filePath: string;
}

export interface IVendorCreateRequest {
  description?: string;
  name?: string;
  vendorFiles?: IVendorFile[];
}

export interface IVendorDetail {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  status: string;
  updatedAt: string;
  vendorFiles: [
    {
      columnMappings: [
        {
          columnName: string;
          index: number;
        },
      ];
      fileDelimeter: string;
      fileName: string;
      id: string;
      isProcessed: boolean;
      status: string;
    },
  ];
}
