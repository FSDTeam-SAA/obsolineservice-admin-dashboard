
"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { USER_PROFILE_QUERY_KEY, UserProfileApiResponse } from "./user-data-type";
import ProfilePicture from './profile-picture';
import { SettingSidebarSkeleton } from './setting-sidebar-skeleton';

const SettingSidebar = () => {
  const session = useSession();
  const status = session?.status;
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading } = useQuery<UserProfileApiResponse>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      const result = await res.json();
      if (!res.ok || !result?.success) {
        throw new Error(result?.message || "Unable to fetch user profile");
      }
      return result;
    },
    enabled: !!token
  })

  const user = data?.data;
  const location = [
    user?.address?.roadArea,
    user?.address?.cityState,
    user?.address?.country,
    user?.address?.postalCode,
  ].filter(Boolean).join(", ");

  if (status === "loading" || isLoading) {
    return <SettingSidebarSkeleton />;
  }


  return (
    <aside className="min-h-[480px] overflow-hidden !rounded-[10px] bg-white pb-8 shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
        <div className="h-[112px] w-full bg-[linear-gradient(180deg,#182342_0%,#536CB5_42%,#A89BEF_76%,#FFFFFF_100%)]" />
        <ProfilePicture profileImage={user?.profileImage} />

        <div className="px-4 pt-3 text-center">
          <h4 className="text-xl font-bold leading-tight text-[#07113F]">{user?.name || "N/A"}</h4>
          <p className="break-all pt-1 text-sm font-medium text-[#07113F]">{user?.email || "N/A"}</p>
        </div>

        <dl className="mt-5 space-y-3 px-4 text-sm leading-[1.5] text-[#26324A]">
          <div>
            <dt className="inline font-medium">Name : </dt>
            <dd className="inline text-primary font-semibold">{user?.name || "N/A"}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Bio : </dt>
            <dd className="inline text-primary font-semibold">{user?.bio || "N/A"}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Email : </dt>
            <dd className="inline break-all text-primary font-semibold">{user?.email || "N/A"}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Phone : </dt>
            <dd className="inline text-primary font-semibold">{user?.phone || "N/A"}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Location : </dt>
            <dd className="inline text-primary font-semibold break-words">{location || "N/A"}</dd>
          </div>
        </dl>
    </aside>
  )
}

export default SettingSidebar
