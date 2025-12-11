import CustomDataTable from "@/components/CustomDataTable";
import CustomPageLayout from "@/components/CustomPageLayout";
import { deleteSupportTicket, getSupportTickets } from "@/services/support";
import { ISupportTicketRequest } from "@/services/support/types";
import usePagination from "@/utils/hooks/usePagination";
import useQueryParams from "@/utils/hooks/useQueryParams";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FILTER_INPUTS } from "./filter.data";
import getSupportTicketColumns from "./column.data";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Support = () => {
    const { t } = useTranslation();
    const [page, setPage] = usePagination();
    const [searchParams] = useSearchParams();
    const { getQueryParams } = useQueryParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState<string | null>(null);

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

    const { mutateAsync: removeTicket } = useMutation({
        mutationFn: (id: string) => deleteSupportTicket(id),
        onSuccess: (_data) => {
            queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
            toast.success(
                t(
                    "support.detail.deleteSuccess",
                    "Destek talebi başarıyla silindi.",
                ),
            );
        },
        onError: (error: any) => {
            toast.error(error?.message || t("notification.anErrorOccurred"));
        },
        onSettled: () => {
            setDeletingId(null);
        },
    });

    const handleDeleteTicket = async (id: string, subject: string) => {
        const confirmed = window.confirm(
            t(
                "support.list.deleteConfirm",
                `"${subject}" başlıklı ticket'ı silmek istediğinize emin misiniz?`,
            ),
        );

        if (!confirmed) return;

        setDeletingId(id);
        await removeTicket(id);
    };

    const columns = getSupportTicketColumns({
        navigate,
        onDelete: handleDeleteTicket,
        deletingId,
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