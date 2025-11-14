import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, Package, CheckCircle2, WorkflowIcon } from 'lucide-react';
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

const SubscriptionCard = ({ subscription, isFreeUser }: SubscriptionCardProps) => {
    const currentPrice = subscription.productPrices?.find(
        price => price.id === subscription.priceId
    );

    const manageSubscriptionMutation = useMutation({
        mutationFn: getManageSubscription,
        onSuccess: (response) => {
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
        <div className={`rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 ${!isFreeUser ? 'transform hover:-translate-y-1' : ''} ${isFreeUser ? 'h-full' : ''}`}>
            <div className={`${isFreeUser ? 'px-5 py-6' : 'px-6 sm:px-8 py-10'} flex flex-col ${isFreeUser ? 'gap-3' : 'sm:flex-row sm:items-start sm:justify-between gap-6'} relative overflow-hidden`}>
                {!isFreeUser && (
                    <>
                        <div className="absolute top-0 right-0 w-64 h-64  rounded-full -translate-y-32 translate-x-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 brounded-full translate-y-24 -translate-x-24" />
                    </>
                )}
                <div className="flex-1 relative z-10">
                    <h2 className={`font-bold tracking-tight ${isFreeUser ? 'text-2xl mb-2' : 'text-3xl sm:text-4xl mb-4'}`}>
                        {subscription.productName}
                    </h2>
                    <p className={`leading-relaxed ${isFreeUser ? 'text-sm' : 'text-base sm:text-lg'}`}>
                        {subscription.productDescription}
                    </p>
                </div>

                {currentPrice && !isFreeUser && (
                    <div className="flex flex-col items-center sm:items-end px-8 py-6 rounded-2xl relative z-10 shadow-lg">
                        <div className="text-4xl sm:text-5xl font-bold">
                            ${(currentPrice.unitAmount / 100).toFixed(2)}
                        </div>
                        <div className="text-base mt-2 font-medium">
                            /{currentPrice.interval}
                        </div>
                    </div>
                )}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />


            <div className={`${isFreeUser ? 'px-5 py-5 space-y-5' : 'px-6 sm:px-8 py-10 space-y-10'}`}>
                <div className={`grid grid-cols-1 ${isFreeUser ? 'gap-4' : 'sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                    <div className="flex items-start gap-3 group">
                        <div className={`${isFreeUser ? 'p-2' : 'p-3'} bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 ${isFreeUser ? 'rounded-lg' : 'rounded-xl'} flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-200`}>
                            <Calendar className={`${isFreeUser ? 'w-4 h-4' : 'w-5 h-5'} text-white dark:text-black`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-black dark:text-white uppercase tracking-wide">
                                {t('subscriptions.subscriptionCard.startDate')}
                            </p>
                            <p className={`${isFreeUser ? 'text-sm' : 'text-sm sm:text-base'} text-black dark:text-white truncate`}>
                                {dayjs(subscription.startDate).format('MMMM D, YYYY')}
                            </p>
                        </div>
                    </div>

                    {subscription.nextBillingDate && (
                        <div className="flex items-start gap-3 group">
                            <div className={`${isFreeUser ? 'p-2' : 'p-3'} bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 ${isFreeUser ? 'rounded-lg' : 'rounded-xl'} flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-200`}>
                                <CreditCard className={`${isFreeUser ? 'w-4 h-4' : 'w-5 h-5'} text-white dark:text-black`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-black dark:text-white uppercase tracking-wide">
                                    {t('subscriptions.subscriptionCard.nextBilling')}
                                </p>
                                <p className={`${isFreeUser ? 'text-sm' : 'text-sm sm:text-base'} text-black dark:text-white truncate`}>
                                    {dayjs(subscription.nextBillingDate).format('MMMM D, YYYY')}
                                </p>
                            </div>
                        </div>
                    )}

                    {subscription.capacity && (
                        <div className="flex items-start gap-3 group">
                            <div className={`${isFreeUser ? 'p-2' : 'p-3'} bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 ${isFreeUser ? 'rounded-lg' : 'rounded-xl'} flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-200`}>
                                <Package className={`${isFreeUser ? 'w-4 h-4' : 'w-5 h-5'} text-white dark:text-black`} />
                            </div>
                            <div className="flex flex-col justify-center items-start flex-1 min-w-0">
                                <p className="text-xs font-semibold text-black dark:text-white uppercase tracking-wide">
                                    {t('subscriptions.subscriptionCard.capacity')}
                                </p>
                                <p className={`${isFreeUser ? 'text-sm' : 'text-sm sm:text-base'} text-black dark:text-white truncate`}>
                                    {subscription.capacity.toLocaleString()} {t('subscriptions.subscriptionCard.products')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {subscription.marketingFeatures && subscription.marketingFeatures.length > 0 && (
                    <div className={isFreeUser ? 'pt-3' : 'pt-8'}>
                        <div className={`flex items-center gap-3 ${isFreeUser ? 'mb-3' : 'mb-6'}`}>
                            <div className={`${isFreeUser ? 'p-2' : 'p-3'} bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 ${isFreeUser ? 'rounded-lg' : 'rounded-xl'} flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-200`}>
                                <WorkflowIcon className={`${isFreeUser ? 'w-4 h-4' : 'w-6 h-6'} text-white dark:text-black`} />
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wide">
                                {isFreeUser ? t('subscriptions.subscriptionCard.features') : t('subscriptions.subscriptionCard.planFeatures')}</p>
                        </div>

                        <div className={`grid grid-cols-1 ${isFreeUser ? 'gap-2' : 'sm:grid-cols-2 gap-4'}`}>
                            {subscription.marketingFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center ${isFreeUser ? 'gap-2 rounded-lg p-3' : 'gap-4 rounded-xl p-5'} border border-gray-200 dark:border-gray-700
                     hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 ${!isFreeUser && 'transform hover:-translate-y-0.5'}`}
                                >
                                    <div className={`flex items-center justify-center ${isFreeUser ? 'w-5 h-5' : 'w-8 h-8'} rounded-full shadow-md flex-shrink-0`}>
                                        <CheckCircle2 className={`${isFreeUser ? 'w-3 h-3 text-green-500' : 'w-5 h-5'}`} />
                                    </div>
                                    <span className={`${isFreeUser ? 'text-xs' : 'text-sm sm:text-base'} font-medium leading-snug`}>
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}



                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

                {!isFreeUser && (
                    <div className="flex flex-col justify-end">
                        <Button
                            onClick={handleManageSubscription}
                            disabled={manageSubscriptionMutation.isPending}
                            className="w-full sm:w-auto bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 text-white dark:text-black hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-semibold text-base py-6"
                        >
                            {manageSubscriptionMutation.isPending
                                ? 'Loading...'
                                : t('subscriptions.subscriptionCard.manageSubscription')
                            }
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionCard;

