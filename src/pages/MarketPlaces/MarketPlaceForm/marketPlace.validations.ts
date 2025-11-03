import * as yup from 'yup';
import { IMarketPlaceCreateRequest } from '@/services/marketplaces/type';

export const marketPlaceValidationSchema: yup.ObjectSchema<IMarketPlaceCreateRequest> = yup.object().shape({
    marketplace: yup.string().required('Marketplace name is required'),
    marketplaceURL: yup.string().url('Invalid URL').required('Marketplace URL is required'),
    marketplaceKey: yup.string().required('Marketplace key is required'),
    regionId: yup.string().required('Region is required'),
});

export default marketPlaceValidationSchema;