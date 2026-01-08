/**
 * EmptyState - Graceful empty state display
 */

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon = "📭", title, description, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      <span className="text-4xl mb-4" role="img" aria-label="empty">
        {icon}
      </span>
      <p className="text-lg font-medium text-muted-foreground mb-1">{title}</p>
      {description && <p className="text-sm text-muted-foreground/70">{description}</p>}
    </div>
  );
}
