import { IPageResponse } from "@/types/common.types";
import { apiRequest } from "../api";
import {
    ISupportTicket,
    ISupportTicketCreateRequest,
    ISupportTicketDetail,
    ISupportTicketRequest,
    ISupportTicketUpdateRequest,
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