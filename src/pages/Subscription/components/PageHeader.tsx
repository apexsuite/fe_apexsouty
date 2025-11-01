import { Crown, Sparkles } from "lucide-react";

interface PageHeaderProps {
    isFreeUser: boolean;
}

const PageHeader = ({ isFreeUser }: PageHeaderProps) => {
    const title = isFreeUser ? "Free Plan" : "Active Subscription";
    const subtitle = isFreeUser
        ? "You are currently using the Free plan. Upgrade to unlock more features."
        : "Manage your current plan and explore upgrade options.";

    return (
        <div className="flex flex-col items-center gap-2 pb-6">
            <div className="flex items-center flex-col gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                    {isFreeUser ? (
                        <Crown className="w-5 h-5" />
                    ) : (
                        <Sparkles className="w-5 h-5" />
                    )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
                    {title}
                </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                {subtitle}
            </p>
        </div>
    );
};

export default PageHeader;
