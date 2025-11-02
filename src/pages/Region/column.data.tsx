import { Badge } from "@/components/ui/badge";
import { IRegion } from "@/services/region/types";
import { ColumnDef } from "@tanstack/react-table";

const getRegionColumns = (): ColumnDef<IRegion>[] =>
    [
        {
            accessorKey: "regionName",
            header: "Region Name",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.regionName}</span>
            ),
        },
        {
            accessorKey: "regionURL",
            header: "Region URL",
            cell: ({ row }) => (
                <a
                    href={row.original.regionURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                    {row.original.regionURL}
                </a>
            ),
        },
        {
            accessorKey: "marketplaces",
            header: "Marketplaces",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.marketplaces?.map((marketplace, index) => (
                        <Badge key={index} variant="secondary" className="font-mono text-xs">
                            {marketplace}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.isActive ? "default" : "destructive"}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            accessorKey: "consent.sellingPartnerId",
            header: "Seller Partner ID",
            cell: ({ row }) => (
                <span className="font-mono text-xs text-muted-foreground">
                    {row.original.consent?.sellingPartnerId || "-"}
                </span>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => (
                <span className="text-sm">
                    {new Date(row.original.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
            ),
        },
    ];

export default getRegionColumns;