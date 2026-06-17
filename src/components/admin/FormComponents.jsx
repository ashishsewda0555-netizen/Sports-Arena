import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <p className="mt-1.5 text-sm text-error flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
      <AlertCircle className="w-4 h-4" />
      {error.message}
    </p>
  );
}

export function FormInput({ label, type = 'text', register, name, error, className, ...props }) {
  return (
    <div className={cn("w-full", className)}>
      {label && <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>}
      <input
        id={name}
        type={type}
        {...register(name)}
        className={cn(
          "w-full px-4 h-11 rounded-md border bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary transition-shadow",
          error ? "border-error focus:ring-error" : "border-border hover:border-text-secondary"
        )}
        {...props}
      />
      <ErrorMessage error={error} />
    </div>
  );
}

export function FormTextarea({ label, register, name, error, className, rows = 4, ...props }) {
  return (
    <div className={cn("w-full", className)}>
      {label && <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>}
      <textarea
        id={name}
        rows={rows}
        {...register(name)}
        className={cn(
          "w-full px-4 py-3 rounded-md border bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary transition-shadow resize-y",
          error ? "border-error focus:ring-error" : "border-border hover:border-text-secondary"
        )}
        {...props}
      />
      <ErrorMessage error={error} />
    </div>
  );
}

export function FormSelect({ label, register, name, error, options, className, ...props }) {
  return (
    <div className={cn("w-full", className)}>
      {label && <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>}
      <select
        id={name}
        {...register(name)}
        className={cn(
          "w-full px-4 h-11 rounded-md border bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary transition-shadow appearance-none",
          error ? "border-error focus:ring-error" : "border-border hover:border-text-secondary"
        )}
        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ErrorMessage error={error} />
    </div>
  );
}

export function FormCheckbox({ label, description, register, name, error, className, ...props }) {
  return (
    <div className={cn("w-full flex items-start gap-3", className)}>
      <div className="flex items-center h-6">
        <input
          id={name}
          type="checkbox"
          {...register(name)}
          className={cn(
            "w-5 h-5 rounded border-border text-secondary focus:ring-secondary focus:ring-offset-bg bg-bg cursor-pointer transition-colors"
          )}
          {...props}
        />
      </div>
      <div className="flex flex-col">
        {label && <label htmlFor={name} className="text-sm font-medium text-text-primary cursor-pointer">{label}</label>}
        {description && <p className="text-sm text-text-secondary mt-0.5">{description}</p>}
        <ErrorMessage error={error} />
      </div>
    </div>
  );
}
