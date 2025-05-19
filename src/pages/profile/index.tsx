import { useAppStore } from "@/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { UPDATE_PROFILE_ROUTE } from "@/utils/constants";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [hovered, setHovered] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const navigate = useNavigate();

  const validateProfile = () => {
    if (!firstName) {
      console.log("First name is required");
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
            // profilePicture,
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
        console.error("Error saving changes:", error);
        toast.error("Error saving changes");
      }
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="grid min-h-[35rem] min-w-[30rem] rounded-3xl border-2 border-surface bg-surface text-opacity-90 shadow-lg shadow-shadow xl:grid-cols-1 p-4">
        <div className="p-2">
          <IoArrowBack className="text-4xl lg:text-5xl cursor-pointer" />
        </div>
        <div className="grid grid-cols-2 items-center">
          <div
            className="relative flex h-full w-32 items-top justify-center px-4 md:h-40 md:w-40"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 overflow-hidden rounded-full md:h-40 md:w-40">
              {profilePicture ? (
                <AvatarImage
                  src={firstName}
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
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/80 ring-fuchsia-50">
                {profilePicture ? (
                  <FaTrash
                    className="cursor-pointer text-4xl text-white"
                    aria-label="Update profile picture"
                  />
                ) : (
                  <MdOutlineAddPhotoAlternate
                    className="cursor-pointer text-4xl text-white"
                    aria-label="Update profile picture"
                  />
                )}
              </div>
            )}
            {/* <input/> */}
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
