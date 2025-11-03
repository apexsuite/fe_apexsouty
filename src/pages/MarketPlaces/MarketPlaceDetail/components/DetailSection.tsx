import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DetailSectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export const DetailSection = ({ title, icon, children, className }: DetailSectionProps) => {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardHeader className="border-b bg-muted/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {children}
            </CardContent>
        </Card>
    );
};

