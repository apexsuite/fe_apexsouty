import {
  INPUT_TYPES,
  type FilterInputs,
} from '@/components/CustomFilter/types';
import { STATUS_OPTIONS } from '@/utils/constants/options';

export const FILTER_INPUTS: FilterInputs[] = [
  {
    name: 'marketplace',
    label: 'Marketplace Name',
    placeholder: 'e.g., North America',
    type: INPUT_TYPES.Text,
  },
  {
    name: 'marketplaceURL',
    label: 'Marketplace URL',
    placeholder: 'e.g., https://...',
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
