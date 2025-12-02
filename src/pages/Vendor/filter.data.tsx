import { FilterInputs, INPUT_TYPES } from '@/components/CustomFilter/types';
import { statusOptions } from '@/utils/constants/common';

export const FILTER_INPUTS: FilterInputs[] = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'Enter name',
    type: INPUT_TYPES.Text,
  },
  {
    name: 'description',
    label: 'Description',
    placeholder: 'Enter description',
    type: INPUT_TYPES.Text,
  },
  {
    name: 'status',
    label: 'Status',
    placeholder: 'Select status',
    type: INPUT_TYPES.Select,
    options: statusOptions,
  },
];
