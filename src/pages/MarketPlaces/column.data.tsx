import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IMarketplace } from "@/services/marketplaces/type";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Check, CircleX, Edit, Eye, Trash } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface IMarketPlaceColumnsProps {
    navigate: NavigateFunction;
    deleteMarketplace: (id: string) => void;
    changeMarketplaceStatus: (id: string) => void;
}

const getMarketPlaceColumns = ({
    navigate,
    deleteMarketplace,
    changeMarketplaceStatus
}: IMarketPlaceColumnsProps): ColumnDef<IMarketplace>[] => {
    return [
        {
            accessorKey: "marketplace",
            header: "Marketplace",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.marketplace}</span>
            ),
        },
        {
            accessorKey: "marketplaceKey",
            header: "Marketplace Key",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.marketplaceKey}</span>
            ),
        },
        {
            accessorKey: "marketplaceURL",
            header: "Marketplace URL",
            cell: ({ row }) => (
                <a
                    href={row.original.marketplaceURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                    {row.original.marketplaceURL}
                </a>
            ),
        },
        {
            accessorKey: "region",
            header: "Region",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.region}</span>
            ),
        },
        {
            accessorKey: "regionId",
            header: "Region ID",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.regionId}</span>
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
            accessorKey: "id",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="outline" tooltip="View Market Place" size="sm" onClick={() => navigate(`/marketplaces/${row.original.id}`)}>
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" tooltip="Edit Market Place" size="sm" onClick={() => navigate(`/marketplaces/${row.original.id}/edit`)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" tooltip="Delete Market Place" size="sm" onClick={() => deleteMarketplace(row.original.id)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" tooltip="Change Market Place Status" size="sm" onClick={() => changeMarketplaceStatus(row.original.id)}>
                        {row.original.isActive ? <Check className="h-4 w-4" /> : <CircleX className="h-4 w-4" />}
                    </Button>
                </div>
            ),
        },
    ]
};

export default getMarketPlaceColumns;