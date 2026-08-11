"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import Image, { type StaticImageData } from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { USER_PROFILE_QUERY_KEY, UserProfileApiResponse } from "./user-data-type";

import NoUserImage from "../../../../../public/assets/images/no-user.jpeg"


interface ProfilePictureProps {
  profileImage?: string;
}

const ProfilePicture = ({ profileImage: savedProfileImage }: ProfilePictureProps) => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const queryClient = useQueryClient();

  const [profilePicture, setProfilePicture] = useState<string | StaticImageData>(NoUserImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // update api
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-profile-image"],
    mutationFn: async (formData: FormData): Promise<UserProfileApiResponse> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/upload-avatar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const result: UserProfileApiResponse = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Upload failed");
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<UserProfileApiResponse>(USER_PROFILE_QUERY_KEY, data);
      toast.success(data?.message || "Profile image updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload failed");
      setProfilePicture(savedProfileImage || NoUserImage);
    },
  });

  useEffect(() => {
    setProfilePicture(savedProfileImage || NoUserImage);
  }, [savedProfileImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file to backend
    const formData = new FormData();
    formData.append("profileImage", file, file.name);
    mutate(formData);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative -mt-14 w-fit rounded-full border-[3px] border-white shadow-[0_3px_10px_rgba(0,0,0,0.18)]">
      <div className="relative">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-[#D9DDE7] bg-white">
          <Image
            src={profilePicture}
            alt="Profile"
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute bottom-0 right-0 flex">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          <Button
            size="sm"
            className="h-7 w-7 rounded-full border-2 border-white bg-primary p-0 shadow-sm"
            title="Upload new image"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
       
      </div>
    </div>
    </div>
  );
};

export default ProfilePicture;
