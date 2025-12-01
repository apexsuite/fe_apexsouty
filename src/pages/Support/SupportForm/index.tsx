import { ControlledInputText, ControlledSelect } from "@/components/FormInputs";
import CustomButton from "@/components/CustomButton";
import { Uploader } from "@/components/Uploader";
import { createSupportTicket, ISupportTicketCreateRequest } from "@/services/support";
import { TicketCategory, TicketPriority } from "@/services/support/types";
import { SUPPORT_TICKET_CATEGORY, SUPPORT_TICKET_PRIORITY } from "@/utils/constants/support";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface ISupportAttachmentFormValue {
    filePath: string;
    fileName: string;
    contentType: string;
}

const SupportForm = () => {
    const navigate = useNavigate();
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

    const { mutateAsync } = useMutation({
        mutationFn: createSupportTicket,
        onSuccess: () => {
            toast.success(t("notification.supportTicketCreatedSuccessfully", "Support ticket created successfully"));
        },
        onError: (error: any) => {
            toast.error(error?.message || t("notification.anErrorOccurred"));
        },
    });

    const handleUploadSuccess = (filePaths: string[]) => {
        // NOTE: Burada Uploader bileşeninden gelen dosya yollarını,
        // API kontratındaki attachment formatına dönüştürüyoruz.
        const newAttachments: ISupportAttachmentFormValue[] = filePaths.map((filePath) => {
            const fileName = filePath.split("/").pop() || filePath;
            const extension = fileName.split(".").pop() || "";

            // Çok kaba MIME tahmini; backend tarafında gerçek MIME type zaten kontrol edilmeli.
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
        const payload: ISupportTicketCreateRequest = {
            ...data,
            attachments: attachments.length ? attachments : undefined,
        };

        await mutateAsync(payload);
        reset();
        setAttachments([]);
        navigate("/support");
    };

    return (
        <div className="m-8 mx-auto w-full max-w-3xl space-y-4 rounded-lg border bg-background p-8 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t("support.form.createTitle", "Create Support Ticket")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t("support.form.createDescription", "Describe your issue and we will get back to you as soon as possible.")}
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
                        label={t("support.form.submit", "Create Ticket")}
                        loading={isSubmitting}
                        className="w-full"
                    />
                </div>
            </form>
        </div>
    );
};

export default SupportForm;