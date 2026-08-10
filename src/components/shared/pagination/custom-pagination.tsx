/* eslint-disable prefer-const */
"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  className?: string;
}

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  className,
}: CustomPaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    // Always show first page
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push("ellipsis-start");
      }
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Always show last page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("ellipsis-end");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn("flex justify-center", className)}>
      <Pagination>
        <PaginationContent className="flex items-center gap-2">
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={cn(
                "h-10 w-10 p-0 flex items-center justify-center rounded-md border border-gray-200",
                "bg-white text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-200",
                "cursor-pointer shadow-sm",
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:scale-105"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </PaginationPrevious>
          </PaginationItem>

          {/* Page Numbers */}
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis className="h-10 w-10 p-0 flex items-center justify-center">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </PaginationEllipsis>
                </PaginationItem>
              );
            }

            const pageNum = page as number;
            const isActive = currentPage === pageNum;

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => onPageChange(pageNum)}
                  isActive={isActive}
                  className={cn(
                    "h-10 w-10 p-0 flex items-center justify-center rounded-md border transition-all duration-200",
                    "font-medium cursor-pointer shadow-sm",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-primary hover:border-primary/50"
                  )}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              className={cn(
                "h-10 w-10 p-0 flex items-center justify-center rounded-md border border-gray-200",
                "bg-white text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-200",
                "cursor-pointer shadow-sm",
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:scale-105"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
