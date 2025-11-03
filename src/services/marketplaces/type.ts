import { IPageParams } from "@/types/common.types";

export interface IMarketplace {
    createdAt: string;
    id: string;
    isActive: boolean;
    marketplace: string;
    marketplaceKey: string;
    marketplaceURL: string;
    region: string;
    regionId: string;
}

export interface IMarketPlaceRequest extends IPageParams {
    marketplace?: string;
    marketplaceURL?: string;
    isActive?: string;
}

export interface IMarketPlaceCreateRequest {
    marketplace: string;
    marketplaceKey: string;
    marketplaceURL: string;
    regionId: string;
}

