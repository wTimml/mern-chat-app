import type { UserData } from './userData'

export interface MessageDataType {
    _id: string;
    content: string;
    messageType: 'text' | 'file';
    fileUrl?: string;
    sender: string | UserData;
    recipient: string | UserData;
    timestamp: Date;
}