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

const getSizeClasses = (size: number) => {
  const sizes: Record<number, string> = {
    6: "w-6 h-6",
    8: "w-8 h-8",
    10: "w-10 h-10",
    12: "w-12 h-12",
    16: "w-16 h-16",
  };
  return sizes[size] || sizes[10]; // fallback to default size
};

export default function DisplayUserProfile({
  userProfileData,
  showDetails = false,
  showChatType = "contact",
  size = 10,
}: DisplayUserProfileProps) {
  const sizeClasses = getSizeClasses(size);

  const renderAvatar = () => (
    <div className={`${sizeClasses} relative`}>
      <Avatar className={`${sizeClasses} overflow-hidden rounded-full`}>
        {userProfileData?.profileImage ? (
          <AvatarImage
            src={`${HOST}/${userProfileData.profileImage}`}
            alt="profile"
            className="h-full w-full object-cover rounded-full"
          />
        ) : (
          <div
            className={`flex ${sizeClasses} items-center justify-center rounded-full border border-solid font-bold uppercase text-text-primary ${getColor(
              userProfileData?.color ?? 0
            )}`}
          >
            {userProfileData?.firstName?.charAt(0) ||
              userProfileData?.email?.charAt(0)}
          </div>
        )}
      </Avatar>
    </div>
  );

  const renderDetails = () => (
    <div>
      {showDetails ? (
        <div className="flex flex-col">
          <span>
            {userProfileData?.firstName && userProfileData?.lastName
              ? `${userProfileData.firstName} ${userProfileData.lastName}`
              : userProfileData?.email}
          </span>
          <span className="text-xs">{userProfileData.email}</span>
        </div>
      ) : (
        <span>
          {userProfileData?.firstName && userProfileData?.lastName
            ? `${userProfileData.firstName} ${userProfileData.lastName}`
            : userProfileData?.email}
        </span>
      )}
    </div>
  );

  if (showChatType === "channel") {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-10 h-10 relative`}>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-solid font-bold uppercase text-text-primary`}
          >
            #
          </div>
        </div>
        <span>{userProfileData?.name}</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-2">
        {renderAvatar()}
        {renderDetails()}
      </div>
    );
  }
}
