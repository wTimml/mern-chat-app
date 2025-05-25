import DisplayUserProfile from "@/components/ui/displayUserProfile";
import { useAppStore } from "@/store";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  if (!selectedChatData) {
    return null; // Or show a loading state/placeholder
  }

  return (
    <div className="h-[10vh] border-b-3 border-surface flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <DisplayUserProfile
            userProfileData={selectedChatData}
            showDetails={false}
            showChatType={selectedChatType}
          />
          {/* <div>
            {selectedChatType === "contact" && selectedChatData?.firstName
              ? `${selectedChatData?.firstName} ${selectedChatData?.lastName}`
              : selectedChatData?.email}
          </div> */}
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-cyan-700 duration-300 transition-all "
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
