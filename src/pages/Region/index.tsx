import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CustomDataTable from "@/components/CustomDataTable";
import { IRegionRequest } from "@/services/region/types";
import { changeRegionStatus, deleteRegion, getRegions } from "@/services/region";
import RegionFilters from "./components/RegionFilters";
import getRegionColumns from "./column.data";
import useQueryParams from "@/utils/hooks/useQueryParams";
import usePagination from "@/utils/hooks/usePagination";
import { toast } from "react-toastify";

const Region = () => {
    const [page, setPage] = usePagination();
    const [searchParams] = useSearchParams();
    const { getQueryParams } = useQueryParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();



    const params = useMemo<IRegionRequest>(() => {
        const { page, pageSize, regionName, regionURL, isActive } = getQueryParams(["page", "pageSize", "regionName", "regionURL", "isActive"]);

        return {
            page: page ? Number(page) : 1,
            pageSize: pageSize ? Number(pageSize) : 10,
            ...(regionName && { regionName }),
            ...(regionURL && { regionURL }),
            ...(isActive && { isActive }),
        };
    }, [searchParams]);

    const { data, isLoading } = useQuery({
        queryKey: ["regions", params],
        queryFn: () => getRegions(params),
    });

    const { mutate: deleteRegionMutation } = useMutation({
        mutationFn: deleteRegion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regions'] });
            toast.success('Region deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete region');
        },
    });

    const { mutate: changeRegionStatusMutation } = useMutation({
        mutationFn: changeRegionStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regions'] });
            toast.success('Region status changed successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to change region status');
        },
    });

    const columns = getRegionColumns({
        navigate,
        deleteRegion: deleteRegionMutation,
        changeRegionStatus: changeRegionStatusMutation
    });


    return (
        <div className="space-y-4 p-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Regions</h1>
                    <p className="text-muted-foreground">
                        View and manage Amazon regions
                    </p>
                </div>
            </div>

            <RegionFilters />

            <CustomDataTable
                columns={columns}
                data={data?.items || []}
                pagination={page.componentParams}
                setPagination={setPage}
                totalCount={data?.totalCount || 0}
                pageCount={data?.pageCount}
                isLoading={isLoading}
            />
        </div>
    );
};

export default Region;