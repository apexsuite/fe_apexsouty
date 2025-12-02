import CustomButton from "@/components/CustomButton";
import DateTimeDisplay from "@/components/common/date-time-display";
import IdCopy from "@/components/common/id-copy";
import PermissionGuard from "@/components/PermissionGuard";
import { ISupportTicketMessage } from "@/services/support/types";
import { ColumnDef } from "@tanstack/react-table";
import ButtonGroup from "antd/es/button/button-group";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { t } from "i18next";

interface IMessagesColumnsProps {
    navigate: NavigateFunction;
    onDelete: (messageId: string) => void;
    deletingId?: string | null;
}

const getMessagesColumns = ({
    navigate,
    onDelete,
    deletingId,
}: IMessagesColumnsProps): ColumnDef<ISupportTicketMessage>[] => [
        {
            accessorKey: "ownerId",
            header: t("support.messages.table.ownerId", "Owner ID"),
            cell: ({ row }) => (
                <IdCopy
                    value={row.original.ownerId}
                    tooltip={t("support.messages.table.copyOwnerId")}
                    successMessage={t("support.messages.table.copyOwnerIdSuccess")}
                />
            ),
        },
        {
            accessorKey: "message",
            header: t("support.messages.table.message", "Mesaj"),
            cell: ({ row }) => (
                <p className="max-w-xl whitespace-pre-wrap text-sm">
                    {row.original.message}
                </p>
            ),
        },
        {
            accessorKey: "createdAt",
            header: t("support.messages.table.createdAt", "Gönderim Tarihi"),
            cell: ({ row }) => (
                <DateTimeDisplay value={row.original.createdAt} mode="datetime" />
            ),
        },
        {
            accessorKey: "id",
            header: t("common.actions", "İşlemler"),
            cell: ({ row }) => (
                <ButtonGroup>
                    <CustomButton
                        variant="outline"
                        tooltip={t(
                            "support.messages.table.viewDetail",
                            "Mesaj detayını görüntüle",
                        )}
                        icon={<Eye />}
                        onClick={() =>
                            navigate(
                                `/support/${row.original.ticketId}/messages/${row.original.id}`,
                            )
                        }
                    />
                    <PermissionGuard permission="update-ticket-message" mode="hide">
                        <CustomButton
                            variant="outline"
                            tooltip={t(
                                "support.messages.table.editMessage",
                                "Mesajı düzenle",
                            )}
                            icon={<Pencil />}
                            onClick={() =>
                                navigate(
                                    `/support/${row.original.ticketId}/messages/${row.original.id}/edit`,
                                )
                            }
                        />
                    </PermissionGuard>

                    <PermissionGuard permission="update-ticket-message" mode="hide">
                        <CustomButton
                            variant="outline"
                            tooltip={t(
                                "support.messages.table.deleteMessage",
                                "Mesajı sil",
                            )}
                            icon={<Trash2 />}
                            loading={deletingId === row.original.id}
                            onClick={() => onDelete(row.original.id)}
                        />
                    </PermissionGuard>
                </ButtonGroup>
            ),
        },
    ];

export default getMessagesColumns;