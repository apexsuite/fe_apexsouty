import * as yup from 'yup';
import type { ICreatePageRoute } from '@/services/page-routes/types';

export const pageRoutesValidationSchema: yup.ObjectSchema<ICreatePageRoute> =
  yup.object().shape({
    name: yup.string().required('Name is required'),
    path: yup.string().required('Path is required'),
    component: yup.string().required('Component is required'),
    icon: yup.string().required('Icon is required'),
    parentId: yup.string().nullable().optional(),
    description: yup.string().required('Description is required'),
    isActive: yup.boolean().required('Is Active is required'),
    isVisible: yup.boolean().required('Is Visible is required'),
    isUnderConstruction: yup
      .boolean()
      .required('Is Under Construction is required'),
  });
