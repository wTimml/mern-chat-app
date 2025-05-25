import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const { userInfo, selectedChatType } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast("Please complete your profile setup to access the chat.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ContactsContainer />
      {selectedChatType === undefined ? <EmptyContainer /> : <ChatContainer />}
      {/* <EmptyContainer /> */}
      {/* <ChatContainer /> */}
    </div>
  );
};

export default Chat;
