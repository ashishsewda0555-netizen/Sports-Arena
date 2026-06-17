import { cn } from '@/lib/utils';

export function Section({
  children,
  className,
  alt = false,
  containerClass,
  id,
}) {
  return (
    <section
      id={id}
      className={cn(
        'section',
        alt && 'section--alt',
        className
      )}
    >
      <div className={cn('container', containerClass)}>
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  title,
  overline,
  description,
  align = 'center',
  className,
}) {
  return (
    <div
      className={cn(
        'section-header',
        align === 'left' && 'section-header--left',
        className
      )}
    >
      {overline && <div className="overline">{overline}</div>}
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
    </div>
  );
}
