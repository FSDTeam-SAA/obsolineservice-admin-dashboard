import { Skeleton } from "@/components/ui/skeleton";

export const SettingSidebarSkeleton = () => {
  return (
    <div className="h-auto pb-5 bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.12)]">
      {/* Cover */}
      <Skeleton className="w-full h-[187px] rounded-t-lg" />

      {/* Profile picture */}
      <div className="flex justify-center -mt-12">
        <Skeleton className="w-24 h-24 rounded-full" />
      </div>

      {/* Name & role */}
      <div className="pt-6 pb-10 flex flex-col items-center gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* User info */}
      <div className="px-6 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Menus */}
      <div className="px-6 pt-8">
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
};
