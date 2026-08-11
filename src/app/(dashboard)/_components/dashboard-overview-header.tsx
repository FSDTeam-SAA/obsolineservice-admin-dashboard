"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import NoUserImage from "../../../../public/assets/images/no-user.jpeg";
import {
  USER_PROFILE_QUERY_KEY,
  UserProfileApiResponse,
} from "../settings/_components/user-data-type";

const DashboardOverviewHeader = ({title, description}:{title: string, description:string}) => {
  const { data: session } = useSession();
  const token = session?.user.accessToken;
  const [imageFailed, setImageFailed] = useState(false);

  const { data, isLoading } = useQuery<UserProfileApiResponse>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result: UserProfileApiResponse = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to fetch user profile");
      }
      return result;
    },
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 5,
  });

  const user = data?.data;



  useEffect(() => {
    setImageFailed(false);
  }, [user?.profileImage]);

  return (
    <div className="sticky top-0 z-50">
      <div className="flex items-center justify-between gap-4 bg-white p-5">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-normal text-primary lg:text-3xl">
            {title}
          </h1>
          <p className="text-sm font-normal leading-normal text-primary">
            {description}
          </p>
        </div>

        <Link
          href="/settings/personal-information"
          aria-label="Open personal information"
          title={user?.name || "Profile"}
          className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#F2F3F5] shadow-[0_1px_5px_rgba(0,0,0,0.25)] transition-transform hover:scale-105"
        >
          {isLoading ? (
            <span className="block h-full w-full animate-pulse bg-[#E2E5EA]" />
          ) : (
            <Image
              src={!imageFailed && user?.profileImage ? user.profileImage : NoUserImage}
              alt={user?.name ? `${user.name}'s profile` : "Profile"}
              width={44}
              height={44}
              unoptimized
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
            />
          )}
        </Link>
      </div>
    </div>
  );
};

export default DashboardOverviewHeader;





