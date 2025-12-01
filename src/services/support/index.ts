import { IPageResponse } from "@/types/common.types";
import { apiRequest } from "../api";
import {
    ISupportTicket,
    ISupportTicketCreateRequest,
    ISupportTicketDetail,
    ISupportTicketRequest,
    ISupportTicketUpdateRequest,
    ISupportTicketAssignRequest,
    ISupportTicketPriorityUpdateRequest,
    ISupportTicketStatusUpdateRequest,
    ISupportTicketMessage,
    ISupportTicketMessageCreateRequest,
    ISupportTicketMessageUpdateRequest,
} from "./types";

export const getSupportTickets = async (params: ISupportTicketRequest): Promise<IPageResponse<ISupportTicket>> => {
    const response = await apiRequest('/support/tickets', {
        method: 'GET',
        params,
    });
    return response.data;
};


export const createSupportTicket = async (
    data: ISupportTicketCreateRequest
): Promise<void> => {
    await apiRequest('/support/tickets', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const getSupportTicketById = async (id: string): Promise<ISupportTicketDetail> => {
    const response = await apiRequest(`/support/tickets/${id}`, {
        method: 'GET',
    });
    return response.data;
};

export const updateSupportTicket = async (
    id: string,
    data: ISupportTicketUpdateRequest
): Promise<void> => {
    await apiRequest(`/support/tickets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

/**
 * @description Kapalı veya çözülmüş ticket'ı yeniden açar.
 * Sadece CLOSED veya RESOLVED durumundaki kayıtlar için kullanılmalıdır.
 */
export const reopenSupportTicket = async (id: string): Promise<void> => {
    await apiRequest(`/support/tickets/${id}/reopen`, {
        method: 'POST',
    });
};

/**
 * @description Ticket'ı kapatır ve backend tarafında closedAt alanını set eder.
 */
export const closeSupportTicket = async (id: string): Promise<void> => {
    await apiRequest(`/support/tickets/${id}/close`, {
        method: 'POST',
    });
};

/**
 * @description Ticket'ı soft delete olacak şekilde siler.
 */
export const deleteSupportTicket = async (id: string): Promise<void> => {
    await apiRequest(`/support/tickets/${id}`, {
        method: 'DELETE',
    });
};

/**
 * @description Sadece staff/admin için ticket durumunu günceller.
 */
export const updateSupportTicketStatus = async (
    id: string,
    data: ISupportTicketStatusUpdateRequest,
): Promise<void> => {
    await apiRequest(`/support/tickets/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
};

/**
 * @description Sadece staff/admin için ticket önceliğini günceller.
 */
export const updateSupportTicketPriority = async (
    id: string,
    data: ISupportTicketPriorityUpdateRequest,
): Promise<void> => {
    await apiRequest(`/support/tickets/${id}/priority`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
};

/**
 * @description Sadece staff/admin için ticket'ı bir kullanıcıya atar.
 */
export const assignSupportTicket = async (
    id: string,
    data: ISupportTicketAssignRequest,
): Promise<void> => {
    await apiRequest(`/support/tickets/${id}/assign`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

/**
 * @description Sadece staff/admin için ticket üzerindeki atamayı kaldırır.
 */
export const unassignSupportTicket = async (id: string): Promise<void> => {
    await apiRequest(`/support/tickets/${id}/unassign`, {
        method: 'POST',
    });
};

/**
 * @description Belirli bir ticket'a ait mesajları listeler.
 * Mesajlar backend tarafından createdAt ASC olacak şekilde döner.
 */
export const getSupportTicketMessages = async (
    ticketId: string,
    params?: { page?: number; limit?: number },
): Promise<IPageResponse<ISupportTicketMessage>> => {
    const response = await apiRequest(`/support/tickets/${ticketId}/messages`, {
        method: 'GET',
        params,
    });

    return response.data;
};

/**
 * @description Ticket'a yeni mesaj ekler.
 * Mesaj eklendikten sonra ticket'ın lastActivityAt alanı backend tarafından güncellenir.
 */
export const createSupportTicketMessage = async (
    ticketId: string,
    data: ISupportTicketMessageCreateRequest,
): Promise<void> => {
    await apiRequest(`/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

/**
 * @description Ticket üzerindeki tek bir mesajın detayını döner.
 */
export const getSupportTicketMessageById = async (
    ticketId: string,
    messageId: string,
): Promise<ISupportTicketMessage> => {
    const response = await apiRequest(
        `/support/tickets/${ticketId}/messages/${messageId}`,
        {
            method: "GET",
        },
    );

    return response.data;
};

/**
 * @description Sadece mesajı yazan kullanıcının güncelleyebileceği mesaj güncelleme isteği.
 */
export const updateSupportTicketMessage = async (
    ticketId: string,
    messageId: string,
    data: ISupportTicketMessageUpdateRequest,
): Promise<void> => {
    await apiRequest(`/support/tickets/${ticketId}/messages/${messageId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

/**
 * @description Ticket'a bağlı bir mesajı siler.
 */
export const deleteSupportTicketMessage = async (
    ticketId: string,
    messageId: string,
): Promise<void> => {
    await apiRequest(`/support/tickets/${ticketId}/messages/${messageId}`, {
        method: "DELETE",
    });
};