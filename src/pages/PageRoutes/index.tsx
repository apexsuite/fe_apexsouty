import CustomPageLayout from '@/components/CustomPageLayout';
import usePagination from '@/utils/hooks/usePagination';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomDataTable from '@/components/CustomDataTable';
import { toastManager } from '@/components/ui/toast';
import { TAGS } from '@/utils/constants/tags';
import type { IPageRouteRequest } from '@/services/page-routes/types';
import getPageRouteColumns from '@/pages/PageRoutes/column.data';
import {
  changePageRouteStatus,
  deletePageRoute,
  getPageRoutes,
} from '@/services/page-routes';
import { FILTER_INPUTS } from '@/pages/PageRoutes/filter.data';

export default function PageRoutes() {
  const navigate = useNavigate();
  const [page, setPage] = usePagination();
  const [searchParams] = useSearchParams();
  const { getQueryParams } = useQueryParams();
  const queryClient = useQueryClient();

  const params = useMemo<IPageRouteRequest>(() => {
    const {
      page,
      pageSize,
      name,
      description,
      path,
      component,
      isActive,
      isDefault,
      isUnderConstruction,
    } = getQueryParams([
      'page',
      'pageSize',
      'name',
      'description',
      'path',
      'component',
      'isActive',
      'isDefault',
      'isUnderConstruction',
    ]);

    return {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      ...(name && { name }),
      ...(description && { description }),
      ...(path && { path }),
      ...(component && { component }),
      ...(isActive && { isActive: isActive === 'true' }),
      ...(isDefault && { isDefault: isDefault === 'true' }),
      ...(isUnderConstruction && {
        isUnderConstruction: isUnderConstruction === 'true',
      }),
    };
  }, [searchParams]);

  const { data: pageRoutes, isFetching } = useQuery({
    queryKey: [TAGS.PAGE_ROUTE, params],
    queryFn: () => getPageRoutes(params),
  });

  const { mutate: changePageRouteStatusMutation } = useMutation({
    mutationFn: changePageRouteStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS.PAGE_ROUTE] });
      toastManager.add({
        title: 'Page route status changed successfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toastManager.add({
        title: error.message ?? 'Failed to change page route status',
        type: 'error',
      });
    },
  });

  const { mutateAsync: deletePageRouteMutation } = useMutation({
    mutationFn: (id: string) => {
      toastManager.promise(deletePageRoute(id), {
        loading: {
          title: 'Deleting',
        },
        success: () => ({
          title: 'Page route deleted successfully',
        }),
        error: (error: Error) => ({
          title: 'Error',
          description: error.message ?? 'Failed to delete page route',
        }),
      });

      return deletePageRoute(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS.PAGE_ROUTE] });
    },
  });

  const columns = getPageRouteColumns({
    navigate,
    deletePageRoute: deletePageRouteMutation,
    changePageRouteStatus: changePageRouteStatusMutation,
  });

  return (
    <CustomPageLayout
      title="Page Routes"
      description="Manage and edit all your pages"
      filters={{ inputs: FILTER_INPUTS, path: '/page-routes/create' }}
      datatable={
        <CustomDataTable
          columns={columns}
          data={pageRoutes?.items || []}
          pagination={page.componentParams}
          setPagination={setPage}
          totalCount={pageRoutes?.totalCount || 0}
          pageCount={pageRoutes?.pageCount}
          isLoading={isFetching}
        />
      }
    />
  );
}
