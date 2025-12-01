import CustomDataTable from "@/components/CustomDataTable";
import CustomPageLayout from "@/components/CustomPageLayout";
import { getSupportTickets } from "@/services/support";
import { ISupportTicketRequest } from "@/services/support/types";
import usePagination from "@/utils/hooks/usePagination";
import useQueryParams from "@/utils/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FILTER_INPUTS } from "./filter.data";
import getSupportTicketColumns from "./column.data";
import { useTranslation } from "react-i18next";

const Support = () => {
    const { t } = useTranslation();
    const [page, setPage] = usePagination();
    const [searchParams] = useSearchParams();
    const { getQueryParams } = useQueryParams();
    const navigate = useNavigate();

    const params = useMemo<ISupportTicketRequest>(() => {
        const { page, pageSize, subject, status, priority, category, assignedToId, isPersonal } = getQueryParams([
            'page',
            'pageSize',
            'subject',
            'status',
            'priority',
            'category',
            'assignedToId',
            'isPersonal',
        ]);

        return {
            page: page ? Number(page) : 1,
            pageSize: pageSize ? Number(pageSize) : 10,
            ...(subject && { subject }),
            ...(status && { status }),
            ...(priority && { priority }),
            ...(category && { category }),
            ...(assignedToId && { assignedToId }),
            ...(isPersonal && { isPersonal: isPersonal === 'true' }),
        };
    }, [searchParams]);

    const { data, isLoading } = useQuery({
        queryKey: ['supportTickets', params],
        queryFn: () => getSupportTickets(params),
        staleTime: 0,
        refetchOnMount: 'always',
    });


    const columns = getSupportTicketColumns({
        navigate,
    });

    return (
        <CustomPageLayout
            title={t("support.list.title")}
            description={t("support.list.description")}
            filters={{ inputs: FILTER_INPUTS, path: '/support/create' }}
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
    )
};

export default Support;