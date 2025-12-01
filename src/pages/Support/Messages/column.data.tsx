import DateTimeDisplay from "@/components/common/date-time-display";
import IdCopy from "@/components/common/id-copy";
import { ISupportTicketMessage } from "@/services/support/types";
import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";

const getMessagesColumns = (): ColumnDef<ISupportTicketMessage>[] => [
    {
        accessorKey: "ownerId",
        header: t("support.messages.table.ownerId", "Owner ID"),
        cell: ({ row }) => (
            <IdCopy value={row.original.ownerId} tooltip={t("support.messages.table.copyOwnerId")} successMessage={t("support.messages.table.copyOwnerIdSuccess")} />
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
];

export default getMessagesColumns;