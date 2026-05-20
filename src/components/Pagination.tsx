import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/Button'
import type { PaginationMeta } from '@/types/api'

export function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
}) {
  if (pagination.totalPages <= 1) return null

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Page {pagination.page} sur {pagination.totalPages} · {pagination.total} candidature
        {pagination.total > 1 ? 's' : ''}
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!pagination.hasPrevPage}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <ChevronLeft className="size-4" />
          Précédent
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Suivant
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
