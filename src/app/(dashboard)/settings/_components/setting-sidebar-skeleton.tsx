import { Skeleton } from "@/components/ui/skeleton";

export const SettingSidebarSkeleton = () => {
  return (
    <div className="min-h-[480px] overflow-hidden rounded-lg bg-white pb-8 shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
      {/* Cover */}
      <Skeleton className="h-[112px] w-full rounded-none" />

      {/* Profile picture */}
      <div className="-mt-14 flex justify-center">
        <Skeleton className="h-24 w-24 rounded-full border-[3px] border-white" />
      </div>

      {/* Name & role */}
      <div className="flex flex-col items-center gap-2 pt-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>

      {/* User info */}
      <div className="mt-5 space-y-3 px-4">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
};
