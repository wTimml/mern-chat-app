import { useAppStore } from "@/store";
import DisplayUserProfile from "./ui/displayUserProfile";

const ContactList = ({ contacts, isChannel = false }: any) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact: any) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  console.log(contacts);
  return (
    <div className="mt-5">
      {contacts.map((contact: any) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData?._id === contact._id
              ? "bg-surface hover:bg-surface"
              : "hover:bg-surface"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <DisplayUserProfile userProfileData={contact} size={10} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
