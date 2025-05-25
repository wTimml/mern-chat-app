import Lottie from "lottie-react";
import animationDataLoading from "@/assets/Animation - loading.json";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/constants";

export default function EmptyContainer() {
  return (
    <div className="flex-1 md:bg-[bg-surface] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <Lottie
        // animationData={animationDefaultOptions}
        animationData={animationDataLoading}
        loop={true}
        autoPlay={true}
        style={{ height: 200, width: 200 }}
        // isClickToPauseDisabled={true}
      />
      <div className="text-opacity-80 flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center text-primary">
        <h3 className="newsreader-font">Welcome to {APP_NAME}</h3>
        <span className="newsreader-font text-2xl text-text-primary">
          {APP_DESCRIPTION}
        </span>
      </div>
    </div>
  );
}
