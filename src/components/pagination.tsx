"use client"

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (!totalPages || totalPages <= 1) return null

  return (
    <div className='mt-8 flex items-center justify-center gap-3'>
      <button
        type='button'
        disabled={page <= 1 || isLoading}
        onClick={() => onPageChange(page - 1)}
        className='rounded-full border border-muted bg-background px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50'
      >
        Previous
      </button>
      <div className='rounded-full bg-muted px-4 py-2 text-sm font-semibold text-foreground'>
        Page {page} of {totalPages}
      </div>
      <button
        type='button'
        disabled={page >= totalPages || isLoading}
        onClick={() => onPageChange(page + 1)}
        className='rounded-full border border-muted bg-background px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50'
      >
        Next
      </button>
    </div>
  )
}
