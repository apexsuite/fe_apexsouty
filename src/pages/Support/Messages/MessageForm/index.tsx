import { ControlledInputText } from "@/components/FormInputs";
import CustomButton from "@/components/CustomButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Uploader } from "@/components/Uploader";
import {
    createSupportTicketMessage,
} from "@/services/support";
import {
    ISupportTicketMessageCreateRequest,
} from "@/services/support/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface IMessageAttachmentFormValue {
    filePath: string;
    fileName: string;
    contentType: string;
}

const MessageForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [attachments, setAttachments] = useState<IMessageAttachmentFormValue[]>([]);

    if (!id) {
        // Geçersiz rota durumunda hiçbir şey göstermiyoruz
        return <LoadingSpinner />;
    }

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<ISupportTicketMessageCreateRequest>({
        defaultValues: {
            message: "",
            isInternal: false,
            attachments: [],
        },
    });

    const { mutateAsync: createMessage } = useMutation({
        mutationFn: (payload: ISupportTicketMessageCreateRequest) =>
            createSupportTicketMessage(id, payload),
        onSuccess: () => {
            toast.success(
                t(
                    "support.messages.createSuccess",
                    "Mesaj başarıyla oluşturuldu.",
                ),
            );
            // Mesaj oluşturulduktan sonra mesaj listesini yeniliyoruz
            queryClient.invalidateQueries({
                queryKey: ["support-ticket-messages", id],
            });
        },
        onError: (error: any) => {
            toast.error(error?.message || t("notification.anErrorOccurred"));
        },
    });

    const handleUploadSuccess = (filePaths: string[]) => {
        const newAttachments: IMessageAttachmentFormValue[] = filePaths.map(
            filePath => {
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
            },
        );

        setAttachments(prev => [...prev, ...newAttachments]);
    };

    const onSubmit = async (data: ISupportTicketMessageCreateRequest) => {
        const payload: ISupportTicketMessageCreateRequest = {
            message: data.message,
            // Normal kullanıcılar için daima false; staff için ayrı bir form eklenebilir
            isInternal: false,
            attachments: attachments.length ? attachments : undefined,
        };

        await createMessage(payload);

        reset();
        setAttachments([]);
        navigate(`/support/${id}/messages`);
    };

    return (
        <div className="m-8 mx-auto w-full max-w-3xl space-y-4 rounded-lg border bg-background p-8 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t(
                            "support.messages.createTitle",
                            "Yeni Mesaj Oluştur",
                        )}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            "support.messages.createDescription",
                            "Ticket için yeni bir mesaj ekleyebilirsiniz.",
                        )}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <ControlledInputText
                    control={control}
                    name="message"
                    label={t("support.messages.form.message.label", "Mesaj")}
                    placeholder={t(
                        "support.messages.form.message.placeholder",
                        "Mesajınızı yazın",
                    )}
                    required
                />

                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        {t(
                            "support.form.attachments.label",
                            "Attachments",
                        )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {t(
                            "support.form.attachments.helper",
                            "You can upload screenshots, documents or other files related to your issue.",
                        )}
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
                        onClick={() => navigate(`/support/${id}/messages`)}
                    />
                    <CustomButton
                        type="submit"
                        label={t(
                            "support.messages.form.submit",
                            "Mesaj Oluştur",
                        )}
                        loading={isSubmitting}
                        className="w-full"
                    />
                </div>
            </form>
        </div>
    );
};

export default MessageForm;