export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex gap-4 pb-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1 h-8 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-lg">
      <div className="space-y-4">
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-10 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export function GridSkeleton({ items = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
