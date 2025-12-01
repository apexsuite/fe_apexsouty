import DateTimeDisplay from "@/components/common/date-time-display";
import IdCopy from "@/components/common/id-copy";
import { InfoSection } from "@/components/common/info-section";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getSupportTicketMessageById } from "@/services/support";
import { ISupportTicketMessage } from "@/services/support/types";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { useParams, useNavigate } from "react-router-dom";
import CustomButton from "@/components/CustomButton";

const MessageDetail = () => {
    const { id, messageId } = useParams<{ id: string; messageId: string }>();
    const navigate = useNavigate();

    if (!id || !messageId) {
        return null;
    }

    const {
        data: message,
        isLoading,
        isError,
    } = useQuery<ISupportTicketMessage>({
        queryKey: ["support-ticket-message", id, messageId],
        queryFn: () => getSupportTicketMessageById(id as string, messageId),
        enabled: !!id && !!messageId,
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError || !message) {
        return (
            <div className="m-8 mx-auto w-full max-w-3xl">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
                    <p className="mb-4 text-sm text-destructive">
                        {t("notification.recordNotFound") || "Kayıt bulunamadı."}
                    </p>
                    <CustomButton
                        variant="outline"
                        label={t("pages.back", "Geri dön")}
                        onClick={() => navigate(`/support/${id}/messages`)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t("support.messages.detailTitle", "Mesaj Detayı")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            "support.messages.detailDescription",
                            "Seçili mesaja ait detayları görüntüleyebilirsiniz.",
                        )}
                    </p>
                </div>
                <CustomButton
                    variant="outline"
                    label={t("common.back", "Geri")}
                    onClick={() => navigate(`/support/${id}/messages`)}
                />
            </div>

            <InfoSection
                title={t("support.messages.detailInfo", "Mesaj Bilgileri")}
                items={[
                    {
                        label: t("support.messages.table.ownerId", "Sahip ID"),
                        value: message.senderName
                    },
                    {
                        label: t(
                            "support.messages.table.message",
                            "Mesaj",
                        ),
                        value: (
                            <p className="whitespace-pre-wrap text-sm">
                                {message.message}
                            </p>
                        ),
                    },
                    {
                        label: t(
                            "support.messages.table.createdAt",
                            "Gönderim Tarihi",
                        ),
                        value: (
                            <DateTimeDisplay
                                value={message.createdAt}
                                mode="datetime"
                            />
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default MessageDetail;