import { apiRequest } from '@/services/api';
import type {
  ICreatePageRoute,
  IPageRoutes,
  IPageRouteRequest,
  IPageRoute,
} from '@/services/page-routes/types';
import type { IPageResponse } from '@/types/common.types';
import type { IUpdatePageRoute } from './types';

export const getPageRoutes = async (
  params: IPageRouteRequest
): Promise<IPageResponse<IPageRoutes>> => {
  const response = await apiRequest('/page-routes', {
    method: 'GET',
    params,
  });
  return response.data ?? response;
};

export const createPageRoute = async (
  data: ICreatePageRoute
): Promise<IPageRoute> => {
  const response = await apiRequest('/page-routes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data ?? response;
};

export const getPageRoute = async (id: string): Promise<IPageRoute> => {
  const response = await apiRequest(`/page-routes/${id}`, {
    method: 'GET',
  });
  return response.data ?? response;
};

export const updatePageRoute = async (
  id: string,
  data: IUpdatePageRoute
): Promise<IPageRoute> => {
  const response = await apiRequest(`/page-routes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
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
