import * as yup from 'yup';
import { IVendorCreateRequest } from '@/services/vendor/types';

export const vendorValidationSchema: yup.ObjectSchema<IVendorCreateRequest> =
  yup.object().shape({
    name: yup.string().required('Vendor name is required'),
    description: yup.string().required('Vendor description is required'),
    vendorFiles: yup.array().optional(),
  });

export default vendorValidationSchema;
