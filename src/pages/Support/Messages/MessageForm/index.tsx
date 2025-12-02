import { ControlledInputText } from "@/components/FormInputs";
import CustomButton from "@/components/CustomButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import PermissionGuard from "@/components/PermissionGuard";
import { Uploader } from "@/components/Uploader";
import {
    createSupportTicketMessage,
    getSupportTicketMessageById,
    updateSupportTicketMessage,
} from "@/services/support";
import {
    ISupportTicketMessageCreateRequest,
    ISupportTicketMessage,
    ISupportTicketMessageUpdateRequest,
} from "@/services/support/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface IMessageAttachmentFormValue {
    filePath: string;
    fileName: string;
    contentType: string;
}

const MessageForm = () => {
    const { id, messageId } = useParams<{ id: string; messageId?: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [attachments, setAttachments] = useState<IMessageAttachmentFormValue[]>([]);
    const isEditMode = Boolean(messageId);

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

    if (!id) {
        // Geçersiz rota durumunda hiçbir şey göstermiyoruz
        return <LoadingSpinner />;
    }

    const { data: message, isLoading: isMessageLoading, isError: isMessageError } = useQuery<ISupportTicketMessage>({
        queryKey: ["support-ticket-message", id, messageId],
        queryFn: () =>
            getSupportTicketMessageById(id as string, messageId as string),
        enabled: isEditMode && !!id && !!messageId,
    });

    useEffect(() => {
        if (message && isEditMode) {
            reset({
                message: message.message,
                isInternal: message.isInternal,
                attachments: message.attachments,
            });
        }
    }, [message, isEditMode, reset]);


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
            queryClient.invalidateQueries({
                queryKey: ["support-ticket-messages", id],
            });
        },
        onError: (error: any) => {
            toast.error(error?.message || t("notification.anErrorOccurred"));
        },
    });

    const { mutateAsync: updateMessage } = useMutation({
        mutationFn: (payload: ISupportTicketMessageUpdateRequest) =>
            updateSupportTicketMessage(id as string, messageId as string, payload),
        onSuccess: () => {
            toast.success(
                t(
                    "support.messages.updateSuccess",
                    "Mesaj başarıyla güncellendi.",
                ),
            );
            queryClient.invalidateQueries({
                queryKey: ["support-ticket-messages", id],
            });
            queryClient.invalidateQueries({
                queryKey: ["support-ticket-message", id, messageId],
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
        if (isEditMode && messageId) {
            const payload: ISupportTicketMessageUpdateRequest = {
                message: data.message,
            };
            await updateMessage(payload);
        } else {
            const payload: ISupportTicketMessageCreateRequest = {
                message: data.message,
                isInternal: false,
                attachments: attachments.length ? attachments : undefined,
            };

            await createMessage(payload);
        }

        reset();
        setAttachments([]);
        navigate(`/support/${id}/messages`);
    };

    return (
        <div className="m-8 mx-auto w-full max-w-3xl space-y-4 rounded-lg border bg-background p-8 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isEditMode
                            ? t(
                                "support.messages.updateTitle",
                                "Mesajı Güncelle",
                            )
                            : t(
                                "support.messages.createTitle",
                                "Yeni Mesaj Oluştur",
                            )}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isEditMode
                            ? t(
                                "support.messages.updateDescription",
                                "Mesaj içeriğini güncelleyebilirsiniz.",
                            )
                            : t(
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

                {!isEditMode && (
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
                )}

                <div className="flex flex-col gap-2 ">
                    <CustomButton
                        type="button"
                        variant="outline"
                        label={t("common.cancel", "Cancel")}
                        className="w-full"
                        onClick={() => navigate(`/support/${id}/messages`)}
                    />
                    <PermissionGuard
                        permission={isEditMode ? "update-ticket-message" : "create-ticket-message"}
                        mode="hide"
                    >
                        <CustomButton
                            type="submit"
                            label={
                                isEditMode
                                    ? t(
                                        "support.messages.form.updateSubmit",
                                        "Mesajı Güncelle",
                                    )
                                    : t(
                                        "support.messages.form.submit",
                                        "Mesaj Oluştur",
                                    )
                            }
                            loading={isSubmitting}
                            className="w-full"
                        />
                    </PermissionGuard>
                </div>
            </form>
        </div>
    );
};

export default MessageForm;