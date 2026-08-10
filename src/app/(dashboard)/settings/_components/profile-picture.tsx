"use client";

import { Button } from "@/components/ui/button";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { useSession } from "next-auth/react";
import Image, { type StaticImageData } from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UserProfileApiResponse } from "./user-data-type";

import NoUserImage from "../../../../../public/assets/images/no-user.jpeg"


const ProfilePicture = () => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const queryClient = new QueryClient();

  const [profilePicture, setProfilePicture] = useState<string | StaticImageData>(NoUserImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log(setProfilePicture)

  // get api
  const { data } = useQuery<UserProfileApiResponse>({
    queryKey: ["profile-img"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
      enabled: !!token
  });

  // update api
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-profile-image"],
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Profile image updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["profile-img"],
      });
      console.log("Response:", data);
    },
    onError: (error) => {
      toast.error("Upload failed");
      console.error(error);
    },
  });

  useEffect(() => {
    const image = data?.data?.profilePicture;
    if (image) {
      setProfilePicture(image);
    }
  }, [data?.data?.profilePicture]);

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
    formData.append("profilePicture", file, file.name);
    mutate(formData);
  };

  return (
    <div className="flex justify-center items-center ">
        <div className="w-fit -mt-20 relative rounded-full border-4 border-[#F7F8F8] bg-[url('/path-to-image')] bg-cover bg-center bg-no-repeat shadow-[0_4px_15px_rgba(0,0,0,0.10)]
">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border relative">
          <Image
            src={profilePicture}
            alt="Profile"
            width={128}
            height={128}
            className="w-full h-full object-cover "
          />
        </div>

        <div className="absolute -bottom-2 -right-2 flex gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          {/* Camera Icon (Choose & Upload Image) */}
          <Button
            size="sm"
            className="w-8 h-8 p-0 rounded-full bg-primary"
            title="Upload new image"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
       
      </div>
    </div>
    </div>
  );
};

export default ProfilePicture;
