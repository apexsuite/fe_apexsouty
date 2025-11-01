import { apiRequest } from '../api';
import { ISubscription } from './types';

/**
 * Abonelik bilgilerini çeker
 * @returns Abonelik bilgileri
 */
export const getSubscription = async (): Promise<ISubscription> => {
    const response = await apiRequest('/subscriptions', {
        method: 'GET',
    });

    // API response'u { data: {...}, error: ... } formatında geliyor
    // Bu yüzden içindeki data'yı döndürüyoruz
    return response.data || response;
};

