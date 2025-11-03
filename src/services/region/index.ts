import { IPageResponse } from "@/types/common.types";
import { IRegion, IRegionCreateRequest, IRegionRequest } from "./types";
import { apiRequest } from "../api";

export const getRegions = async (params: IRegionRequest): Promise<IPageResponse<IRegion>> => {
    const response = await apiRequest('/amazon/regions', {
        method: 'GET',
        params,
    });

    return response.data || response;
};

export const createRegion = async (data: IRegionCreateRequest): Promise<IRegion> => {
    const response = await apiRequest('/amazon/regions', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.data || response;
};

export const getRegionById = async (id: string): Promise<IRegion> => {
    const response = await apiRequest(`/amazon/regions/${id}`, {
        method: 'GET',
    });
    return response.data || response;
};

export const updateRegion = async (id: string, data: IRegionCreateRequest): Promise<IRegion> => {
    const response = await apiRequest(`/amazon/regions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.data || response;
};

export const deleteRegion = async (id: string): Promise<void> => {
    const response = await apiRequest(`/amazon/regions/${id}`, {
        method: 'DELETE',
    });
    return response.data || response;
};

export const changeRegionStatus = async (id: string): Promise<IRegion> => {
    const response = await apiRequest(`/amazon/regions/${id}/change-status`, {
        method: 'PATCH',
    });
    return response.data || response;
};