import {
  ControlledCheckbox,
  ControlledInputNumber,
  ControlledInputText,
} from '@/components/FormInputs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CustomButton from '@/components/CustomButton';
import {
  IRoleCreateRequest,
  type IRoleUpdateRequest,
} from '@/services/roles/types';
import { createRole, getRole, updateRole } from '@/services/roles';
import { toastManager } from '@/components/ui/toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import roleValidationSchema from './role.validations';
import { yupResolver } from '@hookform/resolvers/yup';
import { ControlledInputTextarea } from '@/components/FormInputs/ControlledInputTextarea';
import { TAGS } from '@/utils/constants/tags';
import {
  Frame,
  FrameHeader,
  FrameTitle,
  FrameDescription,
  FramePanel,
} from '@/components/ui/frame';

const RoleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const { control, handleSubmit, reset } = useForm<IRoleCreateRequest>({
    resolver: yupResolver(roleValidationSchema),
    defaultValues: {
      name: '',
      roleValue: 0,
      description: '',
      isActive: true,
      isDefault: false,
    },
  });

  const { data: roleData, isLoading: isLoadingRole } = useQuery({
    queryKey: [TAGS.ROLE, id],
    queryFn: () => getRole(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (roleData && isEditMode) {
      reset({
        name: roleData.name,
        roleValue: roleData.roleValue,
        description: roleData.description,
        isActive: roleData.isActive,
        isDefault: roleData.isDefault,
      });
    }
  }, [roleData, reset, isEditMode]);

  const { mutate: createRoleMutation, isPending: isCreating } = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toastManager.add({
        title: 'Role created successfully',
        type: 'success',
      });
      reset();
      navigate('/roles');
    },
    onError: (error: any) => {
      toastManager.add({
        title: error.message || 'Failed to create role',
        type: 'error',
      });
    },
  });

  const { mutate: updateRoleMutation, isPending: isUpdating } = useMutation({
    mutationFn: (data: IRoleUpdateRequest) => updateRole(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', id] });
      toastManager.add({
        title: 'Role updated successfully',
        type: 'success',
      });
      navigate('/roles');
    },
    onError: (error: any) => {
      toastManager.add({
        title: error.message || 'Failed to update role',
        type: 'error',
      });
    },
  });

  const onSubmit = (data: IRoleCreateRequest) => {
    if (isEditMode && id) {
      updateRoleMutation({ ...data, id });
    } else {
      createRoleMutation(data);
    }
  };

  if (isLoadingRole && isEditMode) {
    return <LoadingSpinner />;
  }

  return (
    <section className="p-4">
      <Frame>
        <FrameHeader>
          <FrameTitle className="text-2xl font-bold">
            {isEditMode ? 'Edit Role' : 'Create Role'}
          </FrameTitle>
          <FrameDescription className="text-muted-foreground text-base">
            {isEditMode
              ? 'Update role information and permissions'
              : 'Create a role with specific permissions'}
          </FrameDescription>
        </FrameHeader>
        <FramePanel>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:*:w-1/2">
                <ControlledInputText
                  control={control}
                  name="name"
                  label="Role Name"
                  placeholder="e.g., Admin"
                  required
                />
                <ControlledInputNumber
                  control={control}
                  name="roleValue"
                  label="Role Value"
                  placeholder="e.g., 1"
                />
              </div>
              <ControlledInputTextarea
                control={control}
                name="description"
                label="Description"
                placeholder="e.g., Admin role"
              />
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:*:w-1/2">
                <ControlledCheckbox
                  control={control}
                  name="isActive"
                  label="Is Active"
                  description="The role will be active if this is checked"
                />
                <ControlledCheckbox
                  control={control}
                  name="isDefault"
                  label="Is Default"
                  description="The role will be default if this is checked"
                />
              </div>
              <div className="flex flex-col items-center gap-4 md:flex-row md:*:w-1/2">
                <CustomButton
                  label="Cancel"
                  onClick={() => navigate('/roles')}
                  variant="outline"
                  className="w-full md:w-auto"
                />
                <CustomButton
                  label={isEditMode ? 'Update' : 'Create'}
                  onClick={handleSubmit(onSubmit)}
                  disabled={isCreating || isUpdating}
                  loading={isCreating || isUpdating}
                  className="w-full md:w-auto"
                />
              </div>
            </div>
          </form>
        </FramePanel>
      </Frame>
    </section>
  );
};

export default RoleForm;
