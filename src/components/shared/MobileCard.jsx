'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Eye } from 'lucide-react';

// Mobile-friendly card for replacing table rows on small screens
export function MobileCard({ 
  title,
  subtitle,
  badge,
  fields = [],
  data,
  onClick,
  onView,
  className = '' 
}) {
  // Support both old format (data) and new format (fields)
  const cardData = data || fields || [];
  const safeData = Array.isArray(cardData) ? cardData : [];
  const handleClick = onClick || onView;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
        {(title || subtitle || badge) && (
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {title && (
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {title}
                  </CardTitle>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
              {badge && <div className="ml-3">{badge}</div>}
            </div>
          </CardHeader>
        )}
        
        <CardContent className={!title && !subtitle ? 'pt-4' : ''}>
          <div className="space-y-2 mb-4">
            {safeData.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[100px]">
                  {item.label}:
                </span>
                <span className="text-sm text-gray-900 dark:text-white text-right flex-1">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          
          {handleClick && (
            <Button
              onClick={handleClick}
              variant="outline"
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default MobileCard;

