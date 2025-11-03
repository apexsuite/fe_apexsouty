import { IPageParams } from "@/types/common.types";

export interface IRegion {
    consent: {
        id: string;
        amazonCallbackUrl: string;
        amazonState: string;
        createdAt: string;
        expiresIn: number;
        isActive: boolean;
        marketplaceId: string;
        sellingPartnerId: string;
        spapiOauthCode: string;
        stateId: string;
        tokenType: string;
        userId: string;
    }
    createdAt: string;
    id: string;
    isActive: boolean;
    marketplaces: string[];
    regionName: string;
    regionURL: string;
}

export interface IRegionRequest extends IPageParams {
    regionName?: string;
    regionURL?: string;
    isActive?: string;
}

export interface IRegionCreateRequest {
    regionName: string;
    regionURL: string;
}



