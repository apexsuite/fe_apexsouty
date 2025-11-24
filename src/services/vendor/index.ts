import { apiRequest } from '@/services/api';
import { IVendor } from '@/services/vendor/types';
import type { IPageParams, IPageResponse } from '@/types/common.types';

export const getVendors = async (
  params: IVendorRequest
): Promise<IPageResponse<IVendor>> => {
  const response = await apiRequest('/vendors', {
    method: 'GET',
    params,
  });
  return response.data;
};

export interface IVendorRequest extends IPageParams {
  name?: string;
  description?: string;
}
