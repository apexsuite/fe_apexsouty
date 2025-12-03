import { apiRequest } from '@/services/api';
import type { IPageRoute, IPageRouteRequest } from './types';
import type { IPageResponse } from '@/types/common.types';

export const getPageRoutes = async (
  params: IPageRouteRequest
): Promise<IPageResponse<IPageRoute>> => {
  const response = await apiRequest('/page-routes', {
    method: 'GET',
    params,
  });
  return response.data ?? response;
};

export const changePageRouteStatus = async (
  id: string
): Promise<IPageRoute> => {
  const response = await apiRequest(`/page-routes/${id}/change-status`, {
    method: 'PATCH',
  });
  return response.data ?? response;
};

export const restorePageRoute = async (id: string): Promise<IPageRoute> => {
  const response = await apiRequest(`/page-routes/${id}/restore`, {
    method: 'PATCH',
  });
  return response.data ?? response;
};

export const deletePageRoute = async (id: string): Promise<void> => {
  const response = await apiRequest(`/page-routes/${id}`, {
    method: 'DELETE',
  });
  return response.data ?? response;
};
