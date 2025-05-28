import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash } from "react-icons/fa";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  DELETE_PROFILE_IMAGE_ROUTE,
  HOST,
  LOGOUT_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LuLogOut } from "react-icons/lu";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [hovered, setHovered] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo?.profileSetup) {
      setFirstName(userInfo?.firstName ?? "");
      setLastName(userInfo?.lastName ?? "");
      setSelectedColor(userInfo?.color ?? 0);
    }
    if (userInfo?.profileImage) {
      setProfileImage(`${HOST}/${userInfo.profileImage}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }

    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            // profileImage,
            selectedColor,
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully");
          navigate("/chat");
        } else {
          toast.error("Failed to update profile");
        }
      } catch (error) {
        // console.error("Error saving changes:", error);
        toast.error("Error saving changes");
      }
    }
  };

  const handleNavigateBack = () => {
    if (userInfo?.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please complete your profile setup");
    }
  };

  const handleFileInputChange = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);

      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data.profileImage) {
        toast.success("Profile image uploaded successfully");
        setUserInfo(
          userInfo
            ? { ...userInfo, profileImage: response.data.image }
            : undefined
        );
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(DELETE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserInfo(userInfo ? { ...userInfo, profileImage: "" } : undefined);
        setProfileImage(null);
        toast.success("Profile image deleted successfully");
      } else {
        toast.error("Failed to delete profile image");
      }
    } catch (error) {
      // console.error("Error deleting image:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setUserInfo(undefined);
        navigate("/auth");
      }
    } catch (error) {
      // console.log("Error logging out:", error);
    }
  };
  // TODO Handle Update Image and Double verification delete image

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="grid min-h-[35rem] min-w-[30rem] rounded-3xl border-2 border-surface bg-surface text-opacity-90 shadow-lg shadow-shadow xl:grid-cols-1 p-4">
        <div className="p-2 flex justify-between">
          {/* Back to chat */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-start">
                <IoArrowBack
                  className="text-4xl lg:text-5xl cursor-pointer"
                  onClick={handleNavigateBack}
                />
              </TooltipTrigger>
              <TooltipContent className="text-white border-none ">
                Back to Chat
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* logout */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-start">
                <LuLogOut
                  className=" text-3xl lg:text-4xl cursor-pointer"
                  onClick={logout}
                />
              </TooltipTrigger>
              <TooltipContent className="text-white border-none ">
                Logout
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div
            className="relative flex h-full w-32 items-top justify-center px-4 md:h-40 md:w-40"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 overflow-hidden rounded-full md:h-40 md:w-40 ">
              {profileImage ? (
                <AvatarImage
                  src={profileImage}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className={`flex h-32 w-32 items-center justify-center rounded-full border border-solid font-bold uppercase text-5xl text-text-primary md:h-40 md:w-40 ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo?.email?.split("").shift()}
                </div>
              )}
            </Avatar>

            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/80 ring-fuchsia-50"
                onClick={
                  profileImage ? handleDeleteImage : handleFileInputChange
                }
              >
                {profileImage ? (
                  <FaTrash
                    className="cursor-pointer text-4xl text-white"
                    aria-label="Update profile Image"
                  />
                ) : (
                  <MdOutlineAddPhotoAlternate
                    className="cursor-pointer text-4xl text-white"
                    aria-label="Update profile Image"
                  />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg, .jpeg, .svg, .webp"
            />
          </div>
          <div className="flex min-w-32 flex-col items-center justify-center gap-5 md:min-w-64">
            <div className="w-full space-y-3">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo?.email || ""}
              />
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>
            <div className="flex w-full gap-5">
              {colors.map((color, index) => (
                <div
                  className={`h-8 w-8 cursor-pointer rounded-full transition-all duration-300 ${color} ${
                    selectedColor === index ? "outline-3 outline-white/40" : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        {/* Updated button container with more explicit styling */}
        <div className="flex w-full justify-center p-4">
          <Button
            className="h-16 w-4/5 text-text-secondary font-bold"
            onClick={saveChanges}
          >
            Update profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
