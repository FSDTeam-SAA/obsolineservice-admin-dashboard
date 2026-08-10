"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ViewFaqProps = {
  faq: { question: string; answer: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Read-only FAQ details, intentionally separate from the add/edit form. */
export default function ViewFaq({ faq, open, onOpenChange }: ViewFaqProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] rounded-lg border-0 bg-white px-6 py-10 shadow-2xl sm:px-8 sm:py-12">
        <DialogHeader className="space-y-6 pr-5 text-left">
          <div><DialogTitle className="text-sm font-semibold text-[#343A40]">Question</DialogTitle><DialogDescription className="mt-2 text-sm leading-6 text-[#59625B]">{faq?.question}</DialogDescription></div>
          <div><DialogTitle className="text-sm font-semibold text-[#343A40]">Answer</DialogTitle><DialogDescription className="mt-2 text-sm leading-6 text-[#69736B]">{faq?.answer}</DialogDescription></div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
