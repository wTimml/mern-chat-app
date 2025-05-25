import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import type { UserData } from "@/types/userData";

interface DisplayUserProfileProps {
  userProfileData: UserData;
  showDetails?: boolean;
  showChatType?: string;
  size?: number;
}

export default function DisplayUserProfile({
  userProfileData,
  showDetails = false,
  showChatType = "contact",
  size = 12,
}: DisplayUserProfileProps) {
  return (
    <>
      <div className={`w-${size} h-${size} relative`}>
        <Avatar className={`h-${size} w-${size} overflow-hidden rounded-full`}>
          {userProfileData?.profileImage ? (
            <AvatarImage
              src={`${HOST}/${userProfileData.profileImage}`}
              alt="profile"
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <div
              className={`flex h-${size} w-${size} items-center justify-center rounded-full border border-solid font-bold uppercase text-text-primary ${getColor(
                userProfileData?.color ?? 0
              )}`}
            >
              {userProfileData?.firstName
                ? userProfileData?.firstName.split("").shift()
                : userProfileData?.email?.split("").shift()}
            </div>
          )}
        </Avatar>
      </div>
      <div>
        {showDetails ? (
          <div className="flex flex-col">
            <span>
              {userProfileData?.firstName && userProfileData?.lastName
                ? `${userProfileData?.firstName} ${userProfileData?.lastName}`
                : userProfileData?.email}
            </span>
            <span className="text-xs">{userProfileData.email}</span>
          </div>
        ) : showChatType === "contact" &&
          userProfileData?.firstName &&
          userProfileData?.lastName ? (
          `${userProfileData?.firstName} ${userProfileData?.lastName}`
        ) : (
          userProfileData?.email
        )}
      </div>
    </>
  );
}
