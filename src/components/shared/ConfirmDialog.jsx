'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
  danger: XCircle,
};

const colorMap = {
  warning: 'text-yellow-600 dark:text-yellow-400',
  success: 'text-emerald-600 dark:text-emerald-400',
  info: 'text-blue-600 dark:text-blue-400',
  danger: 'text-red-600 dark:text-red-400',
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'warning', // warning | success | info | danger
  loading = false
}) {
  const Icon = iconMap[variant];
  const iconColor = colorMap[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
            >
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <DialogTitle className="text-xl">{title}</DialogTitle>
                </div>
                <DialogDescription className="text-base">
                  {description}
                </DialogDescription>
              </DialogHeader>
              
              <DialogFooter className="mt-6 gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={loading}
                  className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  {loading ? 'Processing...' : confirmText}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

export default ConfirmDialog;
