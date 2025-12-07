'use client';

import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

export default function ConfirmDialog({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  confirmLabel = 'Confirm', 
  cancelLabel = 'Cancel', 
  onConfirm,
  variant = 'default' // 'default' | 'danger'
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-2xl">{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={`rounded-2xl ${
              variant === 'danger' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
