import { useAppStore } from "@/store";
import type { MessageDataType } from "@/types/messageDataType";
import { HOST } from "@/utils/constants";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  // 1. Maintains socket connection
  // 2. Handles message reception
  // 3. Updates chat state via Zustand store
  const socket = useRef<Socket | null>(null);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (!userInfo?.id) return; // Don't connect if no user ID

    socket.current = io(HOST, {
      withCredentials: true,
      query: { userId: userInfo?.id },
    });

    // socket.current.on("connect", () => {
    //   console.log("Socket connected with userId:", userInfo.id);
    // });

    const handleReceiveMessage = (message: MessageDataType) => {
      const store = useAppStore.getState();
      const {
        selectedChatData,
        selectedChatType,
        addMessage,
        refreshContacts,
      } = store;

      //refresh when receiving any message
      refreshContacts();

      if (!selectedChatData || !selectedChatType) {
        return;
      }

      const isRelevantMessage =
        (typeof message.sender === "object"
          ? message.sender._id
          : message.sender) === selectedChatData?._id ||
        (typeof message.recipient === "object"
          ? message.recipient._id
          : message.recipient) === selectedChatData?._id;

      if (isRelevantMessage) {
        addMessage(message);
      }

      // Always refresh contacts when receiving any message
      refreshContacts();
    };

    // Add handler for sent messages (if your backend emits this)
    const handleMessageSent = () => {
      const store = useAppStore.getState();
      const { refreshContacts } = store;

      // console.log("Message sent confirmation:", message);
      // Refresh contacts when a message is sent
      refreshContacts();
    };

    const handleReceiveChannelMessage = (message: any) => {
      const {
        selectedChatData,
        selectedChatType,
        addMessage,
        addChanelInChannelList,
      } = useAppStore.getState();

      if (
        selectedChatType !== undefined &&
        selectedChatData?._id === message.channelId
      ) {
        addMessage(message);
      }
      addChanelInChannelList(message);
    };

    // listener
    socket.current.on("receiveMessage", handleReceiveMessage);
    socket.current.on("messageSent", handleMessageSent);
    socket.current.on("receive-channel-message", handleReceiveChannelMessage);

    return () => {
      if (socket.current) {
        socket.current.off("receiveMessage", handleReceiveMessage);
        socket.current.off("messageSent", handleMessageSent);
        socket.current.disconnect();
      }
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
