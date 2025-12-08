import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Shield, Plus } from 'lucide-react';
import CustomDataTable from '@/components/CustomDataTable';
import {
  getUserRoles,
  assignRoleToUser,
  unassignRoleFromUser,
} from '@/services/user-managment';
import { getRoles } from '@/services/roles';
import { TAGS } from '@/utils/constants/tags';
import { toastManager } from '@/components/ui/toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import Empty from '@/components/common/empty';
import { ControlledSelect } from '@/components/FormInputs';
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from '@/components/ui/frame';
import getUserRoleColumns from './user-role.column';
import type { IRole } from '@/services/roles/types';
import { useMemo } from 'react';
import CustomButton from '@/components/CustomButton';

interface AssignRoleFormData {
  roleId: string;
}

export default function UserRoles() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: userRoles, isLoading: isLoadingUserRoles } = useQuery({
    queryKey: [TAGS.USER, id, 'roles'],
    queryFn: () => getUserRoles(id!),
    enabled: !!id,
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles', 'all'],
    queryFn: () => getRoles({ page: 1, pageSize: 10, isActive: true }),
    enabled: !!id,
  });

  const { control, handleSubmit, reset } = useForm<AssignRoleFormData>({
    defaultValues: {
      roleId: '',
    },
  });

  // Mevcut kullanıcı rollerini filtrele
  const availableRoles = useMemo(() => {
    if (!rolesData?.items && !rolesData?.data) return [];
    const roles = rolesData.items || rolesData.data || [];
    const assignedRoleIds = new Set(userRoles?.map(role => role.roleId) || []);
    return roles.filter((role: IRole) => !assignedRoleIds.has(role.id));
  }, [rolesData, userRoles]);

  const roleOptions = useMemo(() => {
    return availableRoles.map((role: IRole) => ({
      value: role.id,
      label: role.name,
    }));
  }, [availableRoles]);

  const { mutate: assignRoleMutation, isPending: isAssigning } = useMutation({
    mutationFn: (roleId: string) => {
      return assignRoleToUser(id!, roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TAGS.USER, id, 'roles'],
      });
      queryClient.invalidateQueries({
        queryKey: [TAGS.USER, id],
      });
      reset();
      toastManager.add({
        title: 'Role assigned successfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toastManager.add({
        title: error.message ?? 'Failed to assign role',
        type: 'error',
      });
    },
  });

  const { mutate: unassignRoleMutation } = useMutation({
    mutationFn: (roleId: string) => unassignRoleFromUser(id!, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TAGS.USER, id, 'roles'],
      });
      queryClient.invalidateQueries({
        queryKey: [TAGS.USER, id],
      });
      toastManager.add({
        title: 'Role unassigned successfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toastManager.add({
        title: error.message ?? 'Failed to unassign role',
        type: 'error',
      });
    },
  });

  const onSubmit = (data: AssignRoleFormData) => {
    if (!data.roleId) {
      toastManager.add({
        title: 'Please select a role',
        type: 'error',
      });
      return;
    }
    assignRoleMutation(data.roleId);
  };

  const columns = getUserRoleColumns({
    unassignRole: (roleId: string) => {
      unassignRoleMutation(roleId);
    },
  });

  if (isLoadingUserRoles || isLoadingRoles) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-2">
      {!userRoles || userRoles.length === 0 ? (
        <Empty
          title="No roles assigned"
          description="This user has no assigned roles. Use the form above to assign a role."
          icon={<Shield />}
        />
      ) : (
        <CustomDataTable
          columns={columns}
          data={userRoles}
          isLoading={isLoadingUserRoles}
        />
      )}
      {roleOptions.length > 0 && (
        <Frame>
          <FrameHeader className="py-3">
            <FrameTitle className="flex items-center gap-2 text-base">
              <Shield />
              Assign Role
            </FrameTitle>
          </FrameHeader>
          <FramePanel>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <ControlledSelect
                    control={control}
                    name="roleId"
                    label="Select Role"
                    placeholder={
                      roleOptions.length === 0
                        ? 'No available roles'
                        : 'Choose a role to assign'
                    }
                    options={roleOptions}
                    required
                    disabled={roleOptions.length === 0 || isAssigning}
                  />
                </div>
                <CustomButton
                  label="Assign Role"
                  icon={<Plus />}
                  onClick={handleSubmit(onSubmit)}
                  disabled={roleOptions.length === 0 || isAssigning}
                  loading={isAssigning}
                  size="lg"
                />
              </div>
            </form>
          </FramePanel>
        </Frame>
      )}
    </div>
  );
}
