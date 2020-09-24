export interface Messages {
    id: number;
    senderId: number;
    senderKnownAs: string;
    senderPhotoUrl: string; 
    recipientId: number;
    recipientKnownAs: string;
    recipientPhotoUrl: string;
    content: string;
    isRead: false;
    dateRead: Date;
    messageSent: Date; 
}
