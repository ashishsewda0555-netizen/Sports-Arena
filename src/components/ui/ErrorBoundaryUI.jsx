import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function ErrorBoundaryUI({ error, reset, title = "Something went wrong!" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-surface rounded-2xl shadow-lg border border-border">
      <div className="w-20 h-20 bg-gradient-to-br from-error/20 to-error/5 text-error rounded-2xl flex items-center justify-center mb-8">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-heading font-bold text-text-primary mb-3">
        {title}
      </h2>
      <p className="text-text-secondary max-w-md mb-8">
        We encountered an unexpected error while trying to load this content. Please try again or return to the homepage.
        <br />
        <span className="text-xs text-text-disabled block mt-4 bg-surface-alt p-3 rounded-lg border border-border overflow-auto max-h-24 font-mono">
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
          <Button variant="secondary" className="flex items-center gap-2 w-full sm:w-auto">
            <Home className="w-4 h-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
