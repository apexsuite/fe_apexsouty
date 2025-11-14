import CustomDataTable from '@/components/CustomDataTable';
import usePagination from '@/utils/hooks/usePagination';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { IMarketPlaceRequest } from '@/services/marketplaces/type';
import {
  changeMarketplaceStatus,
  deleteMarketplace,
  getMarketplaces,
} from '@/services/marketplaces';
import { toast } from 'react-toastify';
import getMarketPlaceColumns from '@/pages/MarketPlaces/column.data';
import CustomPageLayout from '@/components/CustomPageLayout';
import { FILTER_INPUTS } from '@/pages/MarketPlaces/filter.data';

const MarketPlaces = () => {
  const [page, setPage] = usePagination();
  const [searchParams] = useSearchParams();
  const { getQueryParams } = useQueryParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const params = useMemo<IMarketPlaceRequest>(() => {
    const { page, pageSize, marketplace, marketplaceURL, isActive } =
      getQueryParams([
        'page',
        'pageSize',
        'marketplace',
        'marketplaceURL',
        'isActive',
      ]);

    return {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      ...(marketplace && { marketplace }),
      ...(marketplaceURL && { marketplaceURL }),
      ...(isActive && { isActive }),
    };
  }, [searchParams]);
  const { data, isLoading } = useQuery({
    queryKey: ['marketplaces', params],
    queryFn: () => getMarketplaces(params),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { mutate: deleteMarketplaceMutation } = useMutation({
    mutationFn: deleteMarketplace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplaces'] });
      toast.success('Marketplace deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete marketplace');
    },
  });

  const { mutate: changeMarketplaceStatusMutation } = useMutation({
    mutationFn: changeMarketplaceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplaces'] });
      toast.success('Marketplace status changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change marketplace status');
    },
  });

  const columns = getMarketPlaceColumns({
    navigate,
    deleteMarketplace: deleteMarketplaceMutation,
    changeMarketplaceStatus: changeMarketplaceStatusMutation,
  });

  return (
    <CustomPageLayout
      title="Market Places"
      description="View and manage Amazon market places"
      filters={{ inputs: FILTER_INPUTS, path: '/marketplaces/create' }}
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
};

export default MarketPlaces;
