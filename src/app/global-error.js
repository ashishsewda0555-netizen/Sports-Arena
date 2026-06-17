'use client';

import { ErrorBoundaryUI } from '@/components/ui/ErrorBoundaryUI';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="bg-surface font-body text-text-primary antialiased min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <ErrorBoundaryUI 
            error={error} 
            reset={reset} 
            title="Critical Application Error" 
          />
        </div>
      </body>
    </html>
  );
}
