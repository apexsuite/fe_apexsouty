import {
  ControlledCheckbox,
  ControlledInputText,
} from '@/components/FormInputs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CustomButton from '@/components/CustomButton';
import { toastManager } from '@/components/ui/toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ControlledInputTextarea } from '@/components/FormInputs/ControlledInputTextarea';
import { TAGS } from '@/utils/constants/tags';
import {
  Frame,
  FrameHeader,
  FrameTitle,
  FrameDescription,
  FramePanel,
} from '@/components/ui/frame';
import {
  ICreatePageRoute,
  type IUpdatePageRoute,
} from '@/services/page-routes/types';
import {
  createPageRoute,
  getPageRoute,
  updatePageRoute,
} from '@/services/page-routes';
import { yupResolver } from '@hookform/resolvers/yup';
import { pageRoutesValidationSchema } from './page-routes.validation';

const PageRouteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreatePageRoute>({
    resolver: yupResolver(pageRoutesValidationSchema),
    defaultValues: {
      name: '',
      path: '',
      component: '',
      icon: '',
      description: '',
      isActive: true,
      isUnderConstruction: false,
      isVisible: true,
    },
  });

  const { data: pageRouteData, isLoading: isLoadingPageRoute } = useQuery({
    queryKey: [TAGS.PAGE_ROUTE, id],
    queryFn: () => getPageRoute(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (pageRouteData && isEditMode) {
      reset({
        name: pageRouteData.name,
        path: pageRouteData.path,
        component: pageRouteData.component,
        icon: pageRouteData.icon,
        description: pageRouteData.description,
        isActive: pageRouteData.isActive,
        isUnderConstruction: pageRouteData.IsUnderConstruction,
        isVisible: pageRouteData.isVisible,
      });
    }
  }, [pageRouteData, reset, isEditMode]);

  const { mutate: createPageRouteMutation, isPending: isCreating } =
    useMutation({
      mutationFn: createPageRoute,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TAGS.PAGE_ROUTE] });
        toastManager.add({
          title: 'Page route created successfully',
          type: 'success',
        });
        reset();
        navigate('/page-routes');
      },
      onError: (error: any) => {
        toastManager.add({
          title: error.message || 'Failed to create page route',
          type: 'error',
        });
      },
    });

  const { mutate: updatePageRouteMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: (data: IUpdatePageRoute) => updatePageRoute(id!, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TAGS.PAGE_ROUTE] });
        queryClient.invalidateQueries({ queryKey: [TAGS.PAGE_ROUTE, id!] });
        toastManager.add({
          title: 'Page route updated successfully',
          type: 'success',
        });
        navigate('/page-routes');
      },
      onError: (error: any) => {
        toastManager.add({
          title: error.message || 'Failed to update page route',
          type: 'error',
        });
      },
    });

  const onSubmit = (data: ICreatePageRoute) => {
    if (isEditMode && id) {
      updatePageRouteMutation({ ...data, id });
    } else {
      createPageRouteMutation(data);
    }
  };

  if (isLoadingPageRoute && isEditMode) {
    return <LoadingSpinner />;
  }

  return (
    <section className="p-4">
      <Frame>
        {errors && <div className="text-red-500">{errors.name?.message}</div>}
        <FrameHeader>
          <FrameTitle className="text-2xl font-bold">
            {isEditMode ? 'Edit Page Route' : 'Create Page Route'}
          </FrameTitle>
          <FrameDescription className="text-muted-foreground text-base">
            {isEditMode
              ? 'Update page route information and permissions'
              : 'Create a page route with specific permissions'}
          </FrameDescription>
        </FrameHeader>
        <FramePanel>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <ControlledInputText
                control={control}
                name="name"
                label="Page Route Name"
                placeholder="e.g., Admin"
                required
              />
              <ControlledInputText
                control={control}
                name="path"
                label="Page Route Path"
                placeholder="Page route path"
              />
              <ControlledInputText
                control={control}
                name="component"
                label="Component"
                placeholder="e.g., AdminComponent"
              />
              <ControlledInputText
                control={control}
                name="icon"
                label="Icon"
                placeholder="e.g., AdminIcon"
              />
              <ControlledInputTextarea
                control={control}
                name="description"
                label="Description"
                placeholder="e.g., Admin page route"
              />
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:*:w-1/3">
                <ControlledCheckbox
                  control={control}
                  name="isActive"
                  label="Is Active"
                  description="The role will be active if this is checked"
                />
                <ControlledCheckbox
                  control={control}
                  name="isVisible"
                  label="Is Visible"
                  description="The page route will be visible if this is checked"
                />
                <ControlledCheckbox
                  control={control}
                  name="isUnderConstruction"
                  label="Is Under Construction"
                  description="The page route will be under construction if this is checked"
                />
              </div>
              <div className="flex flex-col items-center gap-4 md:flex-row md:*:w-1/2">
                <CustomButton
                  label="Cancel"
                  onClick={() => navigate('/page-routes')}
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

export default PageRouteForm;
