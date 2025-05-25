import type { UserData } from '../../types/userData';
import type { MessageDataType } from '../../types/messageDataType';

export type ChatType = 'channel' | 'contact' | 'dm' | 'group' | undefined;

export interface ChatSlice {
    selectedChatType: ChatType;
    selectedChatData: UserData | undefined;
    selectedChatMessages: MessageDataType[] | undefined;
    directMessagesContacts: [] | undefined;
    contactsLastUpdated: number | undefined;

    setSelectedChatType: (selectedChatType: ChatType) => void;
    setSelectedChatData: (selectedChatData: UserData) => void;
    setSelectedChatMessages: (selectedChatMessages: MessageDataType[]) => void;
    setDirectMessagesContacts: (directMessagesContacts: []) => void;

    refreshContacts: () => void;

    closeChat: () => void;
    addMessage: (message: MessageDataType) => void;
}

export const createChatSlice = (set: any, get: any, api: any ): ChatSlice => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    contactsLastUpdated: 0,

    setSelectedChatType: (selectedChatType: ChatType) => set({ selectedChatType}),
    setSelectedChatData: (selectedChatData: UserData) => set({
        selectedChatData

    }),
    setSelectedChatMessages: (selectedChatMessages: MessageDataType[]) => set({ selectedChatMessages}),
    setDirectMessagesContacts: (directMessagesContacts: []) => set({ directMessagesContacts}),

    // Add this method to trigger contacts refresh
    refreshContacts: () => set({ contactsLastUpdated: Date.now() }),

    closeChat: () => set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: []}),

    addMessage: (message: MessageDataType) => {

        const { selectedChatMessages = [] } = get();
        set({
            selectedChatMessages: [...selectedChatMessages, message]
        });

    },
    
})