import { apiRequest } from '@/services/api';
import {
  IVendor,
  IVendorRequest,
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
  return response.data;
};

export const getVendor = async (id: string): Promise<IVendorDetail> => {
  const response = await apiRequest(`/vendors/${id}`, {
    method: 'GET',
  });
  return response.data;
};

export const createVendor = async (data: IVendor): Promise<IVendor> => {
  const response = await apiRequest('/vendors', {
    method: 'POST',
    data,
  });
  return response.data;
};
