'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export function FormCard({ 
  title, 
  description, 
  children, 
  className = '',
  footer 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-6 sm:p-8 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm">
        {(title || description) && (
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
            {title && (
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
        
        <div className="space-y-6">
          {children}
        </div>
        
        {footer && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            {footer}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default FormCard;
