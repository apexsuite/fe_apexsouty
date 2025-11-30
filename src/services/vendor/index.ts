import { apiRequest } from '@/services/api';
import {
  IVendor,
  IVendorRequest,
  type IVendorCreateRequest,
  type IVendorDetail,
  type IVendorFileUpdateRequest,
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

export const getVendor = async (id: string): Promise<IVendorDetail> => {
  const response = await apiRequest(`/vendors/${id}`, {
    method: 'GET',
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

export const updateVendor = async (id: string): Promise<IVendor> => {
  const response = await apiRequest(`/vendors/${id}`, {
    method: 'PUT',
  });
  return response.data ?? response;
};

export const deleteVendor = async (id: string): Promise<void> => {
  const response = await apiRequest(`/vendors/${id}`, {
    method: 'DELETE',
  });
  return response.data ?? response;
};

/** Vendor dosyasının column mapping bilgilerini güncelle */
export const updateVendorFileMapping = async (
  vendorId: string,
  vendorFileId: string,
  data: IVendorFileUpdateRequest
): Promise<void> => {
  const response = await apiRequest(
    `/vendors/${vendorId}/files/${vendorFileId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  return response.data ?? response;
};
