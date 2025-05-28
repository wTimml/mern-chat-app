import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import type { MessageDataType } from "@/types/messageDataType";
import { apiClient } from "@/lib/api-client";
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES,
  HOST,
} from "@/utils/constants";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
    userInfo,
  } = useAppStore();

  const [showImage, setShowImage] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData?._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        // console.error("Error fetching messages:", error);
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData?._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        // console.error("Error fetching messages:", error);
      }
    };

    if (selectedChatData?._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath: string) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderMessages = () => {
    let lastDate: string | null = null;
    return selectedChatMessages?.map(
      (message: MessageDataType, index: number) => {
        const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
        const showDate = messageDate !== lastDate;
        lastDate = messageDate;

        return (
          <div key={message._id || index}>
            {showDate && (
              <div className="text-center my-2">
                {moment(message.timestamp).format("LL")}
              </div>
            )}
            {selectedChatType === "contact" && renderDMMessages(message)}
            {selectedChatType === "channel" &&
              renderChannelMessages(message, index, selectedChatMessages)}
          </div>
        );
      }
    );
  };

  const downloadFile = async (file: string | undefined) => {
    try {
      if (!file) return;

      setIsDownloading(true);
      setFileDownloadProgress(0);

      const response = await apiClient.get(`${HOST}/${file}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / (total || 1));
          setFileDownloadProgress(percentCompleted);
        },
      });

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const fileName = file.split("/").pop() || "download";

      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      // console.error("Error downloading file:", error);
    } finally {
      setIsDownloading(false);
      setFileDownloadProgress(0);
    }
  };

  const renderDMMessages = (message: MessageDataType) => (
    <div
      className={`${
        (typeof message.sender === "object"
          ? message.sender._id
          : message.sender) === selectedChatData?._id
          ? "text-left"
          : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData?._id
              ? "bg-primary/30 text-text-primary/90 border-primary/50"
              : "bg-primary/30 text-text-primary/90 border-text-primary/50"
          } border inline-block p-3 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData?._id
              ? "bg-primary/30 text-text-primary/90 border-primary/50"
              : "bg-primary/30 text-text-primary/90 border-text-primary/50"
          } border inline-block p-3 rounded my-1 max-w-[50%] break-words`}
        >
          {message.fileUrl && checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl ? message.fileUrl : "");
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span className="overflow-hidden">
                {message.fileUrl?.split("/").pop()}
              </span>
              <span
                className="bg-black/20 p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessages = (
    message: any,
    index: number,
    messages: any[]
  ) => {
    // Check if previous message exists and is from the same sender
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const isSameSenderAsPrevious =
      prevMessage && prevMessage.sender._id === message.sender._id;

    return (
      <div
        key={message._id}
        className={`${!isSameSenderAsPrevious ? "mt-5" : ""} ${
          message.sender._id !== userInfo?.id ? "text-left" : "text-right"
        }`}
      >
        {message.sender._id !== userInfo?.id && !isSameSenderAsPrevious ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-7 w-7 rounded-full overflow-hidden">
              {message.sender.profileImage && (
                <AvatarImage
                  src={`${HOST}/${message.sender.profileImage}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              )}
              <AvatarFallback
                className={`uppsercase h-7 w-7 text-lg flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-sm text-white/60">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          !isSameSenderAsPrevious && (
            <div className="text-sm text-white/60 mt-1">
              {moment(message.timestamp).format("LT")}
            </div>
          )
        )}

        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id !== userInfo?.id
                ? "bg-primary/30 text-text-primary/90 border-primary/50"
                : "bg-primary/30 text-text-primary/90 border-text-primary/50"
            } border inline-block p-3 rounded my-1 max-w-[50%] break-words ml-10`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id !== userInfo?.id
                ? "bg-primary/30 text-text-primary/90 border-primary/50"
                : "bg-primary/30 text-text-primary/90 border-text-primary/50"
            } border inline-block p-3 rounded my-1 max-w-[50%] break-words ml-10`}
          >
            {message.fileUrl && checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl ? message.fileUrl : "");
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span className="overflow-hidden">
                  {message.fileUrl?.split("/").pop()}
                </span>
                <span
                  className="bg-black/20 p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoMdArrowRoundDown className="text-2xl text-white" />
            </button>
            <button
              className="bg-black/20 p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => (setShowImage(false), setImageUrl(""))}
            >
              <IoCloseSharp className="text-2xl text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
