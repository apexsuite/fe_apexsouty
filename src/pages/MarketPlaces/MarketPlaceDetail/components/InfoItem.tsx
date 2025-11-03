import { cn } from "@/lib/utils";

interface InfoItemProps {
    label: string;
    value: string | React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}

export const InfoItem = ({ label, value, icon, className }: InfoItemProps) => {
    return (
        <div className={cn("flex flex-col space-y-1.5", className)}>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {icon}
                <span>{label}</span>
            </div>
            <div className="text-base font-semibold text-foreground">
                {value}
            </div>
        </div>
    );
};

