import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function ErrorBoundaryUI({ error, reset, title = "Something went wrong!" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-surface rounded-xl shadow-sm border border-border">
      <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-heading font-bold text-text-primary mb-3">
        {title}
      </h2>
      <p className="text-text-secondary max-w-md mb-8">
        We encountered an unexpected error while trying to load this content. Please try again or return to the homepage.
        <br />
        <span className="text-xs text-text-disabled block mt-4 bg-surface-alt p-2 rounded border border-border overflow-auto max-h-24">
          {error?.message || "Unknown Error"}
        </span>
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        {reset && (
          <Button onClick={() => reset()} className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
        )}
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <Home className="w-4 h-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
