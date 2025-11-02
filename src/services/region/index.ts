import { IPageResponse } from "@/types/common.types";
import { IRegion, IRegionRequest } from "./types";
import { apiRequest } from "../api";

export const getRegions = async (params: IRegionRequest): Promise<IPageResponse<IRegion>> => {
    const response = await apiRequest('/amazon/regions', {
        method: 'GET',
        params,
    });

    return response.data || response;
};