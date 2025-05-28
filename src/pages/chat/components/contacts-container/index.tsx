import {
  APP_NAME,
  GET_DM_CONTACTS_ROUTES,
  GET_USER_CHANNELS_ROUTES,
} from "@/utils/constants";
import ProfileInfo from "./components/profile-info";
import NewDM from "./components/new-dm";
import { apiClient } from "@/lib/api-client";
import { useEffect } from "react";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/create-channel";

export default function ContactsContainer() {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    contactsLastUpdated,
    channels,
    setChannels,
  } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    };

    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTES, {
        withCredentials: true,
      });
      if (response.data.channel) {
        setChannels(response.data.channel);
      }
    };

    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts]);
  //  }, [contactsLastUpdated]);
  //  7:34:09

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-background border-r-3 border-surface w-full">
      <div className="pt-3">
        <span className="text-3xl font-semibold p-5 justify-start items-center gap-2 text-primary newsreader-font-bolder">
          {APP_NAME}
        </span>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>

        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}

const Title = ({ text }: { text: string }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
