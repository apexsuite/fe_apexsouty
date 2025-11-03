import { IPageResponse } from "@/types/common.types";
import { apiRequest } from "../api";
import { IMarketplace, IMarketPlaceCreateRequest, IMarketPlaceRequest } from "./type";

export const getMarketplaces = async (params: IMarketPlaceRequest): Promise<IPageResponse<IMarketplace>> => {
    const response = await apiRequest('/amazon/marketplaces', {
        method: 'GET',
        params,
    });

    return response.data || response;
};

export const createMarketplace = async (data: IMarketPlaceCreateRequest): Promise<IMarketplace> => {
    const response = await apiRequest('/amazon/marketplaces', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.data || response;
};

export const getMarketplaceById = async (id: string): Promise<IMarketplace> => {
    const response = await apiRequest(`/amazon/marketplaces/${id}`, {
        method: 'GET',
    });
    return response.data || response;
};

export const updateMarketplace = async (id: string, data: IMarketPlaceCreateRequest): Promise<IMarketplace> => {
    const response = await apiRequest(`/amazon/marketplaces/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.data || response;
};

export const deleteMarketplace = async (id: string): Promise<void> => {
    const response = await apiRequest(`/amazon/marketplaces/${id}`, {
        method: 'DELETE',
    });
    return response.data || response;
};

export const changeMarketplaceStatus = async (id: string): Promise<IMarketplace> => {
    const response = await apiRequest(`/amazon/marketplaces/${id}/change-status`, {
        method: 'PATCH',
    });
    return response.data || response;
};