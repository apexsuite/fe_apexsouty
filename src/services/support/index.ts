import { IPageResponse } from "@/types/common.types";
import { apiRequest } from "../api";
import { ISupportTicket, ISupportTicketRequest, TicketCategory, TicketPriority } from "./types";

export const getSupportTickets = async (params: ISupportTicketRequest): Promise<IPageResponse<ISupportTicket>> => {
    const response = await apiRequest('/support/tickets', {
        method: 'GET',
        params,
    });
    return response.data;
};

export interface ISupportTicketCreateRequest {
    subject: string;
    description: string;
    priority: TicketPriority;
    category: TicketCategory;
    attachments?: {
        filePath: string;
        fileName: string;
        contentType: string;
    }[];
}

export const createSupportTicket = async (data: ISupportTicketCreateRequest): Promise<void> => {
    const response = await apiRequest('/support/tickets', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    return response.data;
};