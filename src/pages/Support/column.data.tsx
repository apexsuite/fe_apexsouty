import CustomButton from "@/components/CustomButton";
import DateTimeDisplay from "@/components/common/date-time-display";
import IdCopy from "@/components/common/id-copy";
import { ISupportTicket, TicketPriority, TicketStatus } from "@/services/support/types";
import { ColumnDef } from "@tanstack/react-table";
import ButtonGroup from "antd/es/button/button-group";
import { Eye, Pencil } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { PRIORITY_COLOR_MAP, STATUS_COLOR_MAP, SUPPORT_TICKET_CATEGORY, SUPPORT_TICKET_PRIORITY, SUPPORT_TICKET_STATUS } from "@/utils/constants/support";
import i18n from "@/locales";

interface ISupportTicketColumnsProps {
    navigate: NavigateFunction;
}

const getSupportTicketColumns = ({
    navigate,
}: ISupportTicketColumnsProps): ColumnDef<ISupportTicket>[] => [
        {
            accessorKey: 'subject',
            header: i18n.t('support.list.table.subject'),
        },
        {
            accessorKey: 'status',
            header: i18n.t('support.list.table.status'),
            cell: ({ row }) => {
                const statusOption = SUPPORT_TICKET_STATUS.find(status => status.value === row.original.status);
                const statusColor = STATUS_COLOR_MAP[row.original.status as TicketStatus] ?? "bg-gray-400";

                return (
                    <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
                        <span>{statusOption?.label ?? '-'}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'priority',
            header: i18n.t('support.list.table.priority'),
            cell: ({ row }) => {
                const priorityOption = SUPPORT_TICKET_PRIORITY.find(priority => priority.value === row.original.priority);
                const priorityColor = PRIORITY_COLOR_MAP[row.original.priority as TicketPriority] ?? "bg-gray-400";

                return (
                    <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${priorityColor}`} />
                        <span>{priorityOption?.label ?? '-'}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'category',
            header: i18n.t('support.list.table.category'),
            cell: ({ row }) => SUPPORT_TICKET_CATEGORY.find(category => category.value === row.original.category)?.label,
        },
        {
            accessorKey: 'createdByName',
            header: i18n.t('support.list.table.createdBy'),
        },
        {
            accessorKey: 'createdAt',
            header: i18n.t('support.list.table.createdAt'),
            cell: ({ row }) => (
                <DateTimeDisplay value={row.original.createdAt} mode="datetime" />
            ),
        },
        {
            accessorKey: 'lastActivityAt',
            header: i18n.t('support.list.table.lastActivityAt'),
            cell: ({ row }) => (
                <DateTimeDisplay value={row.original.lastActivityAt} mode="datetime" />
            ),
        },
        {
            accessorKey: 'ownerId',
            header: i18n.t('support.list.table.ownerId'),
            cell: ({ row }) => (
                <IdCopy
                    value={row.original.ownerId}
                    tooltip={i18n.t("support.list.tooltips.copyOwnerId")}
                    successMessage={i18n.t("support.list.copy.ownerIdSuccess")}
                />
            ),
        },
        {
            accessorKey: 'messageCount',
            header: i18n.t('support.list.table.messages'),
        },
        {
            accessorKey: 'attachmentCount',
            header: i18n.t('support.list.table.attachments'),
        },
        {
            accessorKey: 'isReplied',
            header: i18n.t('support.list.table.replied'),
            cell: ({ row }) => i18n.t(row.original.isReplied ? 'support.list.values.yes' : 'support.list.values.no'),
        },
        {
            accessorKey: 'id',
            header: i18n.t('support.list.table.actions'),
            cell: ({ row }) => (
                <ButtonGroup>
                    <CustomButton
                        variant="outline"
                        tooltip={i18n.t("support.list.tooltips.viewTicket")}
                        icon={<Eye />}
                        onClick={() => navigate(`/support/${row.original.id}`)}
                    />
                    <CustomButton
                        variant="outline"
                        tooltip={i18n.t("support.list.tooltips.editTicket")}
                        icon={<Pencil />}
                        onClick={() => navigate(`/support/${row.original.id}/edit`)}
                    />
                </ButtonGroup>
            ),
        },
    ];

export default getSupportTicketColumns;