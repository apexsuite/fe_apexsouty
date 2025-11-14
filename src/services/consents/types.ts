import { IPageParams } from "@/types/common.types";

export interface IConsent {
    id: string;
    isActive: boolean;
    regionName: string;
    regionURL: string;
    createdAt: string;
    consent?: {
        createdAt: string;
        expiresAt: string;
        id: string;
        isActive: boolean;
        marketplaceId: string;
        regionId: string;
        sellingPartnerId: string;
        userId: string;
    };
    marketplaces: {
        createdAt: string;
        id: string;
        isActive: boolean;
        marketplace: string;
        marketplaceKey: string;
        marketplaceURL: string;
        regionId: string;
    }[];
}

export interface IConsentRequest extends IPageParams {
    regionName?: string;
    regionURL?: string;
    isActive?: string;
}

export interface IConsentsCallback {
    amazonCallbackUri: string;
    amazonState: string;
    sellingPartnerId: string;
}


export interface IConsentValidate {
    state: string;
    sellingPartnerId: string;
    spapiOauthCode: string;
}