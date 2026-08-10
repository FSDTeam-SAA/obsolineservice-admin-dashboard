"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DeleteModal from "@/components/modals/delete-modal";
import OBSPagination from "@/components/ui/obs-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddEditFaqForm, {
  FaqFormValues,
} from "../add-edit-faq/_components/add-edit-faq-form";
import ViewFaq from "./view-faq";

export type Faq = {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

type FaqApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: { total: number; page: number; limit: number; totalPages: number };
  data: {
    faqs: Faq[];
    paginationInfo: {
      currentPage: number;
      totalPages: number;
      totalData: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
};

type MutationResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: Faq | null;
};

const PAGE_SIZE = 5;

export default function FaqContainer() {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const token = session?.user.accessToken;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);

  const { data, isLoading, isFetching, error } = useQuery<FaqApiResponse>({
    queryKey: ["faqs", currentPage, PAGE_SIZE],
    queryFn: () =>
      apiRequest<FaqApiResponse>(
        `/faq?page=${currentPage}&limit=${PAGE_SIZE}`,
        token,
      ),
    enabled: status === "authenticated" && Boolean(token),
  });

  const faqs = data?.data?.faqs ?? [];
  const pagination = data?.data?.paginationInfo;
  const isInitialLoading = status === "loading" || isLoading;

  const saveMutation = useMutation({
    mutationFn: ({
      values,
      faqId,
    }: {
      values: FaqFormValues;
      faqId?: string;
    }) =>
      apiRequest<MutationResponse>(faqId ? `/faq/${faqId}` : "/faq", token, {
        method: faqId ? "PUT" : "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: async (result, variables) => {
      toast.success(result.message);
      setIsFormOpen(false);
      setEditingFaq(null);
      await queryClient.invalidateQueries({ queryKey: ["faqs"] });
      if (!variables.faqId) setCurrentPage(1);
    },
    onError: showMutationError,
  });

  const deleteMutation = useMutation({
    mutationFn: (faqId: string) =>
      apiRequest<MutationResponse>(`/faq/${faqId}`, token, {
        method: "DELETE",
      }),
    onSuccess: async (result) => {
      toast.success(result.message);
      setFaqToDelete(null);
      await queryClient.invalidateQueries({ queryKey: ["faqs"] });
      if (faqs.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      }
    },
    onError: showMutationError,
  });

  const openCreateDialog = () => {
    setEditingFaq(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (faq: Faq) => {
    setEditingFaq(faq);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (saveMutation.isPending) return;
    setIsFormOpen(false);
    setEditingFaq(null);
  };

  const actions = (faq: Faq) => (
    <div className="flex items-center justify-center gap-0.5">
      <ActionButton label={`Edit ${faq.question}`} onClick={() => openEditDialog(faq)}><Pencil className="h-4 w-4" /></ActionButton>
      <ActionButton label={`Delete ${faq.question}`} onClick={() => setFaqToDelete(faq)}><Trash2 className="h-4 w-4" /></ActionButton>
      <ActionButton label={`View ${faq.question}`} onClick={() => setSelectedFaq(faq)}><Eye className="h-4 w-4" /></ActionButton>
    </div>
  );

  const showingFrom = pagination?.totalData
    ? (pagination.currentPage - 1) * PAGE_SIZE + 1
    : 0;
  const showingTo = pagination
    ? Math.min(pagination.currentPage * PAGE_SIZE, pagination.totalData)
    : 0;

  return (
    <section className="p-4 sm:p-6" aria-label="FAQ management">
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={openCreateDialog} className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"><Plus className="h-4 w-4" />Add New FAQ</button>
      </div>

      {isInitialLoading ? (
        <div className="space-y-2 rounded-lg border border-[#E4EAF3] bg-white p-4">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => <Skeleton key={index} className="h-14 w-full" />)}
        </div>
      ) : error ? (
        <div className="flex min-h-52 items-center justify-center rounded-lg border border-dashed border-red-200 bg-white p-6 text-center text-sm font-medium text-red-600">{error instanceof Error ? error.message : "Could not load FAQs"}</div>
      ) : faqs.length ? (
        <div className={`overflow-hidden rounded-lg border border-[#E4EAF3] bg-white transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] table-fixed">
              <thead className="bg-[#EDF4F8]">
                <tr className="text-xs font-medium text-[#475569]"><th className="w-[34%] px-6 py-3 text-center">Question</th><th className="w-[48%] px-6 py-3 text-center">Answer</th><th className="w-[18%] px-6 py-3 text-center">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-[#E4EAF3]">
                {faqs.map((faq) => <tr key={faq._id} className="transition-colors hover:bg-[#FAFBFD]"><td className="px-6 py-4 text-center text-sm font-medium text-[#475569]">{faq.question}</td><td className="px-6 py-4 text-center text-sm leading-5 text-[#64748B]"><p className="mx-auto line-clamp-2 max-w-lg">{faq.answer}</p></td><td className="px-6 py-4">{actions(faq)}</td></tr>)}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {faqs.map((faq) => <article key={faq._id} className="rounded-lg border border-[#E4EAF3] p-4"><div className="flex items-start justify-between gap-3"><h2 className="font-medium text-[#334155]">{faq.question}</h2>{actions(faq)}</div><p className="mt-3 text-sm leading-6 text-[#64748B]">{faq.answer}</p></article>)}
          </div>
        </div>
      ) : (
        <div className="flex min-h-52 items-center justify-center rounded-lg border border-dashed border-[#D8E0EC] bg-white p-6 text-center text-sm text-[#64748B]">No FAQs yet. Add your first question to get started.</div>
      )}

      {!isInitialLoading && !error && pagination && pagination.totalData > 0 && (
        <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#9CA3AF]">Showing {showingFrom} to {showingTo} of {pagination.totalData} results</p>
          <div className={isFetching ? "pointer-events-none opacity-60" : ""}><OBSPagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={setCurrentPage} /></div>
        </div>
      )}

      <ViewFaq faq={selectedFaq} open={selectedFaq !== null} onOpenChange={(open) => !open && setSelectedFaq(null)} />

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-3xl border-0 bg-transparent p-0 shadow-none"><AddEditFaqForm faq={editingFaq} onSubmit={(values) => saveMutation.mutate({ values, faqId: editingFaq?._id })} onCancel={closeForm} isLoading={saveMutation.isPending} /></DialogContent>
      </Dialog>

      <DeleteModal isOpen={faqToDelete !== null} onClose={() => setFaqToDelete(null)} onConfirm={() => faqToDelete && deleteMutation.mutate(faqToDelete._id)} title="Are You Sure?" desc="Are you sure you want to delete this FAQ?" isLoading={deleteMutation.isPending} />
    </section>
  );
}

function ActionButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className="rounded-md p-2 text-primary transition-colors hover:bg-[#EEF2FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={label} title={label}>{children}</button>;
}

async function apiRequest<T>(path: string, token?: string, init?: RequestInit) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  const result = (await response.json()) as T & { success: boolean; message: string };

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong");
  }
  return result;
}

function showMutationError(error: Error) {
  toast.error(error.message || "Something went wrong");
}
