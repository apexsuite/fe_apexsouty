import { apiRequest } from '../api';
import { ISubscription } from './types';


export const getSubscription = async (): Promise<ISubscription> => {
    const response = await apiRequest('/subscriptions', {
        method: 'GET',
    });

    return response.data || response;
};

