import { useAppStore } from "@/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DisplayUserProfile from "@/components/ui/displayUserProfile";

const ProfileInfo = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  if (!userInfo) {
    return null; // Or show a loading state/placeholder
  }

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-surface">
      <div className="flex gap-3 items-center justify-center">
        <DisplayUserProfile userProfileData={userInfo} />
      </div>
      <div className="flex gap-5">
        {/* edit profile */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-primary text-xl font-medium cursor-pointer"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="text-white border-none ">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
