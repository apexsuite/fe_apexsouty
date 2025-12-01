import { IPageParams } from "@/types/common.types";

export interface ISupportTicket {
    attachmentCount: number;
    category: string;
    createdAt: string;
    createdBy: string;
    createdByName: string;
    id: string;
    isReplied: boolean;
    lastActivityAt: string;
    messageCount: number;
    ownerId: string;
    priority: string;
    status: string;
    subject: string;
    unreadCount: number;
}

export interface ISupportTicketRequest extends IPageParams {
    subject?: string;
    status?: string;
    priority?: string;
    category?: string;
    assignedToId?: string;
    isPersonal?: boolean;
}

export enum TicketStatus {
    OPEN = "open",           // Yeni açılmış ticket
    INPROGRESS = "in_progress", // İşlem görüyor
    RESOLVED = "resolved",   // Çözüldü
    CLOSED = "closed",       // Kapatıldı
    REOPENED = "reopened"    // Yeniden açıldı
}

export enum TicketPriority {
    LOW = "low",           // Düşük öncelik
    MEDIUM = "medium",     // Orta öncelik
    HIGH = "high",         // Yüksek öncelik
    URGENT = "urgent"      // Acil
}

export enum TicketCategory {
    TECHNICAL = "technical",       // Teknik sorun
    BILLING = "billing",           // Faturalama
    ACCOUNT = "account",           // Hesap ile ilgili
    FEATUREREQUEST = "feature_request", // Özellik talebi
    BUGREPORT = "bug_report",     // Hata raporu
    OTHER = "other"                // Diğer
}