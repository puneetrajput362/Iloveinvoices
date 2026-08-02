import React from 'react';

type BadgeVariant = 'verified' | 'review' | 'scanning' | 'exported' | 'error' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  verified: 'status-verified',
  review: 'status-review',
  scanning: 'status-scanning',
  exported: 'status-exported',
  error: 'status-error',
  default: 'bg-muted text-muted-foreground border border-border',
};

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}