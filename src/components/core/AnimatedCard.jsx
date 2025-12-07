'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnimatedCard({ 
  title, 
  children, 
  className = '', 
  delay = 0,
  padding = 'p-6',
  rounded = 'rounded-3xl'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      className="h-full"
    >
      <Card className={`${rounded} shadow-lg hover:shadow-xl transition-all duration-300 border-0 ${className}`}>
        {title && (
          <CardHeader className={padding}>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className={!title ? padding : 'p-6 pt-0'}>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
