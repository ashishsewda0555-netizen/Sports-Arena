'use client';

import { Modal } from '@/components/admin/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title = "Confirm Deletion", message = "Are you sure you want to delete this item? This action cannot be undone.", isDeleting = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-error" />
        </div>
        <p className="text-text-primary font-medium mb-2">{message}</p>
        <p className="text-sm text-text-secondary mb-6">This action is permanent and cannot be reversed.</p>
        
        <div className="flex justify-center gap-3 w-full">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isDeleting} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isDeleting} className="w-full sm:w-auto bg-error hover:bg-error/90 text-white">
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
