import CustomDataTable from "@/components/CustomDataTable";
import CustomPageLayout from "@/components/CustomPageLayout";
import DateTimeDisplay from "@/components/common/date-time-display";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getSupportTicketMessages } from "@/services/support";
import { ISupportTicketMessage } from "@/services/support/types";
import usePagination from "@/utils/hooks/usePagination";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import getMessagesColumns from "./column.data";

const Messages = () => {
    const { id } = useParams<{ id: string }>();
    const [pagination, setPage] = usePagination(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["support-ticket-messages", id, pagination.request],
        queryFn: () =>
            getSupportTicketMessages(id as string, {
                page: pagination.request.page,
                limit: pagination.request.pageSize,
            }),
        enabled: !!id,
    });

    // ID yoksa veya geçersizse hiçbir içerik göstermiyoruz
    if (!id) {
        return null;
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError || !data) {
        return (
            <div className="m-8 mx-auto w-full max-w-3xl">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
                    <p className="mb-4 text-sm text-destructive">
                        {t("notification.recordNotFound") || "Kayıt bulunamadı."}
                    </p>
                </div>
            </div>
        );
    }

    const messages: ISupportTicketMessage[] = data.items || data.data || [];

    const columns = getMessagesColumns();

    return (
        <CustomPageLayout
            title={t("support.messages.title", "Messages")}
            description={t(
                "support.messages.description",
                "Ticket mesaj geçmişini görüntüleyebilirsiniz.",
            )}
            filters={{ inputs: [], path: `/support/${id}/messages/create` }}
            datatable={
                <CustomDataTable
                    columns={columns}
                    data={messages}
                    pagination={pagination.componentParams}
                    setPagination={setPage}
                    totalCount={data.totalCount}
                    pageCount={data.pageCount}
                    isLoading={isLoading}
                />
            }
        />
    );
};

export default Messages;