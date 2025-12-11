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
    name: 'path',
    label: 'Path',
    placeholder: 'Enter path',
    type: INPUT_TYPES.Text,
  },
  {
    name: 'component',
    label: 'Component',
    placeholder: 'Enter component',
    type: INPUT_TYPES.Text,
  },
  {
    name: 'isActive',
    label: 'Is Active',
    placeholder: 'Enter is active',
    type: INPUT_TYPES.Select,
    options: STATUS_OPTIONS,
  },
  {
    name: 'isDefault',
    label: 'Is Default',
    placeholder: 'Enter is default',
    type: INPUT_TYPES.Select,
    options: DEFAULT_OPTIONS,
  },
  {
    name: 'isUnderConstruction',
    label: 'Is Under Construction',
    placeholder: 'Enter is under construction',
    type: INPUT_TYPES.Select,
    options: DEFAULT_OPTIONS,
  },
];
