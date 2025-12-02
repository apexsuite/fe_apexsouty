import { apiRequest } from '@/services/api';
import {
  IVendor,
  IVendorRequest,
  type IProcessSelectedVendorFileRequest,
  type IVendorCreateRequest,
  type IVendorDetail,
  type IVendorFile,
  type IVendorFileConfig,
  type IVendorFileSample,
} from '@/services/vendor/types';
import type { IPageResponse } from '@/types/common.types';

export const getVendors = async (
  params: IVendorRequest
): Promise<IPageResponse<IVendor>> => {
  const response = await apiRequest('/vendors', {
    method: 'GET',
    params,
  });
  return response.data ?? response;
};

export const createVendor = async (
  data: IVendorCreateRequest
): Promise<IVendorDetail> => {
  const response = await apiRequest('/vendors', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data ?? response;
};

export const getVendor = async (id: string): Promise<IVendorDetail> => {
  const response = await apiRequest(`/vendors/${id}`, {
    method: 'GET',
  });
  return response.data ?? response;
};

export const updateVendor = async (
  id: string,
  data: IVendorCreateRequest
): Promise<IVendor> => {
  const response = await apiRequest(`/vendors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data ?? response;
};

export const deleteVendor = async (id: string): Promise<void> => {
  const response = await apiRequest(`/vendors/${id}`, {
    method: 'DELETE',
  });
  return response.data ?? response;
};

/** Vendor File Operations **/

export const createVendorFile = async (
  vendorId: string,
  data: IVendorFile
): Promise<IVendorDetail> => {
  const response = await apiRequest(`/vendors/${vendorId}/files`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data ?? response;
};

export const deleteVendorFile = async (
  vendorId: string,
  vendorFileId: string
): Promise<void> => {
  const response = await apiRequest(
    `/vendors/${vendorId}/files/${vendorFileId}`,
    {
      method: 'DELETE',
    }
  );
  return response.data ?? response;
};

export const createVendorFileConfig = async (
  vendorId: string,
  vendorFileId: string,
  data: IVendorFileConfig
): Promise<IVendorDetail> => {
  const response = await apiRequest(
    `/vendors/${vendorId}/files/${vendorFileId}/config`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  return response.data ?? response;
};

export const getVendorFileSample = async (
  vendorId: string,
  vendorFileId: string
): Promise<IVendorFileSample> => {
  const response = await apiRequest(
    `/vendors/${vendorId}/files/${vendorFileId}/sample`,
    {
      method: 'GET',
    }
  );
  return response.data ?? response;
};

export const processSelectedVendorFile = async (
  vendorId: string,
  data: IProcessSelectedVendorFileRequest
): Promise<IVendorDetail> => {
  const response = await apiRequest(`/vendors/${vendorId}/process`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data ?? response;
};

export const processAllVendorFiles = async (
  vendorId: string,
  processAgain: boolean
): Promise<IVendorDetail> => {
  const response = await apiRequest(`/vendors/${vendorId}/process/all`, {
    method: 'POST',
    body: JSON.stringify({ processAgain }),
  });
  return response.data ?? response;
};

export const updateVendorFileMapping = createVendorFileConfig;
