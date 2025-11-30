import { apiRequest } from '@/services/api';
import {
  IVendor,
  IVendorRequest,
  type IVendorCreateRequest,
  type IVendorDetail,
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
): Promise<IVendor> => {
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
