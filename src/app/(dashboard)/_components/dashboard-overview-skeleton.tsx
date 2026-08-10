import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Active Projects Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>

      {/* Upcoming Meeting Schedule Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>

      {/* Upcoming Deadlines Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>

       <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>

    </div>
  );
}