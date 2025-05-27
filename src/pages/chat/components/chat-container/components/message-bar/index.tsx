import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker, { Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react"; // if using that lib
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTES } from "@/utils/constants";

const MessageBar = () => {
  const emojiRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const [message, setMessage] = useState<string>("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = async (emoji: EmojiClickData) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      const { refreshContacts } = useAppStore.getState();

      socket.emit("sendMessage", {
        sender: userInfo?.id,
        content: message,
        recipient: selectedChatData?._id,
        messageType: "text",
        fileUrl: undefined,
      });

      // Refresh contacts immediately after sending
      refreshContacts();

      //clear input
      setMessage("");
    }
  };

  const handleAttachFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTES, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(
              Math.round((data.loaded * 100) / (data.total || 1))
            );
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo?.id,
              content: undefined,
              recipient: selectedChatData?._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Error attaching file:", error);
    }
  };

  return (
    <div className="h-[10vh] bg-background flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-surface rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-cyan-700 duration-300 transition-all "
          onClick={handleAttachFile}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-cyan-700 duration-300 transition-all "
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme={Theme.AUTO}
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-primary rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-primary-hover focus:outline-none focus:text-cyan-700 duration-300 transition-all "
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl text-white" />
      </button>
    </div>
  );
};

export default MessageBar;
