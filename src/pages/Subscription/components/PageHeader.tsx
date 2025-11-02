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
        <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900 text-white mb-4 shadow-lg">
                {isFreeUser ? (
                    <Crown className="w-7 h-7" />
                ) : (
                    <Sparkles className="w-7 h-7" />
                )}
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {title}
            </h1>
            <p className="text-sm text-gray-600 max-w-xl">
                {subtitle}
            </p>
        </div>
    );
};

export default PageHeader;
