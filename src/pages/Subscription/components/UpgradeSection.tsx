import PricingPage from './PricingPage';
import { ISubscription } from '@/services/subscription/types';

interface UpgradeSectionProps {
    pricingTable: ISubscription['pricingTable'];
}

const UpgradeSection = ({ pricingTable }: UpgradeSectionProps) => {
    if (!pricingTable) {
        return null;
    }

    return (
        <div className="rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 h-full">
            <PricingPage
                publishableKey={pricingTable.publishableKey}
                tableId={pricingTable.tableId}
                customerSession={pricingTable.customerSession}
                referenceId={pricingTable.referenceId}
            />
        </div>
    );
};

export default UpgradeSection;

