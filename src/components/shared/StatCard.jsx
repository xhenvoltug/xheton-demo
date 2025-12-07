'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({ 
  title, 
  value, 
  change, // { value: number, isPositive: boolean }
  icon: Icon,
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <Card className="p-6 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            
            {change && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                change.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {change.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(change.value)}%</span>
              </div>
            )}
          </div>
          
          {Icon && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <Icon className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default StatCard;
