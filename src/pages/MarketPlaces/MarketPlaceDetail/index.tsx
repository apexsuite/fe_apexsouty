import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getMarketplaceById } from "@/services/marketplaces";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowLeft,
    Calendar,
    Globe,
    Key,
    MapPin,
    Pencil,
    ShoppingBag,
    Store
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { DetailSection } from "./components/DetailSection";
import { InfoItem } from "./components/InfoItem";
import { StatusBadge } from "./components/StatusBadge";
import dayjs from "dayjs";

const MarketPlaceDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: marketplace, isLoading: isLoadingMarketplace } = useQuery({
        queryKey: ['marketplace', id],
        queryFn: () => getMarketplaceById(id!),
        enabled: !!id,
    });

    if (isLoadingMarketplace) {
        return <LoadingSpinner />
    }

    if (!marketplace) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                    <Store className="h-16 w-16 text-muted-foreground" />
                    <h2 className="text-2xl font-semibold">Marketplace not found</h2>
                    <Button onClick={() => navigate('/marketplaces')} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Marketplaces
                    </Button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('DD/MM/YYYY HH:mm');
    };

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate('/marketplaces')}
                        className="mt-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {marketplace.marketplace}
                            </h1>
                            <StatusBadge isActive={marketplace.isActive} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Marketplace Detail Information
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => navigate(`/marketplaces/${id}/edit`)}
                    variant="default"
                    className="gap-2 shrink-0 bg-green-500 hover:bg-green-600"
                >
                    <Pencil className="h-4 w-4" />
                    Edit Marketplace
                </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DetailSection
                    title="Marketplace Information"
                    icon={<ShoppingBag className="h-5 w-5" />}
                >
                    <div className="grid gap-6">
                        <InfoItem
                            label="Marketplace Name"
                            value={marketplace.marketplace}
                            icon={<Store className="h-4 w-4" />}
                        />
                        <InfoItem
                            label="Marketplace URL"
                            value={
                                <a
                                    href={marketplace.marketplaceURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-2"
                                >
                                    {marketplace.marketplaceURL}
                                    <Globe className="h-4 w-4" />
                                </a>
                            }
                            icon={<Globe className="h-4 w-4" />}
                        />
                        <InfoItem
                            label="Marketplace Key"
                            value={
                                <code className="px-3 py-1.5 bg-muted rounded-md text-sm font-mono">
                                    {marketplace.marketplaceKey}
                                </code>
                            }
                            icon={<Key className="h-4 w-4" />}
                        />
                    </div>
                </DetailSection>

                <DetailSection
                    title="Region Information"
                    icon={<MapPin className="h-5 w-5" />}
                >
                    <div className="grid gap-6">
                        <InfoItem
                            label="Region Name"
                            value={marketplace.region.regionName}
                            icon={<MapPin className="h-4 w-4" />}
                        />
                        <InfoItem
                            label="Region URL"
                            value={
                                <a
                                    href={marketplace.region.regionURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-2"
                                >
                                    {marketplace.region.regionURL}
                                    <Globe className="h-4 w-4" />
                                </a>
                            }
                            icon={<Globe className="h-4 w-4" />}
                        />
                        <InfoItem
                            label="Region Status"
                            value={<StatusBadge isActive={marketplace.region.isActive} />}
                        />
                    </div>
                </DetailSection>
            </div>

            <DetailSection
                title="System Information"
                icon={<Calendar className="h-5 w-5" />}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoItem
                        label="Created Date"
                        value={formatDate(marketplace.createdAt)}
                        icon={<Calendar className="h-4 w-4" />}
                    />
                    <InfoItem
                        label="Marketplace ID"
                        value={
                            <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                                {marketplace.id}
                            </code>
                        }
                    />
                    <InfoItem
                        label="Region ID"
                        value={
                            <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                                {marketplace.regionId}
                            </code>
                        }
                    />
                </div>
            </DetailSection>
        </div>
    );
}

export default MarketPlaceDetail;