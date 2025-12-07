'use client';

import { Button } from '@/components/ui/button';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 mb-6">
          <Icon className="h-16 w-16 text-gray-400" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
