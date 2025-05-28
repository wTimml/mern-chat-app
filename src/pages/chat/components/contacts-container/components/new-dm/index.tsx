import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "lottie-react";
import animationDataLoading from "@/assets/Animation - loading.json";
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserData } from "@/types/userData";
import { useAppStore } from "@/store";
import DisplayUserProfile from "@/components/ui/displayUserProfile";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModal, setOpenNewContactModal] =
    useState<boolean>(false);
  const [searchedContacts, setSearchedContacts] = useState<[]>([]);

  const searchContacts = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // const searchValue = e.target.value;

      if (e.target.value.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchValue: e.target.value },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      // console.log("Error searching contacts:", error);
    }
  };

  const selectNewContact = (contact: UserData) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-start">
            <FaPlus
              className="text-opacity-90 text-start hover:text-primary-hover cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="text-white border-none ">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-background border-none w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-surface"
              onChange={(e) => searchContacts(e)}
            />
          </div>
          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact: UserData) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer "
                    onClick={() => selectNewContact(contact)}
                  >
                    <DisplayUserProfile
                      userProfileData={contact}
                      showDetails={true}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchedContacts.length <= 0 && (
            <div className="flex-1 bg-[bg-surface] my-5 flex flex-col items-center duration-1000 transition-all">
              <Lottie
                // animationData={animationDefaultOptions}
                animationData={animationDataLoading}
                loop={true}
                autoPlay={true}
                style={{ height: 100, width: 100, opacity: 0.6 }}
                // isClickToPauseDisabled={true}
              />
              <div className="text-opacity-80 flex flex-col gap-5 items-center lg:text-2xl text-xl transition-all duration-300 text-center text-primary">
                <h3 className="newsreader-font">Search contact </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
