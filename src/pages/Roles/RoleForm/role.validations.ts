import * as yup from 'yup';
import { IRoleCreateRequest } from '@/services/roles/types';

export const roleValidationSchema: yup.ObjectSchema<IRoleCreateRequest> = yup
  .object()
  .shape({
    name: yup.string().required('Name is required'),
    roleValue: yup
      .number()
      .min(1, 'Role value must be at least 1')
      .required('Role value is required'),
    description: yup
      .string()
      .min(10, 'Description must be at least 10 characters')
      .required('Description is required'),
    isActive: yup.boolean().required('Is active is required'),
    isDefault: yup.boolean().required('Is default is required'),
  });

export default roleValidationSchema;
