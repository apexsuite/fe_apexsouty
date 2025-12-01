import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import PermissionGuard from "@/components/PermissionGuard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    assignSupportTicket,
    closeSupportTicket,
    deleteSupportTicket,
    getSupportTicketById,
    reopenSupportTicket,
    unassignSupportTicket,
} from "@/services/support";
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
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "react-toastify";

/**
 * @description
 * Destek bileti detaylarını ve mesajlaşma geçmişini gösteren sayfa.
 */
const SupportDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [assignedToId, setAssignedToId] = useState<string>("");

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

    /**
     * @description
     * Detay ve liste sorgularını yeniden tetiklemek için yardımcı fonksiyon.
     * Böylece statü / öncelik / atama değişiklikleri ekrana yansır.
     */
    const invalidateSupportQueries = () => {
        if (!id) return;
        queryClient.invalidateQueries({ queryKey: ["support-ticket", id] });
        queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
    };

    // Ticket yeniden açma
    const { mutateAsync: reopenTicket, status: reopenStatus } = useMutation({
        mutationFn: () => reopenSupportTicket(id as string),
        onSuccess: () => {
            toast.success(
                t(
                    "support.detail.reopenSuccess",
                    "Destek talebi başarıyla yeniden açıldı.",
                ),
            );
            invalidateSupportQueries();
        },
        onError: (error: any) => {
            toast.error(error?.message || t("notification.anErrorOccurred"));
        },
    });

    // Ticket kapatma
    const { mutateAsync: closeTicket, status: closeStatus } = useMutation({
        mutationFn: () => closeSupportTicket(id as string),
        onSuccess: () => {
            toast.success(
                t(
                    "support.detail.closeSuccess",
                    "Destek talebi başarıyla kapatıldı.",
                ),
            );
            invalidateSupportQueries();
        },
        onError: (error: any) => {
            toast.error(error?.message || t("notification.anErrorOccurred"));
        },
    });

    // Ticket silme
    const { mutateAsync: removeTicket, status: deleteStatus } = useMutation({
        mutationFn: () => deleteSupportTicket(id as string),
        onSuccess: () => {
            toast.success(
                t(
                    "support.detail.deleteSuccess",
                    "Destek talebi başarıyla silindi.",
                ),
            );
            invalidateSupportQueries();
            navigate("/support");
        },
        onError: (error: any) => {
            toast.error(error?.message || t("notification.anErrorOccurred"));
        },
    });

    // Atama (staff only)
    const { mutateAsync: assignTicket, status: assignStatus } = useMutation({
        mutationFn: () =>
            assignSupportTicket(id as string, { assignedToId }),
        onSuccess: () => {
            toast.success(
                t(
                    "support.detail.assignSuccess",
                    "Ticket ataması başarıyla güncellendi.",
                ),
            );
            invalidateSupportQueries();
        },
        onError: (error: any) => {
            toast.error(error?.message || t("notification.anErrorOccurred"));
        },
    });

    // Atama kaldırma (staff only)
    const { mutateAsync: unassignTicket, status: unassignStatus } =
        useMutation({
            mutationFn: () => unassignSupportTicket(id as string),
            onSuccess: () => {
                toast.success(
                    t(
                        "support.detail.unassignSuccess",
                        "Ticket ataması başarıyla kaldırıldı.",
                    ),
                );
                invalidateSupportQueries();
            },
            onError: (error: any) => {
                toast.error(
                    error?.message || t("notification.anErrorOccurred"),
                );
            },
        });

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

    const statusConfig = SUPPORT_TICKET_STATUS.find(
        s => s.value === ticket.status,
    );
    const statusColor =
        STATUS_COLOR_MAP[ticket.status as TicketStatus] ?? "bg-gray-400";

    const priorityConfig = SUPPORT_TICKET_PRIORITY.find(
        p => p.value === ticket.priority,
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
                <div className="flex flex-col items-end gap-2">
                    <CustomButton
                        icon={<Pencil className="h-4 w-4" />}
                        label={t(
                            "support.list.tooltips.editTicket",
                            "Edit Support Ticket"
                        )}
                        onClick={() => navigate(`/support/${id}/edit`)}
                        variant="default"
                    />

                    {/* Hızlı ticket aksiyonları */}
                    <div className="flex flex-wrap justify-end gap-2">
                        {(ticket.status === TicketStatus.CLOSED ||
                            ticket.status === TicketStatus.RESOLVED) && (
                                <CustomButton
                                    variant="outline"
                                    size="sm"
                                    label={t(
                                        "support.detail.reopen",
                                        "Reopen Ticket",
                                    )}
                                    loading={reopenStatus === "pending"}
                                    onClick={() => reopenTicket()}
                                />
                            )}
                        {ticket.status !== TicketStatus.CLOSED && (
                            <CustomButton
                                variant="outline"
                                size="sm"
                                label={t(
                                    "support.detail.close",
                                    "Close Ticket",
                                )}
                                loading={closeStatus === "pending"}
                                onClick={() => closeTicket()}
                            />
                        )}
                        <CustomButton
                            variant="destructive"
                            size="sm"
                            label={t(
                                "support.detail.delete",
                                "Delete Ticket",
                            )}
                            loading={deleteStatus === "pending"}
                            onClick={() => removeTicket()}
                        />
                    </div>
                </div>
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
                                <div className="flex flex-col gap-2">
                                    <IdCopy
                                        value={ticket.ownerId}
                                        tooltip="Copy Owner ID"
                                        successMessage="Owner ID panoya kopyalandı"
                                    />

                                    {/* Atama / unassign alanı - sadece staff/admin */}
                                    <PermissionGuard
                                        permission="assign-ticket"
                                        mode="hide"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="text"
                                                className="w-full rounded-md border bg-background px-2 py-1 text-xs"
                                                placeholder={t(
                                                    "support.detail.assignedToIdPlaceholder",
                                                    "Kullanıcı ID (UUID) girin",
                                                )}
                                                value={assignedToId}
                                                onChange={e =>
                                                    setAssignedToId(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <div className="flex gap-2">
                                                <CustomButton
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    label={t(
                                                        "support.detail.assign",
                                                        "Assign",
                                                    )}
                                                    loading={assignStatus === "pending"}
                                                    onClick={() =>
                                                        assignTicket()
                                                    }
                                                    disabled={
                                                        !assignedToId.trim()
                                                    }
                                                />
                                                <PermissionGuard
                                                    permission="unassign-ticket"
                                                    mode="hide"
                                                >
                                                    <CustomButton
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        label={t(
                                                            "support.detail.unassign",
                                                            "Unassign",
                                                        )}
                                                        loading={unassignStatus === "pending"}
                                                        onClick={() =>
                                                            unassignTicket()
                                                        }
                                                    />
                                                </PermissionGuard>
                                            </div>
                                        </div>
                                    </PermissionGuard>
                                </div>
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
                        label: t("support.detail.resolvedAt", "Resolved At"),
                        value: (
                            // Çözümlenme tarihi sadece ticket çözüldüğünde doludur
                            <DateTimeDisplay
                                value={ticket.resolvedAt}
                                mode="datetime"
                            />
                        ),
                        icon: <Calendar />,
                    },
                    {
                        label: t("support.detail.closedAt", "Closed At"),
                        value: (
                            // Kapanma tarihi sadece ticket kapandığında doludur
                            <DateTimeDisplay
                                value={ticket.closedAt}
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
