import { TicketCategory, TicketPriority, TicketStatus } from "@/services/support/types";

const SUPPORT_TICKET_STATUS = [
    { label: 'Open', value: TicketStatus.OPEN },
    { label: 'In Progress', value: TicketStatus.INPROGRESS },
    { label: 'Resolved', value: TicketStatus.RESOLVED },
    { label: 'Closed', value: TicketStatus.CLOSED },
    { label: 'Reopened', value: TicketStatus.REOPENED },
];

const SUPPORT_TICKET_PRIORITY = [
    { label: 'Low', value: TicketPriority.LOW },
    { label: 'Medium', value: TicketPriority.MEDIUM },
    { label: 'High', value: TicketPriority.HIGH },
    { label: 'Urgent', value: TicketPriority.URGENT },
];

const SUPPORT_TICKET_CATEGORY = [
    { label: 'Technical', value: TicketCategory.TECHNICAL },
    { label: 'Billing', value: TicketCategory.BILLING },
    { label: 'Account', value: TicketCategory.ACCOUNT },
    { label: 'Feature Request', value: TicketCategory.FEATUREREQUEST },
    { label: 'Bug Report', value: TicketCategory.BUGREPORT },
    { label: 'Other', value: TicketCategory.OTHER },
];


export const STATUS_COLOR_MAP: Record<TicketStatus, string> = {
    [TicketStatus.OPEN]: "bg-blue-500",
    [TicketStatus.INPROGRESS]: "bg-amber-500",
    [TicketStatus.RESOLVED]: "bg-emerald-500",
    [TicketStatus.CLOSED]: "bg-slate-500",
    [TicketStatus.REOPENED]: "bg-purple-500",
};

export const PRIORITY_COLOR_MAP: Record<TicketPriority, string> = {
    [TicketPriority.LOW]: "bg-emerald-500",
    [TicketPriority.MEDIUM]: "bg-amber-500",
    [TicketPriority.HIGH]: "bg-orange-500",
    [TicketPriority.URGENT]: "bg-red-600",
};

export { SUPPORT_TICKET_STATUS, SUPPORT_TICKET_PRIORITY, SUPPORT_TICKET_CATEGORY };