import { IAttachment, IPageParams } from "@/types/common.types";

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

export interface ISupportTicketCreateRequest {
    subject: string;
    description: string;
    priority: TicketPriority;
    category: TicketCategory;
    attachments?: IAttachment[];
}

export interface ISupportTicketUpdateRequest {
    subject: string;
    description: string;
    priority: TicketPriority;
    category: TicketCategory;
}

// Ticket durum / öncelik / atama güncelleme istek tipleri
// Tüm istek body tipleri backend dökümantasyonu ile birebir uyumludur.
export interface ISupportTicketStatusUpdateRequest {
    status: TicketStatus;
}

export interface ISupportTicketPriorityUpdateRequest {
    priority: TicketPriority;
}

export interface ISupportTicketAssignRequest {
    assignedToId: string;
}

// Mesaj listeleme tipleri
export interface ISupportTicketMessageListParams extends IPageParams {
    ticketId: string;
}

export interface ISupportTicketMessage {
    ownerId: string;
    id: string;             // UUID: Message ID
    ticketId: string;       // UUID: Ticket ID
    message: string;
    isInternal: boolean;    // Staff notları için
    createdBy: string;      // UUID: User ID
    senderName: string;     // Kullanıcı adı veya "ApexScouty Team"
    createdAt: string;      // ISO 8601
    attachments: IAttachment[];
}

// Mesaj oluşturma isteği
export interface ISupportTicketMessageCreateRequest {
    message: string;              // Mesaj içeriği
    isInternal: boolean;          // Staff notları için (normal kullanıcılar false göndermeli)
    attachments?: IAttachment[];  // Opsiyonel ekler
}

// Mesaj güncelleme isteği (sadece içerik)
export interface ISupportTicketMessageUpdateRequest {
    message: string;
}

export interface ISupportTicketDetail {
    id: string;                 // UUID
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: TicketCategory;
    createdBy: string;          // UUID: User ID
    createdByName: string;
    ownerId: string;            // UUID: Owner User ID
    lastActivityAt: string;     // ISO 8601
    resolvedAt?: string;        // ISO 8601, çözüldüğü tarih
    closedAt?: string;          // ISO 8601, kapatıldığı tarih
    createdAt: string;          // ISO 8601
    messages: Array<{
        id: string;             // UUID: Message ID
        ticketId: string;       // UUID: Ticket ID
        message: string;
        isInternal: boolean;    // Staff notları için
        createdBy: string;      // UUID: User ID
        senderName: string;     // Kullanıcı adı veya "ApexScouty Team"
        createdAt: string;      // ISO 8601
        attachments: Array<{
            id: string;             // UUID: Attachment ID
            filePath: string;       // "tickets/abc123.png"
            fileName: string;       // "screenshot.png"
            contentType: string;    // "image/png"
            uploadedBy: string;     // UUID: User ID
            createdAt: string;      // ISO 8601
        }>;
    }>;
    attachments: IAttachment[];
}