import { ControlledInputText } from "@/components/FormInputs";
import { Button } from "@/components/ui/button";
import { createRegion, getRegionById, updateRegion } from "@/services/region";
import { IRegionCreateRequest } from "@/services/region/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import regionValidationSchema from "./region.validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const RegionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const isEditMode = Boolean(id);

    const { control, handleSubmit, reset } = useForm<IRegionCreateRequest>({
        resolver: yupResolver(regionValidationSchema),
        defaultValues: {
            regionName: '',
            regionURL: '',
        },
    });

    const { data: regionData, isLoading: isLoadingRegion } = useQuery({
        queryKey: ['region', id],
        queryFn: () => getRegionById(id!),
        enabled: isEditMode,
    });

    useEffect(() => {
        if (regionData && isEditMode) {
            reset({
                regionName: regionData.regionName,
                regionURL: regionData.regionURL,
            });
        }
    }, [regionData, reset, isEditMode]);

    const { mutate: createRegionMutation, isPending: isCreating } = useMutation({
        mutationFn: createRegion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regions'] });
            toast.success('Region created successfully');
            reset();
            navigate('/regions');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create region');
        },
    });

    const { mutate: updateRegionMutation, isPending: isUpdating } = useMutation({
        mutationFn: (data: IRegionCreateRequest) => updateRegion(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regions'] });
            queryClient.invalidateQueries({ queryKey: ['region', id] });
            toast.success('Region updated successfully');
            navigate('/regions');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update region');
        },
    });

    const onSubmit = (data: IRegionCreateRequest) => {
        if (isEditMode) {
            updateRegionMutation(data);
        } else {
            createRegionMutation(data);
        }
    };

    const isPending = isCreating || isUpdating;

    if (isLoadingRegion && isEditMode) {
        return (
            <div className="container mx-auto space-y-6 py-8 px-4">
                <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading region data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto space-y-6 py-8 px-4 mt-10 border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isEditMode ? 'Edit Region' : 'Create Region'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditMode ? 'Update region information' : 'Create a new region'}
                    </p>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col gap-4">
                    <ControlledInputText
                        control={control}
                        name="regionName"
                        label="Region Name"
                        placeholder="e.g., North America"
                    />
                    <ControlledInputText
                        control={control}
                        name="regionURL"
                        label="Region URL"
                        placeholder="e.g., https://..."
                    />
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/regions')}
                            className="w-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-green-500 text-white hover:bg-green-600 w-full"
                        >
                            {isPending ? (
                                <Loader className="h-4 w-4 animate-spin" />
                            ) : isEditMode ? (
                                'Update'
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegionForm;