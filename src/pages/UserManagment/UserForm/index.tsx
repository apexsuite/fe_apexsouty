import {
  ControlledCheckbox,
  ControlledInputText,
  ControlledPassword,
  ControlledSelect,
} from '@/components/FormInputs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CustomButton from '@/components/CustomButton';
import { toastManager } from '@/components/ui/toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { yupResolver } from '@hookform/resolvers/yup';
import { TAGS } from '@/utils/constants/tags';
import {
  Frame,
  FrameHeader,
  FrameTitle,
  FrameDescription,
  FramePanel,
} from '@/components/ui/frame';
import userFormValidationSchema from './user-form.validations';
import {
  IUserCreateRequest,
  IUserUpdateRequest,
  UserType,
} from '@/services/user-managment/types';
import { createUser, getUser, updateUser } from '@/services/user-managment';
import { USER_TYPE_OPTIONS } from '@/utils/constants/options';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const { control, handleSubmit, reset } = useForm<
    IUserCreateRequest | IUserUpdateRequest
  >({
    resolver: yupResolver(userFormValidationSchema(isEditMode)),
    defaultValues: {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      userType: UserType.USER,
      isActive: false,
    },
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [TAGS.USER, id],
    queryFn: () => getUser(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (user && isEditMode) {
      reset({
        email: user?.email,
        firstname: user?.firstname,
        lastname: user?.lastname,
        userType: user?.userType,
        isActive: user?.isActive,
        password: '',
      });
    }
  }, [user, reset, isEditMode]);

  const { mutate: createUserMutation, isPending: isCreating } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS.USER] });
      toastManager.add({
        title: 'User created successfully',
        type: 'success',
      });
      reset();
      navigate('/user-management');
    },
    onError: (error: any) => {
      toastManager.add({
        title: error.message || 'Failed to create user',
        type: 'error',
      });
    },
  });

  const { mutate: updateUserMutation, isPending: isUpdating } = useMutation({
    mutationFn: (data: IUserUpdateRequest) => updateUser(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS.USER] });
      queryClient.invalidateQueries({ queryKey: [TAGS.USER, id] });
      toastManager.add({
        title: 'User updated successfully',
        type: 'success',
      });
      navigate('/user-management');
    },
    onError: (error: any) => {
      toastManager.add({
        title: error.message || 'Failed to update user',
        type: 'error',
      });
    },
  });

  const onSubmit = (data: IUserCreateRequest | IUserUpdateRequest) => {
    if (isEditMode && id) {
      const updateData: IUserUpdateRequest = {
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        userType: data.userType,
        isActive: data.isActive,
        ...(data.password && { password: data.password }),
      };
      updateUserMutation(updateData);
    } else {
      createUserMutation(data as IUserCreateRequest);
    }
  };

  if (isLoadingUser && isEditMode) {
    return <LoadingSpinner />;
  }

  return (
    <Frame>
      <FrameHeader>
        <FrameTitle className="text-2xl font-bold">
          {isEditMode ? 'Edit User' : 'Create User'}
        </FrameTitle>
        <FrameDescription className="text-muted-foreground text-base">
          {isEditMode ? 'Update user information' : 'Create a new user account'}
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:*:w-1/2">
              <ControlledInputText
                control={control}
                name="firstname"
                label="First Name"
                placeholder="e.g., John"
                required
              />
              <ControlledInputText
                control={control}
                name="lastname"
                label="Last Name"
                placeholder="e.g., Doe"
                required
              />
            </div>
            <ControlledInputText
              control={control}
              name="email"
              label="Email"
              placeholder="e.g., john.doe@example.com"
              type="email"
              required
            />
            {!isEditMode && (
              <ControlledPassword
                control={control}
                name="password"
                label="Password"
                placeholder="Enter password"
                required={!isEditMode}
              />
            )}
            <ControlledSelect
              control={control}
              name="userType"
              label="User Type"
              options={USER_TYPE_OPTIONS}
              placeholder="Select user type"
              required
            />
            <ControlledCheckbox
              control={control}
              name="isActive"
              label="Is Active"
              description="The user will be active if this is checked"
            />
            <div className="flex justify-end gap-2">
              <CustomButton
                label="Cancel"
                onClick={() => navigate('/user-management')}
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
  );
};

export default UserForm;
