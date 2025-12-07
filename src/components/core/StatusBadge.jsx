'use client';

import { Badge } from '@/components/ui/badge';

const variants = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
};

export default function StatusBadge({ 
  variant = 'default', 
  children, 
  className = '' 
}) {
  return (
    <Badge 
      className={`${variants[variant]} rounded-full px-3 py-1 font-medium ${className}`}
      variant="outline"
    >
      {children}
    </Badge>
  );
}
