import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/* ------------------------------------------------------------------ */
/*  CardSkeleton                                                       */
/* ------------------------------------------------------------------ */

interface CardSkeletonProps {
  /** Number of shimmer lines to show */
  lines?: number;
  className?: string;
}

/**
 * Generic shimmer skeleton for card / section content.
 *
 * ```tsx
 * {isLoading ? <CardSkeleton lines={4} /> : <ActualContent />}
 * ```
 */
export function CardSkeleton({ lines = 3, className }: CardSkeletonProps) {
  const widths = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-1/3"];
  return (
    <div className={`animate-pulse space-y-3 ${className ?? ""}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={widths[i % widths.length]}
          sx={{ height: 16 }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ChartSkeleton                                                      */
/* ------------------------------------------------------------------ */

interface ChartSkeletonProps {
  height?: number;
  className?: string;
}

/**
 * Shimmer placeholder for chart areas.
 */
export function ChartSkeleton({
  height = 200,
  className,
}: ChartSkeletonProps) {
  return (
    <div className={`animate-pulse ${className ?? ""}`}>
      <div className="flex items-center gap-2 mb-3">
        <Skeleton variant="text" className="w-32" sx={{ height: 16 }} />
        <Skeleton variant="text" className="w-16" sx={{ height: 12 }} />
      </div>
      <Skeleton
        variant="rectangular"
        className="w-full rounded-lg"
        sx={{ height }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DataErrorState                                                     */
/* ------------------------------------------------------------------ */

interface DataErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Generic error state for non-table data sections.
 *
 * ```tsx
 * {isError && <DataErrorState onRetry={refetch} />}
 * ```
 */
export function DataErrorState({
  message = "Something went wrong loading this data.",
  onRetry,
  className,
}: DataErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-8 text-center ${className ?? ""}`}
    >
      <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
      <p className="text-sm text-red-500 mb-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 underline underline-offset-2"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DataLoadingState                                                   */
/* ------------------------------------------------------------------ */

interface DataLoadingStateProps {
  text?: string;
  className?: string;
}

/**
 * Centered spinner for generic loading states.
 */
export function DataLoadingState({
  text = "Loading...",
  className,
}: DataLoadingStateProps) {
  return (
    <div
      className={`flex items-center justify-center gap-2 py-8 text-muted-foreground ${className ?? ""}`}
    >
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
