export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Image */}
      <div className="h-64 w-full animate-pulse bg-slate-200" />

      {/* Content */}
      <div className="space-y-4 p-4">
        {/* Category */}
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-10 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-14 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}