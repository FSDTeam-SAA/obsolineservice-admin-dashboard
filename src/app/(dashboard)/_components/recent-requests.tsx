"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  CalendarDays,
  Eye,
  Inbox,
  MapPin,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteModal from "@/components/modals/delete-modal";
import OBSPagination from "@/components/ui/obs-pagination";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type RecentRequest = {
  _id: string;
  holidayHomes: number;
  campingPitches: number;
  rooms: number;
  desiredDate: string;
  preferredTime: string;
  name: string;
  phoneNumber: string;
  email: string;
  location: string;
  isRentingOnBehalf: boolean;
  message: string;
  createdAt: string;
};

type DemoRequestsResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: { total: number; page: number; limit: number; totalPages: number };
  data: {
    demos: RecentRequest[];
    paginationInfo: {
      currentPage: number;
      totalPages: number;
      totalData: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
};

const fields = [
  ["Holiday homes", "holidayHomes"],
  ["Camping pitches", "campingPitches"],
  ["Rooms", "rooms"],
] as const;

export default function RecentRequests() {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)?.accessToken;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<RecentRequest | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<RecentRequest | null>(null);
  const limit = 5;

  const { data, isLoading, isFetching, error } = useQuery<DemoRequestsResponse>({
    queryKey: ["demo-requests", page, limit],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/request-demo?page=${page}&limit=${limit}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      );
      const result = (await response.json()) as DemoRequestsResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch demo requests");
      }

      return result;
    },
    enabled: status !== "loading",
  });

  const pagination = data?.data?.paginationInfo;
  const hasSearch = search.trim().length > 0;

  const deleteRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/request-demo/${requestId}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      );
      const result = (await response.json()) as {
        success: boolean;
        message: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete demo request");
      }

      return result;
    },
    onSuccess: async (result) => {
      toast.success(result.message || "Demo request deleted successfully");
      setRequestToDelete(null);

      if ((data?.data?.demos.length ?? 0) === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["demo-requests"] });
      }
    },
    onError: (mutationError) => {
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to delete demo request",
      );
    },
  });

  const filteredRequests = useMemo(() => {
    const requests = data?.data?.demos ?? [];
    const query = search.trim().toLowerCase();
    if (!query) return requests;

    return requests.filter((request) =>
      [request.name, request.email, request.phoneNumber].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [data?.data?.demos, search]);

  const renderActions = (request: RecentRequest) => (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => setRequestToDelete(request)}
        className="rounded-lg p-2 text-primary transition-colors hover:bg-[#EEF2FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`Delete request from ${request.name}`}
        title="Delete request"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setSelectedRequest(request)}
        className="rounded-lg p-2 text-primary transition-colors hover:bg-[#EEF2FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`View request from ${request.name}`}
        title="View request details"
      >
        <Eye className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <section className="p-6" aria-labelledby="recent-requests-heading">
      <div className="rounded-2xl border border-[#E4EAF3] bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF2FF] text-primary">
                <CalendarDays className="h-5 w-5" />
              </span>
              <div>
                <h2 id="recent-requests-heading" className="text-lg font-semibold text-[#1F2937]">Recent requests</h2>
                <p className="text-sm text-[#6B7280]">Latest accommodation enquiries</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mb-5 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email or phone"
            className="h-11 rounded-xl border-[#D8E0EC] bg-[#FBFCFE] pl-10 pr-10 text-sm shadow-none transition-colors placeholder:text-[#8A94A6] focus-visible:border-primary focus-visible:bg-white"
          />
          {hasSearch && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#E9EEF7] hover:text-[#1E293B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2 rounded-xl border border-[#E8EDF4] p-4">
            {Array.from({ length: limit }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex min-h-44 items-center justify-center rounded-xl border border-dashed border-red-200 px-4 text-center text-sm font-medium text-red-600">
            {error instanceof Error ? error.message : "Could not load demo requests"}
          </div>
        ) : filteredRequests.length ? (
          <>
            <div className={`hidden overflow-x-auto rounded-xl border border-[#E8EDF4] transition-opacity md:block ${isFetching ? "opacity-60" : ""}`}>
              <table className="min-w-[980px] w-full text-sm">
                <thead className="bg-[#F5F8FC] text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  <tr>
                    {fields.map(([label]) => <th key={label} className="px-4 py-3">{label}</th>)}
                    <th className="px-4 py-3">Desired Date / Time</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3 text-right"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EDF4]">
                  {filteredRequests.map((request) => (
                    <tr key={request._id} className="transition-colors hover:bg-[#FAFBFD]">
                      {fields.map(([, key]) => <td key={key} className="px-4 py-4 font-medium text-[#334155]">{request[key]}</td>)}
                      <td className="px-4 py-4 text-[#475569]"><div className="font-medium">{formatDate(request.desiredDate)}</div><div className="mt-0.5 text-xs text-[#7C8799]">{request.preferredTime}</div></td>
                      <td className="px-4 py-4 font-medium text-[#334155]">{request.name}</td>
                      <td className="px-4 py-4"><a href={`tel:${request.phoneNumber}`} className="block whitespace-nowrap text-[#475569] hover:text-primary hover:underline">{request.phoneNumber}</a><a href={`mailto:${request.email}`} className="block max-w-[220px] truncate text-xs text-[#64748B] hover:text-primary hover:underline">{request.email}</a></td>
                      <td className="px-2 py-4">{renderActions(request)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {filteredRequests.map((request) => (
                <article key={request._id} className="rounded-xl border border-[#E8EDF4] p-4">
                  <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-[#1F2937]">{request.name}</h3><a href={`mailto:${request.email}`} className="text-sm text-[#64748B] hover:text-primary hover:underline">{request.email}</a></div>{renderActions(request)}</div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-lg bg-[#F5F8FC] p-2"><Users className="mx-auto mb-1 h-4 w-4 text-primary" />{request.holidayHomes} homes</div><div className="rounded-lg bg-[#F5F8FC] p-2"><MapPin className="mx-auto mb-1 h-4 w-4 text-primary" />{request.campingPitches} pitches</div><div className="rounded-lg bg-[#F5F8FC] p-2"><Users className="mx-auto mb-1 h-4 w-4 text-primary" />{request.rooms} rooms</div></div>
                  <p className="mt-3 text-sm text-[#475569]"><span className="font-medium">Requested:</span> {formatDate(request.desiredDate)} at {request.preferredTime}</p>
                  <a href={`tel:${request.phoneNumber}`} className="mt-1 block text-sm text-[#475569] hover:text-primary hover:underline">{request.phoneNumber}</a>
                </article>
              ))}
            </div>
          </>
        ) : (
          <EmptyRequestsState
            hasSearch={hasSearch}
            search={search}
            onClearSearch={() => setSearch("")}
          />
        )}

        {!isLoading && !error && pagination && pagination.totalData > 0 && (
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {(pagination.currentPage - 1) * limit + 1} to{" "}
              {Math.min(pagination.currentPage * limit, pagination.totalData)} of{" "}
              {pagination.totalData} results
            </p>
            <div className={isFetching ? "pointer-events-none opacity-60" : ""}>
              <OBSPagination
                totalPages={pagination.totalPages}
                currentPage={pagination.currentPage}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}
      </div>

      <Dialog open={Boolean(selectedRequest)} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-h-[90vh] max-w-[calc(100%_-_2rem)] overflow-y-auto !rounded-2xl border-none bg-white p-6 shadow-2xl sm:p-8 md:max-w-[780px] md:p-10 lg:max-w-[850px] [&>button]:right-6 [&>button]:top-6 [&>button]:rounded-full [&>button]:p-1 [&>button]:opacity-100 [&>button]:transition-colors [&>button:hover]:bg-[#F1F5F9] [&>button>svg]:h-5 [&>button>svg]:w-5">
          <DialogHeader className="sr-only">
            <DialogTitle>Request details</DialogTitle>
            <DialogDescription>
              Accommodation enquiry from {selectedRequest?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 md:grid-cols-3 md:gap-x-10 md:gap-y-6">
              <Detail label="Name" value={selectedRequest.name} />
              <Detail label="Email" value={selectedRequest.email} />
              <Detail label="Contact" value={selectedRequest.phoneNumber} />
              <Detail label="Holiday Homes" value={selectedRequest.holidayHomes} />
              <Detail label="Camping Pitches" value={selectedRequest.campingPitches} />
              <Detail label="Rooms" value={selectedRequest.rooms} />
              <Detail label="Desired Date" value={formatDate(selectedRequest.desiredDate)} />
              <Detail label="Desired Time" value={selectedRequest.preferredTime} />
              <Detail label="Location" value={selectedRequest.location || "—"} />
              <Detail label="Renting On Behalf" value={selectedRequest.isRentingOnBehalf ? "Yes" : "No"} />
              {selectedRequest.message && (
                <Detail
                  label="Message"
                  value={selectedRequest.message}
                  className="sm:col-span-2 md:col-span-3"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteModal
        isOpen={Boolean(requestToDelete)}
        onClose={() => setRequestToDelete(null)}
        onConfirm={() => requestToDelete && deleteRequest.mutate(requestToDelete._id)}
        title="Are You Sure?"
        desc="Are you sure you want to delete this request?"
        isLoading={deleteRequest.isPending}
      />
    </section>
  );
}

function EmptyRequestsState({
  hasSearch,
  search,
  onClearSearch,
}: {
  hasSearch: boolean;
  search: string;
  onClearSearch: () => void;
}) {
  return (
    <div className="relative isolate flex min-h-[260px] overflow-hidden rounded-2xl border border-dashed border-[#C9D5E7] bg-gradient-to-b from-[#F8FAFF] to-white px-6 py-10 text-center">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-40 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="m-auto flex max-w-md flex-col items-center">
        <div className="relative mb-5">
          <span className="absolute inset-0 rounded-2xl bg-primary/15 blur-lg" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white bg-white text-primary shadow-[0_10px_30px_rgba(30,64,175,0.12)]">
            {hasSearch ? (
              <Search className="h-7 w-7" strokeWidth={1.8} />
            ) : (
              <Inbox className="h-7 w-7" strokeWidth={1.8} />
            )}
          </span>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-[#1E293B]">
          {hasSearch ? "No requests found" : "No recent requests yet"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#64748B]">
          {hasSearch ? (
            <>
              We couldn&apos;t find a request matching{" "}
              <span className="font-medium text-[#334155]">“{search.trim()}”</span>.
              Try another name, email, or phone number.
            </>
          ) : (
            "New accommodation enquiries will appear here as soon as they arrive."
          )}
        </p>

        {hasSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <X className="h-4 w-4" />
            Clear search
          </button>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, className = "" }: { label: string; value: string | number; className?: string }) {
  return (
    <div className={className}>
      <p className="text-base font-bold leading-6 text-black">{label}</p>
      <p className="mt-1.5 break-words text-[15px] leading-6 text-[#6B7280] sm:text-base">
        {value}
      </p>
    </div>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
