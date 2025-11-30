import CustomPageLayout from '@/components/CustomPageLayout';
import { deleteVendor, getVendors } from '@/services/vendor';
import { IVendorRequest } from '@/services/vendor/types';
import usePagination from '@/utils/hooks/usePagination';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import getVendorColumns from './column.data';
import CustomDataTable from '@/components/CustomDataTable';
import { FILTER_INPUTS } from '@/pages/Vendor/filter.data';
import { toastManager } from '@/components/ui/toast';
import { TAGS } from '@/utils/constants/tags';

export default function Vendor() {
  const [page, setPage] = usePagination();
  const [searchParams] = useSearchParams();
  const { getQueryParams } = useQueryParams();
  const queryClient = useQueryClient();

  const params = useMemo<IVendorRequest>(() => {
    const { page, pageSize, name, description } = getQueryParams([
      'page',
      'pageSize',
      'name',
      'description',
    ]);

    return {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      ...(name && { name }),
      ...(description && { description }),
    };
  }, [searchParams]);

  const { data: vendors, isFetching } = useQuery({
    queryKey: [TAGS.VENDOR, params],
    queryFn: () => getVendors(params),
  });

  const { mutateAsync: deleteVendorMutation } = useMutation({
    mutationFn: (id: string) => {
      toastManager.promise(deleteVendor(id), {
        loading: {
          title: 'Deleting',
        },
        success: () => ({
          title: 'Vendor deleted successfully',
        }),
        error: (error: Error) => ({
          title: 'Error',
          description: error.message ?? 'Failed to delete vendor',
        }),
      });

      return deleteVendor(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });

  const columns = getVendorColumns({
    deleteVendor: deleteVendorMutation,
  });

  return (
    <CustomPageLayout
      title="Vendors"
      description="View and manage vendors"
      filters={{ inputs: FILTER_INPUTS, path: '/vendors/create' }}
      datatable={
        <CustomDataTable
          columns={columns}
          data={vendors?.items || []}
          pagination={page.componentParams}
          setPagination={setPage}
          totalCount={vendors?.totalCount || 0}
          pageCount={vendors?.pageCount}
          isLoading={isFetching}
        />
      }
    />
  );
}
