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
    <div className="space-y-4 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader isFreeUser={isFreeUser} />

        <div className="mx-auto max-w-7xl">
          {isFreeUser ? (
            <div className="flex flex-col lg:flex-row gap-4 w-full">
              <div className="w-full lg:w-1/3">
                <SubscriptionCard
                  subscription={data.activeSubscription}
                  isFreeUser={isFreeUser}
                />
              </div>

              <div className="w-full lg:w-2/3">
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
