import { APP_NAME } from "@/utils/constants";
import ProfileInfo from "./components/profile-info";
import NewDM from "./components/new-dm";

export default function ContactsContainer() {
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
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
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
