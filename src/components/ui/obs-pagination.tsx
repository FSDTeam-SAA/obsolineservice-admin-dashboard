import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from './pagination'

interface PaginationProps {
  totalPages: number // Total number of pages
  currentPage: number // Current active page
  onPageChange: (page: number) => void // Callback for page change
}

const OBSPagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  // Helper to generate an array of page numbers
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        )
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        )
      }
    }
    return pages
  }

  const handlePageClick = (page: number | '...') => {
    if (page === '...' || page === currentPage) return
    onPageChange(page as number)
  }

  return (
    <Pagination>
      <PaginationContent className="flex items-center justify-end gap-2">
        <PaginationItem>
          <PaginationLink
            onClick={() => {
              if (currentPage === 1) {
                return
              } else handlePageClick(currentPage - 1)
            }}
            className={cn(
              'h-8 w-8 cursor-pointer rounded-[4px] border border-[#AEB4B0] p-0 text-[#69706B] hover:border-primary hover:bg-primary hover:text-white',
              currentPage === 1 &&
                'pointer-events-none cursor-not-allowed border-[#D7DBD8] bg-white text-[#B0B0B0]'
            )}
            aria-label="Previous page"
            aria-disabled={currentPage === 1}
          >
            <ChevronLeft
              className={cn('h-4 w-4', currentPage === 1 && 'text-[#B0B0B0]')}
            />
          </PaginationLink>
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={() => handlePageClick(page)}
              isActive={page === currentPage}
              className={cn(
                'h-8 w-8 cursor-pointer rounded-[4px] border border-[#AEB4B0] p-0 text-xs text-[#59615B] hover:border-primary hover:bg-primary hover:text-white',
                page === currentPage
                  ? 'bg-primary text-white hover:bg-primary hover:text-white'
                  : page === '...' && 'cursor-default hover:border-[#AEB4B0] hover:bg-white hover:text-[#59615B]'
              )}
            >
              {page === '...' ? '...' : page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLink
            onClick={() => {
              if (totalPages === currentPage) {
                return
              } else {
                handlePageClick(currentPage + 1)
              }
            }}
            className={cn(
              'h-8 w-8 cursor-pointer rounded-[4px] border border-[#AEB4B0] p-0 text-[#69706B] hover:border-primary hover:bg-primary hover:text-white',
              currentPage === totalPages &&
                'pointer-events-none cursor-not-allowed border-[#D7DBD8] bg-white text-[#B0B0B0]'
            )}
            aria-label="Next page"
            aria-disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default OBSPagination
