import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function AdminPageHeader({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">{title}</h1>
        <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-2 mb-1" />
        {description && <p className="text-text-secondary text-sm mt-2">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="flex items-center gap-2 shrink-0">
          <Plus className="w-5 h-5" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
