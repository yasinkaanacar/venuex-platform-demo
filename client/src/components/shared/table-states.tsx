import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/* ------------------------------------------------------------------ */
/*  TableSkeletonRows                                                  */
/* ------------------------------------------------------------------ */

interface TableSkeletonRowsProps {
  rows?: number;
  columns: number;
  /** Optional per-column width hints (Tailwind width classes). Falls back to random widths. */
  columnWidths?: string[];
  className?: string;
}

/**
 * Renders shimmer placeholder rows inside a `<tbody>`.
 * Usage: `{isLoading && <TableSkeletonRows columns={6} rows={5} />}`
 */
export function TableSkeletonRows({
  rows = 5,
  columns,
  columnWidths,
  className,
}: TableSkeletonRowsProps) {
  const fallbackWidths = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-1/3"];

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className={className}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="px-4 py-3">
              <Skeleton
                variant="text"
                className={
                  columnWidths?.[colIdx] ??
                  fallbackWidths[(rowIdx + colIdx) % fallbackWidths.length]
                }
                sx={{ height: 16 }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  TableEmptyState                                                    */
/* ------------------------------------------------------------------ */

interface TableEmptyStateProps {
  colSpan: number;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Full-width table row shown when a table has no data.
 *
 * ```tsx
 * {data.length === 0 && (
 *   <TableEmptyState
 *     colSpan={6}
 *     icon={<Package className="w-8 h-8 text-gray-300" />}
 *     title="No products match your filters"
 *   />
 * )}
 * ```
 */
export function TableEmptyState({
  colSpan,
  icon,
  title,
  description,
  action,
  className,
}: TableEmptyStateProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={`px-4 py-12 text-center ${className ?? ""}`}
      >
        {icon && <div className="mx-auto mb-3 [&>svg]:mx-auto">{icon}</div>}
        {title && (
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        )}
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/*  TableErrorState                                                    */
/* ------------------------------------------------------------------ */

interface TableErrorStateProps {
  colSpan: number;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Full-width table row shown when data fetching fails.
 */
export function TableErrorState({
  colSpan,
  message = "Something went wrong. Please try again.",
  onRetry,
  className,
}: TableErrorStateProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={`px-4 py-12 text-center ${className ?? ""}`}
      >
        <p className="text-sm text-red-500 mb-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline underline-offset-2"
          >
            Retry
          </button>
        )}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/*  TableLoadingRow (spinner variant)                                  */
/* ------------------------------------------------------------------ */

interface TableLoadingRowProps {
  colSpan: number;
  text?: string;
  className?: string;
}

/**
 * Full-width table row with a spinner. Use as an alternative to TableSkeletonRows
 * when you want a single centered spinner instead of shimmer rows.
 */
export function TableLoadingRow({
  colSpan,
  text = "Loading...",
  className,
}: TableLoadingRowProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={`px-4 py-12 text-center ${className ?? ""}`}
      >
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">{text}</span>
        </div>
      </td>
    </tr>
  );
}
