import CustomDataTable from "@/components/CustomDataTable";
import CustomPageLayout from "@/components/CustomPageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { deleteSupportTicketMessage, getSupportTicketMessages } from "@/services/support";
import { ISupportTicketMessage } from "@/services/support/types";
import usePagination from "@/utils/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getMessagesColumns from "./column.data";
import { toast } from "react-toastify";

const Messages = () => {
    const { id } = useParams<{ id: string }>();
    const [pagination, setPage] = usePagination(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["support-ticket-messages", id, pagination.request],
        queryFn: () =>
            getSupportTicketMessages(id as string, {
                page: pagination.request.page,
                limit: pagination.request.pageSize,
            }),
        enabled: !!id,
    });

    const { mutateAsync: removeMessage } = useMutation({
        mutationFn: (messageId: string) =>
            deleteSupportTicketMessage(id as string, messageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["support-ticket-messages", id],
            });
            toast.success(
                t(
                    "support.messages.deleteSuccess",
                    "Mesaj başarıyla silindi.",
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

    const handleDeleteMessage = async (messageId: string) => {
        const confirmed = window.confirm(
            t(
                "support.messages.deleteConfirm",
                "Bu mesajı silmek istediğinize emin misiniz?",
            ),
        );

        if (!confirmed) return;

        setDeletingId(messageId);
        await removeMessage(messageId);
    };

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

    const columns = getMessagesColumns({
        navigate,
        onDelete: handleDeleteMessage,
        deletingId,
    });

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