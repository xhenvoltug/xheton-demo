'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-950">
            <svg className="h-16 w-16 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Something Went Wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            className="px-6 py-3 rounded-2xl border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
