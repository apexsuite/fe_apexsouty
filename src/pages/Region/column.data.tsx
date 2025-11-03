import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IRegion } from "@/services/region/types";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Check, CircleX, Edit, Trash } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface IRegionColumnsProps {
    navigate: NavigateFunction;
    deleteRegion: (id: string) => void;
    changeRegionStatus: (id: string) => void;
}

const getRegionColumns = ({ navigate, deleteRegion, changeRegionStatus }: IRegionColumnsProps): ColumnDef<IRegion>[] =>
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
                    {dayjs(row.original.createdAt).format("DD/MM/YYYY HH:mm")}
                </span>
            ),
        },
        {
            accessorKey: "id",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="outline" tooltip="Edit Region" size="sm" onClick={() => navigate(`/regions/${row.original.id}/edit`)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" tooltip="Delete Region" size="sm" onClick={() => deleteRegion(row.original.id)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" tooltip="Change Region Status" size="sm" onClick={() => changeRegionStatus(row.original.id)}>
                        {
                            row.original.isActive ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <CircleX className="h-4 w-4" />
                            )
                        }
                    </Button>
                </div>
            ),
        },
    ];

export default getRegionColumns;