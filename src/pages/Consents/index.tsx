import CustomDataTable from "@/components/CustomDataTable";
import CustomPageLayout from "@/components/CustomPageLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getConsents, getConsentLink } from "@/services/consents";
import { IConsent } from "@/services/consents/types";
import usePagination from "@/utils/hooks/usePagination";
import getConsentsColumns from "./column.data";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const Consents = () => {
    const [page, setPage] = usePagination();


    const { data, isLoading } = useQuery({
        queryKey: ['consents'],
        queryFn: () => getConsents(),
    });

    const columns = getConsentsColumns();

    const authorizeMutation = useMutation({
        mutationFn: (marketplaceId: string) => getConsentLink(marketplaceId),
        onSuccess: (response) => {
            if (response.data) {
                toast.success('Consent authorized successfully');
                window.open(response.data, '_blank');
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Error getting consent link');
        },
    });

    const renderMarketplaces = (consent: IConsent) => {
        if (!consent.marketplaces || consent.marketplaces.length === 0) {
            return null;
        }

        return (
            <div className="bg-muted/30 p-4">
                <h4 className="mb-3 font-semibold text-sm">Marketplaces</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-2 text-left font-medium">Marketplace</th>
                                <th className="px-4 py-2 text-left font-medium">URL</th>
                                <th className="px-4 py-2 text-left font-medium">Status</th>
                                <th className="px-4 py-2 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consent.marketplaces.map((marketplace) => (
                                <tr key={marketplace.id} className="border-b last:border-0">
                                    <td className="px-4 py-2">{marketplace.marketplace}</td>
                                    <td className="px-4 py-2">
                                        <a
                                            href={marketplace.marketplaceURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {marketplace.marketplaceURL}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${marketplace.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {marketplace.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Button
                                            size="sm"
                                            onClick={() => authorizeMutation.mutate(marketplace.id)}
                                            disabled={authorizeMutation.isPending && authorizeMutation.variables === marketplace.id}
                                        >
                                            {authorizeMutation.isPending && authorizeMutation.variables === marketplace.id
                                                ? 'Loading...'
                                                : 'Authorize'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const getRowCanExpand = (row: IConsent) => {
        return row.marketplaces && row.marketplaces.length > 0;
    };

    return (
        <CustomPageLayout
            title="Consents"
            description="View and manage Amazon consents"
            datatable={
                <CustomDataTable
                    columns={columns}
                    data={data?.items || []}
                    isLoading={isLoading}
                    renderSubComponent={renderMarketplaces}
                    getRowCanExpand={getRowCanExpand}
                />
            }
        />
    );
};

export default Consents;