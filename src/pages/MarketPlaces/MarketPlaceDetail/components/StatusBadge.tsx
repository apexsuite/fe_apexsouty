import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface StatusBadgeProps {
    isActive: boolean;
}

export const StatusBadge = ({ isActive }: StatusBadgeProps) => {
    return (
        <Badge
            variant={isActive ? "default" : "destructive"}
            className="flex items-center gap-1 w-fit"
        >
            {isActive ? (
                <>
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                </>
            ) : (
                <>
                    <XCircle className="h-3 w-3" />
                    Inactive
                </>
            )}
        </Badge>
    );
};

