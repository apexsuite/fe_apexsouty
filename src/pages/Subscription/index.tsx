import { useQuery } from '@tanstack/react-query';
import { getSubscription } from '@/services/subscription';
import ErrorState from './components/ErrorState';
import PageHeader from './components/PageHeader';
import SubscriptionCard from './components/SubscriptionCard';
import UpgradeSection from './components/UpgradeSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import { t } from 'i18next';

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
    return (
      <ErrorState
        error={new Error(t('subscriptions.errorState.subscriptionNotFound'))}
      />
    );
  }

  const isFreeUser =
    data.activeSubscription.productName?.toLowerCase() === 'free';

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-7xl">
        <PageHeader isFreeUser={isFreeUser} />

        <div className="mx-auto max-w-7xl">
          {isFreeUser ? (
            <div className="animate-fade-in grid grid-cols-1 gap-6 lg:grid-cols-12">
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
            <div className="animate-fade-in mx-auto max-w-5xl">
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
