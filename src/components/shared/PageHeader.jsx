'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function PageHeader({ 
  title, 
  subtitle,
  badge,
  actions = [],
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 ${className}`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {badge && badge}
        </div>
        {subtitle && (
          <p className="text-base text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
      
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          {actions.map((action, idx) => action && (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              {action}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default PageHeader;
