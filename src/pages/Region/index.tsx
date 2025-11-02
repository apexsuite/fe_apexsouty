import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomDataTable from "@/components/CustomDataTable";
import { IRegionRequest } from "@/services/region/types";
import { getRegions } from "@/services/region";
import RegionFilters from "./components/RegionFilters";
import getRegionColumns from "./column.data";
import useQueryParams from "@/utils/hooks/useQueryParams";

const Region = () => {
    const [searchParams] = useSearchParams();
    const { updateQueryParams, getQueryParams } = useQueryParams();

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


    const handlePageChange = (page: number) => {
        updateQueryParams({ page });
    };

    const handlePageSizeChange = (pageSize: number) => {
        updateQueryParams({ page: 1, pageSize });
    };

    const columns = getRegionColumns();

    return (
        <div className="container mx-auto space-y-6 py-8 px-4">
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
                pageCount={data?.pageCount || 0}
                pageIndex={(data?.page || 1) - 1}
                pageSize={data?.pageSize || 10}
                totalCount={data?.totalCount || 0}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                isLoading={isLoading}
            />
        </div>
    );
};

export default Region;