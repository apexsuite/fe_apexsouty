import CustomPageLayout from '@/components/CustomPageLayout';
import usePagination from '@/utils/hooks/usePagination';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomDataTable from '@/components/CustomDataTable';
import { FILTER_INPUTS } from './filter.data';
import { TAGS } from '@/utils/constants/tags';
import type {
  IChangeUserStatusRequest,
  IUsersRequest,
  SubscriptionStatus,
  UserType,
} from '@/services/user-managment/types';
import {
  changeUserStatus,
  getUsers,
  updateUserPassword,
} from '@/services/user-managment';
import getUsersColumns from './column.data';
import { toastManager } from '@/components/ui/toast';
import ChangePasswordDialog from './ChangePasswordDialog';
export default function UserManagment() {
  const navigate = useNavigate();
  const [page, setPage] = usePagination();
  const [searchParams] = useSearchParams();
  const { getQueryParams } = useQueryParams();
  const queryClient = useQueryClient();
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    fullName: string;
  } | null>(null);

  const params = useMemo<IUsersRequest>(() => {
    const {
      page,
      pageSize,
      firstname,
      lastname,
      email,
      isActive,
      subscriptionStatus,
      userType,
      roleId,
    } = getQueryParams([
      'page',
      'pageSize',
      'firstname',
      'lastname',
      'email',
      'isActive',
      'subscriptionStatus',
      'userType',
      'roleId',
    ]);

    return {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      ...(firstname && { firstname }),
      ...(lastname && { lastname }),
      ...(email && { email }),
      ...(isActive && { isActive: isActive === 'true' }),
      ...(subscriptionStatus && {
        subscriptionStatus: subscriptionStatus as SubscriptionStatus,
      }),
      ...(userType && { userType: userType as UserType }),
      ...(roleId && { roleId: Number(roleId) }),
    };
  }, [searchParams]);

  const { data: users, isFetching } = useQuery({
    queryKey: [TAGS.USER, params],
    queryFn: () => getUsers(params),
  });

  const { mutate: changeUserStatusMutation } = useMutation({
    mutationFn: ({ id, isActive }: IChangeUserStatusRequest) =>
      changeUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS.USER] });
      toastManager.add({
        title: 'User status changed successfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toastManager.add({
        title: error.message ?? 'Failed to change user status',
        type: 'error',
      });
    },
  });

  const { mutate: updatePasswordMutation, isPending: isUpdatingPassword } =
    useMutation({
      mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
        updateUserPassword(id, newPassword),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TAGS.USER] });
        toastManager.add({
          title: 'Password changed successfully',
          type: 'success',
        });
        setChangePasswordDialogOpen(false);
        setSelectedUser(null);
      },
      onError: (error: Error) => {
        toastManager.add({
          title: error.message ?? 'Failed to change password',
          type: 'error',
        });
      },
    });

  const handleOpenChangePasswordDialog = (user: {
    id: string;
    fullName: string;
  }) => {
    setSelectedUser({
      id: user.id,
      fullName: user.fullName,
    });
    setChangePasswordDialogOpen(true);
  };

  const handleChangePassword = (userId: string, newPassword: string) => {
    updatePasswordMutation({ id: userId, newPassword });
  };

  const columns = getUsersColumns({
    navigate,
    changeUserStatus: changeUserStatusMutation,
    onChangePassword: handleOpenChangePasswordDialog,
  });

  return (
    <>
      <CustomPageLayout
        title="User Management"
        description="View and manage users"
        filters={{ inputs: FILTER_INPUTS, path: '/user-management/create' }}
        datatable={
          <CustomDataTable
            columns={columns}
            data={users?.items || []}
            pagination={page.componentParams}
            setPagination={setPage}
            totalCount={users?.totalCount || 0}
            pageCount={users?.pageCount}
            isLoading={isFetching}
          />
        }
      />
      {selectedUser && (
        <ChangePasswordDialog
          open={changePasswordDialogOpen}
          onOpenChange={setChangePasswordDialogOpen}
          userId={selectedUser.id}
          fullName={selectedUser.fullName}
          onSubmit={handleChangePassword}
          isPending={isUpdatingPassword}
        />
      )}
    </>
  );
}
