import { apiRequest } from '@/services/api';
import type {
  IRole,
  IRoleCreateRequest,
  IRoleRequest,
  IRoleUpdateRequest,
} from '@/services/roles/types';
import type { IPageResponse } from '@/types/common.types';

export const getRoles = async (
  params: IRoleRequest
): Promise<IPageResponse<IRole>> => {
  const response = await apiRequest('/roles', {
    method: 'GET',
    params,
  });
  return response.data ?? response;
};

export const createRole = async (data: IRoleCreateRequest): Promise<IRole> => {
  const response = await apiRequest('/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data ?? response;
};

export const getRole = async (id: string): Promise<IRole> => {
  const response = await apiRequest(`/roles/${id}`, {
    method: 'GET',
  });
  return response.data ?? response;
};

export const updateRole = async (
  id: string,
  data: IRoleUpdateRequest
): Promise<IRole> => {
  const response = await apiRequest(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data ?? response;
};

export const deleteRole = async (id: string): Promise<void> => {
  const response = await apiRequest(`/roles/${id}`, {
    method: 'DELETE',
  });
  return response.data ?? response;
};

export const changeRoleStatus = async (id: string): Promise<IRole> => {
  const response = await apiRequest(`/roles/${id}/change-status`, {
    method: 'PATCH',
  });
  return response.data ?? response;
};
