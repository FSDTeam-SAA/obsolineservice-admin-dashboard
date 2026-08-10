
"use client"
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react'
import React from 'react'
import { UserProfileApiResponse } from './user-data-type';
import ProfilePicture from './profile-picture';
import { SettingSidebarSkeleton } from './setting-sidebar-skeleton';

const SettingSidebar = () => {
  const session = useSession();
  const status = session?.status;
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading } = useQuery<UserProfileApiResponse>({
    queryKey: ["user-data"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      return await res.json();
    },
    enabled: !!token
  })

  console.log(data)

  if (status === "loading" || isLoading) {
    return <SettingSidebarSkeleton />;
  }


  return (
    <div>
      <div className="h-auto pb-5 bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.12)]">
        <div className="w-full h-[187px] rounded-t-lg bg-[linear-gradient(180deg,#030929_0%,#11245C_20.25%,#2F51AF_40%,#797BD6_60%,#AB97F0_80%,#FDFDFF_100%)]" />
        {/* profile picture  */}
        <div>
          <ProfilePicture />
        </div>
        {/* user info  */}
        <div className='pt-6 pb-10'>
          <h4 className="text-xl md:text-2xl font-semibold leading-[120%] text-primary text-center">{data?.data?.firstName} {data?.data?.lastName || "N/A"}</h4>
          <p className='text-sm font-normal leading-[120%] text-[#68706A] text-center pt-1'>{data?.data?.email || "N/A"}</p>
        </div>
        <div className='px-6'>
          <ul>
            <li className="text-base font-normal text-[#5B6574] leading-[120%] "><strong className="text-base font-semibold leading-[120%] text-[#5B6574]">Name :</strong> {data?.data?.firstName || "N/A"} {data?.data?.lastName || ""}</li>
             <li className="text-base font-normal text-[#5B6574] leading-[120%] pt-3"><strong className="text-base font-semibold leading-[120%] text-[#5B6574]">Bio :</strong> {data?.data?.bio || "N/A"}</li>
            <li className="text-base font-normal text-[#5B6574] leading-[120%] py-3"><strong className="text-base font-semibold leading-[120%] text-[#5B6574]">Email :</strong> {data?.data?.email || "N/A"}</li>
            <li className="text-base font-normal text-[#5B6574] leading-[120%] "><strong className="text-base font-semibold leading-[120%] text-[#5B6574]">Phone :</strong> {data?.data?.phoneNumber || "N/A"}</li>
            <li className="text-base font-normal text-[#5B6574] leading-[120%] py-3"><strong className="text-base font-semibold leading-[120%] text-[#5B6574]">Location :</strong> {data?.data?.streetAddress || "N/A"}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SettingSidebar