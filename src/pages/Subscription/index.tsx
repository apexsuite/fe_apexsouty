import { useQuery } from '@tanstack/react-query';
import { getSubscription } from '@/services/subscription';
import ErrorState from './components/ErrorState';
import PageHeader from './components/PageHeader';
import SubscriptionCard from './components/SubscriptionCard';
import UpgradeSection from './components/UpgradeSection';
import LoadingSpinner from '@/components/LoadingSpinner';

const Subscription = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['subscription'],
        queryFn: getSubscription,
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorState error={error} />;
    }

    if (!data?.activeSubscription) {
        return <ErrorState error={new Error('Abonelik bilgisi bulunamadı')} />;
    }

    const isFreeUser = data.activeSubscription.productName?.toLowerCase() === 'free';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <PageHeader isFreeUser={isFreeUser} />

                <div className="max-w-7xl mx-auto">
                    {isFreeUser ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                            <div className="lg:col-span-4">
                                <SubscriptionCard
                                    subscription={data.activeSubscription}
                                    isFreeUser={isFreeUser}
                                />
                            </div>

                            <div className="lg:col-span-8">
                                <UpgradeSection pricingTable={data.pricingTable} />
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-5xl mx-auto animate-fade-in">
                            <SubscriptionCard
                                subscription={data.activeSubscription}
                                isFreeUser={isFreeUser}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Subscription;
