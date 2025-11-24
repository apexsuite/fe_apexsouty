import { FilterInputs, INPUT_TYPES } from '@/components/CustomFilter/types';

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
];
