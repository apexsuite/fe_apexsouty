import { IConsent } from "@/services/consents/types";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const getConsentsColumns = (): ColumnDef<IConsent>[] => [
    {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
            const hasMarketplaces = row.original.marketplaces && row.original.marketplaces.length > 0;

            if (!hasMarketplaces) {
                return null;
            }

            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => row.toggleExpanded()}
                    className="h-8 w-8 p-0"
                >
                    {row.getIsExpanded() ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            );
        },
        size: 50,
        minSize: 50,
        maxSize: 50,
    },
    {
        accessorKey: 'regionName',
        header: 'Region Name',
    },
    {
        accessorKey: 'regionURL',
        header: 'Region URL',
        cell: ({ row }) => (
            <a
                href={row.original.regionURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-1 hover:underline"
            >
                {row.original.regionURL}
            </a>
        ),
    },
];

export default getConsentsColumns;