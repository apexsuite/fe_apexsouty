import { FilterInputs, INPUT_TYPES } from '@/components/CustomFilter/types';
import { STATUS_OPTIONS } from '@/utils/constants/options';

export const FILTER_INPUTS: FilterInputs[] = [
  {
    name: 'regionName',
    label: 'Region Name',
    placeholder: 'Enter region name',
    type: INPUT_TYPES.Text,
  },
  {
    name: 'regionURL',
    label: 'Region URL',
    placeholder: 'Enter region URL',
    type: INPUT_TYPES.Text,
  },
  {
    name: 'isActive',
    label: 'Status',
    placeholder: 'All Status',
    type: INPUT_TYPES.Select,
    options: STATUS_OPTIONS,
  },
];
