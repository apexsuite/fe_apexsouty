import CustomPageLayout from '@/components/CustomPageLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getVendors } from '@/services/vendor';
import { IVendorRequest } from '@/services/vendor/types';
import usePagination from '@/utils/hooks/usePagination';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import getVendorColumns from './column.data';
import CustomDataTable from '@/components/CustomDataTable';
import { FILTER_INPUTS } from '@/pages/Vendor/filter.data';

export default function Vendor() {
  const [page, setPage] = usePagination();
  const [searchParams] = useSearchParams();
  const { getQueryParams } = useQueryParams();

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

  const { data, isLoading } = useQuery({
    queryKey: ['vendors', params],
    queryFn: () => getVendors(params),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const columns = getVendorColumns();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <CustomPageLayout
      title="Vendors"
      description="View and manage vendors"
      filters={{ inputs: FILTER_INPUTS, path: '/vendors/create' }}
      datatable={
        <CustomDataTable
          columns={columns}
          data={data?.items || []}
          pagination={page.componentParams}
          setPagination={setPage}
          totalCount={data?.totalCount || 0}
          pageCount={data?.pageCount}
          isLoading={isLoading}
        />
      }
    />
  );
}
