import {
  INPUT_TYPES,
  type FilterInputs,
} from '@/components/CustomFilter/types';
import {
  DEFAULT_OPTIONS,
  STATUS_OPTIONS,
  USER_TYPE_OPTIONS,
} from '@/utils/constants/options';

export const FILTER_INPUTS: FilterInputs[] = [
  {
    name: 'firstname',
    label: 'First Name',
    placeholder: 'Enter first name',
    type: INPUT_TYPES.Text,
  },
  {
    name: 'lastname',
    label: 'Last Name',
    placeholder: 'Enter last name',
    type: INPUT_TYPES.Text,
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email',
    type: INPUT_TYPES.Text,
  },
  {
    name: 'isActive',
    label: 'Status',
    placeholder: 'Select status',
    type: INPUT_TYPES.Select,
    options: STATUS_OPTIONS,
  },
  {
    name: 'subscriptionStatus',
    label: 'Subscription Status',
    placeholder: 'Select subscription status',
    type: INPUT_TYPES.Select,
    options: DEFAULT_OPTIONS,
  },
  {
    name: 'userType',
    label: 'User Type',
    placeholder: 'Select user type',
    type: INPUT_TYPES.Select,
    options: USER_TYPE_OPTIONS,
  },
  {
    name: 'roleId',
    label: 'Role ID',
    placeholder: 'Enter role ID',
    type: INPUT_TYPES.Number,
  },
];
