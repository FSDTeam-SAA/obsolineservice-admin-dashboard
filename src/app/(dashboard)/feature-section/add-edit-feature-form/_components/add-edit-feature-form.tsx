"use client";

import { ChangeEvent, DragEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type Feature = {
  _id: string;
  featureName: string;
  title: string;
  bodyText: string;
  features: string[];
  image: string;
};

type FeatureResponse = { success: boolean; message: string; data: Feature };
type FormValues = { featureName: string; title: string; bodyText: string; features: string[] };
const emptyValues: FormValues = { featureName: "", title: "", bodyText: "", features: [] };
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function AddEditFeatureForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const featureId = searchParams.get("id");
  const isEditing = Boolean(featureId);
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const token = session?.user.accessToken;
  const inputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [featureInput, setFeatureInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const { data, isLoading, error } = useQuery<FeatureResponse>({
    queryKey: ["feature", featureId],
    queryFn: () => request<FeatureResponse>(`/feature/${featureId}`, token),
    enabled: Boolean(featureId) && status !== "loading",
  });

  useEffect(() => {
    if (!data?.data) return;
    const feature = data.data;
    setValues({
      featureName: feature.featureName,
      title: feature.title,
      bodyText: feature.bodyText,
      features: feature.features ?? [],
    });
    setPreviewUrl(feature.image || "");
  }, [data]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const saveMutation = useMutation({
    mutationFn: (formData: FormData) =>
      request<FeatureResponse>(featureId ? `/feature/${featureId}` : "/feature", token, {
        method: featureId ? "PUT" : "POST",
        body: formData,
      }),
    onSuccess: async (result) => {
      toast.success(result.message || `Feature ${isEditing ? "updated" : "created"} successfully`);
      await queryClient.invalidateQueries({ queryKey: ["features"] });
      router.push("/feature-section");
    },
    onError: (mutationError: Error) => toast.error(mutationError.message),
  });

  const addFeature = () => {
    const item = featureInput.trim();
    if (!item) return;
    if (values.features.some((feature) => feature.toLowerCase() === item.toLowerCase())) {
      toast.error("This feature has already been added");
      return;
    }
    setValues((current) => ({ ...current, features: [...current.features, item] }));
    setFeatureInput("");
  };

  const handleFeatureKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addFeature();
    }
  };

  const selectImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    if (file.size > MAX_IMAGE_SIZE) return toast.error("Image must be 5MB or smaller");
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => selectImage(event.target.files?.[0]);
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    selectImage(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = {
      featureName: values.featureName.trim(),
      title: values.title.trim(),
      bodyText: values.bodyText.trim(),
      features: values.features,
    };
    if (!trimmed.featureName || !trimmed.title || !trimmed.bodyText) {
      toast.error("Please complete all required fields");
      return;
    }
    const formData = new FormData();
    formData.append("featureName", trimmed.featureName);
    formData.append("title", trimmed.title);
    formData.append("bodyText", trimmed.bodyText);
    formData.append("features", JSON.stringify(trimmed.features));
    if (imageFile) formData.append("image", imageFile);
    saveMutation.mutate(formData);
  };

  if (isEditing && (status === "loading" || isLoading)) {
    return <div className="m-4 space-y-5 rounded-xl bg-white p-6 sm:m-6"><Skeleton className="h-7 w-52" /><Skeleton className="h-11 w-full" /><Skeleton className="h-11 w-full" /><Skeleton className="h-32 w-full" /><Skeleton className="h-28 w-full" /></div>;
  }

  if (error) {
    return <div className="m-4 rounded-xl border border-red-200 bg-white p-10 text-center text-sm font-medium text-red-600 sm:m-6">{error instanceof Error ? error.message : "Could not load feature"}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="m-4 rounded-xl bg-white p-5 shadow-sm sm:m-6 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h1 className="text-xl font-semibold text-[#202020]">{isEditing ? "Edit Feature Section" : "Add Feature Section"}</h1>
        <button type="button" onClick={() => router.push("/feature-section")} className="rounded-md p-1 text-[#202020] hover:bg-[#F1F5F9]" aria-label="Close form"><X className="h-5 w-5" /></button>
      </div>

      <div className="space-y-4">
        <Field label="Feature Name">
          <input required disabled={saveMutation.isPending} value={values.featureName} onChange={(event) => setValues((current) => ({ ...current, featureName: event.target.value }))} placeholder="Enter a feature name" className={inputClassName} />
        </Field>
        <Field label="Title">
          <input required disabled={saveMutation.isPending} value={values.title} onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))} placeholder="Exceptional stays start with exceptional communication." className={inputClassName} />
        </Field>
        <Field label="Body Text">
          <textarea required disabled={saveMutation.isPending} value={values.bodyText} onChange={(event) => setValues((current) => ({ ...current, bodyText: event.target.value }))} placeholder="Describe this feature section..." className={`${inputClassName} min-h-20 resize-y py-3`} />
        </Field>

        <Field label="Features">
          <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-md border border-[#B9C2CE] p-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
            {values.features.map((feature, index) => (
              <span key={`${feature}-${index}`} className="inline-flex items-center gap-1 rounded-full bg-[#ECEEED] px-3 py-1.5 text-xs text-[#59615B]">
                {feature}
                <button type="button" onClick={() => setValues((current) => ({ ...current, features: current.features.filter((_, itemIndex) => itemIndex !== index) }))} className="rounded-full hover:text-red-500" aria-label={`Remove ${feature}`}><X className="h-3.5 w-3.5" /></button>
              </span>
            ))}
            <input value={featureInput} onChange={(event) => setFeatureInput(event.target.value)} onKeyDown={handleFeatureKeyDown} placeholder={values.features.length ? "Add another..." : "Type a feature and press Enter"} className="h-8 min-w-44 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-[#A0A8B3]" />
            <button type="button" onClick={addFeature} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"><Plus className="h-4 w-4" />Add</button>
          </div>
        </Field>

        <Field label="Image Upload">
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="sr-only" />
          <div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} onClick={() => inputRef.current?.click()} onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && inputRef.current?.click()} role="button" tabIndex={0} className="relative flex min-h-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#9AA7B8] bg-white p-5 text-center outline-none transition-colors hover:border-primary hover:bg-[#FAFBFF] focus-visible:ring-2 focus-visible:ring-primary">
            {previewUrl ? (
              <><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${previewUrl}")` }} /><div className="absolute inset-0 bg-black/35" /><div className="relative rounded-md bg-white/95 px-4 py-2 text-sm font-medium text-[#334155] shadow-sm">Click or drop to replace image</div></>
            ) : (
              <div><Camera className="mx-auto h-7 w-7 text-[#202020]" /><p className="mt-3 text-sm font-medium text-[#343A40]">Drag and drop files or click to browse</p><p className="mt-1 text-xs text-[#64748B]">JPG, PNG up to 5MB</p></div>
            )}
          </div>
        </Field>
      </div>

      <div className="mt-5 flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
        <button type="button" disabled={saveMutation.isPending} onClick={() => router.push("/feature-section")} className="h-10 rounded-md border border-[#FF4D6D] px-5 text-sm font-medium text-[#FF4D6D] hover:bg-[#FFF1F3] disabled:opacity-60">Discard Changes</button>
        <button type="submit" disabled={saveMutation.isPending} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-7 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
          {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {saveMutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Feature"}
        </button>
      </div>
    </form>
  );
}

const inputClassName = "mt-2 h-11 w-full rounded-md border border-[#B9C2CE] px-3 text-sm text-[#343A40] outline-none placeholder:text-[#A0A8B3] focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-[#343A40]">{label}{children}</label>;
}

async function request<T>(path: string, token?: string, init?: RequestInit) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, { ...init, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers } });
  const result = (await response.json()) as T & { success: boolean; message: string };
  if (!response.ok || !result.success) throw new Error(result.message || "Something went wrong");
  return result;
}
