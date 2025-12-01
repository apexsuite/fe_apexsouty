import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowLeft,
    Calendar,
    Key,
    MessageSquare,
    Paperclip,
    Shield,
    User,
    Pencil,
} from "lucide-react";

import CustomButton from "@/components/CustomButton";
import DateTimeDisplay from "@/components/common/date-time-display";
import IdCopy from "@/components/common/id-copy";
import { InfoSection } from "@/components/common/info-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSupportTicketById } from "@/services/support";
import {
    ISupportTicketDetail,
    TicketPriority,
    TicketStatus,
} from "@/services/support/types";
import {
    STATUS_COLOR_MAP,
    PRIORITY_COLOR_MAP,
    SUPPORT_TICKET_CATEGORY,
    SUPPORT_TICKET_PRIORITY,
    SUPPORT_TICKET_STATUS,
} from "@/utils/constants/support";
import { t } from "i18next";
import { Spin } from "antd";
import LoadingSpinner from "@/components/LoadingSpinner";

/**
 * @description
 * Destek bileti detaylarını ve mesajlaşma geçmişini gösteren sayfa.
 */
const SupportDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: ticket,
        isLoading,
        isError,
    } = useQuery<ISupportTicketDetail>({
        queryKey: ["support-ticket", id],
        queryFn: () => getSupportTicketById(id as string),
        enabled: !!id,
    });

    const handleBack = () => {
        navigate("/support");
    };

    if (!id) {
        return null;
    }

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    if (isError || !ticket) {
        return (
            <div className="m-8 mx-auto w-full max-w-3xl">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
                    <p className="mb-4 text-sm text-destructive">
                        {t("notification.recordNotFound") || "Kayıt bulunamadı."}
                    </p>
                    <CustomButton variant="outline" onClick={handleBack}>
                        {t("pages.back") || "Geri dön"}
                    </CustomButton>
                </div>
            </div>
        );
    }

    const statusConfig = SUPPORT_TICKET_STATUS.find(s => s.value === ticket.status);
    const statusColor =
        STATUS_COLOR_MAP[ticket.status as TicketStatus] ?? "bg-gray-400";

    const priorityConfig = SUPPORT_TICKET_PRIORITY.find(
        p => p.value === ticket.priority
    );
    const priorityColor =
        PRIORITY_COLOR_MAP[ticket.priority as TicketPriority] ?? "bg-gray-400";

    const categoryLabel =
        SUPPORT_TICKET_CATEGORY.find(c => c.value === ticket.category)?.label ?? "-";

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleBack}
                        className="mt-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {ticket.subject}
                            </h1>
                            <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                                <Shield className="h-3 w-3" />
                                {statusConfig?.label ?? ticket.status}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t(
                                "support.detail.headerDescription",
                                "Support ticket detail information"
                            )}
                        </p>
                    </div>
                </div>
                <CustomButton
                    icon={<Pencil className="h-4 w-4" />}
                    label={t(
                        "support.list.tooltips.editTicket",
                        "Edit Support Ticket"
                    )}
                    onClick={() => navigate(`/support/${id}/edit`)}
                    variant="default"
                />
            </div>

            <Separator />

            {/* Info sections similar to MarketplaceDetail */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <InfoSection
                    title={t("support.detail.ticketInformation", "Ticket Information")}
                    items={[
                        {
                            label: t("support.list.table.subject", "Subject"),
                            value: ticket.subject,
                            icon: <MessageSquare />,
                        },
                        {
                            label: t("support.list.table.status", "Status"),
                            value: (
                                <span className="inline-flex items-center gap-2 text-xs font-medium">
                                    <span
                                        className={`h-2.5 w-2.5 rounded-full ${statusColor}`}
                                    />
                                    {statusConfig?.label ?? ticket.status}
                                </span>
                            ),
                            icon: <Shield />,
                        },
                        {
                            label: t("support.list.table.priority", "Priority"),
                            value: (
                                <span className="inline-flex items-center gap-2 text-xs font-medium">
                                    <span
                                        className={`h-2.5 w-2.5 rounded-full ${priorityColor}`}
                                    />
                                    {priorityConfig?.label ?? ticket.priority}
                                </span>
                            ),
                            icon: <Shield />,
                        },
                        {
                            label: t("support.list.table.category", "Category"),
                            value: categoryLabel,
                            icon: <MessageSquare />,
                        },
                    ]}
                />

                <InfoSection
                    title={t("support.detail.participants", "Participants")}
                    items={[
                        {
                            label: t("support.list.table.createdBy", "Created By"),
                            value: (
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium">
                                        {ticket.createdByName}
                                    </span>
                                    <IdCopy
                                        value={ticket.createdBy}
                                        tooltip="Copy Created By ID"
                                        successMessage="Created By ID panoya kopyalandı"
                                    />
                                </div>
                            ),
                            icon: <User />,
                        },
                        {
                            label: t("support.list.table.ownerId", "Owner ID"),
                            value: (
                                <IdCopy
                                    value={ticket.ownerId}
                                    tooltip="Copy Owner ID"
                                    successMessage="Owner ID panoya kopyalandı"
                                />
                            ),
                            icon: <User />,
                        },
                    ]}
                />
            </div>

            <InfoSection
                title={t("support.detail.systemInformation", "System Information")}
                icon={<Calendar />}
                layout="grid"
                items={[
                    {
                        label: t("support.list.table.createdAt", "Created At"),
                        value: (
                            <DateTimeDisplay value={ticket.createdAt} mode="datetime" />
                        ),
                        icon: <Calendar />,
                    },
                    {
                        label: t("support.list.table.lastActivityAt", "Last Activity"),
                        value: (
                            <DateTimeDisplay
                                value={ticket.lastActivityAt}
                                mode="datetime"
                            />
                        ),
                        icon: <Calendar />,
                    },
                    {
                        label: "Ticket ID",
                        value: ticket.id,
                        icon: <Key />,
                        type: "code",
                    },
                ]}
            />

            {/* Description, conversation & attachments as InfoSections */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <InfoSection
                        title={t("support.detail.description", "Initial message")}
                        items={[
                            {
                                label: "",
                                value: ticket.description || "-",
                                icon: <MessageSquare />,
                            },
                        ]}
                    />

                    <InfoSection
                        title={t("support.detail.conversation", "Conversation")}
                        items={
                            ticket.messages.length > 0
                                ? ticket.messages.map(message => ({
                                    label: message.senderName,
                                    value: (
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span className="font-medium">
                                                    {message.senderName}
                                                </span>
                                                <DateTimeDisplay
                                                    value={message.createdAt}
                                                    mode="datetime"
                                                />
                                            </div>
                                            <p className="text-sm whitespace-pre-wrap">
                                                {message.message}
                                            </p>
                                            {message.attachments &&
                                                message.attachments.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {message.attachments.map(file => (
                                                            <a
                                                                key={file.id}
                                                                href={`${import.meta.env.VITE_CDN_URL}/${file.filePath}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 rounded-full border bg-muted px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted/80"
                                                            >
                                                                <Paperclip className="h-3 w-3" />
                                                                <span className="max-w-[180px] truncate">
                                                                    {file.fileName}
                                                                </span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                        </div>
                                    ),
                                    icon: <MessageSquare />,
                                }))
                                : [
                                    {
                                        label: "",
                                        value: t(
                                            "support.detail.noMessages",
                                            "Henüz mesaj yok."
                                        ),
                                    },
                                ]
                        }
                    />
                </div>

                <InfoSection
                    title={t("support.list.table.attachments", "Attachments")}
                    items={
                        ticket.attachments && ticket.attachments.length > 0
                            ? ticket.attachments.map(att => ({
                                label: "",
                                value: (
                                    <a
                                        href={att.filePath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs text-foreground hover:bg-muted"
                                    >
                                        <Paperclip className="h-3 w-3" />
                                        <span className="truncate">{att.fileName}</span>
                                    </a>
                                ),
                            }))
                            : [
                                {
                                    label: "",
                                    value: t(
                                        "support.detail.noAttachments",
                                        "Bu ticket için ekli dosya yok."
                                    ),
                                },
                            ]
                    }
                />
            </div>
        </div>
    );
};

export default SupportDetail;
