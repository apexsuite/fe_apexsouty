import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Calendar,
  Package,
  CheckCircle2,
  WorkflowIcon,
} from 'lucide-react';
import dayjs from 'dayjs';
import { ISubscription } from '@/services/subscription/types';
import { t } from 'i18next';
import { useMutation } from '@tanstack/react-query';
import { getManageSubscription } from '@/services/subscription';
import { toast } from 'react-toastify';

interface SubscriptionCardProps {
  subscription: ISubscription['activeSubscription'];
  isFreeUser: boolean;
}

const SubscriptionCard = ({
  subscription,
  isFreeUser,
}: SubscriptionCardProps) => {
  const currentPrice = subscription.productPrices?.find(
    price => price.id === subscription.priceId
  );

  const manageSubscriptionMutation = useMutation({
    mutationFn: getManageSubscription,
    onSuccess: response => {
      if (response.data) {
        window.open(response.data, '_blank');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to get manage subscription link');
    },
  });

  const handleManageSubscription = () => {
    manageSubscriptionMutation.mutate();
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-gray-200 shadow-xl transition-all duration-300 hover:shadow-2xl dark:border-gray-700 ${!isFreeUser ? 'transform hover:-translate-y-1' : ''} ${isFreeUser ? 'h-full' : ''}`}
    >
      <div
        className={`${isFreeUser ? 'px-5 py-6' : 'px-6 py-10 sm:px-8'} flex flex-col ${isFreeUser ? 'gap-3' : 'gap-6 sm:flex-row sm:items-start sm:justify-between'} relative overflow-hidden`}
      >
        {!isFreeUser && (
          <>
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-32 -translate-y-32 rounded-full" />
            <div className="brounded-full absolute bottom-0 left-0 h-48 w-48 -translate-x-24 translate-y-24" />
          </>
        )}
        <div className="relative z-10 flex-1">
          <h2
            className={`font-bold tracking-tight ${isFreeUser ? 'mb-2 text-2xl' : 'mb-4 text-3xl sm:text-4xl'}`}
          >
            {subscription.productName}
          </h2>
          <p
            className={`leading-relaxed ${isFreeUser ? 'text-sm' : 'text-base sm:text-lg'}`}
          >
            {subscription.productDescription}
          </p>
        </div>

        {currentPrice && !isFreeUser && (
          <div className="relative z-10 flex flex-col items-center rounded-2xl px-8 py-6 shadow-lg sm:items-end">
            <div className="text-4xl font-bold sm:text-5xl">
              ${(currentPrice.unitAmount / 100).toFixed(2)}
            </div>
            <div className="mt-2 text-base font-medium">
              /{currentPrice.interval}
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />

      <div
        className={`${isFreeUser ? 'space-y-5 px-5 py-5' : 'space-y-10 px-6 py-10 sm:px-8'}`}
      >
        <div
          className={`grid grid-cols-1 ${isFreeUser ? 'gap-4' : 'gap-6 sm:grid-cols-2 lg:grid-cols-3'}`}
        >
          <div className="group flex items-start gap-3">
            <div
              className={`${isFreeUser ? 'p-2' : 'p-3'} bg-linear-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 ${isFreeUser ? 'rounded-lg' : 'rounded-xl'} shrink-0 shadow-md transition-shadow duration-200 group-hover:shadow-lg`}
            >
              <Calendar
                className={`${isFreeUser ? 'h-4 w-4' : 'h-5 w-5'} text-white dark:text-black`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-wide text-black uppercase dark:text-white">
                {t('subscriptions.subscriptionCard.startDate')}
              </p>
              <p
                className={`${isFreeUser ? 'text-sm' : 'text-sm sm:text-base'} truncate text-black dark:text-white`}
              >
                {dayjs(subscription.startDate).format('MMMM D, YYYY')}
              </p>
            </div>
          </div>

          {subscription.nextBillingDate && (
            <div className="group flex items-start gap-3">
              <div
                className={`${isFreeUser ? 'p-2' : 'p-3'} bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 ${isFreeUser ? 'rounded-lg' : 'rounded-xl'} flex-shrink-0 shadow-md transition-shadow duration-200 group-hover:shadow-lg`}
              >
                <CreditCard
                  className={`${isFreeUser ? 'h-4 w-4' : 'h-5 w-5'} text-white dark:text-black`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold tracking-wide text-black uppercase dark:text-white">
                  {t('subscriptions.subscriptionCard.nextBilling')}
                </p>
                <p
                  className={`${isFreeUser ? 'text-sm' : 'text-sm sm:text-base'} truncate text-black dark:text-white`}
                >
                  {dayjs(subscription.nextBillingDate).format('MMMM D, YYYY')}
                </p>
              </div>
            </div>
          )}

          {subscription.capacity && (
            <div className="group flex items-start gap-3">
              <div
                className={`${isFreeUser ? 'p-2' : 'p-3'} bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 ${isFreeUser ? 'rounded-lg' : 'rounded-xl'} flex-shrink-0 shadow-md transition-shadow duration-200 group-hover:shadow-lg`}
              >
                <Package
                  className={`${isFreeUser ? 'h-4 w-4' : 'h-5 w-5'} text-white dark:text-black`}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
                <p className="text-xs font-semibold tracking-wide text-black uppercase dark:text-white">
                  {t('subscriptions.subscriptionCard.capacity')}
                </p>
                <p
                  className={`${isFreeUser ? 'text-sm' : 'text-sm sm:text-base'} truncate text-black dark:text-white`}
                >
                  {subscription.capacity.toLocaleString()}{' '}
                  {t('subscriptions.subscriptionCard.products')}
                </p>
              </div>
            </div>
          )}
        </div>

        {subscription.marketingFeatures &&
          subscription.marketingFeatures.length > 0 && (
            <div className={isFreeUser ? 'pt-3' : 'pt-8'}>
              <div
                className={`flex items-center gap-3 ${isFreeUser ? 'mb-3' : 'mb-6'}`}
              >
                <div
                  className={`${isFreeUser ? 'p-2' : 'p-3'} bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 ${isFreeUser ? 'rounded-lg' : 'rounded-xl'} flex-shrink-0 shadow-md transition-shadow duration-200 group-hover:shadow-lg`}
                >
                  <WorkflowIcon
                    className={`${isFreeUser ? 'h-4 w-4' : 'h-6 w-6'} text-white dark:text-black`}
                  />
                </div>
                <p className="text-xs font-bold tracking-wide text-black uppercase sm:text-sm dark:text-white">
                  {isFreeUser
                    ? t('subscriptions.subscriptionCard.features')
                    : t('subscriptions.subscriptionCard.planFeatures')}
                </p>
              </div>

              <div
                className={`grid grid-cols-1 ${isFreeUser ? 'gap-2' : 'gap-4 sm:grid-cols-2'}`}
              >
                {subscription.marketingFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${isFreeUser ? 'gap-2 rounded-lg p-3' : 'gap-4 rounded-xl p-5'} border border-gray-200 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:hover:border-gray-600 ${!isFreeUser && 'transform hover:-translate-y-0.5'}`}
                  >
                    <div
                      className={`flex items-center justify-center ${isFreeUser ? 'h-5 w-5' : 'h-8 w-8'} flex-shrink-0 rounded-full shadow-md`}
                    >
                      <CheckCircle2
                        className={`${isFreeUser ? 'h-3 w-3 text-green-500' : 'h-5 w-5'}`}
                      />
                    </div>
                    <span
                      className={`${isFreeUser ? 'text-xs' : 'text-sm sm:text-base'} leading-snug font-medium`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />

        {!isFreeUser && (
          <div className="flex flex-col justify-end">
            <Button
              onClick={handleManageSubscription}
              disabled={manageSubscriptionMutation.isPending}
              className="w-full transform bg-gradient-to-r from-gray-900 to-gray-700 py-6 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto dark:from-white dark:to-gray-200 dark:text-black"
            >
              {manageSubscriptionMutation.isPending
                ? 'Loading...'
                : t('subscriptions.subscriptionCard.manageSubscription')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;
