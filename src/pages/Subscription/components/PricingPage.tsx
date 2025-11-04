import { useEffect, useRef } from 'react';

interface PricingPageProps {
    publishableKey: string;
    tableId: string;
    customerSession: string;
    referenceId: string;
}

function PricingPage({ publishableKey, tableId, customerSession, referenceId }: PricingPageProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/pricing-table.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (containerRef.current) {
                const pricingTable = document.createElement('stripe-pricing-table');
                pricingTable.setAttribute('pricing-table-id', tableId);
                pricingTable.setAttribute('publishable-key', publishableKey);
                pricingTable.setAttribute('customer-session-client-secret', customerSession);
                pricingTable.setAttribute('client-reference-id', referenceId);

                containerRef.current.innerHTML = '';
                containerRef.current.appendChild(pricingTable);
            }
        };

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [tableId, publishableKey, customerSession, referenceId]);

    return (
        <div className="w-full">
            <div ref={containerRef} className="w-full"></div>
        </div>
    );
}

export default PricingPage;

