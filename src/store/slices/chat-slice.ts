import type { UserData } from '../../types/userData';
import type { MessageDataType } from '../../types/messageDataType';

export type ChatType = 'channel' | 'contact' | 'dm' | 'group' | undefined;

export interface ChatSlice {
    selectedChatType: ChatType;
    selectedChatData: UserData | undefined;
    selectedChatMessages: MessageDataType[] | undefined;
    setSelectedChatType: (selectedChatType: ChatType) => void;
    setSelectedChatData: (selectedChatData: UserData) => void;
    setSelectedChatMessages: (selectedChatMessages: MessageDataType[]) => void;
    closeChat: () => void;
    addMessage: (message: MessageDataType) => void;
}

export const createChatSlice = (set: any, get: any, api: any ): ChatSlice => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    setSelectedChatType: (selectedChatType: ChatType) => set({ selectedChatType}),
    setSelectedChatData: (selectedChatData: UserData) => set({
        selectedChatData
        // : {
        //     _id: selectedChatData._id,
        //     email: selectedChatData.email,
        //     firstName: selectedChatData.firstName,
        //     lastName: selectedChatData.lastName,
        //     profileImage: selectedChatData.profileImage,
        //     color: selectedChatData.color,
        //     profileSetup: selectedChatData.profileSetup
        // }
    }),
    setSelectedChatMessages: (selectedChatMessages: MessageDataType[]) => set({ selectedChatMessages}),
    closeChat: () => set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: []}),
    addMessage: (message: MessageDataType) => {
        // const selectedChatMessages = get().selectedChatMessages;
        // const selectedChatType = get().selectedChatType;

        // set({
        //     selectedChatMessages: [
        //         ...selectedChatMessages, {
        //              ...message,
        //              recipient: selectedChatType === 'channel' ? message.recipient : message.recipient._id,
        //              sender: selectedChatType === 'channel' ? message.sender : message.sender._id,
        //         }
        //     ]
        // })
        const { selectedChatMessages = [] } = get();
        set({
            selectedChatMessages: [...selectedChatMessages, message]
        });

    }
})