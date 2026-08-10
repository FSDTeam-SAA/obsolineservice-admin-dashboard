import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  desc: string;
  isLoading?: boolean;
};

const DeleteModal = ({ isOpen, onClose, onConfirm, title, desc, isLoading = false }: DeleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="max-w-[570px] !rounded-[14px] border-none bg-white p-7 shadow-2xl sm:p-8 [&>button]:hidden">
        <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0EFF7]">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D9D7EC] text-primary">
            <AlertTriangle className="h-6 w-6 stroke-[1.8]" />
          </span>
        </div>
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl font-semibold leading-normal text-[#343A40] sm:text-[22px]">{title}</DialogTitle>
          <DialogDescription className="text-base font-normal leading-relaxed text-[#747B75] sm:text-lg">
            {desc}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            disabled={isLoading}
            className="h-[52px] w-full rounded-[8px] border border-[#DFDFDF] bg-white text-base font-medium text-[#747B75] shadow-sm transition-colors hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[8px] bg-primary text-base font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
            onClick={onConfirm}
          >
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
