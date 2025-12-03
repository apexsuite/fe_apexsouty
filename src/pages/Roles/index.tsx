import CustomPageLayout from '@/components/CustomPageLayout';
import usePagination from '@/utils/hooks/usePagination';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import getRolesColumns from './column.data';
import CustomDataTable from '@/components/CustomDataTable';
import { FILTER_INPUTS } from '@/pages/Roles/filter.data';
import { toastManager } from '@/components/ui/toast';
import { TAGS } from '@/utils/constants/tags';
import type { IRoleRequest } from '@/services/roles/types';
import { changeRoleStatus, deleteRole, getRoles } from '@/services/roles';
import { toast } from 'react-toastify';
import { sortBy } from '@/utils/helpers/common';

export default function Roles() {
  const navigate = useNavigate();
  const [page, setPage] = usePagination();
  const [searchParams] = useSearchParams();
  const { getQueryParams } = useQueryParams();

  const queryClient = useQueryClient();

  const params = useMemo<IRoleRequest>(() => {
    const {
      page,
      pageSize,
      name,
      description,
      roleValue,
      isDefault,
      isActive,
    } = getQueryParams([
      'page',
      'pageSize',
      'name',
      'description',
      'roleValue',
      'isDefault',
      'isActive',
    ]);

    return {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      ...(name && { name }),
      ...(description && { description }),
      ...(roleValue && { roleValue: Number(roleValue) }),
      ...(isDefault && { isDefault: isDefault === 'true' }),
      ...(isActive && { isActive: isActive === 'true' }),
    };
  }, [searchParams]);

  const { data: roles, isFetching } = useQuery({
    queryKey: [TAGS.ROLE, params],
    queryFn: () => getRoles(params),
  });

  const { mutate: changeRoleStatusMutation } = useMutation({
    mutationFn: changeRoleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS.ROLE] });
      toastManager.add({
        title: 'Role status changed successfully',
        type: 'success',
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create marketplace');
    },
  });

  const { mutateAsync: deleteRoleMutation } = useMutation({
    mutationFn: (id: string) => {
      toastManager.promise(deleteRole(id), {
        loading: {
          title: 'Deleting',
        },
        success: () => ({
          title: 'Role deleted successfully',
        }),
        error: (error: Error) => ({
          title: 'Error',
          description: error.message ?? 'Failed to delete role',
        }),
      });

      return deleteRole(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS.ROLE] });
    },
  });

  const columns = getRolesColumns({
    deleteRole: deleteRoleMutation,
    changeRoleStatus: changeRoleStatusMutation,
    navigate,
  });

  return (
    <CustomPageLayout
      title="Roles"
      description="View and manage roles"
      filters={{ inputs: FILTER_INPUTS, path: '/roles/create' }}
      datatable={
        <CustomDataTable
          columns={columns}
          data={sortBy(roles?.items || [], 'roleValue')}
          pagination={page.componentParams}
          setPagination={setPage}
          totalCount={roles?.totalCount || 0}
          pageCount={roles?.pageCount}
          isLoading={isFetching}
        />
      }
    />
  );
}
