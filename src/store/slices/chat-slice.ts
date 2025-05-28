import type { UserData } from '../../types/userData';
import type { MessageDataType } from '../../types/messageDataType';

export type ChatType = 'channel' | 'contact' | 'dm' | 'group' | undefined;

export interface ChatSlice {
    selectedChatType: ChatType;
    selectedChatData: UserData | undefined;
    selectedChatMessages: MessageDataType[] | undefined;
    directMessagesContacts: [] | undefined;
    contactsLastUpdated: number | undefined;
    isUploading: boolean,
    isDownloading: boolean,
    fileUploadProgress: number,
    fileDownloadProgress: number,
    channels: [] | undefined

    setSelectedChatType: (selectedChatType: ChatType) => void;
    setSelectedChatData: (selectedChatData: UserData) => void;
    setSelectedChatMessages: (selectedChatMessages: MessageDataType[]) => void;
    setDirectMessagesContacts: (directMessagesContacts: []) => void;
    setIsUploading: (isUploading: boolean) => void;
    setIsDownloading: (isDownloading: boolean) => void;
    setFileUploadProgress: (fileUploadProgress: number) => void;
    setFileDownloadProgress: (fileDownloadProgress: number) => void;
    setChannels: (channels: []) => void;

    addChannel: (channels: []) => void;

    refreshContacts: () => void;

    closeChat: () => void;
    addMessage: (message: MessageDataType) => void;

    addChanelInChannelList: (message: any) => void;
}

export const createChatSlice = (set: any, get: any, api: any ): ChatSlice => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    contactsLastUpdated: 0,
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels: [],

    setSelectedChatType: (selectedChatType: ChatType) => set({ selectedChatType}),
    setSelectedChatData: (selectedChatData: UserData) => set({
        selectedChatData

    }),
    setSelectedChatMessages: (selectedChatMessages: MessageDataType[]) => set({ selectedChatMessages}),
    setDirectMessagesContacts: (directMessagesContacts: []) => set({ directMessagesContacts}),
    setIsUploading: (isUploading: boolean) => set({ isUploading }),
    setIsDownloading: (isDownloading: boolean) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadProgress: number) => set({ fileUploadProgress }),
    setFileDownloadProgress: (fileDownloadProgress: number) => set({ fileDownloadProgress }),
    setChannels: (channels) => set({ channels }),

    addChannel: (channel: any) => {
        const channels = get().channels;
        set({ channels: [channel, ...channels] });
    },

    // Add this method to trigger contacts refresh
    refreshContacts: () => set({ contactsLastUpdated: Date.now() }),

    closeChat: () => set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: []}),

    addMessage: (message: MessageDataType) => {

        const { selectedChatMessages = [] } = get();
        set({
            selectedChatMessages: [...selectedChatMessages, message]
        });

    },

    addChanelInChannelList: (message) => {
        const channels = get().channels;
        const data = channels.find((channel: any) => channel._id === message.channelId);
        const index = channels.findIndex(
            (channel: any) => channel._id === message.channelId
        );
        if (index !== -1 && index !== undefined) {
            channels.splice(index,1);
            channels.unshift(data);
        }
    }
    
})