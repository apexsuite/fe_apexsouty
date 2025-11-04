export interface ISubscription {
    activeSubscription: {
        capacity: number;
        marketingFeatures: string[];
        nextBillingDate: string;
        productDescription: string;
        productName: string;
        productPrices: {
            currency: string;
            interval: string;
            unitAmount: number;
        }[];
        startDate: string;
    },
    pricingTable: {
        customerSession: string;
        publishableKey: string;
        referenceId: string;
        tableId: string;
    }
}