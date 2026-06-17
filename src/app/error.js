'use client';

import { useEffect } from 'react';
import { ErrorBoundaryUI } from '@/components/ui/ErrorBoundaryUI';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Root error boundary caught:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <ErrorBoundaryUI error={error} reset={reset} />
      </div>
    </div>
  );
}
