import { UserType } from '@/services/user-managment/types';

export const STATUS_OPTIONS = [
  { value: undefined, label: 'All' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
] as const;

export const DEFAULT_OPTIONS = [
  { value: undefined, label: 'All' },
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
] as const;

export const USER_TYPE_OPTIONS = [
  { value: UserType.ADMIN, label: 'Admin' },
  { value: UserType.USER, label: 'User' },
] as const;
