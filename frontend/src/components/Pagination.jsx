import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i)
  const visiblePages = pages.filter(p =>
    p === 0 || p === totalPages - 1 || Math.abs(p - page) <= 1
  )

  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label="Previous page"
        id="pagination-prev"
      >
        <ChevronLeft size={16} />
      </button>

      {visiblePages.map((p, idx) => {
        const prev = visiblePages[idx - 1]
        const showEllipsis = prev !== undefined && p - prev > 1
        return (
          <span key={p} style={{ display: 'contents' }}>
            {showEllipsis && (
              <span className="text-muted text-sm" style={{ padding: '0 4px' }}>…</span>
            )}
            <button
              className={`pagination-btn${p === page ? ' active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p + 1}`}
              aria-current={p === page ? 'page' : undefined}
              id={`pagination-page-${p + 1}`}
            >
              {p + 1}
            </button>
          </span>
        )
      })}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        aria-label="Next page"
        id="pagination-next"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
