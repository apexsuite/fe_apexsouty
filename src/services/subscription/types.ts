export interface ISubscription {
    activeSubscription: {
        capacity: number;
        marketingFeatures: string[];
        nextBillingDate: string;
        productDescription: string;
        productName: string;
        priceId: string;
        productPrices: {
            id: string;
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