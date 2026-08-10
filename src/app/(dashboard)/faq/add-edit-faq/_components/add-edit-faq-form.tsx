"use client";

import { FormEvent, useEffect, useState } from "react";

export type FaqFormValues = {
  question: string;
  answer: string;
};

type AddEditFaqFormProps = {
  faq?: { _id: string; question: string; answer: string } | null;
  onSubmit: (values: FaqFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

const emptyValues: FaqFormValues = { question: "", answer: "" };

/** One form for both creating and editing an FAQ. */
export default function AddEditFaqForm({ faq, onSubmit, onCancel, isLoading = false }: AddEditFaqFormProps) {
  const [values, setValues] = useState<FaqFormValues>(emptyValues);
  const isEditing = Boolean(faq);

  useEffect(() => {
    setValues(faq ? { question: faq.question, answer: faq.answer } : emptyValues);
  }, [faq]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = values.question.trim();
    const answer = values.answer.trim();
    if (question && answer) onSubmit({ question, answer });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-5 sm:p-6">
      <div className="mb-5 pr-7">
        <h2 className="text-lg font-semibold text-[#202020]">{isEditing ? "Edit FAQ" : "Add New FAQ"}</h2>
      </div>

      <label className="block text-sm font-medium text-[#343A40]">Question
        <input required disabled={isLoading} value={values.question} onChange={(event) => setValues((current) => ({ ...current, question: event.target.value }))} placeholder="What is this website for?" className="mt-2 h-11 w-full rounded-md border border-[#B9C2CE] px-3 text-sm text-[#343A40] outline-none placeholder:text-[#A0A8B3] focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60" />
      </label>

      <label className="mt-5 block text-sm font-medium text-[#343A40]">Answer
        <textarea required disabled={isLoading} value={values.answer} onChange={(event) => setValues((current) => ({ ...current, answer: event.target.value }))} placeholder="Write a clear, helpful answer..." className="mt-2 min-h-36 w-full resize-y rounded-md border border-[#B9C2CE] p-3 text-sm leading-6 text-[#343A40] outline-none placeholder:text-[#A0A8B3] focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60" />
      </label>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button type="button" disabled={isLoading} onClick={onCancel} className="h-10 rounded-md border border-[#FF4D6D] px-5 text-sm font-medium text-[#FF4D6D] transition-colors hover:bg-[#FFF1F3] disabled:opacity-60">Cancel</button>
        <button type="submit" disabled={isLoading} className="h-10 rounded-md bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Saving..." : isEditing ? "Save changes" : "Save FAQ"}</button>
      </div>
    </form>
  );
}
