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
import getUserRoleColumns from './user-role.column';
import type { IRole } from '@/services/roles/types';
import { useMemo } from 'react';
import CustomButton from '@/components/CustomButton';
import { InfoSection } from '@/components/common/info-section';

interface AssignRoleFormData {
  roleId: string;
}

export default function UserRoles() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: userRoles, isLoading: isLoadingUserRoles } = useQuery({
    queryKey: [TAGS.USER, id, TAGS.USER_ROLES],
    queryFn: () => getUserRoles(id!),
    enabled: !!id,
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: [TAGS.ROLE, 'all'],
    queryFn: () => getRoles({ page: 1, pageSize: 10, isActive: true }),
    enabled: !!id,
  });

  const { control, handleSubmit, reset } = useForm<AssignRoleFormData>({
    defaultValues: {
      roleId: '',
    },
  });

  // FILTER AVAILABLE ROLES
  const availableRoles = useMemo(() => {
    if (!rolesData?.items && !rolesData?.data) return [];
    const roles = rolesData.items || rolesData.data || [];
    const assignedRoleIds = new Set(userRoles?.map(role => role.roleId) || []);
    return roles.filter((role: IRole) => !assignedRoleIds.has(role.id));
  }, [rolesData, userRoles]);

  const { mutate: assignRoleMutation, isPending } = useMutation({
    mutationFn: (roleId: string) => {
      return assignRoleToUser(id!, roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TAGS.USER, id, TAGS.USER_ROLES],
      });
      queryClient.invalidateQueries({
        queryKey: [TAGS.USER, id],
      });
      queryClient.invalidateQueries({
        queryKey: [TAGS.USER],
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
        queryKey: [TAGS.USER, id, TAGS.USER_ROLES],
      });
      queryClient.invalidateQueries({
        queryKey: [TAGS.USER, id],
      });
      queryClient.invalidateQueries({
        queryKey: [TAGS.USER],
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
      {availableRoles.length > 0 && (
        <InfoSection title="Assign Role" icon={<Shield />}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-end gap-4">
              <ControlledSelect
                control={control}
                name="roleId"
                label="Select Role"
                placeholder="Select a role to assign"
                options={availableRoles.map((role: IRole) => ({
                  value: role.id,
                  label: role.name,
                }))}
                required
                disabled={isPending}
                className="w-full flex-1"
              />
              <CustomButton
                label="Assign Role"
                icon={<Plus />}
                type="submit"
                disabled={isPending}
                loading={isPending}
                size="lg"
              />
            </div>
          </form>
        </InfoSection>
      )}
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
    </div>
  );
}
