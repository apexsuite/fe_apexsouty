export const PERMISSIONS = {
  USER_MANAGMENT: {
    LIST: 'user-management-get-user-list',
    CREATE: 'user-management-create-user',
    UPDATE: 'user-management-update-user',
    DELETE: 'user-management-delete-user',

    DETAIL: 'user-management-get-user-detail',
    UPDATE_STATUS: 'user-management-update-status',
    UPDATE_PASSWORD: 'user-management-update-user-password',

    GET_USER_ROLES: 'user-management-get-user-roles',
    ASSIGN_ROLE: 'user-management-assign-role',

    UNASSIGN_ROLE: 'user-management-unassign-role',
    GET_USER_SESSIONS: 'user-management-get-user-session-list',
    GET_USER_SESSION: 'user-management-get-user-session',
    DELETE_USER_SESSION: 'user-management-delete-user-session',

    GET_USER_SUBSCRIPTION: 'user-management-get-subscription',
    UPDATE_USER_SUBSCRIPTION_CAPACITY:
      'user-management-update-user-subscription-capacity',
  },
} as const;

export type Permission = keyof typeof PERMISSIONS;
