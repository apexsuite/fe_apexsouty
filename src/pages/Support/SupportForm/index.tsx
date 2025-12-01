import { ControlledInputText, ControlledSelect } from "@/components/FormInputs";
import CustomButton from "@/components/CustomButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Uploader } from "@/components/Uploader";
import {
    createSupportTicket,
    getSupportTicketById,
    updateSupportTicket,
} from "@/services/support";
import {
    ISupportTicketCreateRequest,
    ISupportTicketDetail,
    ISupportTicketUpdateRequest,
    TicketCategory,
    TicketPriority,
} from "@/services/support/types";
import {
    SUPPORT_TICKET_CATEGORY,
    SUPPORT_TICKET_PRIORITY,
} from "@/utils/constants/support";
import { useMutation, useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface ISupportAttachmentFormValue {
    filePath: string;
    fileName: string;
    contentType: string;
}

const SupportForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);
    const [attachments, setAttachments] = useState<ISupportAttachmentFormValue[]>([]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<ISupportTicketCreateRequest>({
        defaultValues: {
            subject: "",
            description: "",
            priority: TicketPriority.MEDIUM,
            category: TicketCategory.TECHNICAL,
            attachments: [],
        },
    });

    const {
        data: ticketDetail,
        isLoading: isDetailLoading,
        isError: isDetailError,
    } = useQuery<ISupportTicketDetail>({
        queryKey: ["support-ticket", id],
        queryFn: () => getSupportTicketById(id as string),
        enabled: isEditMode && !!id,
    });

    useEffect(() => {
        if (ticketDetail && isEditMode) {
            reset({
                subject: ticketDetail.subject,
                description: ticketDetail.description,
                priority: ticketDetail.priority,
                category: ticketDetail.category,
                attachments: ticketDetail.attachments,
            });
            setAttachments(
                (ticketDetail.attachments || []).map(att => ({
                    filePath: att.filePath,
                    fileName: att.fileName,
                    contentType: att.contentType,
                }))
            );
        }
    }, [ticketDetail, isEditMode, reset]);

    const { mutateAsync: createTicket } = useMutation({
        mutationFn: createSupportTicket,
        onSuccess: () => {
            toast.success(t("notification.supportTicketCreatedSuccessfully", "Support ticket created successfully"));
        },
        onError: (error: any) => {
            toast.error(error?.message || t("notification.anErrorOccurred"));
        },
    });

    const { mutateAsync: updateTicket } = useMutation({
        mutationFn: (payload: { id: string; data: ISupportTicketUpdateRequest }) =>
            updateSupportTicket(payload.id, payload.data),
        onSuccess: () => {
            toast.success(t("notification.supportTicketUpdatedSuccessfully", "Support ticket updated successfully"));
        },
        onError: (error: any) => {
            toast.error(error?.message || t("notification.anErrorOccurred"));
        },
    });

    const handleUploadSuccess = (filePaths: string[]) => {
        const newAttachments: ISupportAttachmentFormValue[] = filePaths.map((filePath) => {
            const fileName = filePath.split("/").pop() || filePath;
            const extension = fileName.split(".").pop() || "";

            const contentType =
                extension === "png"
                    ? "image/png"
                    : extension === "jpg" || extension === "jpeg"
                        ? "image/jpeg"
                        : extension === "pdf"
                            ? "application/pdf"
                            : "application/octet-stream";

            return {
                filePath,
                fileName,
                contentType,
            };
        });

        setAttachments((prev) => [...prev, ...newAttachments]);
    };

    const onSubmit = async (data: ISupportTicketCreateRequest) => {
        if (isEditMode && id) {
            const updatePayload: ISupportTicketUpdateRequest = {
                subject: data.subject,
                description: data.description,
                priority: data.priority,
                category: data.category,
            };
            await updateTicket({ id, data: updatePayload });
        } else {
            const payload: ISupportTicketCreateRequest = {
                ...data,
                attachments: attachments.length ? attachments : undefined,
            };
            await createTicket(payload);
        }

        reset();
        setAttachments([]);
        navigate("/support");
    };

    /**
     * @description
     * Edit modunda detay verileri gelmeden formu göstermiyoruz.
     * Böylece kullanıcı boş form görmeden, gerçek ticket verileri ile çalışır.
     */
    if (isEditMode && isDetailLoading) {
        return <LoadingSpinner />;
    }

    if (isEditMode && (isDetailError || !ticketDetail)) {
        return (
            <div className="m-8 mx-auto w-full max-w-3xl">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
                    <p className="mb-4 text-sm text-destructive">
                        {t("notification.recordNotFound") || "Kayıt bulunamadı."}
                    </p>
                    <CustomButton
                        variant="outline"
                        label={t("pages.back", "Geri dön")}
                        onClick={() => navigate("/support")}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="m-8 mx-auto w-full max-w-3xl space-y-4 rounded-lg border bg-background p-8 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isEditMode
                            ? t("support.form.updateTitle", "Update Support Ticket")
                            : t("support.form.createTitle", "Create Support Ticket")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isEditMode
                            ? t("support.form.updateDescription", "Update your support ticket details.")
                            : t("support.form.createDescription", "Describe your issue and we will get back to you as soon as possible.")}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <ControlledInputText
                    control={control}
                    name="subject"
                    label={t("support.form.subject.label", "Subject")}
                    placeholder={t("support.form.subject.placeholder", "Enter subject")}
                    required
                />

                <ControlledInputText
                    control={control}
                    name="description"
                    label={t("support.form.description.label", "Description")}
                    placeholder={t("support.form.description.placeholder", "Describe your issue in detail")}
                    required
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ControlledSelect
                        control={control}
                        name="priority"
                        label={t("support.form.priority.label", "Priority")}
                        placeholder={t("support.form.priority.placeholder", "Select priority")}
                        options={SUPPORT_TICKET_PRIORITY}
                        required
                    />

                    <ControlledSelect
                        control={control}
                        name="category"
                        label={t("support.form.category.label", "Category")}
                        placeholder={t("support.form.category.placeholder", "Select category")}
                        options={SUPPORT_TICKET_CATEGORY}
                        required
                    />
                </div>

                {
                    !isEditMode && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                {t("support.form.attachments.label", "Attachments")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {t("support.form.attachments.helper", "You can upload screenshots, documents or other files related to your issue.")}
                            </p>
                            <Uploader
                                control={control}
                                name="attachments"
                                onUploadSuccess={handleUploadSuccess}
                            />
                        </div>
                    )
                }

                <div className="flex flex-col gap-2 ">
                    <CustomButton
                        type="button"
                        variant="outline"
                        label={t("common.cancel", "Cancel")}
                        className="w-full"
                        onClick={() => navigate("/support")}
                    />
                    <CustomButton
                        type="submit"
                        label={
                            isEditMode
                                ? t("support.form.updateSubmit", "Update Ticket")
                                : t("support.form.submit", "Create Ticket")
                        }
                        loading={isSubmitting}
                        className="w-full"
                    />
                </div>
            </form>
        </div>
    );
};

export default SupportForm;