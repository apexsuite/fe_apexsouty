import { IPageResponse } from "@/types/common.types";
import { apiRequest } from "../api";
import { IConsent, IConsentsCallback, IConsentValidate } from "./types"

export const getConsents = async (): Promise<IPageResponse<IConsent>> => {
    const response = await apiRequest('/amazon/consents', {
        method: 'GET',
    });

    return response.data || response;
};

export const requestConsentsCallback = async (params: IConsentsCallback): Promise<{ data: string }> => {
    const response = await apiRequest('/amazon/consents/callback', {
        method: 'POST',
        body: JSON.stringify(params),
    });

    return response?.data || response;
};

export const getConsentLink = async (marketplaceId: string): Promise<{ data: string }> => {
    const response = await apiRequest('/amazon/consents/get-consent-link', {
        method: 'POST',
        body: JSON.stringify({ marketplaceId }),
    });

    return response;
};

export const validateAmazonConsent = async (params: IConsentValidate): Promise<{ data: string }> => {
    const response = await apiRequest('/amazon/consents/validate', {
        method: 'POST',
        body: JSON.stringify(params),
    });

    return response?.data || response;
};
