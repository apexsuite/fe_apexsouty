import { IRegionCreateRequest } from '@/services/region/types';
import * as yup from 'yup';

export const regionValidationSchema: yup.ObjectSchema<IRegionCreateRequest> = yup.object().shape({
    regionName: yup.string().required('Region name is required'),
    regionURL: yup.string().url('Invalid URL').required('Region URL is required'),
});

export default regionValidationSchema;