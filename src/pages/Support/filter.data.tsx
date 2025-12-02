import { FilterInputs, INPUT_TYPES } from "@/components/CustomFilter/types";
import { booleanOptions } from "@/utils/constants/common";
import { SUPPORT_TICKET_CATEGORY, SUPPORT_TICKET_PRIORITY, SUPPORT_TICKET_STATUS } from "@/utils/constants/support";
import { t } from "i18next";

export const FILTER_INPUTS: FilterInputs[] = [
    {
        name: 'subject',
        label: t('support.list.filtersForm.subject.label'),
        placeholder: t('support.list.filtersForm.subject.placeholder'),
        type: INPUT_TYPES.Text,
    },
    {
        name: 'status',
        label: t('support.list.filtersForm.status.label'),
        placeholder: t('support.list.filtersForm.status.placeholder'),
        type: INPUT_TYPES.Select,
        options: SUPPORT_TICKET_STATUS,
    },
    {
        name: 'priority',
        label: t('support.list.filtersForm.priority.label'),
        placeholder: t('support.list.filtersForm.priority.placeholder'),
        type: INPUT_TYPES.Select,
        options: SUPPORT_TICKET_PRIORITY,
    },
    {
        name: 'category',
        label: t('support.list.filtersForm.category.label'),
        placeholder: t('support.list.filtersForm.category.placeholder'),
        type: INPUT_TYPES.Select,
        options: SUPPORT_TICKET_CATEGORY,
    },
    {
        name: 'assignedToId',
        label: t('support.list.filtersForm.assignedToId.label'),
        placeholder: t('support.list.filtersForm.assignedToId.placeholder'),
        type: INPUT_TYPES.Text,
    },
    {
        name: 'isPersonal',
        label: t('support.list.filtersForm.isPersonal.label'),
        placeholder: t('support.list.filtersForm.isPersonal.placeholder'),
        type: INPUT_TYPES.Select,
        options: booleanOptions,
    },
];