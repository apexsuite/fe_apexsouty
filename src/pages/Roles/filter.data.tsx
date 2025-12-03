import {
  INPUT_TYPES,
  type FilterInputs,
} from '@/components/CustomFilter/types';
import { DEFAULT_OPTIONS, STATUS_OPTIONS } from '@/utils/constants/options';

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
    name: 'roleValue',
    label: 'Role Value',
    placeholder: 'Enter role value',
    type: INPUT_TYPES.Number,
  },
  {
    name: 'isDefault',
    label: 'Is Default',
    placeholder: 'Select is default',
    type: INPUT_TYPES.Select,
    options: DEFAULT_OPTIONS,
  },
  {
    name: 'isActive',
    label: 'Status',
    placeholder: 'Select status',
    type: INPUT_TYPES.Select,
    options: STATUS_OPTIONS,
  },
];
