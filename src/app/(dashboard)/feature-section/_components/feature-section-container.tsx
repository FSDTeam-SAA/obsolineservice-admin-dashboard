"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DeleteModal from "@/components/modals/delete-modal";
import OBSPagination from "@/components/ui/obs-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type Feature = {
  _id: string;
  featureName: string;
  title: string;
  bodyText: string;
  features: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
};

type FeaturesResponse = {
  success: boolean;
  message: string;
  data: {
    features: Feature[];
    paginationInfo: {
      currentPage: number;
      totalPages: number;
      totalData: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
};

type MutationResponse = { success: boolean; message: string; data: Feature | null };
const PAGE_SIZE = 5;

export default function FeatureSectionContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const token = session?.user.accessToken;
  const [currentPage, setCurrentPage] = useState(1);
  const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const { data, isLoading, isFetching, error } = useQuery<FeaturesResponse>({
    queryKey: ["features", currentPage, PAGE_SIZE],
    queryFn: () =>
      featureRequest<FeaturesResponse>(
        `/feature?page=${currentPage}&limit=${PAGE_SIZE}`,
        token,
      ),
    enabled: status !== "loading",
  });

  const features = data?.data?.features ?? [];
  const pagination = data?.data?.paginationInfo;
  const isInitialLoading = status === "loading" || isLoading;

  const deleteMutation = useMutation({
    mutationFn: (featureId: string) =>
      featureRequest<MutationResponse>(`/feature/${featureId}`, token, {
        method: "DELETE",
      }),
    onSuccess: async (result) => {
      toast.success(result.message || "Feature deleted successfully");
      setFeatureToDelete(null);
      if (features.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      }
      await queryClient.invalidateQueries({ queryKey: ["features"] });
    },
    onError: (mutationError: Error) => toast.error(mutationError.message),
  });

  const actions = (feature: Feature) => (
    <div className="flex items-center justify-center gap-0.5">
      <ActionButton
        label={`Edit ${feature.title}`}
        onClick={() =>
          router.push(`/feature-section/add-edit-feature-form?id=${feature._id}`)
        }
      >
        <Pencil className="h-4 w-4" />
      </ActionButton>
      <ActionButton
        label={`Delete ${feature.title}`}
        onClick={() => setFeatureToDelete(feature)}
      >
        <Trash2 className="h-4 w-4" />
      </ActionButton>
      <ActionButton
        label={`View ${feature.title}`}
        onClick={() => setSelectedFeature(feature)}
      >
        <Eye className="h-4 w-4" />
      </ActionButton>
    </div>
  );

  const showingFrom = pagination?.totalData
    ? (pagination.currentPage - 1) * PAGE_SIZE + 1
    : 0;
  const showingTo = pagination
    ? Math.min(pagination.currentPage * PAGE_SIZE, pagination.totalData)
    : 0;

  return (
    <section className="p-4 sm:p-6" aria-label="Feature section management">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/feature-section/add-edit-feature-form")}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add New
        </button>
      </div>

      {isInitialLoading ? (
        <div className="space-y-2 rounded-lg border border-[#E4EAF3] bg-white p-4">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="flex min-h-52 items-center justify-center rounded-lg border border-dashed border-red-200 bg-white p-6 text-center text-sm font-medium text-red-600">
          {error instanceof Error ? error.message : "Could not load features"}
        </div>
      ) : features.length ? (
        <div
          className={`overflow-hidden rounded-lg border border-[#E4EAF3] bg-white transition-opacity ${isFetching ? "opacity-60" : ""}`}
        >
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] table-fixed">
              <thead className="bg-[#EDF4F8] text-xs font-medium text-[#475569]">
                <tr>
                  <th className="w-[11%] px-4 py-3 text-center">Image</th>
                  <th className="w-[25%] px-4 py-3 text-center">Title</th>
                  <th className="w-[27%] px-4 py-3 text-center">Body Text</th>
                  <th className="w-[15%] px-4 py-3 text-center">Last Updated</th>
                  <th className="w-[11%] px-4 py-3 text-center">Status</th>
                  <th className="w-[11%] px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4EAF3]">
                {features.map((feature) => (
                  <tr key={feature._id} className="hover:bg-[#FAFBFD]">
                    <td className="px-4 py-2.5">
                      <FeatureImage feature={feature} />
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-[#475569]">
                      <p className="line-clamp-2">{feature.title}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-sm leading-5 text-[#64748B]">
                      <p className="line-clamp-2">{feature.bodyText}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-[#64748B]">
                      {formatDate(feature.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex min-w-20 justify-center rounded-full bg-[#EAF4FB] px-3 py-1 text-xs font-medium text-[#2573B8]">
                        Active
                      </span>
                    </td>
                    <td className="px-2 py-3">{actions(feature)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {features.map((feature) => (
              <article key={feature._id} className="rounded-lg border border-[#E4EAF3] p-4">
                <div className="flex items-start gap-3">
                  <FeatureImage feature={feature} />
                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-2 text-sm font-semibold text-[#334155]">
                      {feature.title}
                    </h2>
                    <p className="mt-1 text-xs text-[#94A3B8]">Updated {formatDate(feature.updatedAt)}</p>
                  </div>
                  {actions(feature)}
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#64748B]">
                  {feature.bodyText}
                </p>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-[#D8E0EC] bg-white p-6 text-center">
          <ImageIcon className="mb-3 h-8 w-8 text-[#94A3B8]" />
          <p className="font-medium text-[#475569]">No features yet</p>
          <p className="mt-1 text-sm text-[#94A3B8]">Add your first feature section to get started.</p>
        </div>
      )}

      {!isInitialLoading && !error && pagination && pagination.totalData > 0 && (
        <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#9CA3AF]">
            Showing {showingFrom} to {showingTo} of {pagination.totalData} results
          </p>
          <div className={isFetching ? "pointer-events-none opacity-60" : ""}>
            <OBSPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      <Dialog open={selectedFeature !== null} onOpenChange={(open) => !open && setSelectedFeature(null)}>
        <DialogContent className="max-w-2xl rounded-xl border-0 bg-white p-7 shadow-2xl sm:p-9">
          <DialogHeader>
            <DialogTitle className="pr-8 text-xl text-[#202020]">{selectedFeature?.title}</DialogTitle>
            <DialogDescription>{selectedFeature?.featureName}</DialogDescription>
          </DialogHeader>
          {selectedFeature && (
            <div className="space-y-5">
              {selectedFeature.image && (
                <div
                  className="h-52 rounded-lg bg-[#EEF2F6] bg-cover bg-center"
                  style={{ backgroundImage: `url("${selectedFeature.image}")` }}
                  role="img"
                  aria-label={selectedFeature.title}
                />
              )}
              <p className="text-sm leading-6 text-[#64748B]">{selectedFeature.bodyText}</p>
              {selectedFeature.features.length > 0 && (
                <ul className="list-inside list-disc space-y-2 text-sm text-[#475569]">
                  {selectedFeature.features.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteModal
        isOpen={featureToDelete !== null}
        onClose={() => setFeatureToDelete(null)}
        onConfirm={() => featureToDelete && deleteMutation.mutate(featureToDelete._id)}
        title="Are You Sure?"
        desc="Are you sure you want to delete this feature?"
        isLoading={deleteMutation.isPending}
      />
    </section>
  );
}

function FeatureImage({ feature }: { feature: Feature }) {
  return feature.image ? (
    <div
      className="mx-auto h-12 w-20 shrink-0 rounded-md bg-[#EEF2F6] bg-cover bg-center"
      style={{ backgroundImage: `url("${feature.image}")` }}
      role="img"
      aria-label={feature.title}
    />
  ) : (
    <div className="mx-auto flex h-12 w-20 shrink-0 items-center justify-center rounded-md bg-[#EEF2F6] text-[#94A3B8]">
      <ImageIcon className="h-5 w-5" />
    </div>
  );
}

function ActionButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="rounded-md p-2 text-primary transition-colors hover:bg-[#EEF2FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={label} title={label}>
      {children}
    </button>
  );
}

async function featureRequest<T>(path: string, token?: string, init?: RequestInit) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    ...init,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers },
  });
  const result = (await response.json()) as T & { success: boolean; message: string };
  if (!response.ok || !result.success) throw new Error(result.message || "Something went wrong");
  return result;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}
