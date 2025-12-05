import type { IPageParams } from '@/types/common.types';

export const SubscriptionStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const UserType = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const TokenType = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export interface IUserRole {
  createdAt: string;
  description: string;
  id: string;
  isActive: boolean;
  roleId: string;
  roleName: string;
  roleValue: number;
}

export interface ISubscription {
  createdAt: string;
  currentPeriodEnd: string;
  currentPeriodStart: string;
  customCapacity: number;
  id: string;
  nextBillingDate: string;
  productId: string;
  productName: string;
  startDate: string;
  status: string;
}

export interface IUsers {
  createdAt: string;
  email: string;
  firstname: string;
  hasSubscription: boolean;
  id: string;
  isActive: boolean;
  lastname: string;
  roles: IUserRole[];
  subscriptionStatus: SubscriptionStatus;
  userType: UserType;
}

export interface IUsersRequest extends IPageParams {
  firstname?: string;
  lastname?: string;
  email?: string;
  isActive?: boolean;
  subscriptionStatus?: SubscriptionStatus;
  userType?: UserType;
  roleId?: number;
}

export interface IUser {
  createdAt: string;
  email: string;
  firstname: string;
  id: string;
  isActive: boolean;
  lastname: string;
  profile: {
    firstname: string;
    lastname: string;
  };
  roles: IUserRole[];
  subscription: ISubscription;
  updatedAt: string;
  userType: UserType;
  version: number;
}

export interface IUserCreateRequest {
  email: string;
  firstname: string;
  isActive: boolean;
  lastname: string;
  password: string;
  userType: UserType;
}

export interface IUserUpdateRequest {
  email: string;
  firstname: string;
  isActive: boolean;
  lastname: string;
  password?: string;
  userType: UserType;
}

export interface IChangeUserStatusRequest {
  id: string;
  isActive: boolean;
}

export interface IUserSessions {
  expiresAt: string;
  tokenId: string;
  tokenType: string;
}

export interface IUserSession {
  claims?: unknown;
  expiresAt: string;
  token?: string;
  tokenId?: string;
  tokenType?: string;
}

export interface IUserSessionRequest {
  user_id: string;
  token_type: TokenType;
  token_id: string;
}

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];
export type UserType = (typeof UserType)[keyof typeof UserType];
export type TokenType = (typeof TokenType)[keyof typeof TokenType];
