"use client";
import { Sparkles, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DashboardOverviewSkeleton from "./dashboard-overview-skeleton";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import { useSession } from "next-auth/react";
import { DashboardOverviewsApiResponse } from "./dashboard-overview-data-type";

export function DashboardOverview() {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, isError, error } =
    useQuery<DashboardOverviewsApiResponse>({
      queryKey: ["dashboard-overview"],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/overview`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return await res.json();
      },
      enabled: !!token,
    });

    console.log("Dashboard Overview Data:", data);

  

  let content;

  if (isLoading) {
    content = (
      <div className="p-6">
        <DashboardOverviewSkeleton />
      </div>
    );
  } else if (isError) {
    content = (
      <div className="p-6">
        <ErrorContainer message={error?.message || "Something went wrong"} />
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
        <div className="md:col-span-1 h-[100px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
          <div>
            <p className="text-sm font-semibold text-[#616161] leading-normal">
              Total Requests
            </p>
            <p className="text-3xl leading-[120%] text-primary font-bold font-hexco pt-2">
              {data?.data?.generateReport || 384}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#F7F7FE] p-3 rounded-full">
              <Sparkles  className="w-6 h-6 text-primary" />
            </span>
          </div>
        </div>
        <div className="md:col-span-1 h-[100px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
          <div>
            <p className="text-sm font-semibold text-[#616161] leading-normal">
              Total Users
            </p>
            <p className="text-3xl leading-[120%] text-primary font-bold font-hexco pt-2">
              {data?.data?.totalUser || 502}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#F7F7FE] p-3 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </span>
          </div>
        </div>

        {/* <div className="md:col-span-1 h-[100px] flex items-center justify-between bg-white shadow-[0px_4px_6px_0px_#0000001A] px-4 rounded-[8px]">
          <div>
            <p className="text-sm font-semibold text-[#616161] leading-normal">
              Total Earning
            </p>
            <p className="text-3xl leading-[120%] text-primary font-bold font-hexco pt-2">
              £{data?.data?.totalEarning?.toFixed(2) || 0}
            </p>
          </div>
          <div>
            <span className="flex items-center justify-center bg-[#F7F7FE] p-3 rounded-full">
              <PoundSterling  className="w-6 h-6 text-primary" />
            </span>
          </div>
        </div> */}

        
      </div>
    );
  }

  return <div className="">{content}</div>;
}
