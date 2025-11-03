import { ControlledInputText, ControlledSelect } from "@/components/FormInputs";
import { Button } from "@/components/ui/button";
import { statusOptions } from "@/utils/constants/common";
import useQueryParams from "@/utils/hooks/useQueryParams";
import { Filter, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface FilterFormData {
    marketplace?: string;
    marketplaceURL?: string;
    isActive?: string;
}

const MarketPlaceFilters = () => {
    const {
        updateQueryParams,
        clearAllQueryParams,
        deleteQueryParams,
    } = useQueryParams();
    const navigate = useNavigate();
    const [showFilters, setShowFilters] = useState(false);
    const { control, handleSubmit, reset, watch } = useForm<FilterFormData>({
        mode: "onChange",
        defaultValues: {
            marketplace: "",
            marketplaceURL: "",
            isActive: ""
        },
    });

    const handleSearch = async (formValues: FilterFormData) => {
        Object.keys(formValues).forEach((field) => {
            deleteQueryParams([field]);
        });

        const searchParams = Object.fromEntries(
            Object.entries(formValues).filter(
                ([, value]) => value !== undefined && value !== ''
            )
        );
        updateQueryParams({ ...searchParams, page: 1, pageSize: 10 });
    };

    const handleReset = () => {
        clearAllQueryParams();
        reset({
            marketplace: "",
            marketplaceURL: "",
            isActive: ""
        });
    };

    const hasActiveFilters = () => {
        const values = watch();
        return (
            (values.marketplace && values.marketplace.trim() !== "") ||
            (values.marketplaceURL && values.marketplaceURL.trim() !== "") ||
            (values.isActive && values.isActive !== "")
        );
    };
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                    size={"sm"}
                >
                    <Filter className="h-4 w-4" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                    {hasActiveFilters() && !showFilters && (
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            !
                        </span>
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/marketplaces/create")}
                >
                    <Plus className="h-4 w-4" />
                    Create
                </Button>
            </div>

            {showFilters && (
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit(handleSearch)} onReset={handleReset} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <ControlledInputText
                                control={control}
                                name="marketplace"
                                label="Marketplace Name"
                                placeholder="e.g., North America"
                            />

                            <ControlledInputText
                                control={control}
                                name="marketplaceURL"
                                label="Marketplace URL"
                                placeholder="e.g., https://..."
                            />

                            <ControlledSelect
                                control={control}
                                name="isActive"
                                label="Status"
                                options={statusOptions}
                                placeholder="All Status"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="submit"
                                variant="default"
                                className="gap-2 bg-green-500 text-white hover:bg-green-600"
                                size="sm"
                            >
                                <Search className="h-4 w-4" />
                                Apply Filters
                            </Button>
                            <Button
                                type="reset"
                                variant="outline"
                                className="gap-2"
                                size="sm"
                            >
                                <X className="h-4 w-4" />
                                Reset
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MarketPlaceFilters;