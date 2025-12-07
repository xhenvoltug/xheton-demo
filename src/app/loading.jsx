export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="text-center">
        <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-950 mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Loading...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we prepare your content
        </p>
      </div>
    </div>
  );
}
