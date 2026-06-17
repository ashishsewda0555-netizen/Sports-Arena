'use client';

import { useEffect } from 'react';
import { ErrorBoundaryUI } from '@/components/ui/ErrorBoundaryUI';

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error('Admin route boundary caught:', error);
  }, [error]);

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <ErrorBoundaryUI 
        error={error} 
        reset={reset} 
        title="Admin Dashboard Error"
      />
    </div>
  );
}
