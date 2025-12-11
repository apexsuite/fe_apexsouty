import { apiRequest } from '@/services/api';
import type {
  IUser,
  IUserCreateRequest,
  IUserRole,
  IUserSession,
  IUserSessionRequest,
  IUserSessions,
  IUserUpdateRequest,
  IUsers,
  IUsersRequest,
} from '@/services/user-managment/types';
import type { IPageResponse } from '@/types/common.types';
import type { ISubscription } from '../subscription/types';

/* SERVICE BASE URL */
const BASE_URL = '/user-management/users' as const;

/* Permission: PERMISSIONS.USER_MANAGMENT.LIST */
export const getUsers = async (
  params: IUsersRequest
): Promise<IPageResponse<IUsers>> => {
  const response = await apiRequest(BASE_URL, {
    method: 'GET',
    params,
  });
  return response.data || response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.DETAIL */
export const getUser = async (id: string): Promise<IUser> => {
  const response = await apiRequest(`${BASE_URL}/${id}`, {
    method: 'GET',
  });
  return response.data || response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.CREATE */
export const createUser = async (data: IUserCreateRequest): Promise<IUser> => {
  const response = await apiRequest(BASE_URL, {
    method: 'POST',
    data,
  });
  return response.data || response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.UPDATE */
export const updateUser = async (
  id: string,
  data: IUserUpdateRequest
): Promise<IUser> => {
  const response = await apiRequest(`${BASE_URL}/${id}`, {
    method: 'PUT',
    data,
  });
  return response.data || response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.UPDATE_STATUS */
export const changeUserStatus = async (
  id: string,
  isActive: boolean
): Promise<IUser> => {
  const response = await apiRequest(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
  return response.data ?? response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.UPDATE_PASSWORD */
export const updateUserPassword = async (
  id: string,
  newPassword: string
): Promise<IUser> => {
  const response = await apiRequest(`${BASE_URL}/${id}/password`, {
    method: 'PATCH',
    body: JSON.stringify({ newPassword }),
  });
  return response.data || response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.GET_USER_ROLES */
export const getUserRoles = async (id: string): Promise<IUserRole[]> => {
  const response = await apiRequest(`${BASE_URL}/${id}/roles`, {
    method: 'GET',
  });
  return response.data || response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.ASSIGN_ROLE */
export const assignRoleToUser = async (
  id: string,
  roleId: string
): Promise<IUser> => {
  const response = await apiRequest(`${BASE_URL}/${id}/roles`, {
    method: 'POST',
    body: JSON.stringify({ roleId }),
  });
  return response.data || response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.UNASSIGN_ROLE */
export const unassignRoleFromUser = async (
  id: string,
  roleId: string
): Promise<IUser> => {
  const response = await apiRequest(`${BASE_URL}/${id}/roles/${roleId}`, {
    method: 'DELETE',
  });
  return response.data || response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.GET_USER_SESSIONS */
export const getUserSessions = async (id: string): Promise<IUserSessions[]> => {
  const response = await apiRequest(`${BASE_URL}/${id}/sessions`, {
    method: 'GET',
  });
  return response.data || response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.GET_USER_SESSION */
export const getUserSession = async (
  id: string,
  request: IUserSessionRequest
): Promise<IUserSession> => {
  const response = await apiRequest(
    `${BASE_URL}/${id}/sessions/${request.token_type}/${request.token_id}`,
    {
      method: 'GET',
      params: request,
    }
  );
  return response.data || response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.DELETE_USER_SESSION */
export const deleteUserSession = async (
  id: string,
  request: IUserSessionRequest
): Promise<void> => {
  const response = await apiRequest(
    `${BASE_URL}/${id}/sessions/${request.token_type}/${request.token_id}`,
    {
      method: 'DELETE',
    }
  );
  return response.data || response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.GET_USER_SUBSCRIPTION */
export const getUserSubscription = async (
  id: string
): Promise<ISubscription> => {
  const response = await apiRequest(`${BASE_URL}/${id}/subscription`, {
    method: 'GET',
  });
  return response.data || response;
};

/* Permission: PERMISSIONS.USER_MANAGMENT.UPDATE_USER_SUBSCRIPTION_CAPACITY */
export const updateUserSubscriptionCapacity = async (
  id: string,
  customCapacity: number
): Promise<IUser> => {
  const response = await apiRequest(`${BASE_URL}/${id}/subscription/capacity`, {
    method: 'PATCH',
    body: JSON.stringify({ customCapacity }),
  });
  return response.data || response;
};
