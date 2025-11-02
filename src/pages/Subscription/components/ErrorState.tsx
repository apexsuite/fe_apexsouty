import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from 'i18next';

interface ErrorStateProps {
    error: Error | unknown;
}

const ErrorState = ({ error }: ErrorStateProps) => {
    const errorMessage = error instanceof Error
        ? error.message
        : t('subscriptions.errorState.errorMessage');

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
            <div className="text-center space-y-8 max-w-lg">
                <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-red-500/20 dark:bg-red-500/30 rounded-full animate-ping" />
                    <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-2xl">
                        <AlertCircle className="w-12 h-12 text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                        {t('subscriptions.errorState.errorTitle')}
                    </h2>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                        <p className="text-base sm:text-lg text-red-700 dark:text-red-300 leading-relaxed">
                            {errorMessage}
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 text-white dark:text-black hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-semibold"
                >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    {t('subscriptions.errorState.tryAgain')}
                </Button>
            </div>
        </div>
    );
};

export default ErrorState;

